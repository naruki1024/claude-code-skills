# Claude Code Memory Management

Based on the documentation, here's how to use CLAUDE.md files:

## Memory File Locations (Hierarchy)

CLAUDE.md files can be placed in 4 different locations with priority from highest to lowest specificity:

| Type | Location | Purpose | Shared With |
|------|----------|---------|------------|
| **Enterprise Policy** | `/Library/Application Support/ClaudeCode/CLAUDE.md` (macOS)<br>`/etc/claude-code/CLAUDE.md` (Linux)<br>`C:\ProgramData\ClaudeCode\CLAUDE.md` (Windows) | Organization-wide instructions managed by IT/DevOps | All users in organization |
| **Project Memory** | `./CLAUDE.md` or `./.claude/CLAUDE.md` | Team-shared project instructions | Team members via source control |
| **User Memory** | `~/.claude/CLAUDE.md` | Personal settings across all projects | Personal (all projects) |
| **Local Project Memory** | `./CLAUDE.local.md` | Personal project-specific settings (deprecated) | Personal (current project only) |

## Importing Files

Use the `@path/to/import` syntax to import additional files:

```
See @README for project overview and @package.json for available npm commands for this project.

# Additional Instructions
- git workflow @docs/git-instructions.md
```

Relative and absolute paths are supported:

```
# Individual Preferences
- @~/.claude/my-project-instructions.md
```

**Note:** Imports are not evaluated in markdown code spans or blocks.

## Setting Up Project Memory

Bootstrap CLAUDE.md for your codebase:

```
> /init
```

**Best practices:**
- Include frequently used commands (build, test, lint)
- Document code style settings and naming conventions
- Add important architecture patterns specific to your project
- Use for both team-shared and personal configuration

## Memory Search Order

Claude Code recursively loads memory:
1. Starts from current working directory
2. Searches up to root directory (`/`)
3. Loads all found CLAUDE.md and CLAUDE.local.md files
4. Also detects CLAUDE.md nested in subdirectories below current directory

## Direct Memory Editing

Use the `/memory` slash command to open and edit memory files in your system editor during a session.

## Best Practices

- **Be specific:** "Use 2-space indentation" is better than "Format code properly"
- **Use structure:** Format memory as bullet points grouped under descriptive markdown headings
- **Keep updated:** Regularly review and update memory as projects evolve to ensure Claude has current information and context
