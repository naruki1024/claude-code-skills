# Identity and Access Management (IAM) in Claude Code

Based on the documentation, here's a comprehensive overview of Claude Code's IAM capabilities:

## Authentication Methods

Claude Code supports three authentication approaches for team setups:

1. **Claude API** (via Claude Console)
2. **Amazon Bedrock**
3. **Google Vertex AI**

### Claude API Setup
- Create/use existing Claude Console account
- Add users via Console (Settings → Members → Invite) or configure SSO
- Assign roles:
  - **Claude Code role**: Create Claude Code API keys only
  - **Developer role**: Create any API key type
- Users must accept invitation, verify system requirements, install Claude Code, and authenticate

## Permissions System

Claude Code implements a **tiered permissions model** balancing power and safety:

| Tool Type | Examples | Approval Required | Persistent Storage |
|-----------|----------|-------------------|-------------------|
| **Read-only** | File read, LS, Grep | No | N/A |
| **Bash commands** | Shell execution | Yes | Per command/directory |
| **File changes** | Edit/write files | Yes | Until session ends |

## Permission Configuration

Use `/permissions` to manage tool permissions. The system supports:

- **Allow**: Use without manual approval
- **Ask**: Prompt user each time (overrides Allow)
- **Deny**: Prevent tool use (highest priority)
- **Additional Directories**: Extend file access beyond working directory
- **Default Mode**: Control new request behavior

### Permission Modes

```
default         → Standard: prompt for first tool use
acceptEdits     → Auto-accept file edits during session
plan            → Read-only analysis mode
bypassPermissions → Skip all prompts (requires secure environment)
```

## Tool-Specific Rules

**Bash patterns** (prefix matching):
```
Bash(npm run build)      → Exact command match
Bash(npm run test:*)     → Commands starting with "npm run test"
Bash(curl http://site/*) → curl commands to http://site/
```

**Read & Edit** (gitignore format):
```
//path              → Absolute filesystem path
~/path              → Home directory path
/path               → Relative to settings file
path or ./path      → Relative to current directory
```

**WebFetch**:
```
WebFetch(domain:example.com)  → Domain-specific requests
```

**MCP** (no wildcards):
```
mcp__puppeteer                    → All puppeteer tools
mcp__puppeteer__puppeteer_navigate → Specific tool
```

## Enterprise Management Policies

System administrators can enforce organization-wide policies via:

- **macOS**: `/Library/Application Support/ClaudeCode/managed-settings.json`
- **Linux/WSL**: `/etc/claude-code/managed-settings.json`
- **Windows**: `C:\ProgramData\ClaudeCode\managed-settings.json`

These policies cannot be overridden by users.

## Configuration Priority (Highest to Lowest)

1. Enterprise policies
2. Command-line options
3. Local project settings (`.claude/settings.local.json`)
4. Shared project settings (`.claude/settings.json`)
5. User settings (`~/.claude/settings.json`)

## Credential Management

- **Storage**: Encrypted in macOS Keychain
- **Supported types**: Claude.ai, Claude API, Bedrock, Vertex credentials
- **Custom scripts**: Set `apiKeyHelper` to run shell scripts returning API keys
- **Update interval**: Default 5 minutes or HTTP 401 response; customize via `CLAUDE_CODE_API_KEY_HELPER_TTL_MS`
