// Ensure required HTML elements exist
const textarea = document.getElementById("xppCode");
const suggestionsBox = document.getElementById("suggestions");

// --- Expanded X++ Data Structure ---
const xppData = {
  keywords: [
    // Core X++ Keywords - Your existing keywords list is already very comprehensive
    "abstract",
    "as",
    "asc",
    "avg",
    "break",
    "breakpoint",
    "by",
    "case",
    "catch",
    "changecompany",
    "class",
    "client",
    "const",
    "continue",
    "count",
    "crosscompany",
    "delegate",
    "delete_from",
    "desc",
    "display",
    "div",
    "do",
    "edit",
    "else",
    "eventhandler",
    "exists",
    "extends",
    "final",
    "finally",
    "firstonly",
    "for",
    "forceliterals",
    "forcenestedloop",
    "forceplaceholders",
    "forceselectorder",
    "forupdate",
    "from",
    "group",
    "if",
    "implements",
    "in",
    "index",
    "insert_recordset",
    "instanceof",
    "interface",
    "internal",
    "is",
    "join",
    "like",
    "maxof",
    "minof",
    "mod",
    "namespace",
    "native",
    "new",
    "next",
    "nofetch",
    "notexists",
    "optimisticlock",
    "order",
    "outer",
    "pessimisticlock",
    "print",
    "private",
    "protected",
    "public",
    "repeat",
    "retry",
    "return",
    "reverse",
    "select",
    "server",
    "setting",
    "static",
    "sum",
    "super",
    "switch",
    "table",
    "this",
    "throw",
    "throws",
    "transaction",
    "try",
    "ttsabort",
    "ttsbegin",
    "ttscommit",
    "update_recordset",
    "using",
    "validtimestate",
    "var",
    "void",
    "where",
    "while",
    "yield",
  ],
  dataTypes: [
    "anytype",
    "boolean",
    "container",
    "date",
    "enum",
    "guid",
    "int",
    "int64",
    "real",
    "str",
    "timeofday",
    "utcdatetime",
    "List",
    "Map",
    "Set",
    "Args",
    "Types",
    "ListIterator",
    "ListEnumerator",
    "MapEnumerator",
  ],
  operators: [
    "div",
    "mod",
    "like",
    "+",
    "-",
    "*",
    "/",
    "&&",
    "||",
    "!",
    "==",
    "!=",
    "<",
    ">",
    "<=",
    ">=",
  ],
  accessModifiers: ["private", "protected", "public"],
  literals: ["true", "false", "null"],
  precompilerDirectives: [
    "#define",
    "#if",
    "#ifdef",
    "#ifndef",
    "#else",
    "#endif",
    "#undef",
    "#localmacro",
    "#globalmacro",
    "#macrolib",
    "#endmacro",
  ],
  systemObjects: [
    "FormRun",
    "FormControl",
    "FormDataSource",
    "Query",
    "QueryRun",
    "QueryBuildDataSource",
    "QueryBuildRange",
    "xRecord",
    "SysGlobal",
    "Global",
    "Exception",
    "Struct",
    "RecordInsertList",
    "RecordSortedList",
    "xSession",
    "SysOperationController",
    "SysOperationServiceController",
    "SysOperationDataContract",
    "SysOperationProgress",
    "NumberSeq",
    "RunBase",
    "RunBaseBatch",
    "Info",
    "COM",
    "CLRInterop",
  ],
  functions: [
    "strFmt()",
    "int2Str()",
    "str2Int()",
    "real2Str()",
    "str2Real()",
    "date2Str()",
    "str2Date()",
    "enum2Str()",
    "str2Enum()",
    "buf2Buf()",
    "curUserId()",
    "curExt()",
    "today()",
    "timeNow()",
    "conPeek()",
    "conPoke()",
    "conLen()",
    "conNull()",
    "newGuid()",
    "classNum()",
    "tableNum()",
    "fieldName2Id()",
    "fieldId2Name()",
    "main(Args _args)",
  ],
  collectionMethods: {
    List: [
      "addEnd(value)",
      "addStart(value)",
      "get(index)",
      "getEnumerator()",
      "elements()",
      "indexOf(element)",
      "insert(index, element)",
      "lastIndexOf(element)",
      "moveNext()",
      "parmIterator()",
      "parmList()",
      "removeRange(index, count)",
      "replicateFromList(list)",
      "replicateToList(list)",
      "setEnumerator(ListEnumerator _enumerator)",
      "size()",
      "sort()",
    ],
    ListIterator: [
      "more()",
      "value()",
      "next()",
      "begin()",
      "end()",
      "reset()",
    ],
    ListEnumerator: ["moveNext()", "current()", "reset()"],
    Map: [
      "insert(key, value)",
      "add(key, value)",
      "lookup(key)",
      "exists(key)",
      "getEnumerator()",
      "keys()",
      "values()",
      "remove(key)",
      "elements()",
      "keysEnumerator()",
      "valuesEnumerator()",
      "mapEnumerator()",
      "size()",
    ],
    MapEnumerator: [
      "moveNext()",
      "current()",
      "currentKey()",
      "currentValue()",
      "reset()",
    ],
    Set: [
      "add(value)",
      "in(value)",
      "remove(value)",
      "size()",
      "elements()",
      "clear()",
      "getEnumerator()",
    ],
    Record: [
      // Common table buffer methods
      "update()",
      "insert()",
      "delete()",
      "validateWrite()",
      "validateDelete()",
      "selectForUpdate()" /*"exists()", "notExists()" - These are SELECT clauses*/,
      "doUpdate()",
      "doInsert()",
      "doDelete()",
      "checkExistence()",
      "data()",
      "fieldId()",
      "tableName()",
      "tableId",
      "find()",
      "initValue()",
      "clear()",
    ],
    Types: [
      "String",
      "Integer",
      "Int64",
      "Real",
      "Date",
      "Enum",
      "Guid",
      "Container",
      "UtcDateTime",
      "TimeOfDay",
      "AnyType",
      "Boolean",
    ],
  },
  templates: [
    {
      name: "class",
      caption: "class - New Class",
      content: "class ${1:MyClass}\n{\n\t${2:// class members}\n}",
      meta: "snippet",
    },
    {
      name: "listtemp",
      caption: "listtemp - New List",
      content: "List ${1:list_name} = new List(Types::${2:String});",
      meta: "snippet",
    },
    {
      name: "listitertemp",
      caption: "listitertemp - New ListIterator",
      content:
        "ListIterator ${1:listI_name} = new ListIterator(${2:list_name});",
      meta: "snippet",
    },
    {
      name: "listenumtemp",
      caption: "listenumtemp - New ListEnumerator",
      content:
        "ListEnumerator ${1:listE_name} = ${2:list_name}.getEnumerator();",
      meta: "snippet",
    },
    {
      name: "maptemp",
      caption: "maptemp - New Map",
      content:
        "Map ${1:map_name} = new Map(Types::${2:Int}, Types::${3:String});",
      meta: "snippet",
    },
    {
      name: "mapenumtemp",
      caption: "mapenumtemp - New MapEnumerator",
      content: "MapEnumerator ${1:mapE_name} = ${2:map_name}.getEnumerator();",
      meta: "snippet",
    },
    {
      name: "settemp",
      caption: "settemp - New Set",
      content: "Set ${1:set_name} = new Set(Types::${1:Int});",
      meta: "snippet",
    },
    {
      name: "trycatch",
      caption: "trycatch - Try/Catch block",
      content:
        "try\n{\n\t${1:// Code}\n}\ncatch (Exception::${2:Error})\n{\n\t${3:// Error handling}\n\tthrow Exception::Error;\n}",
      meta: "snippet",
    },
    {
      name: "main",
      caption: "main - Main method",
      content: "static void main(Args _args)\n{\n\t${1:// Code}\n}",
      meta: "snippet",
    },
    {
      name: "if",
      caption: "if - If statement",
      content: "if (${1:condition})\n{\n\t${2:// code}\n}",
      meta: "snippet",
    },
    {
      name: "ifelse",
      caption: "ifelse - If/Else statement",
      content:
        "if (${1:condition})\n{\n\t${2:// code}\n}\nelse\n{\n\t${3:// code}\n}",
      meta: "snippet",
    },
    {
      name: "while",
      caption: "while - While loop",
      content: "while (${1:condition})\n{\n\t${2:// code}\n}",
      meta: "snippet",
    },
    {
      name: "whileselect",
      caption: "whileselect - While Select loop",
      content:
        "${1:MyTableBuffer} ${2:myTableBuffer};\n\nwhile select ${3:*} from ${2:myTableBuffer}\n\twhere ${4:condition}\n{\n\t${5:// Process record}\n}",
      meta: "snippet",
    },
    {
      name: "select",
      caption: "select - Basic select statement",
      content: "select ${1:*} from ${2:TableName}\n\twhere ${3:condition};",
      meta: "snippet",
    },
    {
      name: "forr",
      caption: "forr - For loop",
      content:
        "for (${1:int i = 0}; ${2:i < count}; ${3:i++})\n{\n\t${4:// code}\n}",
      meta: "snippet",
    },
    {
      name: "switch",
      caption: "switch - Switch statement",
      content:
        "switch (${1:expression})\n{\n\tcase ${2:value1}:\n\t\t${3:// code}\n\t\tbreak;\n\tcase ${4:value2}:\n\t\t${5:// code}\n\t\tbreak;\n\tdefault:\n\t\t${6:// code}\n\t\tbreak;\n}",
      meta: "snippet",
    },
    {
      name: "method",
      caption: "method - New method",
      content:
        "${1:public} ${2:void} ${3:methodName}(${4:Args _args})\n{\n\t${5:// code}\n}",
      meta: "snippet",
    },
    {
      name: "transaction",
      caption: "transaction - Transaction block",
      content:
        "ttsBegin;\ntry\n{\n\t${1:// database operations}\n\tttsCommit;\n}\ncatch\n{\n\t// Handle error, ttsAbort is usually automatic on exception\n\tinfo('Transaction failed.');\n\tttsAbort; // Optional explicit abort if needed\n}",
      meta: "snippet",
    },
    {
      name: "info",
      caption: "info - Info message",
      content: 'info(strFmt("${1:Your message here %1}", ${2:variable}));',
      meta: "snippet",
    },
  ],
};

