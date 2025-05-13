/**
 * Enhanced Table Automation Agent with localStorage Persistence
 *
 * This script automatically populates database tables based on a JSON schema definition,
 * executes X++ code, handles table deletion operations, and stores user interaction
 * history in localStorage for improved personalization.
 */

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

    // Initialize interaction history from localStorage or create new
    this.userHistory = this.loadUserHistory();
  }

  /**
   * Load user interaction history from localStorage
   */
  loadUserHistory() {
    try {
      const storedHistory = localStorage.getItem("tableAutomationHistory");
      return storedHistory
        ? JSON.parse(storedHistory)
        : {
            tables: {},
            interactions: [],
            preferences: {},
            lastSession: new Date().toISOString(),
          };
    } catch (error) {
      console.warn("Error loading user history from localStorage:", error);
      return {
        tables: {},
        interactions: [],
        preferences: {},
        lastSession: new Date().toISOString(),
      };
    }
  }

  /**
   * Save user interaction history to localStorage
   */
  saveUserHistory() {
    try {
      localStorage.setItem(
        "tableAutomationHistory",
        JSON.stringify(this.userHistory)
      );
    } catch (error) {
      console.warn("Error saving user history to localStorage:", error);
    }
  }

  /**
   * Update user history with current operation
   */
  updateUserHistory() {
    // Update tables record
    this.userHistory.tables[this.jsonData.name] = {
      fields: this.jsonData.fields,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Add to interactions
    this.userHistory.interactions.push({
      action: "create_table",
      tableName: this.jsonData.name,
      timestamp: new Date().toISOString(),
      fieldCount: this.jsonData.fields.length,
      deletedTable: this.jsonData.delete || null,
    });

    // Update session info
    this.userHistory.lastSession = new Date().toISOString();

    // Save to localStorage
    this.saveUserHistory();
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

      // Update user history with this operation
      this.updateUserHistory();

      this.logOperation("Table automation workflow completed successfully!");
      return {
        success: true,
        operations: this.operations,
        historyUpdated: true,
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

            // Update history to remove the table
            if (this.userHistory.tables[tableName]) {
              this.userHistory.tables[tableName].deleted = true;
              this.userHistory.tables[tableName].deletedAt =
                new Date().toISOString();
              this.saveUserHistory();
            }

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
   * Get suggestions for table improvements based on history
   */
  getSuggestions() {
    // This is a placeholder for recommendation logic
    // In a full implementation, this would analyze past table patterns
    const suggestions = [];

    // Check if any common fields are missing
    const commonFields = this.getCommonFieldsFromHistory();
    const currentFieldNames = this.jsonData.fields.map((f) =>
      f.name.toLowerCase()
    );

    for (const commonField of commonFields) {
      if (!currentFieldNames.includes(commonField.name.toLowerCase())) {
        suggestions.push({
          type: "missing_common_field",
          field: commonField,
          message: `Consider adding the commonly used field "${commonField.name}" of type ${commonField.type}`,
        });
      }
    }

    return suggestions;
  }

  /**
   * Extract common fields from user history
   */
  getCommonFieldsFromHistory() {
    // This is a simplified implementation
    // A real implementation would do more sophisticated pattern analysis
    const fieldCounts = {};

    // Count field occurrences across tables
    Object.values(this.userHistory.tables).forEach((table) => {
      if (!table.deleted) {
        table.fields.forEach((field) => {
          const key = `${field.name.toLowerCase()}|${field.type}`;
          fieldCounts[key] = (fieldCounts[key] || 0) + 1;
        });
      }
    });

    // Find fields that appear in at least 2 tables
    const commonFields = [];
    for (const [key, count] of Object.entries(fieldCounts)) {
      if (count >= 2) {
        const [name, type] = key.split("|");
        commonFields.push({
          name: name.charAt(0).toUpperCase() + name.slice(1), // Capitalize first letter
          type: type,
        });
      }
    }

    return commonFields;
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
      suggestions: this.getSuggestions(),
      userStats: {
        totalTables: Object.keys(this.userHistory.tables).length,
        totalInteractions: this.userHistory.interactions.length,
        lastSession: this.userHistory.lastSession,
      },
    };
  }

  /**
   * Get previously created tables from history
   */
  static getPreviousTables() {
    try {
      const storedHistory = localStorage.getItem("tableAutomationHistory");
      const history = storedHistory
        ? JSON.parse(storedHistory)
        : { tables: {} };

      // Return active (non-deleted) tables
      return Object.entries(history.tables)
        .filter(([_, table]) => !table.deleted)
        .map(([name, table]) => ({
          name,
          fieldCount: table.fields.length,
          createdAt: table.createdAt,
        }));
    } catch (error) {
      console.warn("Error accessing table history:", error);
      return [];
    }
  }
}

/**
 * TableAutomationManager - Manages AI interaction and history
 * This class serves as the interface between the AI assistant and the automation agent
 */
class TableAutomationManager {
  constructor() {
    // Load conversation history from localStorage
    this.conversationHistory = this.loadConversationHistory();
    this.setupEventListeners();
  }

  /**
   * Load conversation history from localStorage
   */
  loadConversationHistory() {
    try {
      const storedHistory = localStorage.getItem(
        "tableAutomationConversations"
      );
      return storedHistory
        ? JSON.parse(storedHistory)
        : {
            conversations: [],
            preferences: {},
            lastInteraction: null,
          };
    } catch (error) {
      console.warn("Error loading conversation history:", error);
      return {
        conversations: [],
        preferences: {},
        lastInteraction: null,
      };
    }
  }

  /**
   * Save conversation history to localStorage
   */
  saveConversationHistory() {
    try {
      localStorage.setItem(
        "tableAutomationConversations",
        JSON.stringify(this.conversationHistory)
      );
    } catch (error) {
      console.warn("Error saving conversation history:", error);
    }
  }

  /**
   * Record a new conversation entry
   */
  recordConversation(userInput, aiResponse, tableCreated = null) {
    this.conversationHistory.conversations.push({
      timestamp: new Date().toISOString(),
      userInput,
      aiResponse,
      tableCreated,
    });

    this.conversationHistory.lastInteraction = new Date().toISOString();
    this.saveConversationHistory();
  }

  /**
   * Set up event listeners for the chat interface
   */
  setupEventListeners() {
    // Example implementation - would need customization based on actual UI
    const sendButton = document.getElementById("sendButton");
    const userInput = document.getElementById("userInput");

    if (sendButton && userInput) {
      sendButton.addEventListener("click", () => {
        const input = userInput.value.trim();
        if (input) {
          this.processUserInput(input);
          userInput.value = "";
        }
      });

      userInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          const input = userInput.value.trim();
          if (input) {
            this.processUserInput(input);
            userInput.value = "";
          }
        }
      });
    }
  }

  /**
   * Process user input and generate AI response
   * This would typically involve sending to an actual AI service
   * Here we simulate with some basic pattern matching
   */
  processUserInput(input) {
    // Display user message
    this.displayMessage(input, "user");

    // In a real implementation, this would call the AI service
    // For demo purposes, we'll use a simple response generator
    setTimeout(() => {
      const response = this.generateResponse(input);
      this.displayMessage(response.message, "ai");

      // If the AI generated a table configuration, execute it
      if (response.jsonData) {
        this.executeTableAutomation(response.jsonData);
      }
    }, 500);
  }

  /**
   * Generate AI response based on user input
   * This is a placeholder for actual AI integration
   */
  generateResponse(input) {
    // Simplified response logic - in production this would be an AI service
    const lowerInput = input.toLowerCase();

    // Simple pattern matching
    if (lowerInput.includes("create") && lowerInput.includes("table")) {
      // Extract table name - very simplified example
      const nameMatch = input.match(
        /table\s+(?:named|called)?\s*["']?([a-zA-Z0-9_]+)["']?/i
      );
      const tableName = nameMatch ? nameMatch[1] : "NewTable";

      // Basic field detection - extremely simplified
      const fields = [];

      if (lowerInput.includes("customer")) {
        fields.push(
          {
            name: "CustomerID",
            type: "STR(20)",
            notNull: true,
            primaryKey: true,
          },
          {
            name: "CustomerName",
            type: "STR(100)",
            notNull: true,
            primaryKey: false,
          },
          { name: "Email", type: "STR(100)", notNull: false, primaryKey: false }
        );
      } else if (lowerInput.includes("product")) {
        fields.push(
          {
            name: "ProductID",
            type: "STR(20)",
            notNull: true,
            primaryKey: true,
          },
          {
            name: "ProductName",
            type: "STR(100)",
            notNull: true,
            primaryKey: false,
          },
          { name: "Price", type: "REAL", notNull: true, primaryKey: false }
        );
      } else {
        // Default fields
        fields.push(
          { name: "ID", type: "STR(20)", notNull: true, primaryKey: true },
          { name: "Name", type: "STR(50)", notNull: true, primaryKey: false },
          {
            name: "CreatedDate",
            type: "DATE",
            notNull: false,
            primaryKey: false,
          }
        );
      }

      // Create JSON data
      const jsonData = {
        name: tableName,
        fields: fields,
      };

      return {
        message: `I'll create a table named "${tableName}" with ${fields.length} fields. Processing now...`,
        jsonData: jsonData,
      };
    }

    // Default response for other inputs
    return {
      message:
        "I'm here to help you create database tables. Let me know what kind of table you'd like to create.",
      jsonData: null,
    };
  }

  /**
   * Execute table automation with the provided JSON data
   */
  async executeTableAutomation(jsonData) {
    try {
      this.displayMessage("Starting table creation process...", "system");

      const agent = new EnhancedTableAutomationAgent(jsonData);
      const result = await agent.run();

      if (result.success) {
        const report = agent.generateReport();
        this.displayMessage(
          `✅ Table "${jsonData.name}" created successfully with ${jsonData.fields.length} fields!`,
          "system"
        );

        // Record this successful table creation in conversation history
        this.recordConversation(null, null, {
          tableName: jsonData.name,
          timestamp: new Date().toISOString(),
          fieldCount: jsonData.fields.length,
        });
      } else {
        this.displayMessage(
          `❌ Error creating table: ${result.error}`,
          "system"
        );
      }
    } catch (error) {
      this.displayMessage(
        `❌ Fatal error in automation: ${error.message}`,
        "system"
      );
    }
  }

  /**
   * Display a message in the chat interface
   */
  displayMessage(message, sender) {
    // Simple implementation - would need customization based on actual UI
    const chatContainer = document.getElementById("chatContainer");

    if (chatContainer) {
      const messageElement = document.createElement("div");
      messageElement.className = `message ${sender}-message`;
      messageElement.textContent = message;
      chatContainer.appendChild(messageElement);
      chatContainer.scrollTop = chatContainer.scrollHeight;

      // Record user-AI conversations
      if (sender === "user" || sender === "ai") {
        this.recordConversation(
          sender === "user" ? message : null,
          sender === "ai" ? message : null
        );
      }
    }
  }
}

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  // Create and initialize the manager
  window.tableManager = new TableAutomationManager();

  // Display welcome message
  window.tableManager.displayMessage(
    "Welcome to the Table Automation Assistant! I can help you create database tables. What would you like to create today?",
    "ai"
  );
});

