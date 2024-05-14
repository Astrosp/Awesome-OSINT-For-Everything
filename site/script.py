import re

# Define the text to search for
search_text = "chat"

# Open the Markdown file
with open("./README.md", "r", encoding="utf-8") as f:
    # Read the file content
    content = f.read()

# Search for the text using regular expressions
matches = re.findall(f"^.*{search_text}.*http.*$", content, flags=re.MULTILINE)

# Print the number of matches found
#print(f"Found {len(matches)} matches for '{search_text}'")
if matches:
    for match in matches:
         print(f"Found for '{search_text}' : {match}")
else:
    print(f"No match for '{search_text}'")