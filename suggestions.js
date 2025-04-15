const textarea = document.getElementById("xppCode");
const suggestionsBox = document.getElementById("suggestions");

const keywords = [
  // Core X++ Keywords
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

  // Data Types
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

  // Literals
  "true",
  "false",
  "null",

  // Precompiler Directives
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

  // System Objects
  "Args",
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
  "Map",
  "Set",
  "List",
  "ListIterator",
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

  // Message & Logging
  "info",
  "warning",
  "error",
  "strFmt",
  "int2Str",
  "str2Int",
  "real2Str",
  "str2Real",
  "date2Str",
  "str2Date",
  "enum2Str",
  "str2Enum",
  "buf2Buf",
  "curUserId",
  "curExt",
  "today",
  "timeNow",

  // Container Operations
  "conPeek",
  "conPoke",
  "conLen",
  "conNull",

  // GUID Handling
  "newGuid",

  // Table & Field Information
  "classNum",
  "tableNum",
  "fieldName2Id",
  "fieldId2Name",

  // Configuration & Application
  "isConfigurationKeyEnabled",
  "appl",
  "companyInfo",

  // Financial & Transactions
  "ledgerDimension",
  "custVendACType",
  "voucherSeries",

  // Security & Access
  "securityKeyNum",
  "accessMode",
  "xUserInfo",
  "xSysAdmin",

  // Control Flow
  "exit",
  "pause",
  "suspend",
  "resume",

  // Database & Transactions
  "crossCompany",
  "forceLiterals",
  "ttsMonitor",
  "ttsError",

  // Object-Oriented Programming
  "runOn",
  "parmMethod",
  "eventSubscription",

  // Extended Classes & System Objects
  "SysDictTable",
  "SysDictField",
  "SysDictEnum",
  "SysDictClass",
  "SysDictMethod",
  "SysDictForm",
  "SysDictQuery",
  "SysDictView",
  "SysDictDataSource",
  "SysDictTabPage",
  "SysDictWorkflow",
  "SysDictSecurityKey",
  "SysDictAction",
  "SysDictMenu",
  "SysDictMenuItem",
  "SysDictMenuFunction",
  "SysDictReport",
  "SysDictControl",
  "SysDictDatasource",

  // Multi-threading & Batch Processing
  "SysOperationFramework",
  "BatchHeader",
  "BatchJob",
  "BatchTask",
  "BatchThread",
  "BatchInfo",
  "SysJobQueue",
  "SysJobBatch",
  "SysJobTask",
  "SysJobExecutor",

  // Financial Ledger & Transactions
  "LedgerBalance",
  "LedgerPeriod",
  "LedgerTransactionType",
  "LedgerClosingSheet",
  "SysDatabaseLog",
  "SysUserGroup",
  "SysWorkFlowExecution",
  "SysWorkFlowTable",
  "SysEventLog",
  "SysSecurityRole",
  "SysSecurityPolicy",
  "SysSecurityPrivilege",
  "SysSecurityAction",
  "SysSecurityHierarchy",
  "SysSecurityTable",
  "SysSecurityField",
  "CustBankAccount",
  "VendBankAccount",
  "BankStatement",
  "BankBalance",
  "TaxDeclaration",
  "TaxCalculation",
  "TaxInvoice",
  "TaxReporting",

  // Inventory Management
  "InventLedgerPosting",
  "InventMovement",
  "InventAvailability",
  "InventReservation",
  "InventBlocking",
  "InventPackingSlip",

  // Purchasing & Sales Processing
  "PurchAgreement",
  "PurchOrderProcessing",
  "PurchQuotation",
  "SalesQuotation",
  "SalesOrderProcessing",
  "SalesConfirmation",
  "SalesPackingSlip",
  "SalesInvoiceProcessing",

  // Trade & Supply Chain Agreements
  "TradeAgreement",
  "TradePriceDiscountAgreement",
  "TradeMarginCalculation",
  "TradeRebateProcessing",
  "TradeBonusProcessing",
  "TradeCommissionProcessing",
  "TradeAllowanceCalculation",
  "TradeBudgetAllocation",
  "TradeSpendManagement",
  "TradeVendorAgreement",
  "TradeCustomerAgreement",
  "TradeSupplyChainAgreement",

  // UI & Front-End Elements
  "SysControlType",
  "SysFormPart",
  "SysFormGroup",
  "SysButtonControl",
  "SysGridControl",
  "SysCheckBoxControl",
  "SysRadioButtonControl",
  "SysComboBoxControl",
  "SysMenuControl",
  "SysTreeControl",
  "SysImageControl",
  "SysDialogControl",
  "SysTabControl",
  "SysFrameControl",
  "SysHTMLControl",
  "SysTooltip",
  "SysStatusBar",
  "SysProgressIndicator",
  "SysContextMenu",
  "SysNavigationPane",
  "SysExplorerPane",
  "SysBreadcrumbBar",

  // And many more system classes and keywords!
];

