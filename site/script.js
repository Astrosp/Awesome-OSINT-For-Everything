function searchTools() {
    var keyword = document.getElementById("keyword").value;
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://raw.githubusercontent.com/Astrosp/osint-tools/master/README.md", true);
    xhr.onreadystatechange = function() {
      if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
        var contents = xhr.responseText;
        var lines = contents.split("\n");
        var results = [];
        for (var i = 0; i < lines.length; i++) {
          if (lines[i].toLowerCase().indexOf(keyword.toLowerCase()) !== -1) {
            results.push(lines[i]);
          }
        }
        document.getElementById("results").innerHTML = results.join("<br>");
      }
    };
    xhr.send();
  }