// --- SYNTAX HIGHLIGHTING STYLES SETUP ---
function setupSyntaxHighlightingStyles() {
  // Only add styles if they don't exist
  if (!document.getElementById("xppSyntaxHighlightingStyles")) {
    const style = document.createElement("style");
    style.id = "xppSyntaxHighlightingStyles";
    // These styles are intended for use with an overlay div, not the textarea itself.
    style.textContent = `
        .xpp-keyword { color: #0000FF; font-weight: bold; }
        .xpp-type { color: #008080; }
        .xpp-string { color: #A31515; }
        .xpp-comment { color: #008000; }
        .xpp-number { color: #098658; }
        .xpp-operator { color: #777777; }
        .xpp-function { color: #795E26; }
        .xpp-directive { color: #800080; font-weight: bold; }
        .xpp-placeholder { background-color: #e0e0e0; border: 1px dashed #c0c0c0; }
      `;
    document.head.appendChild(style);
  }
}

// --- INTELLISENSE STYLES SETUP ---
function setupIntellisenseStyles() {
  if (!document.getElementById("xppAutocompleteStyles")) {
    const style = document.createElement("style");
    style.id = "xppAutocompleteStyles";
    style.textContent = `
        #suggestions {
          position: absolute;
          list-style-type: none;
          margin: 0;
          padding: 5px 0;
          background-color: #fff;
          border: 1px solid #ccc;
          max-height: 250px; /* Adjust as needed */
          overflow-y: auto;
          z-index: 1000;
          border-radius: 4px;
          box-shadow: 0 4px 8px rgba(0,0,0,0.15);
          display: none; /* Initially hidden */
          width: auto;
          min-width: 250px; /* Adjust as needed */
          font-family: 'Consolas', 'Courier New', monospace;
          font-size: 14px;
          line-height: 1.4;
        }

        #suggestions li {
          padding: 6px 12px;
          cursor: pointer;
          white-space: nowrap;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #eee;
        }
         #suggestions li:last-child {
            border-bottom: none;
         }

        #suggestions li:hover {
          background-color: #f0f8ff; /* Light blue hover */
        }

        #suggestions li.selected {
          background-color: #007bff;
          color: white;
        }

        #suggestions .suggestion-caption {
          /* Style for the main suggestion text if needed */
        }

        #suggestions .meta {
          margin-left: 15px;
          opacity: 0.7;
          font-size: 0.9em;
          color: #555;
          font-style: italic;
        }

        #suggestions li.selected .meta {
          color: #eee;
          opacity: 0.9;
        }

        /* Category-specific colors for the caption */
        #suggestions .category-keyword { color: #0000FF; font-weight: bold; }
        #suggestions .category-type { color: #008080; }
        #suggestions .category-function { color: #795E26; }
        #suggestions .category-operator { color: #666666; }
        #suggestions .category-template { color: #800080; } /* Purple for snippets/templates */
        #suggestions .category-variable { color: #001080; } /* Example if you add variable suggestions */
        #suggestions .category-system { color: #4b0082; } /* Example for system objects */

        #suggestions li.selected .category-keyword,
        #suggestions li.selected .category-type,
        #suggestions li.selected .category-function,
        #suggestions li.selected .category-operator,
        #suggestions li.selected .category-template,
        #suggestions li.selected .category-variable,
        #suggestions li.selected .category-system {
          color: white; /* Ensure text is white on blue background */
        }
      `;
    document.head.appendChild(style);
  }
}

