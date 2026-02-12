# Contributing to Awesome-OSINT-For-Everything

Thank you for your interest in contributing to this OSINT resources collection! This document provides guidelines for contributing to the project.

## How to Contribute

### Reporting Broken Links

If you find broken or dead links:

1. **Check if the issue already exists** in the [Issues](https://github.com/Astrosp/Awesome-OSINT-For-Everything/issues) tab
2. **Create a new issue** with:
   - The broken link(s)
   - The section where they appear
   - Any alternative links you've found (if available)
3. **Use the title format**: `[Broken Link] Service Name - Section`

### Adding New Tools/Resources

To add a new OSINT tool or resource:

1. **Verify the resource**:
   - Ensure the link works
   - Check that it's relevant to OSINT
   - Verify it's not already in the list

2. **Find the right category**:
   - Place it in the most appropriate section
   - Maintain alphabetical order within sections if applicable
   - Create a new section if needed (discuss first in an issue)

3. **Format correctly**:
   ```markdown
   - [Tool Name](https://example.com/) - Brief description of what it does
   ```

4. **Submit a Pull Request**:
   - Fork the repository
   - Make your changes
   - Run link check: `npm run link-check`
   - Submit PR with clear description

### Fixing Broken Links

When fixing broken links:

1. **Verify the problem**:
   - Check if the link is truly dead
   - Use web.archive.org to find historical data
   - Search for the new URL if service moved

2. **Find alternatives**:
   - Look for official new URLs
   - Search for similar services if original is gone
   - Check OSINT communities for recommendations

3. **Update the link**:
   - Replace with working alternative
   - Update description if service changed
   - Add note if functionality differs

4. **Document changes**:
   - Explain why the change was needed in PR description
   - Note what you verified

### Link Checking Process

Before submitting a PR:

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run link checker**:
   ```bash
   npm run link-check
   ```

3. **Review results**:
   - Ensure your new links work (✓)
   - Fix any broken links you introduced (✖)

4. **Generate report** (optional):
   ```bash
   npm run link-check-report
   ```

### Quality Guidelines

**Good Contributions:**
- Add actively maintained tools
- Provide accurate descriptions
- Include working links
- Follow existing formatting
- Group related tools together

**Avoid:**
- Broken or dead links
- Duplicate entries
- Self-promotion without value
- Links to illegal content
- Paywalled services (unless clearly noted)

## Code of Conduct

### Our Standards

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what's best for the community
- Show empathy towards others

### Our Responsibilities

Maintainers will:
- Review PRs in a timely manner
- Provide clear feedback
- Enforce quality standards
- Keep the list up-to-date

## Pull Request Process

1. **Fork and clone** the repository
2. **Create a branch** for your changes:
   ```bash
   git checkout -b add-new-tool
   ```
3. **Make your changes** following the guidelines above
4. **Test your changes**:
   ```bash
   npm install
   npm run link-check
   ```
5. **Commit with clear message**:
   ```bash
   git commit -m "Add ToolName to Category section"
   ```
6. **Push to your fork**:
   ```bash
   git push origin add-new-tool
   ```
7. **Submit Pull Request** with:
   - Clear title describing the change
   - Description of what you added/changed
   - Why it's valuable to the collection
