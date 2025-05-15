// Global variables
let tableCounter = 0;
let currentTableId = null;
let apiSettings = {
  endpoint: "",
  apiKey: "",
};

// Load settings from localStorage if available
if (localStorage.getItem("apiSettings")) {
  try {
    apiSettings = JSON.parse(localStorage.getItem("apiSettings"));
  } catch (e) {
    console.error("Failed to parse stored API settings:", e);
  }
}

// DOM Elements
const addTableBtn = document.getElementById("btn");
const tableCreateSection = document.getElementById("TableCreate");
const tableNameModal = document.getElementById("tableNameModal");
const fieldModal = document.getElementById("fieldModal");
const settingsModal = document.getElementById("settingsModal");
const createTableBtn = document.getElementById("createTableBtn");
const cancelTableBtn = document.getElementById("cancelTableBtn");
const addFieldBtn = document.getElementById("addFieldBtn");
const cancelFieldBtn = document.getElementById("cancelFieldBtn");
const saveSettingsBtn = document.getElementById("saveSettingsBtn");
const cancelSettingsBtn = document.getElementById("cancelSettingsBtn");
const toast = document.getElementById("toast");

// Event Listeners
addTableBtn.addEventListener("click", function (e) {
  // Check if API settings are configured first
  if (!apiSettings.endpoint || !apiSettings.apiKey) {
    openSettingsModal();
  } else {
    openTableNameModal();
  }
});

createTableBtn.addEventListener("click", createNewTable);
cancelTableBtn.addEventListener("click", closeTableNameModal);
addFieldBtn.addEventListener("click", addNewField);
cancelFieldBtn.addEventListener("click", closeFieldModal);
saveSettingsBtn.addEventListener("click", saveSettings);
cancelSettingsBtn.addEventListener("click", closeSettingsModal);

// Add enter key support for modals
document
  .getElementById("tableName")
  .addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      createNewTable();
    }
  });

document
  .getElementById("fieldName")
  .addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      addNewField();
    }
  });

// Functions
function openTableNameModal() {
  tableNameModal.style.display = "flex";
  document.getElementById("tableName").focus();
}

function closeTableNameModal() {
  tableNameModal.style.display = "none";
  document.getElementById("tableName").value = "";
}

function openSettingsModal() {
  // Populate with existing values if available
  if (apiSettings.endpoint) {
    document.getElementById("apiEndpoint").value = apiSettings.endpoint;
  }
  if (apiSettings.apiKey) {
    document.getElementById("apiKey").value = apiSettings.apiKey;
  }

  settingsModal.style.display = "flex";
  document.getElementById("apiEndpoint").focus();
}

function closeSettingsModal() {
  settingsModal.style.display = "none";
}

function saveSettings() {
  const endpoint = document.getElementById("apiEndpoint").value.trim();
  const apiKey = document.getElementById("apiKey").value.trim();

  if (!endpoint) {
    alert("Please enter an API endpoint");
    return;
  }

  if (!apiKey) {
    alert("Please enter an API key");
    return;
  }

  // Validate URL format
  try {
    new URL(endpoint);
  } catch (e) {
    alert("Please enter a valid URL for the API endpoint");
    return;
  }

  apiSettings = {
    endpoint: endpoint,
    apiKey: apiKey,
  };

  // Save to localStorage
  localStorage.setItem("apiSettings", JSON.stringify(apiSettings));

  closeSettingsModal();
  showToast("API settings saved!");

  // Open table modal if this was the initial setup
  openTableNameModal();
}

function openFieldModal(tableId) {
  currentTableId = tableId;
  fieldModal.style.display = "flex";
  document.getElementById("fieldName").focus();
}

function closeFieldModal() {
  fieldModal.style.display = "none";
  resetFieldForm();
}