// --- VARIABLES ---
let selectedSuggestionIndex = -1;
let currentSuggestions = [];
let activeSnippet = null; // { placeholders: [{index, text, start, end}, ...], originalText: "...", currentPlaceholderIndex: 0 }
let variableTypes = {}; // Simple map to store guessed variable types {varName: typeName}

// --- INITIALIZATION ---
function initializeEditor() {
  if (!textarea || !suggestionsBox) {
    console.error(
      "Textarea (#xppCode) or suggestions box (#suggestions) not found. IntelliSense disabled."
    );
    return;
  }

  // Setup styles
  setupIntellisenseStyles();
  setupSyntaxHighlightingStyles(); // Setup styles even if highlighting isn't visually applied to textarea

  // Event Listeners
  textarea.addEventListener("input", handleTyping);
  textarea.addEventListener("keydown", handleKeyDown);
  textarea.addEventListener("click", () => {
    // Close suggestions on click inside textarea if needed
    // Optionally close suggestions, or let typing handle it
    // hideSuggestions();
  });

  // Handle clicks outside the suggestions box/textarea to close suggestions
  document.addEventListener("click", function (e) {
    if (
      e.target !== suggestionsBox &&
      !suggestionsBox.contains(e.target) &&
      e.target !== textarea
    ) {
      hideSuggestions();
    }
  });

  console.log("X++ IntelliSense Initialized.");
}

// --- HIDE SUGGESTIONS ---
function hideSuggestions() {
  if (suggestionsBox) {
    suggestionsBox.style.display = "none";
  }
  selectedSuggestionIndex = -1;
  currentSuggestions = [];
}

