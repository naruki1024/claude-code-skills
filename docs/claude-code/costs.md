# Cost Management for Claude Code

Based on the documentation, here's how to effectively manage costs when using Claude Code:

## Cost Overview

- **Average daily cost per developer**: $6.90
- **90% of users stay below**: $6.90-$12 per day
- **Team usage (API-based)**: Approximately $100-$200 per developer per month on Claude 3.5 Sonnet (varies significantly based on instance count and automation usage)

## Tracking Costs

### Using the `/cost` Command

The `/cost` command provides detailed token usage statistics for your current session:

```
Total cost:            $0.55
Total duration (API):  6m 19.7s
Total duration (wall): 6h 33m 10.2s
Total code changes:    0 lines added, 0 lines removed
```

**Note**: This command is not available for Claude Max and Pro subscribers.

### Additional Tracking Options

- **Claude Console**: View historical usage (requires Admin or Billing role)
- **Claude Code Workspace**: Set spending limits (requires Admin role)
- A "Claude Code" workspace is automatically created when you first authenticate with Claude Console

## Reducing Token Usage

1. **Compact conversations**:
   - Claude auto-compacts when context exceeds 95% capacity
   - Manually use `/compact` when needed
   - Toggle in `/config` → "Auto-compact enabled"
   - Add custom instructions or update CLAUDE.md

2. **Write specific queries** - avoid vague requests that trigger unnecessary scanning

3. **Split complex tasks** - break large tasks into focused interactions

4. **Clear history between tasks** - use `/clear` to reset context

## Team Rate Limiting Recommendations

| Team Size | TPM per User | RPM per User |
|-----------|------------|-----------|
| 1-5 users | 200k-300k | 5-7 |
| 5-20 users | 100k-150k | 2.5-3.5 |
| 20-50 users | 50k-75k | 1.25-1.75 |
| 50-100 users | 25k-35k | 0.62-0.87 |
| 100-500 users | 15k-20k | 0.37-0.47 |
| 500+ users | 10k-15k | 0.25-0.35 |

Rate limits apply at the organization level, allowing individual users to exceed shared allocations temporarily when others aren't actively using the service.

## Background Token Usage

Claude Code consumes tokens even when idle:
- **Conversation summaries** for `claude --resume` functionality
- **Command processing** (e.g., `/cost` status checks)

Typical cost: **less than $0.04 per session**
