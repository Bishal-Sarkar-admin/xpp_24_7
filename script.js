const API_URL = "https://ai-compiler-amber.vercel.app/process-xpp"; // Update with your backend URL

async function processXpp() {
  const xppCode = document.getElementById("xppCode").value;
  const outputElement = document.getElementById("output");

  if (!xppCode.trim()) {
    outputElement.textContent = "Please enter some X++ code.";
    return;
  }

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ xppCode }),
    });

    const data = await response.json();
    outputElement.textContent = JSON.stringify(data, null, 2);
  } catch (error) {
    outputElement.textContent = "Error processing request. Please try again.";
    console.error("Request failed:", error);
  }
}
