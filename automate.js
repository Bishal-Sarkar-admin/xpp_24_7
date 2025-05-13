

class EnhancedTableAutomationAgent {
  constructor(jsonData) {
    this.jsonData = jsonData;
    this.fieldTypeMap = {
      "STR(20)": 0,
      "STR(30)": 1,
      "STR(50)": 2,
      "STR(100)": 3,
      INT: 4,
      REAL: 5,
      NUMBER: 6,
      DATE: 7,
      TIME: 8,
      BOOLEAN: 9,
      ANYTYPE: 10,
    };

    // Track operations for logging
    this.operations = [];
    this.logOperation("Agent initialized with table: " + jsonData.name);
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
   */
  async run() {
    this.logOperation("Starting enhanced table automation workflow");

    try {
      // Handle table deletion if specified
      if (this.jsonData.delete) {
        this.logOperation(`Deleting previous table: ${this.jsonData.delete}`);
        await this.removeTableByName(this.jsonData.delete);
      }

      // Create the new table
      this.logOperation(`Creating new table: ${this.jsonData.name}`);
      await this.createTable();

      // Get the table ID
      const tableID = this.findTableById(this.jsonData.name);
      this.logOperation(`Found table ID: ${tableID}`);

      if (!tableID) {
        throw new Error(
          `Could not find the table with name: ${this.jsonData.name}`
        );
      }

      // Add all fields
      this.logOperation("Adding fields to table");
      await this.addAllFields(tableID);

      // Save the table
      this.logOperation("Saving table structure");
      this.saveTable(tableID);

      // Execute code if provided
      if (this.jsonData.code) {
        this.logOperation("Executing provided X++ code");
        await this.executeCode(this.jsonData.code);
      }

      this.logOperation("Table automation workflow completed successfully!");
      return {
        success: true,
        operations: this.operations,
      };
    } catch (error) {
      this.logOperation(`ERROR: ${error.message}`);
      console.error("Error in table automation:", error);
      return {
        success: false,
        error: error.message,
        operations: this.operations,
      };
    }
  }

  /**
   * Create a new table with the name from JSON data
   */
  async createTable() {
    return new Promise((resolve, reject) => {
      try {
        // Click the add table button
        const addBtn = document.getElementById("btn");
        if (!addBtn) {
          reject(new Error("Add table button not found"));
          return;
        }
        addBtn.click();

        // Set the table name
        setTimeout(() => {
          try {
            const tableNameInput = document.getElementById("tableName");
            if (!tableNameInput) {
              reject(new Error("Table name input not found"));
              return;
            }

            tableNameInput.value = this.jsonData.name;

            // Trigger input event
            const inputEvent = new Event("input", { bubbles: true });
            tableNameInput.dispatchEvent(inputEvent);

            // Click create table button after a delay
            setTimeout(() => {
              try {
                const createBtn = document.getElementById("createTableBtn");
                if (!createBtn) {
                  reject(new Error("Create table button not found"));
                  return;
                }

                createBtn.click();
                setTimeout(resolve, 800); // Longer timeout for UI updates
              } catch (e) {
                reject(new Error(`Error clicking create button: ${e.message}`));
              }
            }, 500);
          } catch (e) {
            reject(new Error(`Error setting table name: ${e.message}`));
          }
        }, 500);
      } catch (e) {
        reject(new Error(`Error initiating table creation: ${e.message}`));
      }
    });
  }

  /**
   * Find a table by its name
   */
  findTableById(tableName) {
    const tableContainers = document.querySelectorAll(".table-container");

    for (let i = 0; i < tableContainers.length; i++) {
      const table = tableContainers[i];
      const nameElement = table.querySelector(".table-name");

      if (nameElement && nameElement.textContent.trim() === tableName.trim()) {
        return table.id;
      }
    }

    return null;
  }

  /**
   * Add all fields from the JSON data to the specified table
   */
  async addAllFields(tableID) {
    for (let i = 0; i < this.jsonData.fields.length; i++) {
      const field = this.jsonData.fields[i];
      this.logOperation(`Adding field: ${field.name} (${field.type})`);
      await this.addField(tableID, field);
    }
  }

  /**
   * Add a single field to the table
   */
  async addField(tableID, fieldData) {
    return new Promise((resolve, reject) => {
      try {
        // Open the field modal
        this.openFieldModal(tableID);

        // Give the modal time to open
        setTimeout(() => {
          try {
            // Set field name
            const fieldNameInput = document.getElementById("fieldName");
            if (!fieldNameInput) {
              reject(new Error("Field name input not found"));
              return;
            }

            fieldNameInput.value = fieldData.name;

            // Trigger input event
            const inputEvent = new Event("input", { bubbles: true });
            fieldNameInput.dispatchEvent(inputEvent);

            // Set field type
            this.setFieldType(fieldData.type);

            // Set constraints
            if (fieldData.notNull) {
              const notNullCheckbox = document.getElementById("notNull");
              if (notNullCheckbox) {
                notNullCheckbox.checked = true;
                // notNullCheckbox.click();
              }
            }

            if (fieldData.primaryKey) {
              const pkCheckbox = document.getElementById("primaryKey");
              if (pkCheckbox) {
                pkCheckbox.checked = true;
                // pkCheckbox.click();
              }
            }

            // Add the field
            setTimeout(() => {
              try {
                const addFieldBtn = document.getElementById("addFieldBtn");
                if (!addFieldBtn) {
                  reject(new Error("Add field button not found"));
                  return;
                }

                addFieldBtn.click();
                setTimeout(resolve, 500);
              } catch (e) {
                reject(new Error(`Error adding field: ${e.message}`));
              }
            }, 400);
          } catch (e) {
            reject(new Error(`Error configuring field: ${e.message}`));
          }
        }, 700);
      } catch (e) {
        reject(new Error(`Error opening field modal: ${e.message}`));
      }
    });
  }

  /**
   * Open the field modal for a specific table
   */
  openFieldModal(tableID) {
    // First click on the table to ensure it's selected
    const tableElement = document.getElementById(tableID);
    if (!tableElement) {
      throw new Error(`Table element with ID ${tableID} not found`);
    }

    tableElement.click();

    // Then open the field modal
    if (typeof window.openFieldModal === "function") {
      window.openFieldModal(tableID);
    } else {
      // Fallback if the function isn't directly accessible
      const addFieldButton = document.querySelector(
        `#${tableID} .add-field-btn`
      );
      if (addFieldButton) {
        addFieldButton.click();
      } else {
        throw new Error("Could not find add field button");
      }
    }
  }

  /**
   * Set the field type based on the JSON type string
   */
  setFieldType(typeStr) {
    const fieldTypeSelect = document.getElementById("fieldType");
    if (!fieldTypeSelect) {
      throw new Error("Field type select not found");
    }

    // Parse the type string (handles both STR(n) and simple types)
    let typeIndex = -1;

    // Normalize type string to uppercase for comparison
    const normalizedType = typeStr.toUpperCase();

    if (
      normalizedType.startsWith("STR(") ||
      normalizedType.startsWith("STRING(")
    ) {
      // Extract the length from string like STR(50) or STRING(100)
      const matches = typeStr.match(/\((\d+)\)/);
      if (!matches || matches.length < 2) {
        throw new Error(`Invalid string type format: ${typeStr}`);
      }

      const length = parseInt(matches[1], 10);

      // Find the closest match in our type map
      if (length <= 20) typeIndex = this.fieldTypeMap["STR(20)"];
      else if (length <= 30) typeIndex = this.fieldTypeMap["STR(30)"];
      else if (length <= 50) typeIndex = this.fieldTypeMap["STR(50)"];
      else typeIndex = this.fieldTypeMap["STR(100)"];
    } else {
      // Direct type lookup using uppercase for case-insensitive comparison
      typeIndex = this.fieldTypeMap[normalizedType];
    }

    // Default to STRING if type not found
    if (typeIndex === undefined) {
      typeIndex = 0; // Default to STR(20)
      this.logOperation(
        `Warning: Unknown field type: ${typeStr}, defaulting to STR(20)`
      );
    }

    // Set the type in the dropdown
    fieldTypeSelect.selectedIndex = typeIndex;

    // Trigger change event
    const changeEvent = new Event("change", { bubbles: true });
    fieldTypeSelect.dispatchEvent(changeEvent);
  }

  /**
   * Save the table
   */
  saveTable(tableID) {
    if (typeof window.saveTable === "function") {
      window.saveTable(tableID);
    } else {
      // Fallback if the function isn't directly accessible
      const saveButton = document.querySelector(`#${tableID} .save-table-btn`);
      if (saveButton) {
        saveButton.click();
      } else {
        throw new Error("Could not find save table button");
      }
    }
  }

  /**
   * Remove a table by its name
   */
  async removeTableByName(tableName) {
    return new Promise((resolve, reject) => {
      try {
        const tableID = this.findTableById(tableName);

        if (!tableID) {
          this.logOperation(
            `Table '${tableName}' not found for deletion, continuing`
          );
          resolve(); // Not finding the table isn't a fatal error
          return;
        }

        this.logOperation(`Found table to delete with ID: ${tableID}`);

        // Try to remove the table from UI
        if (typeof window.removeTable === "function") {
          window.removeTable(tableID);
        } else {
          // Fallback
          const removeButton = document.querySelector(
            `#${tableID} .remove-table-btn`
          );
          if (removeButton) {
            removeButton.click();
          } else {
            this.logOperation(
              "No remove button found, trying to delete from database"
            );
          }
        }

        // Also delete from database using X++ code
        setTimeout(async () => {
          try {
            const deleteCode = `delete_from ${tableName}`;
            await this.executeCode(deleteCode);
            resolve();
          } catch (e) {
            reject(
              new Error(`Error deleting table from database: ${e.message}`)
            );
          }
        }, 500);
      } catch (e) {
        reject(new Error(`Error removing table: ${e.message}`));
      }
    });
  }

  /**
   * Execute X++ code in the code editor
   */
  async executeCode(code) {
    return new Promise((resolve, reject) => {
      try {
        const codeTextArea = document.getElementById("xppCode");
        if (!codeTextArea) {
          reject(new Error("Code textarea not found"));
          return;
        }

        codeTextArea.value = code;

        // Trigger input event to ensure code is registered
        const inputEvent = new Event("input", { bubbles: true });
        codeTextArea.dispatchEvent(inputEvent);

        // Run the code
        setTimeout(() => {
          try {
            const runButton = document.getElementById("runButton");
            if (!runButton) {
              reject(new Error("Run button not found"));
              return;
            }

            runButton.click();
            this.logOperation("Code execution triggered");
            setTimeout(resolve, 800); // Give time for code execution
          } catch (e) {
            reject(new Error(`Error running code: ${e.message}`));
          }
        }, 300);
      } catch (e) {
        reject(new Error(`Error setting code: ${e.message}`));
      }
    });
  }

  /**
   * Output a detailed report of what was done
   */
  generateReport() {
    return {
      tableName: this.jsonData.name,
      fieldCount: this.jsonData.fields.length,
      deletedTable: this.jsonData.delete || "None",
      codeExecuted: this.jsonData.code ? "Yes" : "No",
      operations: this.operations,
      timestamp: new Date().toISOString(),
    };
  }
}

// Example usage
const JSON_Data = {
  delete: "PreviousTable", // Optional: name of table to delete first
  code: `class XppCodeD365FO  
  {
      public static void main(Args _args)
      {
         info("Welcome to the world of X++");
         info("This is a simple example of X++ code.");
      }
  }`,
  name: "MyTable", // Table to create
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
      type: "NUMBER",
      notNull: false,
      primaryKey: false,
    },
  ],
};

// Execute the automation
async function runAutomation(data) {
  try {
    const agent = new EnhancedTableAutomationAgent(data);
    const result = await agent.run();

    if (result.success) {
      console.log("✅ Automation completed successfully!");
      console.log(agent.generateReport());
    } else {
      console.error("❌ Automation failed:", result.error);
      console.log("Operations completed before failure:", result.operations);
    }

    return result;
  } catch (error) {
    console.error("Fatal error in automation:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

// Run the automation with the provided data
// runAutomation(JSON_Data).then((result) => {
//   // You can add additional post-processing here if needed
//   if (result.success) {
//     document.getElementById("status").textContent =
//       "Automation completed successfully";
//   } else {
//     document.getElementById("status").textContent =
//       "Automation failed: " + result.error;
//   }
// });
