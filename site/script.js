async function searchTools() {
        var keyword = document.getElementById("keyword").value;
        const response = await fetch("https://raw.githubusercontent.com/Astrosp/osint-tools/main/README.md");
        const contents = await response.text();
        var lines = contents.split("\n");
        var results = [];
        for (var i = 0; i < lines.length; i++) {
          if (lines[i].toLowerCase().indexOf(keyword.toLowerCase()) !== -1) {
            results.push(lines[i]);
          }
        }
        document.getElementById("results").innerHTML = results.join("<br>");
      }
