
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
    console.log("📋 Raw table data:", tableData); // Debug log
    
    // Ensure tableData is an array
    if (!Array.isArray(tableData.data)) {
      console.error("❌ tableData is not an array:", typeof tableData.data, tableData.data);
      return [];
    }
    
    const textData = document.getElementById("xppCode");
    
    // Initialize as array, not object
    const FilterTableData = [];
    
    // Check if textData exists and has content
    if (textData && textData.textContent) {
      const textContent = textData.textContent.toLowerCase();
      console.log("🔍 Filtering tables based on text content");
      
      for (const table of tableData.data) {
        // Check if table name is mentioned in the text content
        if (table && table.name && textContent.includes(table.name.toLowerCase())) {
          FilterTableData.push(table); 
        }
      }
      
      console.log(`✅ Found ${FilterTableData.length} matching tables out of ${tableData.length} total tables`);
      return FilterTableData;
    } else {
      // If no filter text, return all tables
      console.log(`📊 No filter applied, returning all ${tableData.length} tables`);
      return tableData;
    }
    
  } catch (e) {
    console.error("❌ Error in TotalTable:", e);
    return [];
  }
}

async function TableSchema_And_Data_Mind_Map() {
  try {
    const allTables = await TotalTable_Mind_Map();
    console.log("🔍 Received tables:", allTables); // Debug log

    // Add robust type checking
    if (!allTables) {
      console.log("❌ allTables is null or undefined");
      return [];
    }

    if (!Array.isArray(allTables)) {
      console.error("❌ allTables is not an array:", typeof allTables, allTables);
      return [];
    }

    if (allTables.length === 0) {
      console.log("ℹ️ No tables found");
      return [];
    }

    console.log(`📊 Processing ${allTables.length} tables...`);
    const result = [];

    // Process each table
    for (const table of allTables) {
      // Validate table object
      if (!table || typeof table !== 'object' || !table.name) {
        console.warn("⚠️ Invalid table object:", table);
        continue;
      }

      const tableName = table.name;
      console.log(`🔧 Processing table: ${tableName}`);

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
              query: `SELECT * FROM ${tableName} LIMIT 100;`, // Added LIMIT for safety
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
          data: Array.isArray(tableData) ? tableData : [],
          rowCount: Array.isArray(tableData) ? tableData.length : 0
        });
        
        console.log(`✅ Processed table: ${tableName} (${Array.isArray(tableData) ? tableData.length : 0} rows)`);
        
      } catch (tableError) {
        console.error(`❌ Error processing table ${tableName}:`, tableError);
        // Still add the table with error info
        result.push({
          name: tableName,
          schema: `Error retrieving schema: ${tableError.message}`,
          data: [],
          rowCount: 0,
          error: tableError.message
        });
      }
    }

    console.log(`🎉 Successfully processed ${result.length} tables`);
    return result;
  } catch (e) {
    console.error("❌ Error in TableSchema_And_Data_Mind_Map:", e);
    return [];
  }
}
