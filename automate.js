// Add a global array to store chat history
const chatHistory = [];

// Define the example JSON structure for the AI to follow, now including indexes
const JSON_Data = {
  delete: "PreviousTable", // if required: name of table to delete
  code: `class XppCodeD365FO 	//if required
  {
  	public static void main(Args _args)
  	{
  		info("Welcome to the world of X++");
  		info("This is a simple example of X++ code.");
  	}
  }`,
  name: "Table", // 	if required: Table to create
  fields: [
    {
      name: "Name",
      type: "STR(50)",
      notNull: true,
      primaryKey: true,
    },
    {
      name: "Age",
      type: "INT",
      notNull: false,
      primaryKey: false,
    },
    {
      name: "Email",
      type: "STR(100)",
      notNull: true,
      primaryKey: false,
    },
    {
      name: "Phone",
      type: "NUMBER", // Assuming NUMBER maps to a numeric type like REAL or INT
      notNull: false,
      primaryKey: false,
    },
  ],
  // New indexing section for better performance
  indexes: [
    {
      name: "IDX_Email", // Index name
      fields: ["Email"], // Fields to include in the index (must exist in the table)
      unique: false, // Whether the index is unique or not
    },
    {
      name: "IDX_Name_Age", // Composite index example
      fields: ["Name", "Age"], // Multiple fields for index (must exist in the table)
      unique: true, // Unique constraint
    },
  ],
};

// Table, field, and index caching for better performance
const tableCache = new Map();
const fieldCache = new Map();
const indexCache = new Map(); // Cache for index creation attempts (UI or SQL)

// --- Helper functions for Database Interaction (based on provided code) ---

// These functions are assumed to interact with your backend API to get table info.
// Assumes showSpinner, removeSpinner, showMessage functions exist elsewhere in your environment.

/**
 * Fetches and displays the list of tables in the database.
 * Assumes UI elements with IDs 'tableNames', and helper functions showSpinner, removeSpinner, showMessage.
 */
async function TotalTable_New() {
  try {
    const tableResponse = await fetch("https://server100sql.onrender.com/api/select", {
      method: "POST",
      headers,
      body: JSON.stringify({
        query: "SELECT name FROM sqlite_master WHERE type='table';", // SQLite query to get table names
        params: [],
      }),
    });
    showSpinner(); // Assuming showSpinner exists
    if (!tableResponse.ok) {
      removeSpinner(); // Assuming removeSpinner exists
      showMessage(`Failed to fetch table names.`, "error"); // Assuming showMessage exists
      throw new Error(`Failed to fetch table names.`);
    }

    // Clear existing table list in the UI
    if (tableNamesContainer) {
      tableNamesContainer.innerHTML = "";
    } else {
      console.warn("tableNamesContainer element not found.");
    }

    const tableData = await tableResponse.json();
    if (tableData.data) {
      removeSpinner();
      showMessage(`Table names fetched successfully!`, "success");
    }

    const allTableNames = tableData.data
      ? tableData.data.map((row) => row.name)
      : []; // Extract table names, handle null data
    const TableTitle = document.createElement("h5"); // Renamed from Table to TableTitle for clarity

    TableTitle.style.textAlign = "center";
    TableTitle.innerText = "Tables in Database";
    TableTitle.style.fontSize = "20px";
    if (tableNamesContainer) {
      tableNamesContainer.appendChild(TableTitle);
    }

    allTableNames.forEach((tableName) => {
      // Use forEach to iterate and create UI elements
      const tableDiv = document.createElement("div");
      tableDiv.className = "table-name"; // Use a class for table name divs
      tableDiv.style.cursor = "pointer";
      tableDiv.style.textAlign = "center";
      tableDiv.innerHTML = `<h5>${tableName}</h5>`;

      if (tableNamesContainer) {
        tableNamesContainer.appendChild(tableDiv);
      }

      // Add click listener to show schema and data
      tableDiv.addEventListener("click", async () => {
        showSpinner(); // Show spinner when fetching schema/data for a table
        try {
          const schemaData = await ShowTableSchema_New(tableName);
          const tableData = await ShowTableData_New(tableName);

          // Create the card to display schema and data
          const card = document.createElement("div");
          card.className = "card"; // Assuming .card CSS exists for styling

          // Create close button for the card
          const closeBtn = document.createElement("button");
          closeBtn.className = "close-btn"; // Assuming .close-btn CSS exists for styling
          closeBtn.innerHTML = "&times;"; // HTML entity for 'times' symbol
          closeBtn.onclick = () => card.remove(); // Remove the card when clicked

          // Build schema HTML using fetched data
          const schemaHtml = `<h3>Schema for ${tableName}</h3><pre>${JSON.stringify(
            schemaData ? schemaData.data : null, // Use schemaData.data and handle null/undefined
            null, // Use null for replacer
            2 // Use 2 spaces for indentation
          )}</pre>`;

          // Build data HTML using fetched data
          const dataHtml = `<h3>Data for ${tableName}</h3><pre>${JSON.stringify(
            tableData ? tableData.data : null, // Use tableData.data and handle null/undefined
            null, // Use null for replacer
            2 // Use 2 spaces for indentation
          )}</pre>`;

          // Set card content and append close button
          card.innerHTML = schemaHtml + dataHtml;
          card.appendChild(closeBtn);
          document.body.appendChild(card); // Append the card to the body
        } catch (e) {
          console.error(`Error displaying table details for ${tableName}:`, e);
          showMessage(
            `Error displaying details for ${tableName}: ${e.message}`,
            "error"
          );
        } finally {
          removeSpinner(); // Hide spinner after fetching and displaying
        }
      });
    });
  } catch (e) {
    console.error("❌ Error in TotalTable_New:", e); // Corrected function name
    showMessage(`Error fetching total tables: ${e.message}`, "error"); // Added error message detail
    removeSpinner();
  }
}

/**
 * Fetches the schema for a specific table from the database.
 * Assumes backend API endpoint /api/select handles SQL queries.
 * @param {string} tableName - The name of the table.
 * @returns {Promise<object>} - A promise that resolves with the schema data.
 */
async function ShowTableSchema_New(tableName) {
  try {
    // No spinner/message here, as it's called by TotalTable_New or fetchAllTableSchemas which handle it
    const schemaResponse = await fetch("https://server100sql.onrender.com/api/select", {
      method: "POST",
      headers,
      body: JSON.stringify({
        query: `PRAGMA table_info(${tableName});`, // Using PRAGMA for schema info in SQLite
        params: [],
      }),
    });

    if (!schemaResponse.ok) {
      throw new Error(`Failed to fetch schema for table ${tableName}`);
    }

    const schemaData = await schemaResponse.json();
    return schemaData; // Return the data object containing schema information
  } catch (e) {
    console.error(`❌ Error in ShowTableSchema_New for ${tableName}:`, e); // Corrected function name
    throw e; // Re-throw the error so the caller can catch and handle it
  }
}

/**
 * Fetches all data from a specific table in the database.
 * Assumes backend API endpoint /api/select handles SQL queries.
 * @param {string} tableName - The name of the table.
 * @returns {Promise<object>} - A promise that resolves with the table data.
 */
async function ShowTableData_New(tableName) {
  try {
    // No spinner/message here, as it's called by TotalTable_New which handles it
    const TableDataResponse = await fetch("https://server100sql.onrender.com/api/select", {
      method: "POST",
      headers,
      body: JSON.stringify({
        query: `SELECT * FROM ${tableName};`, // Select all data from the table
        params: [],
      }),
    });

    if (!TableDataResponse.ok) {
      throw new Error(`Failed to fetch Data for table ${tableName}`);
    }

    const TableData = await TableDataResponse.json();
    return TableData; // Return the data object containing table rows
  } catch (e) {
    console.error(`❌ Error in ShowTableData_New for ${tableName}:`, e); // Corrected function name
    throw e; // Re-throw the error so the caller can catch and handle it
  }
}

/**
 * Fetches schemas for all tables in the database.
 * Used to provide context to the AI.
 * @returns {Promise<object>} - A promise that resolves with an object mapping table names to their schemas.
 */
