# Claude Code Model Configuration

This is the Japanese documentation for Claude Code's model configuration. Here's a summary of the key information:

## Available Models

You can configure Claude Code to use:
- **Model aliases** (recommended)
- Full model names
- ARNs (for Bedrock)

## Model Aliases

| Alias | Use Case |
|-------|----------|
| `default` | Recommended model based on account type |
| `sonnet` | Latest Sonnet (4.5) for everyday coding tasks |
| `opus` | Opus 4.1 for complex reasoning tasks |
| `haiku` | Fast, efficient model for simple tasks |
| `sonnet[1m]` | Sonnet with 1 million token context window |
| `opusplan` | Hybrid mode: Opus for planning, Sonnet for execution |

## Setting Your Model

Configure models in order of precedence:

1. **During session**: `/model <alias|name>`
2. **At startup**: `claude --model <alias|name>`
3. **Environment variable**: `ANTHROPIC_MODEL=<alias|name>`
4. **Configuration file**:
```json
{
  "permissions": { ... },
  "model": "opus"
}
```

## Special Model Behaviors

### `opusplan`
- **Plan mode**: Uses Opus for complex reasoning and architecture decisions
- **Execution mode**: Automatically switches to Sonnet for code generation
- Combines Opus's reasoning ability with Sonnet's efficiency

### Extended Context `[1m]`
For Console/API users, add `[1m]` suffix to enable 1M token context:
```
/model anthropic.claude-sonnet-4-5-20250929-v1:0[1m]
```

## Environment Variables

| Variable | Purpose |
|----------|---------|
| `ANTHROPIC_DEFAULT_OPUS_MODEL` | Model for `opus` alias or opusplan planning mode |
| `ANTHROPIC_DEFAULT_SONNET_MODEL` | Model for `sonnet` alias or opusplan execution |
| `ANTHROPIC_DEFAULT_HAIKU_MODEL` | Model for `haiku` alias or background functions |
| `CLAUDE_CODE_SUBAGENT_MODEL` | Model for subagents |

## Prompt Caching Configuration

Control prompt caching with environment variables:

| Variable | Effect |
|----------|--------|
| `DISABLE_PROMPT_CACHING` | Disable for all models (highest priority) |
| `DISABLE_PROMPT_CACHING_HAIKU` | Disable for Haiku only |
| `DISABLE_PROMPT_CACHING_SONNET` | Disable for Sonnet only |
| `DISABLE_PROMPT_CACHING_OPUS` | Disable for Opus only |