function resetFieldForm() {
  document.getElementById("fieldName").value = "";
  document.getElementById("fieldType").value = "VARCHAR(20)";
  document.getElementById("notNull").checked = false;
  document.getElementById("defaultValue").value = "";
  document.getElementById("primaryKey").checked = false;
}

function validateInputName(name) {
  // Only allow letters, numbers, and underscores
  const regex = /^[a-zA-Z0-9_]+$/;
  return regex.test(name);
}

function createNewTable() {
  const tableName = document.getElementById("tableName").value.trim();
  if (tableName === "") {
    alert("Please enter a table name");
    return;
  }

  if (!validateInputName(tableName)) {
    alert(
      "Table name can only contain letters, numbers, and underscores"
    );
    return;
  }

  const tableId = "table_" + tableCounter++;

  const tableContainer = document.createElement("div");
  tableContainer.className = "table-container";
  tableContainer.id = tableId;

  tableContainer.innerHTML = `
    <div class="table-header">
      <div class="table-name">${sanitizeHTML(tableName)}</div>
      <button type="button" class="btn-remove" onclick="removeTable('${tableId}')">Remove Table</button>
    </div>
    <div class="table-responsive">
      <table>
        <thead>
          <tr>
            <th>CID</th>
            <th>Name</th>
            <th>Type</th>
            <th>Not Null</th>
            <th>Default Value</th>
            <th>Primary Key</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
        </tbody>
        <tfoot>
          <tr>
            <td colspan="7" class="table-footer">
              <button type="button" class="btn-add" onclick="openFieldModal('${tableId}')">Add Field</button>
              <button type="button" class="btn-save" onclick="saveTable('${tableId}')">Save Table</button>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
    <div class="sql-output" id="sql_${tableId}">
      <div class="sql-content"></div>
      <button class="copy-btn" onclick="copySQL('${tableId}')">Copy</button>
    </div>
  `;

  tableCreateSection.appendChild(tableContainer);
  closeTableNameModal();
  
  // Add default RacID field automatically
  currentTableId = tableId;
  addDefaultRacIDField(tableId);
}

function addDefaultRacIDField(tableId) {
  const table = document.querySelector(`#${tableId} table tbody`);
  
  // Create a new row for RacID
  const newRow = table.insertRow();
  
  // CID cell
  const cidCell = newRow.insertCell();
  cidCell.textContent = "0";
  
  // Name cell
  const nameCell = newRow.insertCell();
  nameCell.textContent = "RacID";
  
  // Type cell
  const typeCell = newRow.insertCell();
  typeCell.textContent = "INTEGER";
  
  // Not Null cell
  const notNullCell = newRow.insertCell();
  notNullCell.textContent = "1";
  
  // Default Value cell
  const defaultValueCell = newRow.insertCell();
  defaultValueCell.textContent = "null";
  
  // Primary Key cell
  const primaryKeyCell = newRow.insertCell();
  primaryKeyCell.textContent = "1";
  
  // Actions cell
  const actionsCell = newRow.insertCell();
  const removeButton = document.createElement("button");
  removeButton.type = "button";
  removeButton.className = "btn-remove";
  removeButton.textContent = "❌";
  removeButton.onclick = function () {
    table.removeChild(newRow);
    // Update CIDs after removal
    for (let i = 0; i < table.rows.length; i++) {
      table.rows[i].cells[0].textContent = i;
    }
  };
  actionsCell.appendChild(removeButton);
}

function removeTable(tableId) {
  if (confirm("Are you sure you want to remove this table?")) {
    const tableContainer = document.getElementById(tableId);
    tableContainer.parentNode.removeChild(tableContainer);
  }
}

