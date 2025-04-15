const tableNamesContainer = document.getElementById("tableNames");
const apiKey =
  localStorage.getItem("key") || (localStorage.setItem("key", "1234"), "1234");

const headers = {
  "Content-Type": "application/json",
  Accept: "application/json",
  "X-API-KEY": apiKey,
};

async function TotalTable() {
  try {
    const tableResponse = await fetch("http://localhost:3000/api/select", {
      method: "POST",
      headers,
      body: JSON.stringify({
        query: "SELECT name FROM sqlite_master WHERE type='table';",
        params: [],
      }),
    });
    showSpinner();
    if (!tableResponse.ok) {
      removeSpinner();
      showMessage(`Failed to fetch table names.`, "error");
      throw new Error(`Failed to fetch table names.`);
    }

    tableNamesContainer.innerHTML = "";

    const tableData = await tableResponse.json();
    if (tableData.data) {
      removeSpinner();
      showMessage(`Table names fetched successfully!`, "success");
    }

    const allTableNames = tableData.data.map((row) => row.name); // Renamed
    const Table = document.createElement("h5");

    Table.style.textAlign = "center";
    Table.innerText = "Tables in Database";
    Table.style.fontSize = "20px";
    tableNamesContainer.appendChild(Table);
    allTableNames.map((tableName) => {
      const tableDiv = document.createElement("div");
      tableDiv.className = "table-name";
      tableDiv.style.cursor = "pointer";
      tableDiv.style.textAlign = "center";
      tableDiv.innerHTML = `<h5>${tableName}</h5>`;
      tableNamesContainer.appendChild(tableDiv);

      tableDiv.addEventListener("click", async () => {
        const schemaData = await ShowTableSchema(tableName);
        const tableData = await ShowTableData(tableName);

        // Create the card
        const card = document.createElement("div");
        card.className = "card";

        // Create close button
        const closeBtn = document.createElement("button");
        closeBtn.className = "close-btn";
        closeBtn.innerHTML = "&times;";
        closeBtn.onclick = () => card.remove();

        // Build schema HTML
        const schemaHtml = `<h3>Schema for ${tableName}</h3><pre>${JSON.stringify(
          schemaData.data,
          null,
          2
        )}</pre>`;

        // Build data HTML
        const dataHtml = `<h3>Data for ${tableName}</h3><pre>${JSON.stringify(
          tableData.data,
          null,
          2
        )}</pre>`;

        card.innerHTML = schemaHtml + dataHtml;
        card.appendChild(closeBtn);
        document.body.appendChild(card);
      });
    });
  } catch (e) {
    console.error("❌ Error in TotalTable:", e);
    showMessage(`Error: ${e}`, "error");
    removeSpinner();
  }
}

async function ShowTableSchema(tableName) {
  try {
    const schemaResponse = await fetch("http://localhost:3000/api/select", {
      method: "POST",
      headers,
      body: JSON.stringify({
        query: `PRAGMA table_info(${tableName});`,
        params: [],
      }),
    });
    showSpinner();
    if (!schemaResponse.ok) {
      removeSpinner();
      showMessage(`Failed to fetch schema for table ${tableName}`, "error");
      throw new Error(`Failed to fetch schema for table ${tableName}`);
    }

    const schemaData = await schemaResponse.json();
    if (schemaData) {
      removeSpinner();

      showMessage(`Schema fetched successfully!`, "success");
    }

    return schemaData;
  } catch (e) {
    removeSpinner();
    showMessage(`Error: ${e}`, "error");
    console.error(`❌ Error in ShowTableSchema for ${tableName}:`, e);
  }
}

async function ShowTableData(tableName) {
  try {
    const TableDataResponse = await fetch("https://server100sql.onrender.com/api/select", {
      method: "POST",
      headers,
      body: JSON.stringify({
        query: `SELECT * FROM ${tableName};`,
        params: [],
      }),
    });
    showSpinner();
    if (!TableDataResponse.ok) {
      removeSpinner();
      showMessage(`Failed to fetch Data for table ${tableName}`, "error");
      throw new Error(`Failed to fetch Data for table ${tableName}`);
    }

    const TableData = await TableDataResponse.json();
    if (TableData) {
      removeSpinner();
      showMessage(`Data fetched successfully!`, "success");
    }
    return TableData;
  } catch (e) {
    removeSpinner();
    console.error(`❌ Error in ShowTableData for ${tableName}:`, e);
    showMessage(`Error: ${e}`, "error");
  }
}
