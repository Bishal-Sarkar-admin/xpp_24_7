//continue with the missing part

// Add a global array to store chat history
const chatHistory = [];

// Define the example JSON structure for the AI to follow
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
      type: "NUMBER",
      notNull: false,
      primaryKey: false,
    },
  ],
};

// EnhancedTableAutomationAgent Class (including previous corrections and logging)
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
      NUMBER: 6, // Note: 'NUMBER' might need mapping to REAL or INT based on D365FO types
      DATE: 7,
      TIME: 8,
      BOOLEAN: 9,
      ANYTYPE: 10,
    }; // Track operations for logging

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
   * Handles delete, create (table and fields), save, and code execution based on jsonData.
   */

  async run() {
    this.logOperation("Starting enhanced table automation workflow");

    try {
      // Handle table deletion if specified
      if (this.jsonData.delete) {
        this.logOperation(
          `Attempting to delete table: ${this.jsonData.delete}`
        );
        await this.removeTableByName(this.jsonData.delete);
      } else {
        this.logOperation(
          "No table specified for deletion, skipping deletion step."
        );
      } // Proceed with table creation ONLY if a table name is provided

      if (this.jsonData.name) {
        this.logOperation(
          `Attempting to create new table: ${this.jsonData.name}`
        );
        await this.createTable(); // Get the table ID after creation attempt

        // *** POTENTIAL ISSUE: findTableById relies on specific UI structure.
        // *** This might return null if the table isn't immediately visible or named correctly in the UI after creation.
        const tableID = this.findTableById(this.jsonData.name);
        this.logOperation(
          `Found table ID for ${this.jsonData.name}: ${tableID}`
        );

        if (!tableID) {
          // This is a critical failure if we intended to create a table but can't find it in the UI
          throw new Error(
            `Could not find the table in the UI with name: ${this.jsonData.name} after creation attempt. Ensure UI selectors are correct and creation was successful.`
          );
        } // Add all fields IF fields array is provided and is a non-empty array

        if (
          this.jsonData.fields &&
          Array.isArray(this.jsonData.fields) &&
          this.jsonData.fields.length > 0
        ) {
          this.logOperation(
            `Attempting to add ${this.jsonData.fields.length} fields to table ${this.jsonData.name}`
          );
          await this.addAllFields(tableID);
        } else {
          this.logOperation(
            "No fields or empty fields array provided for table creation, skipping field addition."
          );
        } // Save the table structure

        this.logOperation(
          `Attempting to save table structure for ${this.jsonData.name}`
        ); // Note: saveTable might trigger an asynchronous backend process. // The current implementation doesn't wait for backend confirmation.
        await this.saveTable(tableID);
        this.logOperation(
          `Save action triggered for table ${this.jsonData.name}.`
        );
      } else {
        this.logOperation(
          "No table name provided for creation in JSON data, skipping table creation step."
        );
      } // Execute code if provided

      if (this.jsonData.code) {
        this.logOperation("Attempting to execute provided X++ code");
        await this.executeCode(this.jsonData.code);
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
   * Create a new table with the name from JSON data via UI interaction.
   * Assumes UI elements with specific IDs ('btn', 'tableName', 'createTableBtn').
   * *** REQUIRES: The UI elements with IDs 'btn', 'tableName', and 'createTableBtn' must exist and be interactable.
   * *** IMPROVEMENT: Replace fixed timeouts with dynamic waits for elements to appear/become interactable.
   */

  async createTable() {
    return new Promise((resolve, reject) => {
      try {
        const addBtn = document.getElementById("btn");
        if (!addBtn) {
          return reject(new Error("Add table button not found (ID: 'btn')."));
        }
        addBtn.click();
        this.logOperation("Clicked add table button.");

        // *** TIMING ISSUE: Fixed delay assumes modal/input appears within 500ms.
        setTimeout(() => {
          // Allow modal/input to appear
          try {
            const tableNameInput = document.getElementById("tableName");
            if (!tableNameInput) {
              return reject(
                new Error("Table name input field not found (ID: 'tableName').")
              );
            } // Use the table name from jsonData (checked in run())

            tableNameInput.value = this.jsonData.name; // Trigger input event to ensure UI recognizes the value change

            const inputEvent = new Event("input", { bubbles: true });
            tableNameInput.dispatchEvent(inputEvent);
            this.logOperation(`Set table name input to: ${this.jsonData.name}`);

            // *** TIMING ISSUE: Fixed delay assumes input value registers within 500ms.
            setTimeout(() => {
              // Allow input value to register
              try {
                const createBtn = document.getElementById("createTableBtn");
                if (!createBtn) {
                  return reject(
                    new Error(
                      "Create table button not found (ID: 'createTableBtn')."
                    )
                  );
                }

                createBtn.click();
                this.logOperation("Clicked create table button.");
                // *** TIMING ISSUE: Fixed delay assumes UI updates after creation within 800ms.
                setTimeout(resolve, 800); // Longer timeout for UI updates after creation
              } catch (e) {
                reject(new Error(`Error clicking create button: ${e.message}`));
              }
            }, 500); // Delay before clicking create
          } catch (e) {
            reject(new Error(`Error setting table name input: ${e.message}`));
          }
        }, 500); // Delay after clicking add button
      } catch (e) {
        reject(new Error(`Error initiating createTable process: ${e.message}`));
      }
    });
  }
  /**
   * Find a table in the UI by its name.
   * Assumes table containers have class 'table-container' and name element with class 'table-name'.
   * *** REQUIRES: Table elements in the UI must match the structure: <div class="table-container" id="..."><span class="table-name">Table Name</span>...</div>
   * *** RELIABILITY: This method's success depends entirely on the consistency of the D365FO UI structure.
   */

  findTableById(tableName) {
    if (!tableName || typeof tableName !== "string") {
      console.warn("findTableById called with invalid tableName:", tableName);
      return null;
    }
    // *** UI DEPENDENCY: Assumes table containers have this specific class.
    const tableContainers = document.querySelectorAll(".table-container");

    for (let i = 0; i < tableContainers.length; i++) {
      const table = tableContainers[i];
      // *** UI DEPENDENCY: Assumes table name is within an element with this specific class.
      const nameElement = table.querySelector(".table-name"); // Added defensive check for nameElement and its textContent

      if (
        nameElement &&
        nameElement.textContent &&
        nameElement.textContent.trim() === tableName.trim()
      ) {
        return table.id;
      }
    }

    return null; // Return null if table not found
  }
  /**
   * Add all fields listed in jsonData.fields to the specified table.
   */

  async addAllFields(tableID) {
    // This method is called only if this.jsonData.fields is a valid non-empty array by run()
    for (let i = 0; i < this.jsonData.fields.length; i++) {
      const field = this.jsonData.fields[i];
      this.logOperation(
        `Attempting to add field: ${field.name || "Unnamed Field"} (${
          field.type || "Unknown Type"
        })`
      );
      try {
        await this.addField(tableID, field);
        this.logOperation(
          `Successfully attempted to add field: ${
            field.name || "Unnamed Field"
          }`
        );
      } catch (error) {
        this.logOperation(
          `ERROR adding field ${field.name || "Unnamed Field"}: ${
            error.message
          }`
        ); // Continue adding other fields even if one fails
      }
    }
  }
  /**
   * Add a single field to the table via UI interaction.
   * Assumes field modal elements with specific IDs ('fieldName', 'fieldType', 'notNull', 'primaryKey', 'addFieldBtn').
   * *** REQUIRES: The field modal with elements 'fieldName', 'fieldType', 'notNull', 'primaryKey', and 'addFieldBtn' must exist and be interactable after openFieldModal.
   * *** IMPROVEMENT: Replace fixed timeouts with dynamic waits for modal elements to appear/become interactable.
   */

  async addField(tableID, fieldData) {
    // fieldData is assumed to be an object from the fields array
    return new Promise((resolve, reject) => {
      try {
        // Open the field modal for the specific table
        // *** DEPENDENCY: openFieldModal must successfully open the field modal for the given tableID.
        this.openFieldModal(tableID);
        this.logOperation(`Opened field modal for table ID: ${tableID}`);

        // *** TIMING ISSUE: Fixed delay assumes modal opens and elements are ready within 700ms.
        setTimeout(() => {
          // Give the modal time to open and elements to be ready
          try {
            const fieldNameInput = document.getElementById("fieldName");
            if (!fieldNameInput) {
              return reject(
                new Error(
                  "Field name input not found in modal (ID: 'fieldName'). Ensure modal is open and element exists."
                )
              );
            } // Ensure field name is provided

            if (fieldData.name && typeof fieldData.name === "string") {
              fieldNameInput.value = fieldData.name;
              const inputEvent = new Event("input", { bubbles: true });
              fieldNameInput.dispatchEvent(inputEvent);
              this.logOperation(`Set field name input to: ${fieldData.name}`);
            } else {
              this.logOperation(
                "Warning: Field data is missing 'name' or it's not a string. Skipping setting field name."
              ); // We might still proceed to click 'Add Field' if other properties were set, // but a field without a name might cause issues in the UI/backend. // Decided to continue and let the UI/backend validation handle it, or fail on add.
            } // Set field type

            if (fieldData.type) {
              try {
                // *** RELIABILITY: setFieldType depends on the existence of the 'fieldType' select element and the correctness of the fieldTypeMap.
                this.setFieldType(fieldData.type);
                this.logOperation(`Set field type to: ${fieldData.type}`);
              } catch (typeError) {
                this.logOperation(
                  `Warning: Could not set field type "${
                    fieldData.type
                  }" for field "${fieldData.name || "Unnamed"}": ${
                    typeError.message
                  }. Defaulting might occur in setFieldType.`
                );
              }
            } else {
              this.logOperation(
                `Warning: Field type not provided for field: ${
                  fieldData.name || "Unnamed"
                }. Defaulting to STR(20) in setFieldType.`
              );
              // *** DEPENDENCY: setFieldType must handle "STR(20)" as a default.
              this.setFieldType("STR(20)"); // Default if type is missing
            } // Set constraints (notNull, primaryKey) if specified

            // *** UI DEPENDENCY: Assumes checkboxes for constraints have specific IDs.
            const notNullCheckbox = document.getElementById("notNull");
            if (notNullCheckbox && fieldData.notNull === true) {
              notNullCheckbox.checked = true;
              const changeEvent = new Event("change", { bubbles: true });
              notNullCheckbox.dispatchEvent(changeEvent);
              this.logOperation("Set Not Null constraint.");
            }

            const pkCheckbox = document.getElementById("primaryKey");
            if (pkCheckbox && fieldData.primaryKey === true) {
              pkCheckbox.checked = true;
              const changeEvent = new Event("change", { bubbles: true });
              pkCheckbox.dispatchEvent(changeEvent);
              this.logOperation("Set Primary Key constraint.");
            } // Click the add field button in the modal

            // *** TIMING ISSUE: Small fixed delay after setting inputs.
            setTimeout(() => {
              // Small delay after setting inputs
              try {
                const addFieldBtn = document.getElementById("addFieldBtn");
                if (!addFieldBtn) {
                  return reject(
                    new Error(
                      "Add field button not found in modal (ID: 'addFieldBtn'). Ensure modal is open and element exists."
                    )
                  );
                }

                addFieldBtn.click();
                this.logOperation("Clicked add field button in modal.");
                // *** TIMING ISSUE: Fixed delay assumes modal closes/UI updates within 500ms.
                setTimeout(resolve, 500); // Give time for modal to close/UI update
              } catch (e) {
                reject(
                  new Error(`Error clicking add field button: ${e.message}`)
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
        reject(new Error(`Error initiating addField process: ${e.message}`));
      }
    });
  }
  /**
   * Open the field modal for a specific table by clicking on the table element
   * and then the add field button/function.
   * Assumes table element has the tableID as its ID and an add field button with class 'add-field-btn' OR a global window.openFieldModal function.
   * *** REQUIRES: Either a global window.openFieldModal(tableID) function or a button with class 'add-field-btn' within the table element.
   * *** UI DEPENDENCY: Relies on the table element having the correct ID.
   */

  openFieldModal(tableID) {
    const tableElement = document.getElementById(tableID);
    if (!tableElement) {
      throw new Error(
        `Table element with ID "${tableID}" not found to open field modal. Ensure findTableById returned the correct ID and the element exists.`
      );
    } // First click on the table to ensure it's selected/active in the UI

    tableElement.click();
    this.logOperation(`Clicked on table element with ID: ${tableID}`); // Then open the field modal - assuming a global function or a button

    // *** DEPENDENCY: Checks for a global function or a specific button within the table element.
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
          `Could not find a way to open the add field modal for table ID: ${tableID}. Neither window.openFieldModal nor .add-field-btn found.`
        );
      }
    }
  }
  /**
   * Set the field type dropdown in the field modal.
   * Maps string types (including STR(n)) to dropdown indices.
   * Assumes a select element with ID 'fieldType'.
   * *** REQUIRES: A select element with ID 'fieldType' in the open modal, and the options must correspond to the indices in fieldTypeMap.
   */

  setFieldType(typeStr) {
    const fieldTypeSelect = document.getElementById("fieldType");
    if (!fieldTypeSelect) {
      throw new Error(
        "Field type select dropdown not found (ID: 'fieldType'). Ensure modal is open and element exists."
      );
    }

    let typeIndex = -1;
    const normalizedType = typeStr ? typeStr.toUpperCase() : ""; // Handle null/undefined typeStr

    if (
      normalizedType.startsWith("STR(") ||
      normalizedType.startsWith("STRING(")
    ) {
      const matches = normalizedType.match(/\((\d+)\)/);
      if (matches && matches.length >= 2) {
        const length = parseInt(matches[1], 10);
        if (length <= 20) typeIndex = this.fieldTypeMap["STR(20)"];
        else if (length <= 30) typeIndex = this.fieldTypeMap["STR(30)"];
        else if (length <= 50) typeIndex = this.fieldTypeMap["STR(50)"];
        else typeIndex = this.fieldTypeMap["STR(100)"];
      } else {
        this.logOperation(
          `Warning: Invalid string type format "${typeStr}". Falling back to STR(100) or default.`
        );
        typeIndex = this.fieldTypeMap["STR(100)"]; // Fallback for invalid STR format
      }
    } else {
      typeIndex = this.fieldTypeMap[normalizedType];
    } // Default to STR(20) if type not found or parsing failed

    if (typeIndex === undefined || typeIndex === -1) {
      typeIndex = this.fieldTypeMap["STR(20)"]; // Log warning unless it was already logged for invalid string format
      if (
        !normalizedType.startsWith("STR(") &&
        !normalizedType.startsWith("STRING(")
      ) {
        this.logOperation(
          `Warning: Unknown field type "${typeStr}", defaulting to STR(20) (index ${typeIndex}).`
        );
      } else if (typeIndex === -1) {
        // Case where STR format was invalid and STR(100) wasn't found
        this.logOperation(
          `Warning: Could not map string type "${typeStr}" after parsing length. Defaulting to STR(20).`
        );
      }
    } // Set the type in the dropdown if the index is valid

    if (typeIndex >= 0 && typeIndex < fieldTypeSelect.options.length) {
      fieldTypeSelect.selectedIndex = typeIndex; // Trigger change event
      const changeEvent = new Event("change", { bubbles: true });
      fieldTypeSelect.dispatchEvent(changeEvent);
      this.logOperation(
        `Selected field type index: ${typeIndex} for type: ${typeStr}`
      );
    } else {
      this.logOperation(
        `ERROR: Calculated field type index ${typeIndex} is out of bounds for dropdown options. Cannot set type.`
      ); // Consider rejecting or throwing here if setting type is critical // For now, just log and continue, may result in default dropdown value
    }
  }
  /**
   * Save the table structure via UI interaction.
   * Assumes a save button with class 'save-table-btn' within the table container or a global function window.saveTable.
   * Note: This does not wait for backend save confirmation.
   * *** REQUIRES: Either a global window.saveTable(tableID) function or a button with class 'save-table-btn' within the table element.
   * *** IMPROVEMENT: Does not confirm backend save completion; a more robust solution would wait for a confirmation indicator in the UI or backend response.
   */

  async saveTable(tableID) {
    this.logOperation(`Attempting to save table with ID: ${tableID}`);
    return new Promise((resolve) => {
      try {
        // *** DEPENDENCY: Checks for a global function or a specific button within the table element.
        if (typeof window.saveTable === "function") {
          window.saveTable(tableID);
          this.logOperation(`Called window.saveTable(${tableID}).`);
          // *** TIMING ISSUE: Fixed delay assumes save action registers within 800ms.
          setTimeout(resolve, 800); // Give time for the save operation to complete
        } else {
          const tableElement = document.getElementById(tableID);
          if (!tableElement) {
            this.logOperation(
              `ERROR: Could not find table element with ID: ${tableID} for save operation.`
            );
            return resolve(); // Continue workflow despite error
          }

          const saveButton = tableElement.querySelector(".save-table-btn");
          if (saveButton) {
            saveButton.click();
            this.logOperation(
              `Clicked save table button for table ID: ${tableID}.`
            );
            // *** TIMING ISSUE: Fixed delay assumes save action registers within 800ms.
            setTimeout(resolve, 800); // Give time for save operation to complete
          } else {
            // Log error but allow workflow to potentially continue
            this.logOperation(
              `ERROR: Could not find save table button for table ID: ${tableID}. Save action not triggered.`
            );
            resolve(); // Continue workflow despite error
          }
        }
      } catch (error) {
        this.logOperation(`ERROR during saveTable: ${error.message}`);
        resolve(); // Continue workflow despite error
      }
    });
  }
  /**
   * Remove a table by its name via UI and X++ deletion attempts.
   * Attempts UI removal first, then attempts database deletion via X++ code.
   * Continues the workflow even if deletion fails ("pass or fail no matter").
   * *** REQUIRES: Either a global window.removeTable(tableID) function or a button with class 'remove-table-btn' within the table element.
   * *** DEPENDENCIES: Relies on findTableById to get the table ID for UI interaction. Depends on executeCode for X++ execution.
   * *** RISK: Dropping tables via X++ (even simulated) is generally not recommended in production environments.
   */

  async removeTableByName(tableName) {
    if (!tableName || typeof tableName !== "string") {
      this.logOperation(
        "No valid table name provided for deletion, skipping deletion."
      );
      return Promise.resolve(); // Resolve immediately if no valid name
    }

    return new Promise(async (resolve) => {
      // Always resolve to allow workflow to continue
      try {
        // *** DEPENDENCY: Relies on findTableById.
        const tableID = this.findTableById(tableName);

        if (!tableID) {
          this.logOperation(
            `Table '${tableName}' not found in UI for deletion, proceeding to database deletion attempt.`
          ); // Proceed to database deletion attempt even if not found in UI
        } else {
          this.logOperation(
            `Found table to delete with ID: ${tableID}. Attempting UI removal.`
          ); // Try to remove the table from UI
          // *** DEPENDENCY: Checks for a global function or a specific button within the table element.
          if (typeof window.removeTable === "function") {
            window.removeTable(tableID);
            this.logOperation(
              `Called window.removeTable(${tableID}) for UI removal.`
            );
          } else {
            const tableElement = document.getElementById(tableID);
            if (!tableElement) {
              this.logOperation(
                `ERROR: Table element with ID ${tableID} not found for UI removal.`
              );
            } else {
              const removeButton =
                tableElement.querySelector(".remove-table-btn");
              if (removeButton) {
                removeButton.click();
                this.logOperation(
                  `Clicked UI remove button for table ID: ${tableID}.`
                );
              } else {
                this.logOperation(
                  `No UI remove button found for table ID: ${tableID}. Attempting database deletion directly.`
                );
              }
            }
          } // Give UI some time to update after UI removal attempt

          // *** TIMING ISSUE: Fixed delay assumes UI updates within 500ms.
          await new Promise((res) => setTimeout(res, 500));
        } // Also attempt to delete from database using X++ code // This part will execute after a small delay, regardless of UI removal success or finding the table in UI

        const deleteCode = `static void DeleteTable_${tableName}(Args _args)
{
	DictTable dictTable = new DictTable(tableNum(${tableName}));
	if (dictTable && dictTable.id() != 0)
	{
		// Warning: Dropping tables via X++ in production is not recommended.
		// This is for automation scenario as requested.
		// SqlSystem ss = new SqlSystem();
		// ss.dropTable(tableName);

		// A safer approach might involve marking for delete or a different mechanism.
		// For this simulation, we'll just log the attempt or use a simulated delete.
		info(strFmt("Simulating database table drop for table: %1", "${tableName}"));
		// If a real X++ execution environment existed, the code would go here.

		// If the intent is to delete *records*, use delete_from.
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
          // *** DEPENDENCY: Relies on executeCode to run the X++ code. executeCode does not confirm execution result.
          await this.executeCode(deleteCode); // Execute the more robust X++ code block
          this.logOperation(
            `X++ database operation attempt completed for ${tableName}.`
          );
        } catch (executeError) {
          this.logOperation(
            `ERROR during X++ database operation for ${tableName}: ${executeError.message}`
          ); // Continue the workflow despite the error in executeCode
        } // Also try the original simpler data deletion approach if needed (optional based on interpretation)

        const originalDeleteCode = `delete_from ${tableName}`;
        this.logOperation(
          `Attempting database data deletion with X++: ${originalDeleteCode}`
        );
        try {
          // *** DEPENDENCY: Relies on executeCode to run the X++ code. executeCode does not confirm execution result.
          await this.executeCode(originalDeleteCode); // Use the existing executeCode method
          this.logOperation(
            `Database data deletion attempt completed for ${tableName}.`
          );
        } catch (executeError) {
          this.logOperation(
            `ERROR during X++ data deletion for ${tableName}: ${executeError.message}`
          ); // Continue the workflow despite the error in executeCode
        }
      } catch (e) {
        // Log any errors during the deletion process but resolve the promise
        this.logOperation(
          `ERROR during removeTableByName process for ${tableName}: ${e.message}`
        );
      } // Always resolve so the main workflow continues ("pass or fail no matter")
      resolve();
    });
  }
  /**
   * Execute X++ code in the code editor via UI interaction.
   * Assumes UI elements with specific IDs ('xppCode', 'runButton').
   * Note: This does not capture the result/output of the X++ execution.
   * *** REQUIRES: Textarea with ID 'xppCode' and a button with ID 'runButton' must exist and be interactable.
   * *** IMPROVEMENT: This only triggers the run action; a more complete solution would wait for execution completion and capture output/errors if possible in the UI.
   * *** IMPROVEMENT: Replace fixed timeouts with dynamic waits for elements to appear/become interactable.
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
          return reject(new Error("Code textarea not found (ID: 'xppCode'). Ensure the element exists."));
        }

        codeTextArea.value = code; // Trigger input event to ensure UI recognizes the value change

        const inputEvent = new Event("input", { bubbles: true });
        codeTextArea.dispatchEvent(inputEvent);
        this.logOperation("Set X++ code in textarea."); // Click the run button

        // *** TIMING ISSUE: Small fixed delay after setting code.
        setTimeout(() => {
          // Small delay after setting code
          try {
            const runButton = document.getElementById("runButton");
            if (!runButton) {
              return reject(
                new Error("Run button not found (ID: 'runButton'). Ensure the element exists.")
              );
            }

            runButton.click();
            this.logOperation("Clicked X++ run button."); // We resolve after clicking the button, not waiting for X++ execution result
            // *** TIMING ISSUE: Fixed delay assumes click action registers within 800ms. Does not wait for X++ execution completion.
            setTimeout(resolve, 800); // Give some time for the action to register
          } catch (e) {
            reject(new Error(`Error clicking run button: ${e.message}`));
          }
        }, 300); // Delay before clicking run
      } catch (e) {
        reject(new Error(`Error initiating executeCode process: ${e.message}`));
      }
    });
  }
  /**
   * Generate a report of the automation process based on initial JSON and operations log.
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
      deletedTableAttempted: (this.jsonData && this.jsonData.delete) || "None",
      codeExecutionAttempted:
        this.jsonData && this.jsonData.code ? "Yes" : "No",
      operationsLog: this.operations, // Use operationsLog for clarity
      timestamp: new Date().toISOString(),
    };
  }
}

// Function to run the automation workflow with a given JSON data object
// This function initializes the agent and calls its run method.
async function runAutomation(data) {
  if (!data) {
    console.error("runAutomation called with no data.");
    return { success: false, error: "No data provided to run automation." };
  }
  try {
    const agent = new EnhancedTableAutomationAgent(data);
    const result = await agent.run();

    if (result.success) {
      console.log("✅ Overall automation workflow completed.");
      console.log("Automation Report:", agent.generateReport());
    } else {
      console.error("❌ Overall automation workflow failed.");
      console.error("Failure Details:", result.error);
      console.log("Operations Log before failure:", result.operations);
      console.log("Automation Report:", agent.generateReport()); // Still generate report on failure
    }

    return result;
  } catch (error) {
    console.error(
      "❌ Fatal error initializing or running automation agent:",
      error
    );
    return {
      success: false,
      error: `Fatal error: ${error.message}`,
    };
  }
}

// *** FIX APPLIED: Separated the check for the TotalTable function from the variable declaration.
// *** DEPENDENCIES: This function relies on global or environment-provided functions TotalTable, ShowTableSchema, and ShowTableData which are not defined here.
async function DoIndexing() {
  const Indexing = {};
  Indexing.Note = "It is Indexing Data form the DataBase";
  // *** DEPENDENCY: Relies on a textarea with ID 'xppCode'.
  const codeTextArea = document.getElementById("xppCode");
  Indexing.code = codeTextArea ? codeTextArea.value : "Code element not found.";

  // Check if the TotalTable function exists globally or in the current scope.
  let TotalTableList = [];
  // Use window.TotalTable if it's expected to be a global function provided by the environment
  if (typeof window.TotalTable === 'function') {
      try {
          // Call the function and assign the result to the local variable.
          TotalTableList = await window.TotalTable();
      } catch (error) {
          console.error(`DoIndexing: Error calling window.TotalTable(): ${error.message}`);
          // TotalTableList remains [] on error.
      }
  } else {
       // Fallback check if TotalTable is defined in the current scope but not global window
      if (typeof TotalTable === 'function') {
         try {
            TotalTableList = await TotalTable();
         } catch (error) {
            console.error(`DoIndexing: Error calling scoped TotalTable(): ${error.message}`);
         }
      } else {
         console.warn("DoIndexing: TotalTable function not found in the environment (neither global window.TotalTable nor scoped TotalTable).");
      }
  }

  if (!Array.isArray(TotalTableList)) {
      console.error("DoIndexing: TotalTable() (or equivalent) did not return an array.");
      TotalTableList = []; // Ensure it's an array to prevent loop errors
  }

  const tableData = [];
  for (let i = 0; i < TotalTableList.length; i++) {
    const table = TotalTableList[i];
    console.log(`DoIndexing: Processing table: ${table}`);
    try {
        // *** DEPENDENCIES: ShowTableSchema and ShowTableData must be functions available in the environment.
        // Check for global window.ShowTableSchema and ShowTableData first
        const schema = typeof window.ShowTableSchema === 'function' ? await window.ShowTableSchema(table) : (typeof ShowTableSchema === 'function' ? await ShowTableSchema(table) : 'ShowTableSchema function not available');
        const data = typeof window.ShowTableData === 'function' ? await window.ShowTableData(table) : (typeof ShowTableData === 'function' ? await ShowTableData(table) : 'ShowTableData function not available');


        tableData.push({
          name: table,
          schema: schema,
          data: data,
        });
    } catch (error) {
        console.error(`DoIndexing: Error processing table ${table}: ${error.message}`);
        tableData.push({
            name: table,
            schema: `Error fetching schema: ${error.message}`,
            data: `Error fetching data: ${error.message}`,
        });
    }
  }
  Indexing.Table = tableData;
  // *** FIX: Return the Indexing object after the loop completes.
  return Indexing;
}

// Function to fetch AI response from the API
// Function to interact with the AI API, including chat history
// *** DEPENDENCY: Relies on an external API at "http://127.0.0.1:3000/api/ai".
async function aiRes(userInput, history) {
  // Format the history into a simple string for the prompt
  // Limiting history length to avoid excessively long prompts
  const historyLimit = 10; // Keep last 10 interactions
  const recentHistory = history.slice(-historyLimit);
  const formattedHistory = recentHistory
    .map((item) => `${item.role}: ${item.content}`)
    .join("\n");

  console.log("Sending prompt to AI API...");
  console.log("--- Prompt History ---");
  console.log(formattedHistory);
  console.log("--- End History ---");
  console.log("--- Current User Input ---");
  console.log(userInput);
  console.log("--- End User Input ---");

  try {
    // *** DEPENDENCY: Assumes the API is running and accessible at this URL and accepts POST requests with JSON body.
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
          Chat History:
          ${formattedHistory}

          // *** DEPENDENCY: DoIndexing() must be available and return valid data, though it's now more robust to missing dependency functions.
          Inding(all available data in database): ${await DoIndexing()}

          User Input: ${userInput}
          -- User Input is the user request for Dynamics 365 Finance and Operations (D365FO) table automation tasks.
          -- Consider the chat history and the current user input to understand the full context and intent.
          -- Provide JSON data for a table automation task (creation, deletion, and/or X++ Code execution).
          -- The JSON response MUST be a single object and strictly follow this structure:
          Example Response Structure: ${JSON.stringify(JSON_Data, null, 2)}

          -- If the user's request implies a sequence of actions (e.g., delete a table, then create a new table with fields, then run X++ code),
          -- please combine ALL relevant instructions into a SINGLE JSON object based on the Example Response Structure.
          -- Include the 'delete' property with the table name if a table should be deleted before other operations.
          -- Include 'name' with the new table name and 'fields' (an array of field objects with 'name', 'type', 'notNull', 'primaryKey') for table creation.
          -- Include the 'code' property with the X++ code if code execution is requested after table operations.
          -- If a property ('delete', 'code', 'name', or 'fields') is not relevant to the combined request based on the user input, set it to null or an empty array (for 'fields').
          -- For table creation requests, always aim to provide at least a 'name' and an empty 'fields' array if no specific fields are mentioned.
          -- Ensure the JSON is correctly formatted and enclosed within a \`\`\`json\\n...\\n\`\`\` markdown code block.
          -- The goal is to provide a comprehensive plan in one JSON for the agent to execute sequentially (delete -> create -> code).
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
      reply: `Error retrieving AI response: ${error.message}. Please check the API endpoint connection.`,
    };
  }
}

// Event listener for the run button
// *** DEPENDENCY: Relies on a button with ID 'btn_run' and an input field with ID 'userInput'.
document.getElementById("btn_run").addEventListener("click", async () => {
  const userInputElement = document.getElementById("userInput");
  const userInput = userInputElement ? userInputElement.value : "";

  if (!userInput.trim()) {
    console.warn("User input is empty. Please enter a command."); // Optionally provide user feedback in the UI
    return; // Do nothing if input is empty
  } // Add user input to history BEFORE sending the request

  chatHistory.push({ role: "User", content: userInput });
  console.log("Chat History Updated (User):", chatHistory); // Clear the input field after capturing the value

  if (userInputElement) {
    userInputElement.value = "";
  }

  try {
    console.log("Calling AI Response API..."); // Call aiRes with the current user input and the chat history
    // *** DEPENDENCY: Relies on the aiRes function to fetch and process the AI response.
    const response = await aiRes(userInput, chatHistory);
    console.log("AI Response Received:", response);

    let jsonData = null;
    let aiResponseContentForHistory = "No reply from AI or reply is empty."; // Default content for history

    if (response.reply) {
      aiResponseContentForHistory = response.reply; // Store the raw reply in history initially
      console.log("Attempting to parse AI response...");
      try {
        // Attempt to extract and parse the JSON string from the markdown code block
        const jsonMatch = response.reply.match(/```json\n([\s\S]*?)\n```/);
        if (jsonMatch && jsonMatch[1]) {
          const jsonString = jsonMatch[1];
          jsonData = JSON.parse(jsonString);
          console.log("Successfully parsed JSON from AI response."); // Optionally update history content with just the JSON string if preferred
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
    } // Add AI response (parsed JSON string or error info) to history AFTER receiving and processing

    chatHistory.push({ role: "AI", content: aiResponseContentForHistory });
    console.log("Chat History Updated (AI):", chatHistory);

    if (jsonData) {
      console.log("Running automation with parsed JSON data..."); // Run the automation with the parsed JSON data. // The runAutomation function initializes the agent which handles // the delete->create->code sequence based on the presence of properties in jsonData.
      // *** DEPENDENCY: Relies on the runAutomation function to execute the automation workflow.
      runAutomation(jsonData);
    } else {
      console.error(
        "Automation skipped: Valid JSON data was not obtained from AI."
      ); // The error or lack of JSON is already logged in history and console
    }
  } catch (error) {
    console.error("❌ Error during API fetch or automation execution:", error); // Log the fetch/automation error in history
    chatHistory.push({
      role: "AI",
      content: `Error during API fetch or automation execution: ${error.message}`,
    });
    console.log("Chat History Updated (Error):", chatHistory);
  }
});
