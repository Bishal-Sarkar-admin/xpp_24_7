const API_URL = "https://ai-compiler-amber.vercel.app/process-xpp"; // Backend URL

async function executeQuery(type, query) {
  try {
    const response = await fetch(`http://localhost:3000/api/${type}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, params: [] }),
    });

    if (!response.ok) {
      throw new Error(`SQL Execution Error: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error("SQL Execution Error:", error);
    return { error: error.message };
  }
}

async function processXpp() {
  const xppCode = document.getElementById("xppCode").value.trim();
  const outputElement = document.getElementById("output");
  const outputElementsql = document.getElementById("outputSQL");
  const xppoutputPre = document.getElementById("xppoutput");
  const outputError = document.getElementById("error");

  if (!xppCode) {
    outputElement.textContent = "Please enter some X++ code.";
    return;
  }

  // UI: Show Loading State
  outputElement.textContent = "Processing...";
  outputElementsql.textContent = "...";
  xppoutputPre.textContent = "...";
  outputError.textContent = "";

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ xppCode }),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    const data = await response.json();
    const xppOutput = data.output || data.OUTPUT || "No X++ output.";
    const sqlCodeRaw = data.sql || data.SQL || "";
    const sqlCode = Array.isArray(sqlCodeRaw) ? sqlCodeRaw.join("; ") : sqlCodeRaw;
    const error = data.error || data.ERROR || "none";

    // Error Handling
    if (error !== "none") {
      outputError.textContent = error;
      outputError.style.color = "Crimson";
    } else {
      outputError.textContent = "No Error.";
      outputError.style.color = "Green";
    }

    // Display X++ Output
    if (xppOutput.length < 25) {
      xppoutputPre.textContent = xppOutput;
    } else {
      xppoutputPre.textContent = xppOutput.substring(0, 25) + "..."; // Show truncated output
      xppoutputPre.title = xppOutput; // Full output in tooltip
    }

    // Display Full Response
    outputElement.textContent = JSON.stringify(data, null, 2);

    // Execute SQL Query if Generated



if (typeof sqlCode === "string" && sqlCode.trim() !== "") {
  const queryType = sqlCode.match(/^\w+/)?.[0] || "unknown";

  if (queryType !== "unknown" && queryType !== "None") {
    executeQuery(queryType, sqlCode)
      .then((result) => {
        outputElementsql.textContent = JSON.stringify(result, null, 2);
      })
      .catch((err) => {
        outputElementsql.textContent = `SQL Execution Error: ${err}`;
      });
  } else {
    outputElementsql.textContent = "No SQL query generated.";
  }
} else {
  console.error("Invalid SQL response:", sqlCode);
  outputElementsql.textContent = "Invalid SQL response received.";
}

  } catch (error) {
    outputElement.textContent = `Error: ${error.message}`;
    console.error("Request failed:", error);
  }
}