// Example of direct JSON execution
function executeJsonConfiguration(jsonData) {
  const agent = new EnhancedTableAutomationAgent(jsonData);

  agent.run().then((result) => {
    if (result.success) {
      console.log("✅ Automation completed successfully!");
      console.log(agent.generateReport());

      document.getElementById("status").textContent =
        "Automation completed successfully";
    } else {
      console.error("❌ Automation failed:", result.error);

      document.getElementById("status").textContent =
        "Automation failed: " + result.error;
    }
  });
}

// Example JSON configuration that can be used directly
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
  name: "CustomerOrders", // Table to create
  fields: [
    {
      name: "OrderID",
      type: "STR(20)",
      notNull: true,
      primaryKey: true,
    },
    {
      name: "CustomerID",
      type: "STR(20)",
      notNull: true,
      primaryKey: false,
    },
    {
      name: "OrderDate",
      type: "DATE",
      notNull: true,
      primaryKey: false,
    },
    {
      name: "TotalAmount",
      type: "REAL",
      notNull: true,
      primaryKey: false,
    },
    {
      name: "Status",
      type: "STR(20)",
      notNull: true,
      primaryKey: false,
    },
  ],
};

// Uncomment this line to execute the sample JSON configuration on page load
executeJsonConfiguration(JSON_Data);