async function fetchAllTableSchemas() {
  const schemas = {};
  try {
    // First, get all table names
    const tableNamesResponse = await fetch("https://server100sql.onrender.com/api/select", {
      method: "POST",
      headers,
      body: JSON.stringify({
        query: "SELECT name FROM sqlite_master WHERE type='table';",
        params: [],
      }),
    });

    if (!tableNamesResponse.ok) {
      throw new Error(`Failed to fetch table names for schema fetching.`);
    }

    const tableNamesData = await tableNamesResponse.json();
    const allTableNames = tableNamesData.data
      ? tableNamesData.data.map((row) => row.name)
      : [];

    // Then, fetch schema for each table
    for (const tableName of allTableNames) {
      try {
        // Reuse ShowTableSchema_New logic but handle its potential throw
        const schemaData = await ShowTableSchema_New(tableName);
        schemas[tableName] = schemaData.data || []; // Store schema data, default to empty array if none
        console.log(`Fetched schema for table: ${tableName}`);
      } catch (e) {
        console.error(
          `Error fetching schema for table ${tableName}:`,
          e.message
        );
        // Continue loop even if fetching one schema fails, error is already logged by ShowTableSchema_New
      }
    }
  } catch (e) {
    console.error("❌ Error in fetchAllTableSchemas:", e.message);
    // Return partial schemas or empty object if fetching table names fails, error is already logged
  }
  return schemas; // Return the collected schemas
}

// EnhancedTableAutomationAgent Class (including previous corrections, caching, and indexing)
class EnhancedTableAutomationAgent {
  constructor(jsonData) {
    this.jsonData = jsonData;
    this.fieldTypeMap = {
      "STR(20)": 0,
      "STR(30)": 1,
      "STR(50)": 2,
      "STR(100)": 3,
      INT: 4,
      REAL: 5, // Assuming REAL maps to a real number type
      NUMBER: 6, // Assuming NUMBER maps to a generic numeric type
      DATE: 7,
      TIME: 8,
      BOOLEAN: 9,
      ANYTYPE: 10, // Generic type
      // Add common D365FO types that might be used in AI response
      ENUM: 11, // Example: Assuming ENUM is a recognized type and has a corresponding index in the UI dropdown
      UTCDATETIME: 12, // Example: Assuming UTCDATETIME is a recognized type and has a corresponding index
      // Add other specific D365FO types as needed with their corresponding index in the UI dropdown
    };

    // Track operations for logging
    this.operations = [];
    this.logOperation(
      "Agent initialized with table: " +
        ((jsonData && jsonData.name) || "undefined")
    );
  }
  /**
   * Log operations for debugging and tracking
   */

  logOperation(message) {
    const timestamp = new Date().toISOString();
    this.operations.push(`[${timestamp}] ${message}`);
    console.log(`[${timestamp}] ${message}`);
  }

  /**
   * Start the automation process with comprehensive workflow
   * Handles delete, create (table and fields), indexes, save, and code execution based on jsonData.
   * This method orchestrates the sequence of UI interactions.
   */
  async run() {
    this.logOperation("Starting enhanced table automation workflow");

    try {
      // 1. Handle table deletion if specified
      if (this.jsonData.delete) {
        this.logOperation(
          `Attempting to delete table: ${this.jsonData.delete}`
        );
        await this.removeTableByName(this.jsonData.delete);
        this.logOperation(
          `Deletion attempt completed for table: ${this.jsonData.delete}`
        );
      } else {
        this.logOperation(
          "No table specified for deletion, skipping deletion step."
        );
      }

      // 2. Proceed with table creation ONLY if a table name is provided
      if (this.jsonData.name) {
        this.logOperation(
          `Attempting to create new table UI element: ${this.jsonData.name}`
        );
        await this.createTable(); // This creates the UI element for the table

        // Get the table ID after UI creation attempt
        const tableID = this.findTableById(this.jsonData.name);
        this.logOperation(
          `Found table UI element ID for ${this.jsonData.name}: ${tableID}`
        );

        // Add table to cache for faster future access
        if (tableID) {
          tableCache.set(this.jsonData.name, tableID);
        } else {
          // This is a critical failure if we intended to create a table but can't find its UI element
          throw new Error(
            `Could not find the table UI element with name: ${this.jsonData.name} after creation attempt.`
          );
        }

        // 3. Add all fields IF fields array is provided and is a non-empty array
        if (
          this.jsonData.fields &&
          Array.isArray(this.jsonData.fields) &&
          this.jsonData.fields.length > 0
        ) {
          this.logOperation(
            `Attempting to add ${this.jsonData.fields.length} fields to table UI element ${this.jsonData.name}`
          );
          await this.addAllFields(tableID); // This adds fields to the UI element
          this.logOperation(
            `Field addition attempts completed for table: ${this.jsonData.name}`
          );
        } else {
          this.logOperation(
            "No fields or empty fields array provided for table creation, skipping field addition."
          );
        }

        // 4. Add indexes if provided (new functionality)
        if (
          this.jsonData.indexes &&
          Array.isArray(this.jsonData.indexes) &&
          this.jsonData.indexes.length > 0
        ) {
          this.logOperation(
            `Attempting to add ${this.jsonData.indexes.length} indexes to table UI element ${this.jsonData.name}`
          );
          await this.addAllIndexes(tableID); // This adds indexes to the UI element
          this.logOperation(
            `Index addition attempts completed for table: ${this.jsonData.name}`
          );
        } else {
          this.logOperation(
            "No indexes or empty indexes array provided, skipping index creation."
          );
        }

        // 5. Save the table structure (This is where the user indicates database creation happens)
        this.logOperation(
          `Attempting to save table structure (and create in DB) for ${this.jsonData.name}`
        );
        await this.saveTable(tableID); // This clicks the UI save button
        this.logOperation(
          `Save action triggered for table ${this.jsonData.name}. Database creation/update should occur now.`
        );

        // 6. Generate and execute index creation SQL for better performance (after UI save)
        // This step is now initiated within the saveTable method after the UI save click.
        // It's kept separate conceptually here in the run() flow description.
        // The saveTable method handles the async nature of this.
      } else {
        this.logOperation(
          "No table name provided for creation in JSON data, skipping table creation step."
        );
      }

      // 7. Execute code if provided
      if (this.jsonData.code) {
        this.logOperation("Attempting to execute provided X++ code");
        await this.executeCode(this.jsonData.code); // This runs the X++ code block
        this.logOperation("X++ code execution attempt completed.");
      } else {
        this.logOperation(
          "No X++ code provided for execution in JSON data, skipping code execution step."
        );
      }

      this.logOperation(
        "Table automation workflow completed successfully (all specified steps attempted)!"
      );
      return {
        success: true,
        operations: this.operations,
      };
    } catch (error) {
      this.logOperation(`FATAL ERROR during workflow: ${error.message}`);
      console.error("Fatal error in table automation workflow:", error);
      return {
        success: false,
        error: error.message,
        operations: this.operations, // Include operations up to the point of fatal error
      };
    }
  }

  /**
   * Simulates creating a new table UI element with the specified name.
   * Assumes UI elements with specific IDs ('btn', 'tableName', 'createTableBtn').
   */
  async createTable() {
    // Check cache first - if table UI element is already there, skip creating it again
    if (this.jsonData.name && tableCache.has(this.jsonData.name)) {
      this.logOperation(
        `Table UI element ${this.jsonData.name} found in cache, skipping UI creation.`
      );
      return Promise.resolve();
    }

    // Ensure a table name is provided before attempting UI creation
    if (!this.jsonData.name) {
      this.logOperation("No table name provided in jsonData for UI creation.");
      return Promise.resolve(); // Skip if no name
    }

    return new Promise((resolve, reject) => {
      try {
        const addBtn = document.getElementById("btn");
        if (!addBtn) {
          return reject(
            new Error(
              "Add table button not found (ID: 'btn'). Cannot create table UI element."
            )
          );
        }
        addBtn.click();
        this.logOperation("Clicked add table button to open modal.");

        setTimeout(() => {
          // Allow modal/input to appear
          try {
            const tableNameInput = document.getElementById("tableName");
            if (!tableNameInput) {
              return reject(
                new Error(
                  "Table name input field not found (ID: 'tableName'). Cannot set table name in modal."
                )
              );
            }

            // Set the table name in the modal input
            tableNameInput.value = this.jsonData.name;

            // Trigger input event to ensure UI recognizes the value change
            const inputEvent = new Event("input", { bubbles: true });
            tableNameInput.dispatchEvent(inputEvent);
            this.logOperation(
              `Set table name input in modal to: ${this.jsonData.name}`
            );

            setTimeout(() => {
              // Allow input value to register
              try {
                const createBtn = document.getElementById("createTableBtn");
                if (!createBtn) {
                  return reject(
                    new Error(
                      "Create table button not found (ID: 'createTableBtn'). Cannot click create button in modal."
                    )
                  );
                }

                createBtn.click();
                this.logOperation("Clicked create table button in modal.");
                // After clicking create, the table UI element should appear.
                // We resolve after a short delay to allow the UI to update.
                setTimeout(resolve, 800); // Longer timeout for UI updates after modal action
              } catch (e) {
                reject(
                  new Error(
                    `Error clicking create button in modal: ${e.message}`
                  )
                );
              }
            }, 500); // Delay before clicking create button
          } catch (e) {
            reject(
              new Error(`Error setting table name input in modal: ${e.message}`)
            );
          }
        }, 500); // Delay after clicking add button to open modal
      } catch (e) {
        reject(
          new Error(`Error initiating createTable UI process: ${e.message}`)
        );
      }
    });
  }

