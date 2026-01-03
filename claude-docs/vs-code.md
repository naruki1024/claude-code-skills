# Claude Code VS Code Extension - Features and Configuration

## Key Features

### Native IDE Experience
- Dedicated Claude Code sidebar panel accessible via Spark icon
- Real-time viewing of Claude's changes directly in the IDE
- Edit review mode before accepting changes
- Auto-accept mode for automatic application of edits

### File Management & Context
- `@`-mention functionality for file references
- System file picker for attaching files and images
- Conversation history for easy access to past interactions
- Multiple simultaneous Claude Code sessions

### Development Tools
- MCP (Model Context Protocol) server integration via CLI
- Keyboard shortcuts supporting most CLI functionality
- Slash commands for CLI features directly in the extension
- Plan review and editing before accepting changes

## Installation & Requirements

**Minimum Requirements:**
- VS Code 1.98.0 or higher

**Installation:**
Available on the [Visual Studio Code Marketplace](https://marketplace.visualstudio.com/items?itemName=anthropic.claude-code)

## Configuration

### Third-Party Provider Setup

The extension supports Amazon Bedrock and Google Vertex AI. Configure via **VS Code Settings → "Claude Code: Environment Variables"**:

| Variable | Purpose | Required | Example |
|----------|---------|----------|---------|
| `CLAUDE_CODE_USE_BEDROCK` | Enable Bedrock | Bedrock only | `"1"` or `"true"` |
| `CLAUDE_CODE_USE_VERTEX` | Enable Vertex AI | Vertex AI only | `"1"` or `"true"` |
| `ANTHROPIC_API_KEY` | Third-party API access | Required | `"your-api-key"` |
| `AWS_REGION` | Bedrock region | Optional | `"us-east-2"` |
| `AWS_PROFILE` | AWS authentication profile | Optional | `"your-profile"` |
| `CLOUD_ML_REGION` | Vertex AI region | Optional | `"global"` or `"us-east5"` |
| `ANTHROPIC_VERTEX_PROJECT_ID` | GCP project ID | Optional | `"your-project-id"` |
| `ANTHROPIC_MODEL` | Override primary model | Optional | `"us.anthropic.claude-sonnet-4-5-20250929-v1:0"` |
| `ANTHROPIC_SMALL_FAST_MODEL` | Override fast model | Optional | `"us.anthropic.claude-3-5-haiku-20241022-v1:0"` |
| `CLAUDE_CODE_SKIP_AUTH_LOGIN` | Disable login prompts | Optional | `"1"` or `"true"` |

## Not Yet Implemented

- Full MCP server configuration (configure via CLI first)
- Subagent configuration (set up via CLI)
- Checkpointing functionality
- Advanced shortcuts (`#` for memory, `!` for bash commands)
- Tab completion for file paths

## Security Considerations

When using auto-edit mode in VS Code:
- Enable [VS Code Restricted Mode](https://code.visualstudio.com/docs/editor/workspace-trust#_restricted-mode) for untrusted workspaces
- Use manual edit approval mode
- Be cautious with trusted prompts only

## Legacy CLI Integration

The original VS Code integration allows terminal-based Claude Code to interact with the IDE:
- Context sharing (current selection/tab auto-shared)
- IDE-based diff display
- File reference shortcuts (`Cmd+Option+K` on Mac, `Alt+Ctrl+K` on Windows/Linux)
- Automatic diagnostic sharing (lint and syntax errors)

Works with: Visual Studio Code, Cursor, Windsurf, and VSCodium