// --- PARSE CODE FOR VARIABLES (Simple Heuristic) ---
function updateVariableTypes(code) {
  variableTypes = {}; // Reset
  const lines = code.split("\n");
  const declarationRegex =
    /^\s*(?:List|Map|Set|int|str|real|boolean|date|utcdatetime|container|guid|int64|anytype)\s+(\w+)\s*(?:=|;|\()/i;
  // Basic table buffer declaration regex (can be improved)
  const tableBufferRegex = /^\s*(\w+)\s+(\w+)\s*(?:;|where|order|group|,)/i;

  lines.forEach((line) => {
    let match = line.match(declarationRegex);
    if (match) {
      const type = match[0].match(
        /^(?:List|Map|Set|int|str|real|boolean|date|utcdatetime|container|guid|int64|anytype)/i
      )[0];
      const varName = match[1];
      if (type && varName) {
        variableTypes[varName] = type;
      }
    } else {
      match = line.match(tableBufferRegex);
      // Very simple check: if first word looks like a Table name (PascalCase) and second like variable (camelCase/lowercase)
      if (
        match &&
        match[1] &&
        match[2] &&
        /^[A-Z]/.test(match[1]) &&
        /^[a-z_]/.test(match[2])
      ) {
        // Assume it's a table buffer -> suggest Record methods
        variableTypes[match[2]] = "Record";
      }
    }
  });
  // console.log("Detected Variables:", variableTypes); // For debugging
}

// --- HANDLE TYPING ---
function handleTyping(event) {
  const cursorPos = textarea.selectionStart;
  const text = textarea.value;

  // Update variable types based on current code (can be optimized for performance)
  updateVariableTypes(text);

  // If we are inside an active snippet, don't trigger general suggestions
  if (activeSnippet) {
    // We might need to update placeholder positions if text is inserted/deleted *within* them
    // This requires more complex tracking, omitted for simplicity here.
    // Typing normally cancels the snippet mode for now.
    // Consider uncommenting if snippet mode should persist through typing:
    // return;
  }

  const textBeforeCursor = text.substring(0, cursorPos);

  // Context detection
  showContextAwareSuggestions(textBeforeCursor, false); // false = don't force display

  // --- TODO: Trigger syntax highlighting update here if using overlay ---
  // if (highlightingOverlay) {
  //   highlightingOverlay.innerHTML = applySyntaxHighlighting(text);
  //   syncScroll();
  // }
}

// --- HANDLE KEYDOWN ---
function handleKeyDown(event) {
  // --- Snippet Navigation ---
  if (activeSnippet) {
    if (event.key === "Tab") {
      event.preventDefault();
      navigateSnippetPlaceholders(event.shiftKey ? -1 : 1);
      return; // Don't process further for Tab within snippet
    } else if (event.key === "Escape") {
      // Exit snippet mode on Escape
      event.preventDefault();
      // Place cursor at the end of the last placeholder modification
      if (
        activeSnippet.currentPlaceholderIndex >= 0 &&
        activeSnippet.currentPlaceholderIndex <
          activeSnippet.placeholders.length
      ) {
        const lastPlaceholder =
          activeSnippet.placeholders[activeSnippet.currentPlaceholderIndex];
        // We need the *current* end position, which might have changed.
        // Simple approach: just use the calculated end. More robust needs tracking.
        textarea.selectionStart = textarea.selectionEnd = lastPlaceholder.end;
      }
      activeSnippet = null;
      hideSuggestions(); // Hide any suggestions that might pop up
      console.log("Exited snippet mode.");
      return;
    }
    // Allow normal typing within a placeholder, but potentially exit snippet mode on other keys if desired
    // else if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Backspace", "Delete", "Shift"].includes(event.key) && !event.ctrlKey && !event.altKey && !event.metaKey) {
    //    activeSnippet = null; // Exit on other character input? Might be too aggressive.
    // }
  }

  // --- Suggestion Box Navigation ---
  if (suggestionsBox && suggestionsBox.style.display === "block") {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        navigateSuggestion(1);
        break;
      case "ArrowUp":
        event.preventDefault();
        navigateSuggestion(-1);
        break;
      case "Enter":
        event.preventDefault();
        if (selectedSuggestionIndex >= 0) {
          applySelectedSuggestion();
        } else {
          // Allow normal Enter if no suggestion is selected
          // Or potentially insert the best match? For now, do nothing special.
          hideSuggestions();
        }
        break;
      case "Tab":
        // Use Tab to complete *only if* a suggestion is highlighted
        if (selectedSuggestionIndex >= 0) {
          event.preventDefault();
          applySelectedSuggestion();
        } else {
          // If no suggestion selected, allow normal tab behavior (indentation)
          // Or potentially complete with the top suggestion if available?
          if (currentSuggestions.length > 0) {
            event.preventDefault();
            selectedSuggestionIndex = 0; // Select the first one
            applySelectedSuggestion();
          } else {
            hideSuggestions(); // Ensure suggestions are hidden if Tab is pressed with none available
          }
        }
        break;
      case "Escape":
        event.preventDefault();
        hideSuggestions();
        break;
      default:
        // Allow other keys to pass through for typing
        break;
    }
  } else {
    // --- Trigger Suggestions Manually ---
    if (event.ctrlKey && event.key === " ") {
      event.preventDefault();
      forceSuggestions();
    }
    // Allow normal keydown events if suggestions are hidden and not in snippet mode
  }
}

// --- FORCE SUGGESTIONS ---
function forceSuggestions() {
  const cursorPos = textarea.selectionStart;
  const text = textarea.value;
  const textBeforeCursor = text.substring(0, cursorPos);

  // Always try to show suggestions based on context when forced
  showContextAwareSuggestions(textBeforeCursor, true); // true = force display
}

// --- APPLY SELECTED SUGGESTION ---
function applySelectedSuggestion() {
  if (
    selectedSuggestionIndex < 0 ||
    selectedSuggestionIndex >= currentSuggestions.length
  ) {
    return;
  }
  const suggestion = currentSuggestions[selectedSuggestionIndex];
  if (suggestion.snippet) {
    insertSnippet(suggestion); // Pass the whole suggestion object
  } else {
    insertSuggestion(suggestion.value);
  }
  hideSuggestions();
}

// --- CONTEXT-AWARE SUGGESTIONS ---
function showContextAwareSuggestions(textBeforeCursor, force = false) {
  // 1. Check for dot completion (methods/properties)
  const dotMatch = textBeforeCursor.match(/(\w+)\.$/);
  if (dotMatch) {
    const variableName = dotMatch[1];
    showDotCompletionSuggestions(variableName);
    return; // Prioritize dot completion
  }

  // 2. Check for Types:: completion
  if (textBeforeCursor.endsWith("Types::")) {
    showTypesEnumCompletions();
    return; // Prioritize Types:: completion
  }

  // 3. Regular word completion (keywords, types, functions, snippets, variables)
  const wordMatch = textBeforeCursor.match(/(\w+)$/);
  const currentWord = wordMatch ? wordMatch[1] : "";

  // Only show suggestions if there's a word being typed or if forced (Ctrl+Space)
  if (currentWord.length > 0 || force) {
    showWordCompletionSuggestions(currentWord, force);
    return;
  }

  // No relevant context found, hide suggestions
  hideSuggestions();
}