  /**
   * Finds a table UI element in the document by its name.
   * Assumes table containers have class 'table-container' and a name element with class 'table-name'.
   * Uses caching for performance.
   * @param {string} tableName - The name of the table to find.
   * @returns {string|null} - The ID of the table UI element, or null if not found.
   */
  findTableById(tableName) {
    if (!tableName || typeof tableName !== "string") {
      console.warn("findTableById called with invalid tableName:", tableName);
      return null;
    }

    // Check cache first for better performance
    if (tableCache.has(tableName)) {
      this.logOperation(`Using cached table ID for ${tableName}`);
      return tableCache.get(tableName);
    }

    const tableContainers = document.querySelectorAll(".table-container");

    for (let i = 0; i < tableContainers.length; i++) {
      const table = tableContainers[i];
      const nameElement = table.querySelector(".table-name");

      // Added defensive check for nameElement and its textContent
      if (
        nameElement &&
        nameElement.textContent &&
        nameElement.textContent.trim() === tableName.trim()
      ) {
        // Add to cache for future lookups
        tableCache.set(tableName, table.id);
        return table.id;
      }
    }

    return null; // Return null if table UI element not found
  }

  /**
   * Adds all fields listed in jsonData.fields to the specified table UI element.
   * Processes each field addition sequentially via UI interaction.
   * @param {string} tableID - The ID of the table UI element.
   */
  async addAllFields(tableID) {
    // This method is called only if this.jsonData.fields is a valid non-empty array by run()

    // Process each field sequentially (UI interaction might be sensitive to parallel operations)
    for (let i = 0; i < this.jsonData.fields.length; i++) {
      const field = this.jsonData.fields[i];
      // Create a unique cache key for this field within this table
      const fieldCacheKey = `${tableID}_field_${field.name}`;

      // Skip if field already exists in cache (meaning UI addition was attempted)
      if (fieldCache.has(fieldCacheKey)) {
        this.logOperation(
          `Field UI element ${field.name} already exists in cache for table ${tableID}, skipping UI addition.`
        );
        continue;
      }

      try {
        this.logOperation(
          `Attempting to add field UI element: ${
            field.name || "Unnamed Field"
          } (${field.type || "Unknown Type"}) to table ${tableID}`
        );
        await this.addField(tableID, field); // This interacts with the UI modal to add the field
        // Add to field cache after successful UI addition attempt
        fieldCache.set(fieldCacheKey, true);
        this.logOperation(
          `Successfully attempted to add field UI element: ${
            field.name || "Unnamed Field"
          }`
        );
      } catch (error) {
        this.logOperation(
          `ERROR adding field UI element ${field.name || "Unnamed Field"}: ${
            error.message
          }`
        );
        // Continue with other fields even if one fails to be added to the UI
      }
    }
    this.logOperation("Attempted to add all field UI elements.");
  }

  /**
   * Simulates adding a single field to the table UI element via modal interaction.
   * Assumes field modal elements with specific IDs ('fieldName', 'fieldType', 'notNull', 'primaryKey', 'addFieldBtn').
   * @param {string} tableID - The ID of the table UI element.
   * @param {object} fieldData - The data for the field (name, type, notNull, primaryKey).
   * @returns {Promise<void>} - A promise that resolves when the UI interaction is complete.
   */
  async addField(tableID, fieldData) {
    // fieldData is assumed to be an object from the fields array
    return new Promise((resolve, reject) => {
      try {
        // Open the field modal for the specific table UI element
        this.openFieldModal(tableID);
        this.logOperation(`Opened field modal for table ID: ${tableID}`);

        setTimeout(() => {
          // Give the modal time to open and elements to be ready
          try {
            const fieldNameInput = document.getElementById("fieldName");
            if (!fieldNameInput) {
              return reject(
                new Error(
                  "Field name input not found in modal (ID: 'fieldName'). Cannot set field name."
                )
              );
            }

            // Ensure field name is provided and is a string
            if (fieldData.name && typeof fieldData.name === "string") {
              fieldNameInput.value = fieldData.name;
              const inputEvent = new Event("input", { bubbles: true });
              fieldNameInput.dispatchEvent(inputEvent);
              this.logOperation(
                `Set field name input in modal to: ${fieldData.name}`
              );
            } else {
              this.logOperation(
                "Warning: Field data is missing 'name' or it's not a string. Skipping setting field name in modal."
              );
              // Continue even if name is missing, UI/backend might handle it
            }

            // Set field type in the modal dropdown
            if (fieldData.type) {
              try {
                this.setFieldType(fieldData.type);
                this.logOperation(
                  `Set field type in modal to: ${fieldData.type}`
                );
              } catch (typeError) {
                this.logOperation(
                  `Warning: Could not set field type "${
                    fieldData.type
                  }" for field "${fieldData.name || "Unnamed"}": ${
                    typeError.message
                  }. Defaulting might occur in setFieldType.`
                );
                // Continue even if type setting fails
              }
            } else {
              this.logOperation(
                `Warning: Field type not provided for field: ${
                  fieldData.name || "Unnamed"
                }. Defaulting to STR(20) in setFieldType.`
              );
              this.setFieldType("STR(20)"); // Default if type is missing
            }

            // Set constraints (notNull, primaryKey) in the modal checkboxes if specified
            const notNullCheckbox = document.getElementById("notNull");
            if (notNullCheckbox && fieldData.notNull === true) {
              notNullCheckbox.checked = true;
              // Trigger change event if needed by the UI
              const changeEvent = new Event("change", { bubbles: true });
              notNullCheckbox.dispatchEvent(changeEvent);
              this.logOperation("Set Not Null constraint in modal.");
            }

            const pkCheckbox = document.getElementById("primaryKey");
            if (pkCheckbox && fieldData.primaryKey === true) {
              pkCheckbox.checked = true;
              // Trigger change event if needed by the UI
              const changeEvent = new Event("change", { bubbles: true });
              pkCheckbox.dispatchEvent(changeEvent);
              this.logOperation("Set Primary Key constraint in modal.");
            }

            // Click the add field button in the modal
            setTimeout(() => {
              // Small delay after setting inputs
              try {
                const addFieldBtn = document.getElementById("addFieldBtn");
                if (!addFieldBtn) {
                  return reject(
                    new Error(
                      "Add field button not found in modal (ID: 'addFieldBtn'). Cannot click add field button."
                    )
                  );
                }

                addFieldBtn.click();
                this.logOperation("Clicked add field button in modal.");
                // Resolve after clicking the button, assuming the UI handles adding the field element
                setTimeout(resolve, 500); // Give time for modal to close/UI update
              } catch (e) {
                reject(
                  new Error(
                    `Error clicking add field button in modal: ${e.message}`
                  )
                );
              }
            }, 400); // Delay before clicking add field button
          } catch (e) {
            reject(
              new Error(
                `Error configuring field details in modal: ${e.message}`
              )
            );
          }
        }, 700); // Delay after opening field modal
      } catch (e) {
        reject(new Error(`Error initiating addField UI process: ${e.message}`));
      }
    });
  }

