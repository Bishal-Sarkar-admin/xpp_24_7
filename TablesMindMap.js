async function TotalTable_Mind_Map() {
  try {
    const tableResponse = await fetch(
      "https://advance-server-tu9s.onrender.com/api/select",
      {
        method: "POST",
        headers,
        body: JSON.stringify({
          query: "SELECT name FROM sqlite_master WHERE type='table';",
          params: [],
        }),
      }
    );

    if (!tableResponse.ok) {
      throw new Error(
        `HTTP error! status: ${tableResponse.status} - ${tableResponse.statusText}`
      );
    }

    const tableData = await tableResponse.json();
    const textData = document.getElementById("xppCode");

    // Initialize as array, not object
    const FilterTableData = [];

    // Check if textData exists and has content
    if (textData && textData.textContent) {
      const textContent = textData.textContent.toLowerCase();

      for (const table of tableData) {
        // Check if table name is mentioned in the text content
        if (textContent.includes(table.name.toLowerCase())) {
          FilterTableData.push(table);
        }
      }
    } else {
      // If no filter text, return all tables
      return tableData;
    }

    return FilterTableData;
  } catch (e) {
    console.error("❌ Error in TotalTable:", e);
    return [];
  }
}

async function TableSchema_And_Data_Mind_Map() {
  try {
    const allTables = await TotalTable_Mind_Map();

    if (!allTables || allTables.length === 0) {
      console.log("No tables found");
      return [];
    }

    const result = [];

    // Process each table
    for (const table of allTables) {
      const tableName = table.name;

      try {
        // Get schema
        const schemaResponse = await fetch(
          "https://advance-server-tu9s.onrender.com/api/select",
          {
            method: "POST",
            headers,
            body: JSON.stringify({
              query: `SELECT sql FROM sqlite_master WHERE name = ?;`,
              params: [tableName],
            }),
          }
        );

        if (!schemaResponse.ok) {
          throw new Error(`Failed to get schema for ${tableName}`);
        }

        const schemaData = await schemaResponse.json();

        // Get table data (with LIMIT to prevent overwhelming responses)
        const dataResponse = await fetch(
          "https://advance-server-tu9s.onrender.com/api/select",
          {
            method: "POST",
            headers,
            body: JSON.stringify({
              query: `SELECT * FROM ${tableName};`,
              params: [],
            }),
          }
        );

        if (!dataResponse.ok) {
          throw new Error(`Failed to get data for ${tableName}`);
        }

        const tableData = await dataResponse.json();

        // Add to result
        result.push({
          name: tableName,
          schema: schemaData[0]?.sql || `No schema found for ${tableName}`,
          data: tableData || [],
          rowCount: tableData ? tableData.length : 0,
        });

        console.log(
          `✅ Processed table: ${tableName} (${tableData?.length || 0} rows)`
        );
      } catch (tableError) {
        console.error(`❌ Error processing table ${tableName}:`, tableError);
        // Still add the table with error info
        result.push({
          name: tableName,
          schema: `Error retrieving schema: ${tableError.message}`,
          data: [],
          rowCount: 0,
          error: tableError.message,
        });
      }
    }

    return result;
  } catch (e) {
    console.error("❌ Error in TableSchema_And_Data_Mind_Map:", e);
    return [];
  }
}
