# Claude Code Analytics Overview

Based on the documentation, **Analytics** is a management feature that provides detailed usage insights and productivity metrics for Claude Code deployments.

## Key Features

### Access
- Available at [console.anthropic.com/claude-code](https://console.anthropic.com/claude-code)
- Currently available only for organizations using Claude Code through Claude API via Claude Console

### Required Roles
- Primary Owner
- Owner
- Billing
- Admin
- Developer

**Note:** Users, Claude Code Users, and Membership Admins cannot access analytics.

## Available Metrics

### 1. **Accepted Code Lines**
- Total code lines written by Claude Code and accepted by users during sessions
- Excludes rejected proposals
- Doesn't track subsequent deletions

### 2. **Proposal Acceptance Rate**
- Percentage of times users accept code editing tools
- Covers: Edit, Write, NotebookEdit operations

### 3. **Activity**
- **Users**: Active user count per day (left Y-axis)
- **Sessions**: Active session count per day (right Y-axis)

### 4. **Spend**
- **Users**: Active user count per day (left Y-axis)
- **Spend**: Total USD spent per day (right Y-axis)

### 5. **Team Insights**
- **Members**: All users authenticated to Claude Code
  - API key users displayed by **API Key ID**
  - OAuth users displayed by **Email Address**
- **Monthly Spend**: Per-user total for current month
- **Monthly Code Lines**: Per-user accepted lines for current month

## Using Analytics Effectively

### Monitor Adoption
Track team member status to identify:
- Active users who can share best practices
- Organization-wide adoption trends

### Measure Productivity
Tool acceptance rates and code metrics help:
- Understand developer satisfaction with Claude Code suggestions
- Track code generation effectiveness
- Identify training or process improvement opportunities

## Related Resources
- [OpenTelemetry Monitoring](/docs/ja/monitoring-usage) - For custom metrics and alerts
- [Identity and Access Management](/docs/ja/iam) - For role configuration