  /**
   * Adds all indexes listed in jsonData.indexes to the specified table UI element.
   * Processes each index addition sequentially via UI interaction.
   * @param {string} tableID - The ID of the table UI element.
   */
  async addAllIndexes(tableID) {
    if (
      !this.jsonData.indexes ||
      !Array.isArray(this.jsonData.indexes) ||
      this.jsonData.indexes.length === 0
    ) {
      this.logOperation("No indexes to add to UI, skipping index creation.");
      return;
    }

    // Process each index sequentially (UI interaction might be sensitive to parallel operations)
    for (const indexData of this.jsonData.indexes) {
      // Create a unique cache key for this index within this table
      const indexCacheKey = `${tableID}_index_${indexData.name}`;

      // Skip if index already exists in cache (meaning UI addition was attempted)
      if (indexCache.has(indexCacheKey)) {
        this.logOperation(
          `Index UI element ${indexData.name} already exists in cache for table ${tableID}, skipping UI addition.`
        );
        continue;
      }

      try {
        this.logOperation(
          `Attempting to add index UI element: ${indexData.name} to table ${tableID}`
        );
        await this.addIndex(tableID, indexData); // This interacts with the UI modal to add the index
        // Add to index cache after successful UI addition attempt
        indexCache.set(indexCacheKey, true);
        this.logOperation(
          `Successfully attempted to add index UI element: ${indexData.name}`
        );
      } catch (error) {
        this.logOperation(
          `ERROR adding index UI element ${indexData.name}: ${error.message}`
        );
        // Continue with other indexes even if one fails to be added to the UI
      }
    }
    this.logOperation("Attempted to add all index UI elements.");
  }

  /**
   * Simulates adding a single index to the table UI element via modal interaction.
   * Assumes index modal elements with specific IDs ('indexName', 'uniqueIndex', 'indexFieldSelector', 'addFieldToIndexBtn', 'addIndexBtn').
   * @param {string} tableID - The ID of the table UI element.
   * @param {object} indexData - The data for the index (name, fields, unique).
   * @returns {Promise<void>} - A promise that resolves when the UI interaction is complete.
   */
  async addIndex(tableID, indexData) {
    return new Promise((resolve, reject) => {
      try {
        // Open the index modal for the specific table UI element
        this.openIndexModal(tableID);
        this.logOperation(`Opened index modal for table ID: ${tableID}`);

        setTimeout(() => {
          // Give the modal time to open and elements to be ready
          try {
            // Set index name in the modal input
            const indexNameInput = document.getElementById("indexName");
            if (!indexNameInput) {
              return reject(
                new Error(
                  "Index name input not found in modal (ID: 'indexName'). Cannot set index name."
                )
              );
            }

            if (!indexData.name || typeof indexData.name !== "string") {
              this.logOperation(
                "Warning: Index data is missing 'name' or it's not a string. Skipping setting index name in modal."
              );
              // Continue even if name is missing, UI/backend might handle it
            } else {
              indexNameInput.value = indexData.name;
              const inputEvent = new Event("input", { bubbles: true });
              indexNameInput.dispatchEvent(inputEvent);
              this.logOperation(
                `Set index name input in modal to: ${indexData.name}`
              );
            }

            // Set unique constraint in the modal checkbox if specified
            const uniqueCheckbox = document.getElementById("uniqueIndex");
            if (uniqueCheckbox && indexData.unique === true) {
              uniqueCheckbox.checked = true;
              const changeEvent = new Event("change", { bubbles: true });
              uniqueCheckbox.dispatchEvent(changeEvent);
              this.logOperation("Set Unique index constraint in modal.");
            }

            // Add fields to index in the modal
            if (
              indexData.fields &&
              Array.isArray(indexData.fields) &&
              indexData.fields.length > 0
            ) {
              try {
                this.setIndexFields(indexData.fields); // This interacts with the field selection in the modal
              } catch (fieldSetError) {
                this.logOperation(
                  `Warning: Could not set index fields in modal for index ${indexData.name}: ${fieldSetError.message}`
                );
                // Continue to add the index even if fields couldn't be set via UI
              }
            } else {
              this.logOperation(
                `Warning: Index data for ${indexData.name} is missing 'fields' array or it's empty. Cannot add fields to index in modal.`
              );
              // Decide if an index without fields is valid or should cause rejection.
              // For now, log warning and proceed, assuming UI/backend will handle invalid definition.
            }

            // Click the add index button in the modal
            setTimeout(() => {
              // Small delay after setting inputs
              try {
                const addIndexBtn = document.getElementById("addIndexBtn");
                if (!addIndexBtn) {
                  return reject(
                    new Error(
                      "Add index button not found in modal (ID: 'addIndexBtn'). Cannot click add index button."
                    )
                  );
                }

                addIndexBtn.click();
                this.logOperation("Clicked add index button in modal.");
                // Resolve after clicking the button, assuming the UI handles adding the index element
                setTimeout(resolve, 500); // Give time for modal to close/UI update
              } catch (e) {
                reject(
                  new Error(`Error clicking add index button: ${e.message}`)
                );
              }
            }, 400); // Delay before clicking add index button
          } catch (e) {
            reject(
              new Error(
                `Error configuring index details in modal: ${e.message}`
              )
            );
          }
        }, 700); // Delay after opening index modal
      } catch (e) {
        reject(new Error(`Error initiating addIndex UI process: ${e.message}`));
      }
    });
  }

  /**
   * Opens the index modal for a specific table UI element.
   * Assumes table element has the tableID as its ID and an add index button with class 'add-index-btn'
   * or a global function window.openIndexModal.
   * @param {string} tableID - The ID of the table UI element.
   */
  openIndexModal(tableID) {
    const tableElement = document.getElementById(tableID);
    if (!tableElement) {
      throw new Error(
        `Table UI element with ID "${tableID}" not found to open index modal.`
      );
    }

    // First click on the table to ensure it's selected/active in the UI
    tableElement.click();
    this.logOperation(
      `Clicked on table UI element with ID: ${tableID} to open index modal.`
    );

    // Then open the index modal - assuming a global function or a button
    if (typeof window.openIndexModal === "function") {
      window.openIndexModal(tableID);
      this.logOperation(`Called window.openIndexModal(${tableID}).`);
    } else {
      // Fallback: try clicking a specific add index button within the table container
      const addIndexButton = tableElement.querySelector(".add-index-btn");
      if (addIndexButton) {
        addIndexButton.click(); // Corrected typo
        this.logOperation(`Clicked add index button for table ID: ${tableID}.`);
      } else {
        // If neither method works, we can't open the modal
        throw new Error(
          `Could not find a way to open the add index modal for table ID: ${tableID}.`
        );
      }
    }
  }

  /**
   * Simulates setting the fields for an index in the index modal via UI interaction.
   * Assumes a field selector dropdown with ID 'indexFieldSelector' and an add button with ID 'addFieldToIndexBtn'.
   * This method interacts with the modal's field selection mechanism.
   * @param {string[]} fieldNames - An array of field names to add to the index.
   */
  setIndexFields(fieldNames) {
    if (!fieldNames || !Array.isArray(fieldNames) || fieldNames.length === 0) {
      throw new Error(
        "Field names must be provided as a non-empty array for setIndexFields."
      );
    }

    this.logOperation(
      `Setting index fields in UI modal: ${fieldNames.join(", ")}`
    );

    // Process each field name to add it to the index in the modal
    fieldNames.forEach((fieldName) => {
      const fieldSelector = document.getElementById("indexFieldSelector");
      if (!fieldSelector) {
        this.logOperation(
          `Warning: Index field selector not found (ID: 'indexFieldSelector'). Cannot add field "${fieldName}" to index via UI.`
        );
        return; // Skip this field if the selector isn't found
      }

      // Find the option element for the field name in the selector dropdown
      let fieldOption = null;
      for (let i = 0; i < fieldSelector.options.length; i++) {
        if (fieldSelector.options[i].text === fieldName) {
          // Assuming option text matches field name
          fieldOption = fieldSelector.options[i];
          break;
        }
      }

      if (fieldOption) {
        fieldSelector.value = fieldOption.value; // Set the selector value to the option's value
        const changeEvent = new Event("change", { bubbles: true });
        fieldSelector.dispatchEvent(changeEvent);
        this.logOperation(
          `Selected field "${fieldName}" in index field selector.`
        );

        // Click the button to add this selected field to the index list in the modal
        const addFieldToIndexBtn =
          document.getElementById("addFieldToIndexBtn");
        if (!addFieldToIndexBtn) {
          this.logOperation(
            `Warning: Add field to index button not found (ID: 'addFieldToIndexBtn'). Cannot add field "${fieldName}" to index list.`
          );
          return; // Skip adding this field to the list if the button isn't found
        }

        addFieldToIndexBtn.click();
        this.logOperation(
          `Clicked add field to index button for field "${fieldName}".`
        );
      } else {
        this.logOperation(
          `Warning: Field "${fieldName}" not found in the index field selector options.`
        );
      }
    });
  }

