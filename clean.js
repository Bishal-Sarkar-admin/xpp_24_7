document.getElementById("clean").addEventListener("click", async () => {
  try {
    const cleanResponse = await fetch(
      "https://server100sql.onrender.com/api/clean",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": localStorage.getItem("key")
            ? localStorage.getItem("key")
            : localStorage.setItem("key", "1234"),
        },
        body: JSON.stringify({}),
      }
    );

    const response = await cleanResponse.json();
    if (!response.ok) {
      throw new Error(
        response.error || `HTTP error! status: ${response.status}`
      );
    }

    console.log(response);
  } catch (error) {
    console.error("Fetch error:", error);
  }
});