function addNewField() {
  const fieldName = document.getElementById("fieldName").value.trim();
  const fieldType = document.getElementById("fieldType").value;
  const notNull = document.getElementById("notNull").checked ? 1 : 0;
  const defaultValue =
    document.getElementById("defaultValue").value.trim() || "null";
  const primaryKey = document.getElementById("primaryKey").checked
    ? 1
    : 0;

  if (fieldName === "") {
    alert("Please enter a field name");
    return;
  }

  if (!validateInputName(fieldName)) {
    alert(
      "Field name can only contain letters, numbers, and underscores"
    );
    return;
  }

  const table = document.querySelector(`#${currentTableId} table tbody`);
  const rowCount = table.rows.length;

  const newRow = table.insertRow();

  // CID cell
  const cidCell = newRow.insertCell();
  cidCell.textContent = rowCount;

  // Name cell
  const nameCell = newRow.insertCell();
  nameCell.textContent = fieldName;

  // Type cell
  const typeCell = newRow.insertCell();
  typeCell.textContent = fieldType;

  // Not Null cell
  const notNullCell = newRow.insertCell();
  notNullCell.textContent = notNull;

  // Default Value cell
  const defaultValueCell = newRow.insertCell();
  defaultValueCell.textContent = sanitizeHTML(defaultValue);

  // Primary Key cell
  const primaryKeyCell = newRow.insertCell();
  primaryKeyCell.textContent = primaryKey;

  // Actions cell
  const actionsCell = newRow.insertCell();
  const removeButton = document.createElement("button");
  removeButton.type = "button";
  removeButton.className = "btn-remove";
  removeButton.textContent = "❌";
  removeButton.onclick = function () {
    table.removeChild(newRow);
    // Update CIDs after removal
    for (let i = 0; i < table.rows.length; i++) {
      table.rows[i].cells[0].textContent = i;
    }
  };
  actionsCell.appendChild(removeButton);

  closeFieldModal();
}

// Sanitize HTML input to prevent XSS
function sanitizeHTML(str) {
  const temp = document.createElement("div");
  temp.textContent = str;
  return temp.innerHTML;
}

function jsonToSQLite(jsonDef) {
  // Validate input
  if (
    !jsonDef ||
    !jsonDef.name ||
    !jsonDef.fields ||
    !Array.isArray(jsonDef.fields)
  ) {
    throw new Error(
      'Invalid JSON structure. Must include "name" and "fields" array.'
    );
  }

  const tableName = jsonDef.name;

  // Validate table name
  if (!validateInputName(tableName)) {
    throw new Error("Table name contains invalid characters");
  }

  const fields = jsonDef.fields;

  if (fields.length === 0) {
    throw new Error("Table must have at least one field");
  }

  // Start building parameterized SQL statement
  let sql = `CREATE TABLE "${tableName}" (\n`;

  // Process each field
  const fieldDefinitions = fields.map((field) => {
    // Required properties
    if (!field.name || !field.type) {
      throw new Error("Each field must have at least a name and type");
    }

    // Validate field name
    if (!validateInputName(field.name)) {
      throw new Error(
        `Field name "${field.name}" contains invalid characters`
      );
    }

    let fieldDef = `    "${field.name}" ${field.type}`;

    // Add NOT NULL constraint if specified
    if (
      field.notNull === "1" ||
      field.notNull === 1 ||
      field.notNull === true
    ) {
      fieldDef += " NOT NULL";
    }

    // Add DEFAULT value if specified and not "null"
    if (
      field.defaultValue !== undefined &&
      field.defaultValue !== "null"
    ) {
      // Check if default value needs quotes (for string types)
      if (
        field.type.includes("VARCHAR") ||
        field.type === "TEXT" ||
        field.type === "DATE"
      ) {
        fieldDef += ` DEFAULT '${field.defaultValue.replace(
          /'/g,
          "''"
        )}'`;
      } else {
        fieldDef += ` DEFAULT ${field.defaultValue}`;
      }
    }

    // Add PRIMARY KEY constraint if specified
    if (
      field.primaryKey === "1" ||
      field.primaryKey === 1 ||
      field.primaryKey === true
    ) {
      fieldDef += " PRIMARY KEY";
    }

    return fieldDef;
  });

  // Join all field definitions with commas
  sql += fieldDefinitions.join(",\n");

  // Add AUTOINCREMENT to RacID field
  if (jsonDef.fields.some(field => field.name === "RacID" && field.primaryKey)) {
    sql = sql.replace('"RacID" INTEGER NOT NULL PRIMARY KEY', '"RacID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT');
  }

  // Close the SQL statement
  sql += "\n);";

  return sql;
}