// Initialize event listeners
document.addEventListener("DOMContentLoaded", function () {
  // Check if elements exist before adding event listeners
  if (textarea && suggestionsBox) {
    textarea.addEventListener("input", handleTyping);
    textarea.addEventListener("keydown", handleKeyboardNavigation);

    // Handle clicks outside the suggestions box to close it
    document.addEventListener("click", function (e) {
      if (
        e.target !== suggestionsBox &&
        !suggestionsBox.contains(e.target) &&
        e.target !== textarea
      ) {
        suggestionsBox.style.display = "none";
      }
    });
  } else {
    console.error("Required elements not found: 'xppCode' or 'suggestions'");
  }
});

// Variables to track suggestion navigation
let selectedSuggestionIndex = -1;
let currentSuggestions = [];

function handleTyping(event) {
  const cursorPos = textarea.selectionStart;
  const text = textarea.value;

  // Get current word
  const leftPart = text.slice(0, cursorPos);
  const currentWord = leftPart.split(/\s+/).pop();

  if (currentWord.length === 0) {
    suggestionsBox.style.display = "none";
    selectedSuggestionIndex = -1;
    currentSuggestions = [];
    return;
  }

  // Case-insensitive matching
  const matches = keywords.filter((word) =>
    word.toLowerCase().startsWith(currentWord.toLowerCase())
  );

  currentSuggestions = matches;
  selectedSuggestionIndex = -1;

  showSuggestions(matches);
}

function handleKeyboardNavigation(event) {
  // If suggestions aren't showing, don't handle keyboard navigation
  if (suggestionsBox.style.display !== "block") return;

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
        insertSuggestion(currentSuggestions[selectedSuggestionIndex]);
      }
      break;
    case "Escape":
      event.preventDefault();
      suggestionsBox.style.display = "none";
      break;
    case "Tab":
      if (currentSuggestions.length > 0) {
        event.preventDefault();
        if (selectedSuggestionIndex >= 0) {
          insertSuggestion(currentSuggestions[selectedSuggestionIndex]);
        } else {
          insertSuggestion(currentSuggestions[0]);
        }
      }
      break;
  }
}

function navigateSuggestion(direction) {
  const suggestions = suggestionsBox.querySelectorAll("li");
  if (suggestions.length === 0) return;

  // Remove current selection
  if (
    selectedSuggestionIndex >= 0 &&
    selectedSuggestionIndex < suggestions.length
  ) {
    suggestions[selectedSuggestionIndex].classList.remove("selected");
  }

  // Update index
  selectedSuggestionIndex += direction;

  // Handle bounds
  if (selectedSuggestionIndex < 0) {
    selectedSuggestionIndex = suggestions.length - 1;
  } else if (selectedSuggestionIndex >= suggestions.length) {
    selectedSuggestionIndex = 0;
  }

  // Apply selection style
  suggestions[selectedSuggestionIndex].classList.add("selected");

  // Ensure the selected item is visible (scroll if needed)
  suggestions[selectedSuggestionIndex].scrollIntoView({
    block: "nearest",
    inline: "nearest",
  });
}