// --- DOT COMPLETION ---
function showDotCompletionSuggestions(variableName) {
  let suggestions = [];
  let guessedType = variableTypes[variableName] || null; // Get type from parsed variables

  // Simple heuristic if type wasn't parsed (less reliable)
  if (!guessedType) {
    if (variableName.toLowerCase().endsWith("list")) guessedType = "List";
    else if (variableName.toLowerCase().endsWith("map")) guessedType = "Map";
    else if (variableName.toLowerCase().endsWith("set")) guessedType = "Set";
    else if (variableName.toLowerCase().endsWith("iterator"))
      guessedType = "ListIterator";
    else if (variableName.toLowerCase().endsWith("enumerator"))
      guessedType = "ListEnumerator"; // Or MapEnumerator? Needs context.
    else if (variableName === "Types") guessedType = "Types";
    else if (/^[a-z]/.test(variableName)) guessedType = "Record"; // Assume lowercase/camelCase might be a table buffer
    // Add more heuristics if needed
  }

  // console.log(`Dot completion for '${variableName}', guessed type: ${guessedType}`);

  if (guessedType && xppData.collectionMethods[guessedType]) {
    suggestions = xppData.collectionMethods[guessedType].map((method) => ({
      caption: method.replace(/\(.*\)/, ""), // Show only method name in caption initially
      value: method, // The full value to insert might include ()
      meta: `method (${guessedType})`,
      category: "function", // Treat methods as functions for styling
    }));
  } else if (guessedType === "Record") {
    suggestions = xppData.collectionMethods["Record"].map((method) => ({
      caption: method.replace(/\(.*\)/, ""),
      value: method,
      meta: `method (Record)`,
      category: "function",
    }));
  }

  // Add field suggestions if it's potentially a table buffer (guessed as Record)
  if (guessedType === "Record") {
    // In a real scenario, you'd need metadata about table fields.
    // We'll add dummy field suggestions. Replace with actual field lookups.
    const dummyFields = [
      "accountNum",
      "custGroup",
      "recId",
      "tableId",
      "createdDateTime",
    ];
    dummyFields.forEach((field) => {
      suggestions.push({
        caption: field,
        value: field,
        meta: "field (Record)",
        category: "variable", // Style fields as variables
      });
    });
  }

  displaySuggestions(suggestions, ""); // Pass empty currentWord for dot completion
}

// --- TYPES ENUM COMPLETION ---
function showTypesEnumCompletions() {
  const suggestions = xppData.collectionMethods["Types"].map((type) => ({
    caption: type,
    value: type,
    meta: "DataType Enum",
    category: "type",
  }));

  displaySuggestions(suggestions, "Types::");
}

// --- WORD COMPLETION ---
function showWordCompletionSuggestions(currentWord, force = false) {
  let suggestions = [];
  const lowerCurrentWord = currentWord.toLowerCase();

  // Helper function to add suggestions
  const addSuggestions = (
    sourceArray,
    meta,
    category,
    valueTransform = (v) => v
  ) => {
    sourceArray.forEach((item) => {
      const itemLower = item.toLowerCase
        ? item.toLowerCase()
        : item.name.toLowerCase();
      if (itemLower.startsWith(lowerCurrentWord)) {
        suggestions.push({
          caption: typeof item === "object" ? item.caption : item, // Use caption for templates
          value: typeof item === "object" ? item.name : valueTransform(item), // Use name for template value
          meta: typeof item === "object" ? item.meta : meta,
          snippet: typeof item === "object" ? item.content : null, // Add snippet content if it's a template object
          category: category,
        });
      }
    });
  };

  // Add suggestions from various categories
  addSuggestions(xppData.keywords, "keyword", "keyword");
  addSuggestions(xppData.dataTypes, "type", "type");
  addSuggestions(xppData.functions, "function", "function", (fn) =>
    fn.includes("()") ? fn : fn + "()"
  ); // Add () if missing
  addSuggestions(xppData.systemObjects, "system object", "system");
  addSuggestions(xppData.templates, null, "template"); // Meta and category are in the template object
  addSuggestions(xppData.operators, "operator", "operator");
  addSuggestions(xppData.accessModifiers, "modifier", "keyword");
  addSuggestions(xppData.literals, "literal", "keyword");
  addSuggestions(xppData.precompilerDirectives, "directive", "directive");

  // Add detected variables
  Object.keys(variableTypes).forEach((varName) => {
    if (varName.toLowerCase().startsWith(lowerCurrentWord)) {
      suggestions.push({
        caption: varName,
        value: varName,
        meta: `variable (${variableTypes[varName] || "unknown"})`,
        category: "variable",
      });
    }
  });

  // Sort suggestions (e.g., keywords first, then types, etc.) - Optional
  suggestions.sort((a, b) => {
    const categoryOrder = {
      keyword: 1,
      template: 2,
      function: 3,
      variable: 4,
      type: 5,
      system: 6,
      operator: 7,
      directive: 8,
      modifier: 9,
      literal: 10,
    };
    const orderA = categoryOrder[a.category] || 99;
    const orderB = categoryOrder[b.category] || 99;
    if (orderA !== orderB) return orderA - orderB;
    return a.caption.localeCompare(b.caption); // Alphabetical within category
  });

  // Only display if there are matches or if forced (Ctrl+Space) and word is empty
  if (suggestions.length > 0 || (force && currentWord === "")) {
    displaySuggestions(suggestions, currentWord);
  } else {
    hideSuggestions();
  }
}

// --- DISPLAY SUGGESTIONS ---
function displaySuggestions(suggestions, currentInput) {
  if (!suggestionsBox || !textarea) return;

  suggestionsBox.innerHTML = ""; // Clear previous suggestions

  if (suggestions.length === 0) {
    hideSuggestions();
    return;
  }

  currentSuggestions = suggestions; // Store current suggestions
  selectedSuggestionIndex = -1; // Reset selection

  // Create list items
  suggestions.forEach((suggestion, index) => {
    const li = document.createElement("li");

    // Main suggestion text span
    const captionSpan = document.createElement("span");
    captionSpan.textContent = suggestion.caption || suggestion.value; // Fallback to value if caption missing
    captionSpan.className = "suggestion-caption"; // Add class for potential styling
    if (suggestion.category) {
      captionSpan.classList.add(`category-${suggestion.category}`);
    }
    li.appendChild(captionSpan);

    // Metadata span (aligned to the right)
    const metaSpan = document.createElement("span");
    metaSpan.textContent = suggestion.meta || ""; // Display meta info
    metaSpan.className = "meta";
    li.appendChild(metaSpan);

    // Event listeners for mouse interaction
    li.onclick = () => {
      selectedSuggestionIndex = index; // Set index before applying
      applySelectedSuggestion();
    };

    li.onmouseover = () => {
      // Remove selected class from previously selected item
      const currentSelected = suggestionsBox.querySelector(".selected");
      if (currentSelected) {
        currentSelected.classList.remove("selected");
      }
      // Add selected class to hovered item
      li.classList.add("selected");
      selectedSuggestionIndex = index; // Update index on hover
    };

    suggestionsBox.appendChild(li);
  });

  // --- Position the suggestion box ---
  positionSuggestionsBox(currentInput);

  suggestionsBox.style.display = "block"; // Show the box
}

