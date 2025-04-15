// Enable user input if X++ code contains a new Dialog instance
function checkDialog() {
  const xppCode = document.getElementById("xppCode").value;
  const userInput = document.getElementById("userInput");
  localStorage.setItem("code", document.getElementById("xppCode").value); // Save the code to local storage
  const regex = /new\s+Dialog\s*\(/;
  if (regex.test(xppCode)) {
    userInput.removeAttribute("disabled");
  } else {
    userInput.setAttribute("disabled", "true");
  }
}

function getCurrentWord(event) {
  const textarea = event.target;
  const cursorPos = textarea.selectionStart;
  const text = textarea.value;

  // Find word boundaries
  const left = text.slice(0, cursorPos).split(/\s+/);
  const right = text.slice(cursorPos).split(/\s+/);

  const currentWord = left[left.length - 1] + (right[0] || "");

  document.getElementById("currentWord").innerText = currentWord;
}