  /**
   * Opens the field modal for a specific table UI element.
   * Assumes table element has the tableID as its ID and an add field button with class 'add-field-btn'
   * or a global function window.openFieldModal.
   * @param {string} tableID - The ID of the table UI element.
   */
  openFieldModal(tableID) {
    const tableElement = document.getElementById(tableID);
    if (!tableElement) {
      throw new Error(
        `Table UI element with ID "${tableID}" not found to open field modal.`
      );
    }

    // First click on the table to ensure it's selected/active in the UI
    tableElement.click();
    this.logOperation(
      `Clicked on table UI element with ID: ${tableID} to open field modal.`
    );

    // Then open the field modal - assuming a global function or a button
    if (typeof window.openFieldModal === "function") {
      window.openFieldModal(tableID);
      this.logOperation(`Called window.openFieldModal(${tableID}).`);
    } else {
      // Fallback: try clicking a specific add field button within the table container
      const addFieldButton = tableElement.querySelector(".add-field-btn");
      if (addFieldButton) {
        addFieldButton.click();
        this.logOperation(`Clicked add field button for table ID: ${tableID}.`);
      } else {
        // If neither method works, we can't open the modal
        throw new Error(
          `Could not find a way to open the add field modal for table ID: ${tableID}.`
        );
      }
    }
  }

  /**
   * Sets the selected value in the field type dropdown in the field modal.
   * Maps string types (including STR(n)) to dropdown indices.
   * Assumes a select element with ID 'fieldType'.
   * @param {string} typeStr - The string representation of the field type (e.g., "STR(50)", "INT").
   */
  setFieldType(typeStr) {
    const fieldTypeSelect = document.getElementById("fieldType");
    if (!fieldTypeSelect) {
      throw new Error(
        "Field type select dropdown not found (ID: 'fieldType')."
      );
    }

    let typeIndex = -1;
    const normalizedType = typeStr ? typeStr.toUpperCase() : ""; // Handle null/undefined typeStr

    // Attempt to parse string types with length
    if (
      normalizedType.startsWith("STR(") ||
      normalizedType.startsWith("STRING(")
    ) {
      const matches = normalizedType.match(/\((\d+)\)/);
      if (matches && matches.length >= 2) {
        const length = parseInt(matches[1], 10);
        // Map length to the closest available STR type index
        if (length <= 20) typeIndex = this.fieldTypeMap["STR(20)"];
        else if (length <= 30) typeIndex = this.fieldTypeMap["STR(30)"];
        else if (length <= 50) typeIndex = this.fieldTypeMap["STR(50)"];
        else typeIndex = this.fieldTypeMap["STR(100)"]; // Default for lengths > 50
      } else {
        this.logOperation(
          `Warning: Invalid string type format "${typeStr}". Falling back to STR(100) or default.`
        );
        typeIndex = this.fieldTypeMap["STR(100)"]; // Fallback for invalid STR format
      }
    } else {
      // Direct type lookup using the normalized type string
      typeIndex = this.fieldTypeMap[normalizedType];
      // If not found, try adding some common D365FO types dynamically or map them
      if (typeIndex === undefined) {
        // Example of dynamic mapping for common D365FO types if not in the map
        if (normalizedType === "ENUM")
          typeIndex = this.fieldTypeMap["ENUM"]; // Assuming ENUM exists in map
        else if (normalizedType === "UTCDATETIME")
          typeIndex = this.fieldTypeMap["UTCDATETIME"]; // Assuming UTCDATETIME exists
        // Add more mappings here as needed based on your UI's dropdown options
      }
    }

    // Default to STR(20) if type not found, parsing failed, or calculated index is out of bounds
    if (
      typeIndex === undefined ||
      typeIndex === -1 ||
      typeIndex >= fieldTypeSelect.options.length
    ) {
      typeIndex = this.fieldTypeMap["STR(20)"]; // Default to STR(20)
      // Log warning unless it was already logged for invalid string format or specifically for out of bounds index
      if (
        !normalizedType.startsWith("STR(") &&
        !normalizedType.startsWith("STRING(") &&
        typeIndex === this.fieldTypeMap["STR(20)"]
      ) {
        this.logOperation(
          `Warning: Unknown or invalid field type "${typeStr}" or index calculated outside options. Defaulting to STR(20).`
        );
      } else if (typeIndex === -1) {
        // Case where STR format was invalid and STR(100) wasn't found, and fallback to STR(20) also failed/was out of bounds
        this.logOperation(
          `Warning: Could not map or set string type "${typeStr}" after parsing length. Defaulting to STR(20) failed.`
        );
      }
    }

    // Set the type in the dropdown if the final determined index is valid
    if (typeIndex >= 0 && typeIndex < fieldTypeSelect.options.length) {
      fieldTypeSelect.selectedIndex = typeIndex; // Set the selected index
      const changeEvent = new Event("change", { bubbles: true }); // Trigger change event
      fieldTypeSelect.dispatchEvent(changeEvent);
      this.logOperation(
        `Selected field type index: ${typeIndex} for type: ${typeStr}`
      );
    } else {
      // This case should ideally be caught by the previous checks, but as a final safeguard
      this.logOperation(
        `ERROR: Final field type index ${typeIndex} is out of bounds for dropdown options. Cannot set type for "${typeStr}".`
      );
      // The dropdown will likely remain on its default value if setting fails here.
    }
  }

  /**
   * Simulates clicking the save button for the table UI element.
   * Assumes a save button with class 'save-table-btn' within the table container or a global function window.saveTable.
   * This is the action that the user indicates triggers database creation/update.
   * It also initiates the process of generating and executing index creation SQL after the UI save click.
   * @param {string} tableID - The ID of the table UI element.
   * @returns {Promise<void>} - A promise that resolves after the save button is clicked and index SQL execution is initiated.
   */
  async saveTable(tableID) {
    this.logOperation(
      `Attempting to save table UI element with ID: ${tableID}`
    );
    return new Promise((resolve) => {
      try {
        if (typeof window.saveTable === "function") {
          window.saveTable(tableID);
          this.logOperation(`Called window.saveTable(${tableID}).`);
          // After calling the global save function, initiate index SQL execution after a delay
          setTimeout(async () => {
            try {
              await this.generateAndExecuteIndexSQL(this.jsonData.name); // Use table name for SQL
              this.logOperation(
                `Index SQL generation and execution process completed for ${this.jsonData.name} after global save.`
              );
            } catch (indexSqlError) {
              this.logOperation(
                `ERROR during index SQL generation/execution after global save for ${this.jsonData.name}: ${indexSqlError.message}`
              );
            } finally {
              setTimeout(resolve, 500); // Additional delay after index SQL execution attempts
            }
          }, 500); // Delay after calling the global save function
        } else {
          const tableElement = document.getElementById(tableID);
          if (!tableElement) {
            this.logOperation(
              `ERROR: Could not find table UI element with ID: ${tableID} for save operation.`
            );
            return resolve(); // Continue workflow despite error
          }

          const saveButton = tableElement.querySelector(".save-table-btn");
          if (saveButton) {
            saveButton.click(); // Click the UI save button
            this.logOperation(
              `Clicked save table button for table ID: ${tableID}. Database creation/update should be triggered.`
            );

            // Added: Generate and execute index creation SQL for better performance
            // This is attempted after the UI save click, assuming the UI save prepares the table for indexing.
            if (
              this.jsonData.indexes &&
              Array.isArray(this.jsonData.indexes) &&
              this.jsonData.indexes.length > 0
            ) {
              this.logOperation(
                `Generating and executing index creation SQL commands for ${this.jsonData.name} via X++ after UI save click.`
              );
              // Using a small delay before generating/executing index SQL after UI save click
              setTimeout(async () => {
                try {
                  await this.generateAndExecuteIndexSQL(this.jsonData.name); // Use table name for SQL
                  this.logOperation(
                    `Index SQL generation and execution process completed for ${this.jsonData.name} after UI save.`
                  );
                } catch (indexSqlError) {
                  this.logOperation(
                    `ERROR during index SQL generation/execution after UI save for ${this.jsonData.name}: ${indexSqlError.message}`
                  );
                  // Continue the workflow despite index SQL errors
                } finally {
                  setTimeout(resolve, 500); // Additional delay after index SQL execution attempts
                }
              }, 500); // Delay after clicking the save button
            } else {
              setTimeout(resolve, 800); // Standard delay if no indexes after UI save click
            }
          } else {
            // Log error but allow workflow to potentially continue
            this.logOperation(
              `ERROR: Could not find save table button for table ID: ${tableID}. Save action not triggered.`
            );
            resolve(); // Continue workflow despite error
          }
        }
      } catch (error) {
        this.logOperation(`ERROR during saveTable process: ${error.message}`);
        resolve(); // Continue workflow despite error
      }
    });
  }

