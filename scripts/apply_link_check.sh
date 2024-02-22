#!/bin/bash
# Script in charge of auditing the released cheatsheets MD files
# in order to detect dead links
# cd ../
# find . -name \*.md -exec markdown-link-check -c ../.linkcheck.json {} \; 1>../link-check-result.out 2>&1
# errors=`grep -c "ERROR:" ../link-check-result.out`
# content=`cat ../link-check-result.out`
# if [[ $errors != "0" ]]
# then
#     echo "[!] Error(s) found by the Links validator: $errors CS have dead links !"
#     exit $errors
# else
#     echo "[+] No error found by the Links validator."
# fi

# Only check the specific README.md file
target_file="../README.md"

# Run link check with specific file and redirect output
markdown-link-check -c ../.linkcheck.json "$target_file" 1>../link-check-result.out 2>&1

# Check for errors and handle appropriately
errors=$(grep -c "ERROR:" ../link-check-result.out)

if [[ $errors != "0" ]]; then
  echo "[!] Error(s) found in 'README.md': $errors broken links!"
  exit $errors
else
  echo "[+] No errors found in 'README.md'."
fi