async function saveTable(tableId) {
  const table = document.querySelector(`#${tableId} table`);
  const tableName = document.querySelector(
    `#${tableId} .table-name`
  ).textContent;
  const tbody = table.querySelector("tbody");
  const sqlOutput = document.getElementById(`sql_${tableId}`);
  const sqlContent = sqlOutput.querySelector(".sql-content");

  if (tbody.rows.length === 0) {
    alert("Please add at least one field to the table");
    return;
  }

  // Check if API settings are configured
  if (!apiSettings.endpoint || !apiSettings.apiKey) {
    alert("Please configure API settings first");
    openSettingsModal();
    return;
  }

  let tableData = {
    name: tableName,
    fields: [],
  };

  for (let i = 0; i < tbody.rows.length; i++) {
    const row = tbody.rows[i];
    tableData.fields.push({
      cid: row.cells[0].textContent,
      name: row.cells[1].textContent,
      type: row.cells[2].textContent,
      notNull: row.cells[3].textContent,
      defaultValue: row.cells[4].textContent,
      primaryKey: row.cells[5].textContent,
    });
  }

  try {
    const sqlStatement = jsonToSQLite(tableData);
    sqlContent.textContent = sqlStatement;
    sqlOutput.style.display = "block";

    // Show SQL generated toast
    showToast("SQL generated successfully!");

    // Create the table via API
    try {
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-API-KEY": apiSettings.apiKey,
      };

      showToast("Creating table in database...");

      const tableResponse = await fetch(apiSettings.endpoint, {
        method: "POST",
        headers,
        body: JSON.stringify({
          query: sqlStatement,
          params: [],
        }),
      });

      if (!tableResponse.ok) {
        throw new Error(`HTTP error! Status: ${tableResponse.status}`);
      }

      const res_data = await tableResponse.json();
      console.log("Table created response:", res_data);

      if (res_data.data) {
        showToast("Table created successfully in database!");
      } else {
        showToast("Table creation response received, but status unclear");
      }
    } catch (e) {
      console.error("API Error:", e);
      showToast("Error creating table: " + e.message);
    }
  } catch (error) {
    alert("Error generating SQL: " + error.message);
    console.error(error);
  }
}

function copySQL(tableId) {
  const sqlContent = document.querySelector(
    `#sql_${tableId} .sql-content`
  ).textContent;

  navigator.clipboard.writeText(sqlContent).then(
    function () {
      showToast("SQL copied to clipboard!");
    },
    function (err) {
      alert("Could not copy text: " + err);
    }
  );
}

// Toast queue system to prevent overriding messages
const toastQueue = [];
let toastDisplaying = false;

function showToast(message) {
  toastQueue.push(message);
  if (!toastDisplaying) {
    processToastQueue();
  }
}

function processToastQueue() {
  if (toastQueue.length === 0) {
    toastDisplaying = false;
    return;
  }

  toastDisplaying = true;
  const message = toastQueue.shift();

  toast.textContent = message;
  toast.className = "toast show";

  // Hide toast after 3 seconds
  setTimeout(function () {
    toast.className = toast.className.replace("show", "");
    // Process next toast after a small delay
    setTimeout(processToastQueue, 300);
  }, 3000);
}

// Make functions available globally
window.openFieldModal = openFieldModal;
window.saveTable = saveTable;
window.removeTable = removeTable;
window.copySQL = copySQL;
window.openSettingsModal = openSettingsModal;