// --- POSITION SUGGESTIONS BOX ---
function positionSuggestionsBox(currentInput) {
  if (!textarea || !suggestionsBox) return;

  const Properties = [
    "direction", // RTL support
    "boxSizing",
    "width", //on Chrome and IE, exclude the scrollbar, so the mirror div wraps exactly as the textarea does
    "height",
    "overflowX",
    "overflowY", // copy the scrollbar for text area styling

    "borderTopWidth",
    "borderRightWidth",
    "borderBottomWidth",
    "borderLeftWidth",
    "borderStyle",

    "paddingTop",
    "paddingRight",
    "paddingBottom",
    "paddingLeft",

    // https://developer.mozilla.org/en-US/docs/Web/CSS/font
    "fontStyle",
    "fontVariant",
    "fontWeight",
    "fontStretch",
    "fontSize",
    "fontSizeAdjust",
    "lineHeight",
    "fontFamily",

    "textAlign",
    "textTransform",
    "textIndent",
    "textDecoration", // might not make a difference, but better be safe

    "letterSpacing",
    "wordSpacing",

    "tabSize",
    "MozTabSize", //firefox
  ];

  const isFirefox = window.mozInnerScreenX != null;

  // Get cursor position
  const startPos = textarea.selectionStart;
  const endPos = textarea.selectionEnd;

  // Create a mirror div
  const div = document.createElement("div");
  div.id = "input-mirror-div";
  document.body.appendChild(div);

  const style = div.style;
  const computed = getComputedStyle(textarea);

  // Transfer styles
  Properties.forEach((prop) => {
    style[prop] = computed[prop];
  });

  if (isFirefox) {
    // Firefox adds weird non-standard characters for line breaks
    style.width = parseInt(computed.width) - 2 + "px";
    // Firefox lies about the overflow property for textareas: https://bugzilla.mozilla.org/show_bug.cgi?id=984275
    if (textarea.scrollHeight > parseInt(computed.height))
      style.overflowY = "scroll";
  } else {
    style.overflow = "hidden"; // for Chrome to not render a scrollbar; IE keeps overflowY = 'scroll'
  }

  div.textContent = textarea.value.substring(0, startPos);
  // The second special handling for input type="text" vs textarea: spaces need to be replaced with non-breaking spaces - http://stackoverflow.com/a/13402035/54066
  // div.innerHTML = div.innerHTML.replace(/\n$/g, '<br/>&nbsp;').replace(/\n/g, '<br/>').replace(/ {2,}/g, match => '&nbsp;'.repeat(match.length));
  div.innerHTML = div.innerHTML.replace(/\n/g, "<br/>"); // Simpler version for textarea

  // Create a caret element
  const caret = document.createElement("span");
  caret.textContent = "|"; // Placeholder for caret position
  div.appendChild(caret);

  // Calculate position
  const rect = textarea.getBoundingClientRect();
  const caretRect = caret.getBoundingClientRect();
  const divRect = div.getBoundingClientRect();

  // Clean up mirror div
  document.body.removeChild(div);

  // Position the suggestions box
  const top =
    rect.top +
    (caretRect.top - divRect.top) +
    parseInt(computed.lineHeight) +
    window.scrollY;
  const left = rect.left + (caretRect.left - divRect.left) + window.scrollX;

  suggestionsBox.style.top = `${top}px`;
  suggestionsBox.style.left = `${left}px`;

  // Ensure suggestions box stays within viewport boundaries
  const suggRect = suggestionsBox.getBoundingClientRect();
  if (suggRect.right > window.innerWidth) {
    suggestionsBox.style.left = `${window.innerWidth - suggRect.width - 10}px`;
  }
  if (suggRect.bottom > window.innerHeight) {
    // Position above the cursor line if it overflows below
    const topAbove =
      rect.top +
      (caretRect.top - divRect.top) -
      suggRect.height +
      window.scrollY;
    suggestionsBox.style.top = `${topAbove}px`;
  }
  if (parseInt(suggestionsBox.style.left) < 0) {
    suggestionsBox.style.left = "10px";
  }
  if (parseInt(suggestionsBox.style.top) < 0) {
    suggestionsBox.style.top = "10px";
  }
}

// --- KEYBOARD NAVIGATION FOR SUGGESTIONS ---
function navigateSuggestion(direction) {
  const suggestionsItems = suggestionsBox.querySelectorAll("li");
  if (suggestionsItems.length === 0) return;

  let currentSelected = suggestionsBox.querySelector(".selected");
  if (currentSelected) {
    currentSelected.classList.remove("selected");
  }

  selectedSuggestionIndex += direction;

  // Cycle through suggestions
  if (selectedSuggestionIndex < 0) {
    selectedSuggestionIndex = suggestionsItems.length - 1;
  } else if (selectedSuggestionIndex >= suggestionsItems.length) {
    selectedSuggestionIndex = 0;
  }

  // Apply new selection
  const newSelected = suggestionsItems[selectedSuggestionIndex];
  if (newSelected) {
    newSelected.classList.add("selected");
    // Ensure the selected item is visible within the suggestions box
    newSelected.scrollIntoView({ block: "nearest" });
  }
}

