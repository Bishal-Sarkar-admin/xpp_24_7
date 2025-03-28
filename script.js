// X++ Code Processor Application

/**
 * Toggle loading indicator visibility
 * @param {boolean} show - Whether to show or hide the loading indicator
 */
function toggleLoading(show) {
  const loadingIndicator = document.getElementById("loadingIndicator");
  if (loadingIndicator) {
    loadingIndicator.classList.toggle("active", show);
  }
}

/**
 * Display temporary messages to the user
 * @param {string} message - Message to display
 * @param {string} [type='info'] - Message type (info, error, success)
 */
function showMessage(message, type = "info") {
  const messagesDiv = document.getElementById("messages");
  if (!messagesDiv) return;

  const messageElement = document.createElement("div");
  messageElement.className = `${type}-message`;
  messageElement.textContent = message;
  messagesDiv.appendChild(messageElement);

  // Automatically remove message after 5 seconds
  setTimeout(() => {
    if (messageElement.parentNode) {
      messageElement.parentNode.removeChild(messageElement);
    }
  }, 5000);
}

/**
 * Execute SQL queries on the local API endpoint
 * @param {string} type - Type of SQL query (select, insert, update, etc.)
 * @param {string} query - SQL query to execute
 * @returns {Promise<Object>} Query execution result
 */