  /**
   * Generates and executes SQL commands for index creation via X++ code.
   * This method is called after the table structure is saved via the UI.
   * Iterates through indexes in jsonData and constructs/executes SQL `CREATE INDEX` statements using X++ jobs.
   * Assumes the backend API can execute X++ code provided as a string.
   * @param {string} tableName - The name of the table for which to create indexes.
   * @returns {Promise<void>} - A promise that resolves after all index SQL execution attempts are initiated.
   */
  async generateAndExecuteIndexSQL(tableName) {
    if (
      !this.jsonData.indexes ||
      !Array.isArray(this.jsonData.indexes) ||
      this.jsonData.indexes.length === 0
    ) {
      this.logOperation("No indexes in JSON data to generate SQL for.");
      return; // No indexes to create
    }

    this.logOperation(
      `Initiating SQL index creation via X++ for table: ${tableName}`
    );

    // Process each index
    for (const indexData of this.jsonData.indexes) {
      if (
        !indexData.name ||
        !indexData.fields ||
        !Array.isArray(indexData.fields) ||
        indexData.fields.length === 0
      ) {
        this.logOperation(
          `Skipping invalid index definition for SQL generation: ${JSON.stringify(
            indexData
          )}`
        );
        continue; // Skip invalid index definitions
      }

      // Create a unique cache key for this index SQL execution attempt
      const indexSqlCacheKey = `sql_index_${tableName}_${indexData.name}`;

      // Skip if SQL execution for this index is already attempted and cached
      if (indexCache.has(indexSqlCacheKey)) {
        this.logOperation(
          `Index SQL execution for ${indexData.name} is already in cache, skipping re-execution.`
        );
        continue;
      }

      // Generate the SQL for this index
      const uniqueStr = indexData.unique ? "UNIQUE " : "";
      const fieldStr = indexData.fields.map((field) => `"${field}"`).join(", "); // Quote field names for safety
      // Using IF NOT EXISTS is good practice to avoid errors if index already exists
      const sql = `CREATE ${uniqueStr}INDEX IF NOT EXISTS "${indexData.name}" ON "${tableName}" (${fieldStr});`; // Quote table and index names

      this.logOperation(`Generated index SQL: ${sql}`);

      // Construct X++ code to execute the SQL statement
      // This X++ code will be executed by the backend API.
      const xppCode = `
        static void CreateIndexJob_${indexData.name}(Args _args)
        {
            str sqlStatement = "${sql}";
            SqlStatementExecutePermission perm;
            Connection connection;
            Statement statement;
            
            try
            {
                // Assert permission to execute SQL statements
                perm = new SqlStatementExecutePermission(sqlStatement);
                perm.assert();
                
                // Get a database connection
                connection = new Connection();
                
                // Create a statement object
                statement = connection.createStatement();
                
                // Execute the SQL statement
                statement.executeUpdate(sqlStatement);
                
                info(strFmt("Index '%1' created successfully for table '%2' via SQL.", "${indexData.name}", "${tableName}"));
                
                // Revert the permission assertion
                CodeAccessPermission::revertAssert();
            }
            catch(Exception::Error)
            {
                // Catch specific SQL execution errors if needed, or a general error
                error(strFmt("Failed to create index '%1' for table '%2' via SQL. Check if fields exist. Error details might be in server logs.", "${indexData.name}", "${tableName}"));
                CodeAccessPermission::revertAssert(); // Ensure revert is called even on error
            }
            catch
            {
                 // Catch any other unexpected exceptions
                 error(strFmt("An unexpected error occurred while creating index '%1' for table '%2' via SQL.", "${indexData.name}", "${tableName}"));
                 CodeAccessPermission::revertAssert(); // Ensure revert is called
            }
            finally
            {
                 // Clean up resources (optional but good practice)
                 if (statement)
                 {
                     statement.finalize();
                 }
                 if (connection)
                 {
                      // Note: D365FO manages connections, explicit close might not be needed or possible like this.
                      // This is more illustrative of standard SQL connection handling.
                 }
            }
        }
      `;

      this.logOperation(
        `Executing X++ code for index '${indexData.name}' SQL execution.`
      );

      try {
        await this.executeCode(xppCode); // Use the existing executeCode method to run this X++ job via the backend
        this.logOperation(
          `X++ code execution triggered for index '${indexData.name}' SQL execution.`
        );
        // Add to cache after triggering execution (assuming trigger is the goal)
        indexCache.set(indexSqlCacheKey, true); // Cache that SQL execution for this index was attempted
      } catch (executeError) {
        this.logOperation(
          `ERROR triggering X++ code for index '${indexData.name}' SQL execution: ${executeError.message}`
        );
        // Continue to the next index even if execution trigger fails
      }
    }
    this.logOperation(
      "Attempted to generate and execute SQL for all indexes via X++."
    );
  }