function showSuggestions(matches) {
  suggestionsBox.innerHTML = "";

  if (matches.length === 0) {
    suggestionsBox.style.display = "none";
    return;
  }

  // Get cursor position to place suggestion box
  const cursorPos = textarea.selectionStart;
  const textBeforeCursor = textarea.value.substring(0, cursorPos);
  const lines = textBeforeCursor.split("\n");
  const currentLineIndex = lines.length - 1;
  const currentLineText = lines[currentLineIndex];

  const lineHeight = parseInt(getComputedStyle(textarea).lineHeight);
  const verticalOffset = currentLineIndex * lineHeight;

  // Calculate horizontal position based on character width
  const charWidth = getAverageCharWidth(textarea);
  const horizontalOffset = currentLineText.length * charWidth;

  matches.forEach((match, index) => {
    const li = document.createElement("li");
    li.textContent = match;
    li.onclick = () => insertSuggestion(match);
    li.onmouseover = () => {
      // Remove selected class from current selection
      const selected = suggestionsBox.querySelector(".selected");
      if (selected) selected.classList.remove("selected");

      // Add selected class to hovered item
      li.classList.add("selected");
      selectedSuggestionIndex = index;
    };
    suggestionsBox.appendChild(li);
  });

  // Position the suggestion box 5px after cursor position
  const rect = textarea.getBoundingClientRect();
  suggestionsBox.style.top =
    rect.top + verticalOffset + window.scrollY + lineHeight + "px";
  suggestionsBox.style.left =
    rect.left + horizontalOffset + window.scrollX + 20 + "px"; // Added 5px offset
  suggestionsBox.style.display = "block";

  // Ensure suggestion box doesn't go off-screen
  const suggRect = suggestionsBox.getBoundingClientRect();
  if (suggRect.right > window.innerWidth) {
    suggestionsBox.style.left = window.innerWidth - suggRect.width - 10 + "px";
  }
  if (suggRect.bottom > window.innerHeight) {
    suggestionsBox.style.top =
      rect.top + verticalOffset - suggRect.height + "px";
  }
}

function insertSuggestion(word) {
  const cursorPos = textarea.selectionStart;
  const text = textarea.value;

  // Find the start of the current word
  const leftPart = text.slice(0, cursorPos);
  const currentWordStart = leftPart.search(/\w+$/);

  if (currentWordStart !== -1) {
    const before = text.slice(0, currentWordStart);
    const after = text.slice(cursorPos);

    textarea.value = before + word + after;
    // Move cursor position after inserted word
    textarea.selectionStart = textarea.selectionEnd =
      currentWordStart + word.length;
  }

  textarea.focus();
  suggestionsBox.style.display = "none";
  selectedSuggestionIndex = -1;
}

// Helper function to get average character width in the textarea
function getAverageCharWidth(element) {
  const testString =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  // Create a temporary span with same font properties
  const span = document.createElement("span");
  span.style.font = getComputedStyle(element).font;
  span.style.position = "absolute";
  span.style.visibility = "hidden";
  span.style.whiteSpace = "nowrap";
  span.textContent = testString;

  document.body.appendChild(span);
  const width = span.getBoundingClientRect().width;
  document.body.removeChild(span);

  return width / testString.length;
}

// Add some basic CSS if not already defined
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
      border: 1px solid #ddd;
      max-height: 200px;
      overflow-y: auto;
      z-index: 1000;
      border-radius: 4px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
      display: none;
      width: auto;
      min-width: 150px;
    }
    
    #suggestions li {
      padding: 5px 10px;
      cursor: pointer;
      white-space: nowrap;
    }
    
    #suggestions li:hover {
      background-color: #f0f0f0;
    }
    
    #suggestions li.selected {
      background-color: #007bff;
      color: white;
    }
  `;
  document.head.appendChild(style);
}