async function executeQuery(type, query) {
  // Validate query type
  const validTypes = [
    "select",
    "insert",
    "update",
    "delete",
    "create",
    "alter",
    "drop",
  ];

  // Input validation
  if (!validTypes.includes(type.toLowerCase())) {
    throw new Error(`Invalid query type: ${type}`);
  }

  if (!query || typeof query !== "string" || !query.trim()) {
    throw new Error("Invalid query: Query must be a non-empty string");
  }

  try {
    const response = await fetch(
      `https://server100sql.onrender.com/api/${type}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-API-KEY": localStorage.getItem("key")
            ? localStorage.getItem("key")
            : localStorage.setItem("key", "1234"),
        },
        body: JSON.stringify({
          query,
          params: [],
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || `HTTP error! status: ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("SQL Execution Error:", error);
    showMessage(`SQL Error: ${error.message}`, "error");
    throw error;
  }
}

/**
 * Process X++ code through AI analysis and SQL execution
 */
async function processXpp() {
  // Get DOM elements
  const elements = {
    xppCode: document.getElementById("xppCode"),
    output: document.getElementById("output"),
    outputSQL: document.getElementById("outputSQL"),
    xppOutput: document.getElementById("xppoutput"),
    outputError: document.getElementById("error"),
    messages: document.getElementById("messages"),
  };

  // Validate input
  if (!elements.xppCode || !elements.xppCode.value.trim()) {
    showMessage("Please enter some X++ code.", "error");
    return;
  }

  // Clear previous outputs
  Object.values(elements).forEach((el) => {
    if (el && el.id !== "messages") el.textContent = "";
  });
  if (elements.messages) elements.messages.innerHTML = "";

  // Show loading state
  toggleLoading(true);

  try {
    // Initial AI analysis
    const initialResponse = await fetch(
      "https://server100sql.onrender.com/api/ai",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-API-KEY": localStorage.getItem("key")
            ? localStorage.getItem("key")
            : localStorage.setItem("key", "1234"),
        },
        body: JSON.stringify({
          query: `Analyze this X++ code and provide a response in the following JSON format:

{
  "xpp_preview": "Brief explanation",
  "sql_queries": [
    {
      "query": "SQL query in SQLite format",
      "description": "What this query does"
    }
  ],
  "errors": [
    {
      "type": "error_type",
      "message": "error description",
      "severity": "high/medium/low"
    }
  ]
}

Code to analyze:
${elements.xppCode.value.trim()}`,
        }),
      }
    );

    if (!initialResponse.ok) {
      throw new Error(`Initial analysis failed: ${initialResponse.status}`);
    }

    const initialData = await initialResponse.json();

    // Parse and display first API response
    let parsedInitial;
    try {
      const cleanedResponse = initialData.reply
        .replace(/```(json)?\n/g, "")
        .replace(/```/g, "")
        .trim();
      parsedInitial = JSON.parse(cleanedResponse);

      // Display first API response in output element
      if (elements.output) {
        elements.output.textContent = JSON.stringify(parsedInitial, null, 2);
      }
    } catch (parseError) {
      throw new Error(
        "Failed to parse initial AI response: " + parseError.message
      );
    }

    // Handle errors from initial analysis
    if (parsedInitial.errors?.length > 0) {
      const errorMessages = parsedInitial.errors
        .map((err) => `${err.type}: ${err.message} (${err.severity})`)
        .join("\n");
      elements.outputError.textContent = errorMessages;
      elements.outputError.style.color = "Crimson";
      showMessage("Found potential issues in the code", "error");
    } else {
      elements.outputError.textContent = "No errors found.";
      elements.outputError.style.color = "Green";
    }

    // Execute SQL queries from initial analysis
    let sqlResults = [];
    if (parsedInitial.sql_queries?.length > 0) {
      showMessage(
        `Executing ${parsedInitial.sql_queries.length} SQL queries`,
        "info"
      );

      for (const sqlQuery of parsedInitial.sql_queries) {
        const queryType = sqlQuery.query.trim().split(/\s+/)[0].toLowerCase();
        try {
          const result = await executeQuery(queryType, sqlQuery.query);
          sqlResults.push({
            query: sqlQuery.query,
            description: sqlQuery.description,
            type: queryType,
            result: result,
          });
        } catch (err) {
          sqlResults.push({
            query: sqlQuery.query,
            description: sqlQuery.description,
            type: queryType,
            error: err.message,
          });
        }
      }

      // Display SQL results
      if (elements.outputSQL) {
        elements.outputSQL.textContent = JSON.stringify(sqlResults, null, 2);
      }
    }

    // Final prediction analysis
    const finalResponse = await fetch(
      "https://server100sql.onrender.com/api/ai",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-API-KEY": localStorage.getItem("key")
            ? localStorage.getItem("key")
            : localStorage.setItem("key", "1234"),
        },
        body: JSON.stringify({
          query: `Analyze X++ code with execution results and provide final output.
          
X++ Code:
${elements.xppCode.value.trim()}

Initial Analysis:
${JSON.stringify(parsedInitial, null, 2)}

SQL Results:
${JSON.stringify(sqlResults, null, 2)}

Provide final execution prediction in this JSON format:
{
  "output": "The actual result of the X++ code execution"
}`,
        }),
      }
    );

    if (!finalResponse.ok) {
      throw new Error(`Final analysis failed: ${finalResponse.status}`);
    }

    const finalData = await finalResponse.json();

    // Parse and display final output
    let finalOutput;
    try {
      const cleanedFinal = finalData.reply
        .replace(/```(json)?\n/g, "")
        .replace(/```/g, "")
        .trim();
      finalOutput = JSON.parse(cleanedFinal);

      if (elements.xppOutput && finalOutput.output) {
        elements.xppOutput.textContent = finalOutput.output;
      }
    } catch (parseError) {
      throw new Error("Failed to parse final output: " + parseError.message);
    }

    showMessage("Processing completed successfully!", "success");
  } catch (error) {
    console.error("Processing failed:", error);
    showMessage(`Error: ${error.message}`, "error");
    if (elements.output) {
      elements.output.textContent = error.message;
    }
  } finally {
    toggleLoading(false);
  }
}

// Default X++ code template
function setDefaultXppCode() {
  const xppCodeElement = document.getElementById("xppCode");
  if (xppCodeElement) {
    xppCodeElement.value = `class XppCode
{
  public static void main(Args _args)
  {
    info('Hello, World! Welcome to X++.');
  }
}`;
  }
}

// Initialize event listeners
function initializeEventListeners() {
  const runButton = document.getElementById("runButton");
  const xppCodeInput = document.getElementById("xppCode");

  if (runButton) {
    runButton.addEventListener("click", function (event) {
      event.preventDefault();
      processXpp();
    });
  }

  if (xppCodeInput) {
    xppCodeInput.addEventListener("keydown", function (event) {
      if (event.ctrlKey && event.key === "Enter") {
        event.preventDefault();
        processXpp();
      }
    });
  }

  // Set default code on page load
  setDefaultXppCode();
}

// Initialize the application
document.addEventListener("DOMContentLoaded", initializeEventListeners);
