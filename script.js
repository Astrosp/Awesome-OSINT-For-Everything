// Fetch the markdown file from the GitHub repository
fetch('https://raw.githubusercontent.com/Astrosp/Awesome-OSINT-For-Everything/main/README.md')
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to fetch the markdown file');
    }
    return response.text();
  })
  .then(text => {
    const tools = parseMarkdown(text);
    displayResults(tools);

    // Search button event listener
    document.getElementById('searchButton').addEventListener('click', () => {
      const searchTerm = document.getElementById('searchInput').value;
      const results = searchTools(searchTerm, tools);
      displayResults(results);
    });

    // Search on Enter key press
    document.getElementById('searchInput').addEventListener('keyup', (event) => {
      if (event.key === 'Enter') {
        const searchTerm = event.target.value;
        const results = searchTools(searchTerm, tools);
        displayResults(results);
      }
    });
  })
  .catch(error => {
    console.error('Error:', error);
    document.getElementById('results').innerHTML = '<p>Error loading tools. Please try again later.</p>';
  });

// Function to parse the markdown file
function parseMarkdown(text) {
  const lines = text.split('\n');
  let currentCategory = '';
  const tools = [];

  lines.forEach(line => {
    line = line.trim();
    // Check for category headers (##)
    if (line.startsWith('## ')) {
      currentCategory = line.substring(3).trim();
    }
    // Check for tool entries (bullet points)
    else if (line.startsWith('- ')) {
      const match = line.match(/-\s*\[(.*?)\]\((.*?)\)\s*-\s*(.*)/);
      if (match) {
        const tool = {
          name: match[1],
          link: match[2],
          description: match[3],
          category: currentCategory
        };
        tools.push(tool);
      }
    }
  });
  return tools;
}

// Function to search tools based on the search term
function searchTools(searchTerm, tools) {
  if (!searchTerm) {
    return tools; 
  }
  searchTerm = searchTerm.toLowerCase();
  return tools.filter(tool =>
    tool.name.toLowerCase().includes(searchTerm) ||
    tool.description.toLowerCase().includes(searchTerm) ||
    tool.category.toLowerCase().includes(searchTerm)
  );
}

// Function to display search results
function displayResults(results) {
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = '';

  if (results.length === 0) {
    resultsDiv.innerHTML = '<p>No results found.</p>';
  } else {
    results.forEach(tool => {
      const toolDiv = document.createElement('div');
      toolDiv.className = 'tool';
      toolDiv.innerHTML = `
        <h3><a href="${tool.link}" target="_blank">${tool.name}</a></h3>
        <p>${tool.description}</p>
        <p class="category">Category: ${tool.category}</p>
      `;
      resultsDiv.appendChild(toolDiv);
    });
  }
}