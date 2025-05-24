 const ErrorFixed = document.getElementById("ErrorFixed");
      const xppCodeInput = document.getElementById("xppCode");
      const output = document.getElementById("output");

      // Create spinner element
      function createSpinner() {
        const spinner = document.createElement("div");
        spinner.id = "ai-spinner";
        spinner.style.display = "inline-block";
        spinner.style.width = "20px";
        spinner.style.height = "20px";
        spinner.style.marginLeft = "10px";
        spinner.style.borderRadius = "50%";
        spinner.style.border = "3px solid rgba(0, 0, 0, 0.1)";
        spinner.style.borderTopColor = "#3498db";
        spinner.style.animation = "spin 1s linear infinite";

        // Add the animation keyframes to the document
        if (!document.getElementById("spinner-style")) {
          const style = document.createElement("style");
          style.id = "spinner-style";
          style.textContent = `
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    `;
          document.head.appendChild(style);
        }

        return spinner;
      }

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

      async function ErrorFixedUsingAI() {
        try {
          // Show spinner before starting the operation
          showSpinner();

          // Get the error message from output.value.errors, handle case if it's undefined
          const xppCodeError =
            output.value && output.value.errors ? output.value.errors : "";
          const z = ["```json", "```"];
          const requestBody = {
            query: `Analyze this X++ code, X++ code Error and provide a response in the following JSON format:
      ${z[0]}
      {
        fixedcode: "Write your fixed and full and final code"
      }
      ${z[1]}
      X++ code: ${xppCodeInput.value},
      X++ code Error: ${xppCodeError}`,
          };

          const ErrorFixedResponse = await fetch(
            "https://advance-server-tu9s.onrender.com/api/ai",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "X-API-KEY":
                  localStorage.getItem("key") ||
                  (localStorage.setItem("key", "1234"), "1234"),
              },
              body: JSON.stringify(requestBody),
            }
          );

          if (!ErrorFixedResponse.ok) {
            throw new Error(
              `X++ code Fixed Failed: ${ErrorFixedResponse.status}`
            );
          }

          const FixedData = await ErrorFixedResponse.json();

          try {
            const cleanedResponse = FixedData.reply
              .replace(/```(json)?\n?/g, "")
              .replace(/```/g, "")
              .trim();

            const FixedCode = JSON.parse(cleanedResponse);
            xppCodeInput.value = FixedCode.fixedcode; // Use .value instead of .innerText if it's a textarea or input

            // Show success message if you have a function for it
            if (typeof showMessage === "function") {
              /* JavaScript */
              ErrorFixed.disabled = true;
              ErrorFixed.classList.add("disabled-button");

              showMessage("X++ Code Fixed successfully!", "success");
            }
          } catch (parseError) {
            console.error("Failed to parse AI response:", parseError);

            // Show error message
            if (typeof showMessage === "function") {
              showMessage(`Error: ${parseError.message}`, "error");
            } else {
              alert("Failed to process the AI response. Please try again.");
            }
          }
        } catch (error) {
          console.error("Error in ErrorFixedUsingAI:", error);

          // Show error message
          if (typeof showMessage === "function") {
            showMessage(`Error: ${error.message}`, "error");
          } else {
            alert("An error occurred. Please check the console for details.");
          }
        } finally {
          // Always remove spinner when operation completes (success or failure)
          removeSpinner();
        }
      }

      // Add event listener
      ErrorFixed.addEventListener("click", function (event) {
        event.preventDefault();
        ErrorFixedUsingAI();
      });