// --- INSERT SUGGESTION (Non-Snippet) ---
function insertSuggestion(textToInsert) {
  const currentPos = textarea.selectionStart;
  const currentValue = textarea.value;

  // Determine the start of the word/context being replaced
  const textBefore = currentValue.substring(0, currentPos);
  let startIndex = currentPos;

  // Case 1: Dot completion - insert directly after the dot
  if (textBefore.endsWith(".")) {
    startIndex = currentPos;
  }
  // Case 2: Types:: completion - replace Types::
  else if (textBefore.endsWith("Types::")) {
    startIndex = currentPos - "Types::".length;
  }
  // Case 3: Word completion - find the start of the current word
  else {
    const match = textBefore.match(/[\w.:]+$/); // Match word characters, dots, or colons
    if (match) {
      startIndex = currentPos - match[0].length;
    } else {
      startIndex = currentPos; // Insert at cursor if no word found
    }
  }

  // Construct the new value
  const newValue =
    currentValue.substring(0, startIndex) +
    textToInsert +
    currentValue.substring(currentPos);

  // Update textarea value
  textarea.value = newValue;

  // Set cursor position after the inserted text
  const newCursorPos = startIndex + textToInsert.length;
  textarea.selectionStart = textarea.selectionEnd = newCursorPos;

  // Trigger input event for potential listeners and re-parsing
  textarea.dispatchEvent(new Event("input", { bubbles: true }));

  // Focus back on textarea
  textarea.focus();
  hideSuggestions();
}

// --- INSERT SNIPPET ---
function insertSnippet(suggestion) {
  const snippetTemplate = suggestion.snippet;
  const currentPos = textarea.selectionStart;
  const currentValue = textarea.value;

  // Determine the start of the word/trigger being replaced
  const textBefore = currentValue.substring(0, currentPos);
  let startIndex = currentPos;
  const match = textBefore.match(/\b(\w+)$/); // Match the trigger word
  if (match) {
    startIndex = currentPos - match[0].length;
  } else {
    startIndex = currentPos; // Insert at cursor if no word found
  }

  // --- Placeholder Processing ---
  const placeholderRegex = /\$\{(\d+):?([^}]*)\}/g; // Regex for ${1:placeholder} or ${1}
  let processedSnippet = snippetTemplate;
  let snippetPlaceholders = [];
  let placeholderMatch;
  let highestIndex = 0;

  // 1. Find all unique placeholders and their default text
  const placeholderMap = new Map(); // Use Map to handle potentially duplicated indices easily
  while ((placeholderMatch = placeholderRegex.exec(snippetTemplate)) !== null) {
    const index = parseInt(placeholderMatch[1]);
    const defaultValue = placeholderMatch[2] || ""; // Handle ${1} without default text
    if (!placeholderMap.has(index)) {
      placeholderMap.set(index, defaultValue);
    }
    if (index > highestIndex) {
      highestIndex = index;
    }
  }
  // Add the final cursor position ($0 or implicit)
  if (!placeholderMap.has(0)) {
    placeholderMap.set(0, ""); // Represents the final cursor position after tabbing through all
  }

  // 2. Sort placeholders by index (Map iteration order is insertion order, need sorting)
  const sortedIndices = Array.from(placeholderMap.keys()).sort((a, b) => a - b);

  // 3. Replace placeholders in the template *string* and calculate positions
  let currentOffset = 0; // Tracks changes in string length due to replacements
  sortedIndices.forEach((index) => {
    if (index === 0) return; // Handle $0 later

    const defaultValue = placeholderMap.get(index);
    const regex = new RegExp(`\\$\\{${index}:?([^}]*)\\}`, "g"); // Match specific index
    let match;

    // Replace all occurrences of this placeholder index
    while ((match = regex.exec(processedSnippet)) !== null) {
      // Recalculate match index considering previous replacements' offset
      const actualMatchStart = match.index - currentOffset;

      // Store placeholder info *relative to the start of the inserted snippet*
      snippetPlaceholders.push({
        index: index,
        text: defaultValue,
        // Positions are relative to the beginning of the processed snippet string
        start: actualMatchStart,
        end: actualMatchStart + defaultValue.length,
      });
      // Replace in the string
      processedSnippet =
        processedSnippet.substring(0, match.index) +
        defaultValue +
        processedSnippet.substring(match.index + match[0].length);
      // Update offset for subsequent index calculations
      currentOffset += match[0].length - defaultValue.length;
    }
  });

  // Filter unique placeholders by index (important if template had e.g., ${1:x}...${1:y})
  const uniquePlaceholders = [];
  const seenIndices = new Set();
  snippetPlaceholders.forEach((p) => {
    if (!seenIndices.has(p.index)) {
      uniquePlaceholders.push(p);
      seenIndices.add(p.index);
    }
  });
  uniquePlaceholders.sort((a, b) => a.start - b.start); // Sort by appearance order

  // --- Final Insertion ---
  const textToInsert = processedSnippet;
  const newValue =
    currentValue.substring(0, startIndex) +
    textToInsert +
    currentValue.substring(currentPos);

  textarea.value = newValue;

  // --- Activate Snippet Mode ---
  // Adjust placeholder positions to be absolute within the textarea
  uniquePlaceholders.forEach((p) => {
    p.start += startIndex;
    p.end += startIndex;
  });

  activeSnippet = {
    placeholders: uniquePlaceholders,
    // originalText: snippetTemplate, // Store original if needed
    finalCursorPos: startIndex + textToInsert.length, // Default final pos
    currentPlaceholderIndex: -1, // Start before the first placeholder
  };

  // Add the $0 position if it exists
  const zeroPlaceholder = placeholderMap.has(0);
  if (zeroPlaceholder) {
    // Find where $0 was in the original template to calculate its final position
    const zeroRegex = /\$\{0\}/;
    const zeroMatch = snippetTemplate.match(zeroRegex);
    if (zeroMatch) {
      // Complex calculation needed here based on replacements before $0...
      // Simpler: Assume $0 means end of snippet for now
      activeSnippet.finalCursorPos = startIndex + processedSnippet.length; // Position after all replacements
    }
    // Add a placeholder entry for $0 if needed for navigation logic
    // activeSnippet.placeholders.push({ index: 0, start: activeSnippet.finalCursorPos, end: activeSnippet.finalCursorPos });
  }

  // Move to the first placeholder
  navigateSnippetPlaceholders(1); // Move to the first one

  // Trigger input event
  textarea.dispatchEvent(new Event("input", { bubbles: true }));

  // Focus back on textarea
  textarea.focus();
  hideSuggestions(); // Hide suggestions after inserting snippet
  console.log("Entered snippet mode.");
}

