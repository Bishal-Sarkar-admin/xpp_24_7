// Show spinner
function showSpinner() {
  // Remove existing spinner if any
  removeSpinner();

  // Add new spinner next to the button
  const spinner = createSpinner();
  ErrorFixed.insertAdjacentElement("afterend", spinner);

  // Optionally, change button text
  ErrorFixed.innerHTML = "Fixing...";
  ErrorFixed.disabled = true;
}

// Remove spinner
function removeSpinner() {
  const existingSpinner = document.getElementById("ai-spinner");
  if (existingSpinner) {
    existingSpinner.remove();
  }

  // Reset button text
  ErrorFixed.innerHTML = "Fix Error";
  ErrorFixed.disabled = false;
}
