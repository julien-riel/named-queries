---
description: Automates the complete GitHub issue development workflow: assignment, branch creation, context analysis, development, testing, and PR creation.
---

# GitHub Issue Development Workflow

## Description
This command automates the complete GitHub issue development workflow: assignment, branch creation, context analysis, development, testing, and PR creation. It follows best practices for systematic issue resolution with proper testing and documentation.

## Command
```
/github-issue-dev $ARGUMENTS
```

## Alias
```
/gid $ARGUMENTS
```

## Parameters
- `$ARGUMENTS` (required): GitHub issue number to process

## Workflow Steps

### 1. Issue Assignment and Analysis
```
gh issue view $ARGUMENTS --json title,body,labels,assignees
```
- Fetch issue details using GitHub CLI
- Self-assign the issue if not already assigned
- Display issue title, description, and relevant labels
- Identify issue type (bug, feature, enhancement) from labels

### 2. Branch Management
```bash
# Ensure clean working directory
git status
git stash push -m "WIP: before issue-$ARGUMENTS"

# Update main branch
git checkout main
git pull origin main

# Create feature branch with conventional naming
git checkout -b "feature/issue-$ARGUMENTS-$(echo "$ISSUE_TITLE" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g' | sed 's/--*/-/g' | sed 's/^-\|-$//g')"
```

### 3. Context Analysis and Research
```bash
# Analyze recent PRs for patterns
gh pr list --state merged --limit 10 --json number,title,files

# Review similar features or bug fixes
gh pr list --search "label:enhancement" --state merged --limit 5
gh pr list --search "label:bug" --state merged --limit 5

# Check project structure and conventions
find . -name "*.md" -path "./.claude/*" -exec cat {} \;
```

**Analysis checklist:**
- Review coding patterns from recent merged PRs
- Identify naming conventions and file structure
- Check for existing similar implementations
- Review project-specific guidelines in CLAUDE.md
- Understand testing patterns and requirements

### 4. Implementation Strategy
- Plan implementation based on issue requirements
- Follow established project patterns and conventions
- Create necessary files with appropriate structure
- Implement core functionality with proper error handling
- Add comprehensive documentation and comments
- Ensure code follows project style guidelines

### 5. Testing Protocol
```bash
# Check development environment
docker-compose ps || docker compose ps

# Start services if needed
if ! docker-compose ps | grep -q "Up"; then
    echo "Starting development environment..."
    docker-compose up -d
    sleep 30  # Wait for services to be ready
fi

# Run test suite
npm test || yarn test || python -m pytest || cargo test || go test ./...

# Run linting and type checking
npm run lint || yarn lint || flake8 . || cargo clippy || golangci-lint run
npm run typecheck || yarn typecheck || mypy . || tsc --noEmit
```

### 6. Quality Assurance
- Verify all tests pass
- Ensure code coverage meets project standards
- Run integration tests if available
- Check for security vulnerabilities
- Validate accessibility requirements (if applicable)

### 7. Documentation Updates
- Update relevant documentation files
- Add/update API documentation if applicable
- Update CHANGELOG.md with changes
- Ensure README.md reflects new functionality

### 8. Commit and Push
```bash
# Stage changes
git add -A

# Create conventional commit
git commit -m "feat(issue-$ARGUMENTS): $(echo "$ISSUE_TITLE" | head -c 50)"

# Push feature branch
git push -u origin "feature/issue-$ARGUMENTS-*"
```

### 9. Pull Request Creation
```bash
# Create PR using GitHub CLI
gh pr create \
  --title "feat: [$ARGUMENTS] $ISSUE_TITLE" \
  --body "$(cat << EOF
## Description
Resolves #$ARGUMENTS

## Changes Made
- [Auto-generated summary of changes]

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed
- [ ] Code coverage maintained

## Documentation
- [ ] Documentation updated
- [ ] API docs updated (if applicable)
- [ ] CHANGELOG.md updated

## Screenshots/Demo
[Add screenshots or demo if applicable]

## Checklist
- [ ] Code follows project conventions
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] Ready for review
EOF
)" \
  --assignee "@me" \
  --label "ready-for-review"
```

## Usage Examples
```bash
# Process issue #123
/github-issue-dev 123

# Alternative syntax
/gid 456
```

## Prerequisites
- GitHub CLI (`gh`) installed and authenticated
- Git configured with proper user credentials
- Docker/Docker Compose for development environment
- Node.js/Python/Rust/Go environment as per project requirements
- Appropriate permissions: `repo`, `issues:write`, `pull_requests:write`

## Advanced Options
Add these flags to customize behavior:

### Environment Variables
```bash
# Skip tests (use with caution)
export SKIP_TESTS=true

# Create draft PR
export DRAFT_PR=true

# Use different base branch
export BASE_BRANCH=develop

# Auto-accept file changes (dangerous)
export AUTO_ACCEPT=true
```

### Conditional Execution
```bash
# Skip Docker if not available
if ! command -v docker >/dev/null 2>&1; then
    echo "Docker not found, running tests locally..."
    npm test
fi
```

## Error Handling
- **Issue not found**: Display clear error with suggestion to verify issue number
- **Permission denied**: Check GitHub authentication and repository permissions
- **Branch exists**: Offer to switch to existing branch or create with suffix
- **Test failures**: Display detailed logs and pause for manual intervention
- **Merge conflicts**: Guide through resolution process
- **Service unavailable**: Retry with exponential backoff

## Security Considerations
- Never commit sensitive information (API keys, passwords)
- Validate input parameters to prevent injection attacks
- Use environment variables for configuration
- Implement proper access controls

## Integration with Project Tools
```bash
# Auto-format code before commit
npx prettier --write . || black . || rustfmt **/*.rs

# Run security scanning
npm audit || safety check || cargo audit

# Update dependencies if needed
npm update || pip install -U -r requirements.txt
```

## Team Collaboration Features
- Automatic reviewer assignment based on CODEOWNERS
- Integration with project management tools
- Slack/Discord notifications (if configured)
- Automatic issue linking and status updates

This workflow ensures consistent, high-quality issue resolution while maintaining project standards and team collaboration practices.