  /**
   * Attempts to remove a table by its name via UI interaction and potentially X++ database deletion.
   * Attempts UI removal first. If the table UI element is found, it tries to click the remove button.
   * It also includes an attempt to execute X++ code for database-level deletion, regardless of UI success.
   * Continues the workflow even if deletion fails ("pass or fail no matter").
   * @param {string} tableName - The name of the table to remove.
   * @returns {Promise<void>} - A promise that resolves after deletion attempts are initiated.
   */
  async removeTableByName(tableName) {
    if (!tableName || typeof tableName !== "string") {
      this.logOperation(
        "No valid table name provided for deletion, skipping deletion."
      );
      return Promise.resolve(); // Resolve immediately if no valid name
    }

    return new Promise(async (resolve) => {
      // Always resolve to allow workflow to continue regardless of deletion success
      try {
        const tableID = this.findTableById(tableName);

        // Invalidate cache entries related to this table name
        tableCache.delete(tableName);
        // Invalidate field and index caches that might be associated with this table name or ID
        // A more robust approach would be to iterate and delete keys based on table name or ID prefix
        fieldCache.forEach((value, key) => {
          if (
            key.includes(`_${tableName}`) ||
            (tableID && key.startsWith(`${tableID}_`))
          )
            fieldCache.delete(key);
        });
        indexCache.forEach((value, key) => {
          if (
            key.includes(`_index_${tableName}`) ||
            (tableID && key.startsWith(`${tableID}_`))
          )
            indexCache.delete(key);
        });
        this.logOperation(`Invalidated cache entries for table: ${tableName}`);

        if (!tableID) {
          this.logOperation(
            `Table UI element '${tableName}' not found for deletion, proceeding to database deletion attempt.`
          );
          // Proceed to database deletion attempt even if not found in UI
        } else {
          this.logOperation(
            `Found table UI element to delete with ID: ${tableID}. Attempting UI removal.`
          );
          // Try to remove the table from UI by clicking the remove button
          if (typeof window.removeTable === "function") {
            window.removeTable(tableID); // Assuming a global UI removal function
            this.logOperation(
              `Called window.removeTable(${tableID}) for UI removal.`
            );
          } else {
            const tableElement = document.getElementById(tableID);
            if (!tableElement) {
              this.logOperation(
                `ERROR: Table UI element with ID ${tableID} not found for UI removal button click.`
              );
            } else {
              const removeButton =
                tableElement.querySelector(".remove-table-btn");
              if (removeButton) {
                removeButton.click(); // Click the UI remove button
                this.logOperation(
                  `Clicked UI remove button for table ID: ${tableID}.`
                );
              } else {
                this.logOperation(
                  `No UI remove button found for table ID: ${tableID}. Attempting database deletion directly.`
                );
              }
            }
          }

          // Give UI some time to update after UI removal attempt
          await new Promise((res) => setTimeout(res, 500));
        }

        // Also attempt to delete from database using X++ code.
        // This is a separate attempt that runs regardless of UI removal success.
        // Note: Directly dropping tables via X++ in production is generally not recommended.
        // This X++ code is for simulating or attempting database-level deletion in this specific automation context.
        const deleteCode = `static void DeleteTableStructure_${tableName}(Args _args)
{
    DictTable dictTable = new DictTable(tableNum(${tableName}));
    if (dictTable && dictTable.id() != 0)
    {
        // Warning: Dropping tables via X++ in production is not recommended.
        // This is for automation scenario as requested.
        // Consider alternative methods like marking for delete or using sysDatabaseTransDelete.
        
        info(strFmt("Attempting database table drop simulation for: %1", "${tableName}"));
        
        // A real drop would look something like this (requires elevated privileges):
        // new SqlStatementExecutePermission("DROP TABLE \\"${tableName}\\"").assert();
        // SqlSystem ss = new SqlSystem();
        // ss.dropTable(tableName); // This method might exist depending on D365FO version/context
        // CodeAccessPermission::revertAssert();

        // If the intent was to delete *records*, use delete_from.
        // delete_from ${tableName};
        // info(strFmt("Deleted all records from table: %1", "${tableName}"));
    }
    else
    {
        info(strFmt("Table %1 not found in AOT for database deletion attempt.", "${tableName}"));
    }
}`;

        this.logOperation(
          `Attempting database operation for ${tableName} via X++ execution.`
        );
        try {
          await this.executeCode(deleteCode); // Execute the X++ code block via the backend
          this.logOperation(
            `X++ database operation attempt completed for ${tableName}.`
          );
        } catch (executeError) {
          this.logOperation(
            `ERROR during X++ database operation for ${tableName}: ${executeError.message}`
          );
          // Continue the workflow despite the error in executeCode
        }
      } catch (e) {
        // Log any errors during the overall deletion process but resolve the promise
        this.logOperation(
          `ERROR during removeTableByName process for ${tableName}: ${e.message}`
        );
      }
      // Always resolve so the main workflow continues ("pass or fail no matter")
      resolve();
    });
  }

  /**
   * Simulates executing X++ code in the code editor UI element.
   * Assumes UI elements with specific IDs ('xppCode', 'runButton').
   * Note: This does not capture the actual result/output of the X++ execution from the backend.
   * It only simulates the UI interaction to trigger execution.
   * @param {string} code - The X++ code string to execute.
   * @returns {Promise<void>} - A promise that resolves after the run button is clicked.
   */
  async executeCode(code) {
    if (!code || typeof code !== "string") {
      this.logOperation(
        "No valid X++ code provided for execution, skipping execution."
      );
      return Promise.resolve(); // Resolve immediately if no code
    }

    return new Promise((resolve, reject) => {
      try {
        const codeTextArea = document.getElementById("xppCode");
        if (!codeTextArea) {
          return reject(
            new Error(
              "Code textarea not found (ID: 'xppCode'). Cannot set code."
            )
          );
        }

        // Set the code in the textarea UI element
        codeTextArea.value = code;

        // Trigger input event to ensure UI recognizes the value change
        const inputEvent = new Event("input", { bubbles: true });
        codeTextArea.dispatchEvent(inputEvent);
        this.logOperation("Set X++ code in textarea.");

        // Click the run button to trigger execution
        setTimeout(() => {
          // Small delay after setting code to allow UI update
          try {
            const runButton = document.getElementById("runButton");
            if (!runButton) {
              return reject(
                new Error(
                  "Run button not found (ID: 'runButton'). Cannot click run button."
                )
              );
            }

            runButton.click(); // Click the run button
            this.logOperation("Clicked X++ run button.");
            // We resolve after clicking the button, not waiting for X++ execution result from backend.
            // A longer timeout might be needed depending on how long X++ execution takes before UI updates or logs appear.
            setTimeout(resolve, 2000); // Increased delay for code execution trigger
          } catch (e) {
            reject(new Error(`Error clicking run button: ${e.message}`));
          }
        }, 300); // Delay before clicking run button
      } catch (e) {
        reject(
          new Error(`Error initiating executeCode UI process: ${e.message}`)
        );
      }
    });
  }

  /**
   * Generates a report of the automation process based on initial JSON and operations log.
   * @returns {object} - An object containing details of the automation process.
   */
  generateReport() {
    return {
      initialJson: this.jsonData, // Include the initial JSON for context
      tableName: (this.jsonData && this.jsonData.name) || "Not specified",
      fieldCount:
        this.jsonData &&
        this.jsonData.fields &&
        Array.isArray(this.jsonData.fields)
          ? this.jsonData.fields.length
          : 0,
      indexCount:
        this.jsonData &&
        this.jsonData.indexes &&
        Array.isArray(this.jsonData.indexes)
          ? this.jsonData.indexes.length
          : 0, // Report index count
      deletedTableAttempted: (this.jsonData && this.jsonData.delete) || "None",
      codeExecutionAttempted:
        this.jsonData && this.jsonData.code ? "Yes" : "No",
      operationsLog: this.operations, // Use operationsLog for clarity
      timestamp: new Date().toISOString(),
    };
  }
}

// Function to run the automation workflow with a given JSON data object.
// This function initializes the agent and calls its run method, which orchestrates the sequence.
// It also handles showing/hiding spinners and displaying messages.
async function runAutomation(data) {
  if (!data) {
    console.error("runAutomation called with no data.");
    showMessage("Automation failed: No instructions provided.", "error");
    return { success: false, error: "No data provided to run automation." };
  }
  showSpinner(); // Show spinner during the main automation workflow
  try {
    const agent = new EnhancedTableAutomationAgent(data);
    const result = await agent.run();

    if (result.success) {
      console.log("✅ Overall automation workflow completed.");
      console.log("Automation Report:", agent.generateReport());
      showMessage("Automation completed successfully!", "success"); // User feedback
    } else {
      console.error("❌ Overall automation workflow failed.");
      console.error("Failure Details:", result.error);
      console.log("Operations Log before failure:", result.operations);
      console.log("Automation Report:", agent.generateReport()); // Still generate report on failure
      showMessage(`Automation failed: ${result.error}`, "error"); // User feedback
    }

    return result;
  } catch (error) {
    console.error(
      "❌ Fatal error initializing or running automation agent:",
      error
    );
    showMessage(`Fatal automation error: ${error.message}`, "error"); // User feedback
    return {
      success: false,
      error: `Fatal error: ${error.message}`,
    };
  } finally {
    removeSpinner(); // Hide spinner after automation
  }
}

