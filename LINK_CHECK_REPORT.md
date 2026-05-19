# Link Check Report for Awesome-OSINT-For-Everything

## Overview

This document provides information about the link checking infrastructure for this repository and recommendations for maintaining link health.

## Current Infrastructure

### 1. GitHub Actions Workflow

The repository has a GitHub Actions workflow configured at `.github/workflows/md-link-check.yml` that automatically checks markdown links on every push.

**Workflow Details:**
- **Trigger:** Runs on every push to the repository
- **Tool:** Uses `gaurav-nelson/github-action-markdown-link-check@v1`
- **Files Checked:** All markdown files in the repository
- **Configuration:** Uses `markdown-link-check-config.json` for custom settings

### 2. NPM Scripts

The following npm scripts are available for local link checking:

```bash
# Check all links in README.md
npm run link-check
```

### 3. Configuration Files

- **`markdown-link-check-config.json`**: Configuration for markdown-link-check tool
  - Ignores certain URL patterns (bundle.zip, root paths)
  - Sets custom User-Agent header to avoid bot detection

- **`.linkcheck.json`**: Configuration for markdownlint (linting rules)

## Link Statistics

Based on the repository structure:
- **Total Links:** Approximately 1,479 links in README.md
- **Categories:** 70+ categories covering various OSINT tools and resources
- **Link Types:**
  - External websites (OSINT tools, services, platforms)
  - GitHub repositories
  - Documentation sites
  - Educational resources

## Common Link Issues

### 1. Website Changes
- Services shut down or rebrand
- Domain changes or redirects
- HTTPS upgrades

### 2. Temporary Failures
- Server downtime
- Rate limiting
- Geographic restrictions
- Bot detection (Cloudflare, etc.)

### 3. GitHub Repositories
- Repositories archived
- Repositories made private
- Repositories deleted or renamed

## Recommendations

### For Maintainers

1. **Regular Monitoring**
   - Check GitHub Actions results after each push
   - Review failed link checks in the Actions tab
   - Schedule periodic manual reviews (monthly/quarterly)

2. **Link Verification Process**
   - When a link fails, verify manually in a browser
   - Check if the service moved to a new URL
   - Look for alternatives if the service is permanently down
   - Use web.archive.org to find historical information

3. **Updating Broken Links**
   - Replace dead links with working alternatives
   - Add notes when services are discontinued
   - Consider adding "last checked" dates for critical links

4. **Community Contributions**
   - Accept PRs that fix broken links
   - Encourage users to report dead links via Issues
   - Consider using issue templates for link reports

### For Contributors

When submitting PRs to fix links:

1. **Verification:**
   - Manually verify the new link works
   - Ensure the replacement provides similar functionality
   - Check that the link is not behind a paywall or login

2. **Documentation:**
   - Note why the old link failed
   - Explain what the new link provides
   - Add context if the service changed significantly

3. **Testing:**
   - Run `npm install` to install dependencies
   - Run `npm run link-check` to verify locally
   - Ensure GitHub Actions pass after your PR

## How to Run Link Checks Locally

### Prerequisites

```bash
# Install Node.js (if not already installed)
# Then install dependencies
npm install
```

### Running the Check

```bash
# Check all links in README.md
npm run link-check
```

### Interpreting Results

- ✓ (checkmark) = Link is working
- ✖ (X mark) = Link is broken or unreachable
- Status codes:
  - 200: OK
  - 301/302: Redirect (usually OK)
  - 403: Forbidden (may need User-Agent header)
  - 404: Not found
  - 429: Rate limited
  - 0: Connection failed

## Known Limitations

### Sandboxed Environments

Link checking may not work in sandboxed/restricted environments due to:
- Firewall restrictions
- No internet access
- DNS resolution issues

In such cases, rely on GitHub Actions results instead.

### Rate Limiting

Some sites may rate-limit automated checkers. The current configuration includes:
- Custom User-Agent header
- Reasonable timeout settings
- Retry logic (via GitHub Actions)

### False Positives

Some working links may show as broken due to:
- Bot protection (Cloudflare, etc.)
- Geographic restrictions
- Temporary server issues
- CAPTCHA requirements

**Always manually verify** before removing seemingly "broken" links.

## Automated Solutions

### GitHub Actions Benefits

The current GitHub Actions setup provides:
- Automatic checking on every push
- No local environment needed
- Consistent checking environment
- PR comment notifications (can be enabled)

### Future Enhancements

Consider adding:
1. **Scheduled Checks:** Run link checker weekly via GitHub Actions cron
2. **PR Comments:** Auto-comment on PRs with broken links
3. **Issue Creation:** Automatically create issues for broken links
4. **Badge:** Add a link checker badge to README.md showing status
5. **Separate Report:** Generate detailed broken link reports

## Manual Link Verification

For critical links, consider manual verification:

1. **Browser Test:** Open link in multiple browsers
2. **Archive Check:** Look up on web.archive.org
3. **Alternative Search:** Find updated URLs via search engines
4. **Community Check:** Ask in OSINT communities about alternatives

## Contact

For questions about link checking or to report broken links:
- Open an issue on GitHub
- Submit a PR with fixes
- Check existing issues for known problems

## Last Updated

This report was generated on: 2026-02-11

---

**Note:** Link checking is an ongoing maintenance task. The health of external links depends on third-party services and cannot be guaranteed. Regular monitoring and community contributions are essential for keeping this resource up-to-date.
