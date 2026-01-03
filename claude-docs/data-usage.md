# Claude Code Data Usage Policy

Based on the documentation, here's a comprehensive overview of Claude Code's data usage policies:

## Data Training Policy

### Consumer Users (Free, Pro, Max Plans)
- **Starting August 28, 2025**: Users can choose whether to allow data usage for improving future Claude models
- When enabled, data from Free, Pro, and Max accounts (including Claude Code usage) will be used to train new models
- **Deadline**: October 8, 2025 to make this selection
- **Settings**: Privacy settings can be changed anytime at `claude.ai/settings/data-privacy-controls`
- This setting applies only to new or resumed chats and coding sessions

### Commercial Users (Team, Enterprise, API, Third-party Platforms, Claude Gov)
- Maintains existing policy: Anthropic **does not** use code or prompts submitted to Claude Code for model training unless customers explicitly opt-in
- Exception: [Developer Partner Program](https://support.claude.com/en/articles/11174108-about-the-development-partner-program) participants who explicitly provide training materials

## Data Retention Periods

**Consumer Users:**
- **With data improvement enabled**: 5 years (supports model development and security improvements)
- **Without data improvement enabled**: 30 days

**Commercial Users:**
- **Standard**: 30 days
- **Zero data retention**: Available with properly configured API keys (no chat transcripts retained on server)
- **Local caching**: Up to 30 days locally for session resumption (configurable)

## Data Flow & Security

```
User's Machine (Local CLI)
         ↓
    TLS Encrypted
         ↓
Anthropic API ← Data includes all user prompts and model outputs
         ↓
Storage (unencrypted at rest, encrypted in transit)
```

### Cloud Execution (Claude Code on the Web)
- Repository cloned to isolated VM, auto-deleted after session
- GitHub authentication via secure proxy (credentials not in sandbox)
- All outbound traffic through security proxy with audit logging
- Data retention follows account type policies

## Feedback & Telemetry

| Feature | Details |
|---------|---------|
| `/bug` Command | Complete conversation history sent; retained 5 years |
| Session Quality Survey | Only numeric rating (1-2-3 or dismiss) recorded; no transcripts |
| Thumbs Up/Down | Standard feedback mechanism |

## Telemetry Services

### Statsig (Operational Metrics)
- Logs latency, reliability, usage patterns
- **No code or file paths included**
- TLS encryption in transit; 256-bit AES at rest
- Opt-out: `DISABLE_TELEMETRY=1`

### Sentry (Error Logging)
- Operational error logs only
- TLS encryption in transit; 256-bit AES at rest
- Opt-out: `DISABLE_ERROR_REPORTING=1`

### Opt-out All Non-Essential Traffic
```bash
CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC=1
```

## API Provider Default Behavior

| Service | Statsig | Sentry | `/bug` Reports |
|---------|---------|--------|-----------------|
| **Claude API** | Default ON | Default ON | Default ON |
| **Vertex API** | Default OFF | Default OFF | Default OFF |
| **Bedrock API** | Default OFF | Default OFF | Default OFF |

Environment variables can be set in `settings.json`:
- `DISABLE_TELEMETRY=1`
- `DISABLE_ERROR_REPORTING=1`
- `DISABLE_BUG_COMMAND=1`

## Key Compliance Resources

- [Privacy Center](https://privacy.anthropic.com/) - Detailed data retention practices
- [Commercial Terms of Service](https://www.anthropic.com/legal/commercial-terms)
- [Consumer Terms](https://www.anthropic.com/legal/consumer-terms)
- [Privacy Policy](https://www.anthropic.com/legal/privacy)
- [Anthropic Trust Center](https://trust.anthropic.com) - API security controls