// Function to interact with the AI API, including chat history, database schema, and code editor content.
// This function prepares the prompt with relevant context for the AI.
async function aiRes(userInput, history, databaseSchemas, codeEditorContent) {
  // Format the history into a simple string for the prompt
  // Limiting history length to avoid excessively long prompts
  const historyLimit = 20; // Increased history limit
  const recentHistory = history.slice(-historyLimit);
  const formattedHistory = recentHistory
    .map((item) => `${item.role}: ${item.content}`)
    .join("\n");

  // Format database schemas for the prompt
  const formattedSchemas = Object.entries(databaseSchemas)
    .map(([tableName, schema]) => {
      // Format schema fields concisely
      const fieldsInfo = schema
        .map((field) => `${field.name} (${field.type})`)
        .join(", ");
      return `Table: ${tableName}\n  Fields: ${fieldsInfo || "No fields"}`;
    })
    .join("\n\n");

  console.log("Sending prompt to AI API...");
  console.log("--- Prompt History (Recent) ---");
  console.log(formattedHistory);
  console.log("--- End History ---");
  console.log("--- Database Schema Information ---");
  console.log(formattedSchemas || "No database schema information available.");
  console.log("--- End Database Schema Information ---");
  console.log("--- Current Code Editor Content ---");
  console.log(codeEditorContent || "Code editor is empty.");
  console.log("--- End Code Editor Content ---");
  console.log("--- Current User Input ---");
  console.log(userInput);
  console.log("--- End User Input ---");

  try {
    const response = await fetch("https://server100sql.onrender.com/api/ai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-API-KEY":
          localStorage.getItem("key") ||
          (localStorage.setItem("key", "1234"), "1234"),
      },
      body: JSON.stringify({
        query: `
          You are an AI assistant specializing in Dynamics 365 Finance and Operations table and X++ code automation.
          Your task is to interpret user requests in the context of the provided chat history, database schema, and current code editor content, and generate a single JSON object that instructs an automation agent on how to perform the requested tasks.

          Chat History (Recent Interactions):
          ${formattedHistory}

          --- Database Schema Information ---
          ${formattedSchemas || "No database schema information available."}
          --- End Database Schema Information ---

          --- Current Code Editor Content ---
          ${codeEditorContent || "Code editor is empty."}
          --- End Code Editor Content ---

          User Input: ${userInput}

          Instructions:
          1. Analyze the User Input and Chat History to understand the user's intent and any implied sequence of operations (delete, create table, add fields, add indexes, run X++ code).
          2. Use the Database Schema Information to understand the current state of the database, including existing tables, their fields, and types.
          3. Use the Current Code Editor Content if the user is asking to modify, execute, or debug the existing X++ code, or if the request is related to the code's functionality.
          4. Respond with a single JSON object enclosed in a \`\`\`json\\n...\\n\`\`\` markdown block.
          5. The JSON object MUST strictly follow the 'Example Response Structure' provided below. Include properties only if they are relevant to the user's request based on your interpretation.
          6. If a sequence of operations is requested (e.g., "delete X then create Y with fields Z and run code W"), combine them into a single JSON object with all relevant properties ('delete', 'name', 'fields', 'indexes', 'code'). The agent will execute these in the order: delete -> create table UI -> add fields UI -> add indexes UI -> save UI (triggers DB create/update) -> execute X++ code.
          7. If a property is not applicable to the user's request (e.g., no table deletion requested), set the corresponding property to null (for 'delete', 'name', 'code') or an empty array (for 'fields', 'indexes').
          8. For table creation requests, if specific fields or indexes are not mentioned, provide a basic structure with 'name', an empty 'fields' array, and an empty 'indexes' array.
          9. Ensure table and field names in the JSON match standard D365FO naming conventions where appropriate. Use appropriate data types from the fieldTypeMap implicitly understood from the context (STR(n), INT, REAL, DATE, etc.).
          10. If the user asks for X++ code, provide the full, runnable X++ code within the 'code' property.

          Example Response Structure: ${JSON.stringify(JSON_Data, null, 2)}
          `,
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching from AI API:", error);
    return {
      reply: `Error retrieving AI response: ${error.message}. Please check the API endpoint connection or the backend service.`,
    };
  }
}

// Event listener for the run button
document.getElementById("btn_run").addEventListener("click", async () => {
  const userInputElement = document.getElementById("userInput");
  const userInput = userInputElement ? userInputElement.value : "";

  if (!userInput.trim()) {
    console.warn("User input is empty. Please enter a command.");
    // Optionally provide user feedback in the UI
    showMessage("Please enter a command.", "info"); // User feedback
    return; // Do nothing if input is empty
  }

  // Add user input to history BEFORE sending the request
  chatHistory.push({ role: "User", content: userInput });
  console.log("Chat History Updated (User):", chatHistory);

  // Clear the input field after capturing the value
  if (userInputElement) {
    userInputElement.value = "";
  }

  // *** ADDED: Get database schema and code editor content for AI context ***
  let databaseSchemas = {};
  let codeEditorContent = "";

  showSpinner(); // Show spinner while fetching context data

  try {
    // Fetch database schemas for context
    databaseSchemas = await fetchAllTableSchemas();
    console.log("Fetched Database Schemas:", databaseSchemas);

    // Get code editor content
    const codeEditorElement = document.getElementById("xppCode");
    if (codeEditorElement) {
      codeEditorContent = codeEditorElement.value;
      console.log(
        "Fetched Code Editor Content (first 200 chars):",
        codeEditorContent.substring(0, 200) +
          (codeEditorContent.length > 200 ? "..." : "")
      );
    } else {
      console.warn(
        "Code editor element not found (ID: 'xppCode'). Cannot get code editor content."
      );
    }
  } catch (contextError) {
    console.error(
      "Error fetching context data (schemas, code editor):",
      contextError
    );
    // Log the error in history as a system message
    chatHistory.push({
      role: "System",
      content: `Warning: Could not fetch all context data for AI. Automation may be affected. Error: ${contextError.message}`,
    });
    showMessage(
      `Warning: Could not fetch all context data. Error: ${contextError.message}`,
      "warning"
    );
    // Continue execution but AI might lack full context
  } finally {
    removeSpinner(); // Hide spinner after fetching context data
  }

  try {
    console.log("Calling AI Response API with context...");
    // Call aiRes with user input, chat history, database schemas, and code editor content
    const response = await aiRes(
      userInput,
      chatHistory,
      databaseSchemas,
      codeEditorContent
    );
    console.log("AI Response Received:", response);

    let jsonData = null;
    let aiResponseContentForHistory = "No reply from AI or reply is empty."; // Default content for history

    if (response && response.reply) {
      // Check if response and response.reply are not null/undefined
      aiResponseContentForHistory = response.reply; // Store the raw reply in history initially
      console.log("Attempting to parse AI response...");
      try {
        // Attempt to extract and parse the JSON string from the markdown code block
        const jsonMatch = response.reply.match(/```json\n([\s\S]*?)\n```/);
        if (jsonMatch && jsonMatch[1]) {
          const jsonString = jsonMatch[1];
          jsonData = JSON.parse(jsonString);
          console.log("Successfully parsed JSON from AI response.");
          // Optionally update history content with just the JSON string if preferred
          aiResponseContentForHistory = jsonString;
        } else {
          console.warn(
            "AI response does not contain a valid JSON code block. Storing raw reply in history."
          );
        }
      } catch (parseError) {
        console.error("Error parsing JSON from AI response:", parseError);
        aiResponseContentForHistory = `Error parsing JSON from AI reply: ${parseError.message}\nOriginal reply: ${response.reply}`;
        jsonData = null; // Ensure jsonData is null if parsing fails
      }
    } else {
      console.warn(
        "AI response object does not contain a 'reply' property or it is empty."
      );
      aiResponseContentForHistory =
        "AI provided no reply or an invalid response structure.";
    }

    // Add AI response (parsed JSON string or error info) to history AFTER receiving and processing
    chatHistory.push({ role: "AI", content: aiResponseContentForHistory });
    console.log("Chat History Updated (AI):", chatHistory);

    if (jsonData) {
      console.log("Running automation with parsed JSON data...");
      // Run the automation with the parsed JSON data.
      // The runAutomation function initializes the agent which handles
      // the delete->create->add fields->add indexes->save->execute code sequence
      // based on the presence of properties in jsonData.
      runAutomation(jsonData);
    } else {
      console.error(
        "Automation skipped: Valid JSON data was not obtained from AI."
      );
      showMessage(
        "Automation skipped: Could not get valid instructions from AI.",
        "warning"
      );
      // The error or lack of JSON is already logged in history and console
    }
  } catch (error) {
    console.error(
      "❌ Error during overall API fetch or automation execution process:",
      error
    );
    // Log the overall process error in history
    chatHistory.push({
      role: "System",
      content: `Fatal Error during automation process: ${error.message}`,
    });
    console.log("Chat History Updated (Fatal Error):", chatHistory);
    showMessage(
      `Fatal Error during automation process: ${error.message}`,
      "error"
    );
  }
});

// Example of calling TotalTable_New to initially populate the table list on page load
// window.onload = TotalTable_New; // Uncomment this if you want the table list to load on page load