// --- NAVIGATE SNIPPET PLACEHOLDERS ---
function navigateSnippetPlaceholders(direction) {
  if (!activeSnippet || activeSnippet.placeholders.length === 0) {
    activeSnippet = null; // No placeholders, exit mode
    return;
  }

  const currentLength = activeSnippet.placeholders.length;
  let nextIndex = activeSnippet.currentPlaceholderIndex + direction;

  // Handle bounds
  if (nextIndex >= currentLength) {
    // Finished tabbing forward, move to final cursor position and exit snippet mode
    textarea.selectionStart = textarea.selectionEnd =
      activeSnippet.finalCursorPos;
    activeSnippet = null;
    console.log("Exited snippet mode (finished).");
    return;
  } else if (nextIndex < 0) {
    // Tabbing backward from the first placeholder - potentially cycle or exit
    // For now, let's cycle to the last placeholder
    nextIndex = currentLength - 1;
    // Alternative: Exit snippet mode
    // textarea.selectionStart = textarea.selectionEnd = activeSnippet.placeholders[0].start; // Go to start of first placeholder
    // activeSnippet = null;
    // console.log("Exited snippet mode (Shift+Tab from first).");
    // return;
  }

  // --- Update Placeholder Text Before Moving ---
  // This is complex: requires tracking changes within the *current* placeholder
  // to update the positions of *subsequent* placeholders.
  // Simple approach: Assume lengths don't change drastically or recalculate all positions on Tab.
  // For now, we'll just move selection without adjusting subsequent positions based on edits.

  // --- Move Selection ---
  activeSnippet.currentPlaceholderIndex = nextIndex;
  const nextPlaceholder = activeSnippet.placeholders[nextIndex];

  // Need to ensure start/end are still valid if user typed. Recalculation would be needed.
  // Using stored positions for now:
  textarea.selectionStart = nextPlaceholder.start;
  textarea.selectionEnd = nextPlaceholder.end;

  textarea.focus(); // Ensure focus
}

// --- SYNTAX HIGHLIGHTING (Logic Only) ---
// IMPORTANT: This function generates HTML, but it won't render visually inside a standard <textarea>.
// It's intended for use with an overlay <div> or a contenteditable element.
function applySyntaxHighlighting(code) {
  // Escape HTML special characters initially to prevent XSS and rendering issues
  let escapedCode = code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Define patterns with capture groups. Order matters! Comments/strings first.
  const patterns = [
    { regex: /(\/\/.*$)/gm, className: "xpp-comment" }, // Single line comments
    { regex: /(\/\*[\s\S]*?\*\/)/gm, className: "xpp-comment" }, // Multi-line comments
    { regex: /("([^"\\]|\\.)*")/g, className: "xpp-string" }, // Double-quoted strings
    { regex: /('([^'\\]|\\.)*')/g, className: "xpp-string" }, // Single-quoted strings (char literals)
    {
      regex: new RegExp(
        `\\b(${xppData.precompilerDirectives.join("|").replace(/#/g, "#")})\\b`,
        "g"
      ),
      className: "xpp-directive",
    }, // Directives
    {
      regex: new RegExp(`\\b(${xppData.keywords.join("|")})\\b`, "g"),
      className: "xpp-keyword",
    }, // Keywords
    {
      regex: new RegExp(
        `\\b(${xppData.dataTypes.join("|")}|${xppData.systemObjects.join(
          "|"
        )})\\b`,
        "g"
      ),
      className: "xpp-type",
    }, // Types and System Objects
    { regex: /\b([A-Z]\w*)\s*\(/g, className: "xpp-function" }, // Functions (PascalCase convention)
    { regex: /\b([a-z]\w*)\s*\(/g, className: "xpp-function" }, // Functions (camelCase convention) - adjust if needed
    { regex: /\b(\d+(\.\d+)?(e[+-]?\d+)?)\b/gi, className: "xpp-number" }, // Numbers (int, real, scientific)
    // Operators need careful handling to avoid matching parts of words or comments.
    // Using explicit list and ensuring surrounding non-word characters or boundaries.
    // This simple regex might still have issues.
    {
      regex: new RegExp(
        `(${xppData.operators
          .map((op) => op.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
          .join("|")})`
      ),
      className: "xpp-operator",
    },
  ];

  // Apply highlighting using spans
  // This is a basic replacement strategy and can have issues with overlapping matches or context.
  // A proper tokenizer/parser is needed for perfect highlighting.
  patterns.forEach((p) => {
    escapedCode = escapedCode.replace(p.regex, (match) => {
      // Basic check: Avoid highlighting inside already formed spans (very crude)
      // This check is insufficient for nested structures.
      // A better way involves processing tokens and building the HTML structure.
      if (match.includes("<span")) return match; // Don't re-wrap
      return `<span class="${p.className}">${match}</span>`;
    });
  });

  // Add line breaks
  return escapedCode.replace(/\n/g, "<br/>");
}

// --- Initialize ---
document.addEventListener("DOMContentLoaded", initializeEditor);
