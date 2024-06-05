// async function searchTools() {
//         var keyword = document.getElementById("keyword").value;
//         const response = await fetch("https://raw.githubusercontent.com/Astrosp/osint-tools/main/README.md");
//         const contents = await response.text();
//         var lines = contents.split("\n");
//         var results = [];
//         for (var i = 0; i < lines.length; i++) {
//           if (lines[i].toLowerCase().indexOf(keyword.toLowerCase()) !== -1) {
//             results.push(lines[i]);
//           }
//         }
//         document.getElementById("results").innerHTML = results.join("<br>");
//       }

// async function searchTools() {
//   try {
//     const keyword = document.getElementById("keyword").value;

//     // Validate keyword (optional)
//     if (!keyword.trim()) {
//       throw new Error("Please enter a valid keyword to search.");
//     }

//     const response = await fetch("./README.md");

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     const contents = await response.text();
//     const lines = contents.split("\n");
//     const results = [];

//     for (const line of lines) {
//       if (line.toLowerCase().includes(keyword.toLowerCase())) {
//         results.push(line);
//       }
//     }

//     document.getElementById("results").innerHTML = results.join("<br>");
//   } catch (error) {
//     console.error("Error:", error);
//     const errorMessage = error.message || "An error occurred. Please try again later.";
//     document.getElementById("results").innerHTML = `<p style="color: red;">${errorMessage}</p>`;
//   }
// }



async function searchTools() {
  try {
    const keyword = document.getElementById("keyword").value.trim();

    if (!keyword) {
      throw new Error("Please enter a valid keyword to search.");
    }

    const response = await fetch("./README.md");

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const contents = await response.text();
    const lines = contents.split("\n");
    const results = [];

    for (const line of lines) {
      if (line.toLowerCase().includes(keyword.toLowerCase())) {
        results.push(line);
      }
    }

    document.getElementById("results").innerHTML = results.join("<br>");
  } catch (error) {
    console.error("Error:", error);
    document.getElementById("results").innerHTML = `<p style="color: red;">${error.message || "An error occurred. Please try again."}</p>`;
  }
}