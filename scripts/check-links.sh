#!/bin/bash

# Link Check Analysis Script
# This script runs markdown-link-check and provides a summary of results

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
README_FILE="$PROJECT_ROOT/README.md"
OUTPUT_FILE="$PROJECT_ROOT/link-check-results.txt"
SUMMARY_FILE="$PROJECT_ROOT/link-check-summary.md"

echo "========================================"
echo "Link Check Analysis for OSINT Repository"
echo "========================================"
echo ""

# Check if dependencies are installed
if ! command -v markdown-link-check &> /dev/null; then
    echo "ERROR: markdown-link-check is not installed"
    echo "Please run: npm install"
    exit 1
fi

echo "Step 1: Running link check on README.md..."
echo "This may take several minutes due to the large number of links."
echo ""

# Run markdown-link-check and save output
markdown-link-check -c "$PROJECT_ROOT/markdown-link-check-config.json" "$README_FILE" > "$OUTPUT_FILE" 2>&1 || true

echo "Step 2: Analyzing results..."
echo ""

# Count total links
TOTAL_LINKS=$(grep -E "^\s*\[✓\]|^\s*\[✖\]" "$OUTPUT_FILE" | wc -l)
WORKING_LINKS=$(grep -E "^\s*\[✓\]" "$OUTPUT_FILE" | wc -l)
BROKEN_LINKS=$(grep -E "^\s*\[✖\]" "$OUTPUT_FILE" | wc -l)

# Calculate percentage
if [ "$TOTAL_LINKS" -gt 0 ]; then
    WORKING_PERCENT=$((WORKING_LINKS * 100 / TOTAL_LINKS))
    BROKEN_PERCENT=$((BROKEN_LINKS * 100 / TOTAL_LINKS))
else
    WORKING_PERCENT=0
    BROKEN_PERCENT=0
fi

# Display summary
echo "========================================"
echo "Summary:"
echo "========================================"
echo "Total Links:    $TOTAL_LINKS"
echo "Working Links:  $WORKING_LINKS ($WORKING_PERCENT%)"
echo "Broken Links:   $BROKEN_LINKS ($BROKEN_PERCENT%)"
echo ""

# Generate detailed summary file
cat > "$SUMMARY_FILE" << EOF
# Link Check Summary

**Generated:** $(date)

## Statistics

- **Total Links Checked:** $TOTAL_LINKS
- **Working Links:** $WORKING_LINKS ($WORKING_PERCENT%)
- **Broken Links:** $BROKEN_LINKS ($BROKEN_PERCENT%)

## Status

EOF

if [ "$BROKEN_LINKS" -eq 0 ]; then
    echo "✅ **All links are working!**" >> "$SUMMARY_FILE"
    echo "✅ All links are working!"
else
    echo "⚠️ **Some links need attention**" >> "$SUMMARY_FILE"
    echo "⚠️ Some links are broken and need attention"
    echo ""
    echo "Step 3: Extracting broken links..."

    # Extract broken links
    echo "" >> "$SUMMARY_FILE"
    echo "## Broken Links" >> "$SUMMARY_FILE"
    echo "" >> "$SUMMARY_FILE"

    grep -E "^\s*\[✖\]" "$OUTPUT_FILE" | head -50 >> "$SUMMARY_FILE" || true

    if [ "$BROKEN_LINKS" -gt 50 ]; then
        echo "" >> "$SUMMARY_FILE"
        echo "... and $((BROKEN_LINKS - 50)) more broken links." >> "$SUMMARY_FILE"
        echo "" >> "$SUMMARY_FILE"
        echo "See $OUTPUT_FILE for complete results." >> "$SUMMARY_FILE"
    fi
fi

echo "" >> "$SUMMARY_FILE"
echo "## Full Results" >> "$SUMMARY_FILE"
echo "" >> "$SUMMARY_FILE"
echo "Complete results are available in: \`link-check-results.txt\`" >> "$SUMMARY_FILE"
echo "" >> "$SUMMARY_FILE"
echo "## Next Steps" >> "$SUMMARY_FILE"
echo "" >> "$SUMMARY_FILE"
echo "1. Review broken links in the full results file" >> "$SUMMARY_FILE"
echo "2. Manually verify each broken link in a browser" >> "$SUMMARY_FILE"
echo "3. Search for alternative URLs or replacement services" >> "$SUMMARY_FILE"
echo "4. Update README.md with working links" >> "$SUMMARY_FILE"
echo "5. Consider removing permanently dead services" >> "$SUMMARY_FILE"
echo "" >> "$SUMMARY_FILE"
echo "For more information, see LINK_CHECK_REPORT.md" >> "$SUMMARY_FILE"

echo ""
echo "========================================"
echo "Results saved to:"
echo "  - Full results: $OUTPUT_FILE"
echo "  - Summary:      $SUMMARY_FILE"
echo "========================================"
echo ""

# Exit with error if there are broken links
if [ "$BROKEN_LINKS" -gt 0 ]; then
    echo "⚠️  Found $BROKEN_LINKS broken link(s)"
    exit 1
else
    echo "✅  All links are working!"
    exit 0
fi
