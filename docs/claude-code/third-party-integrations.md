# Enterprise Deployment Overview

This page provides an overview of deployment options for Claude Code with third-party services and infrastructure. Here are the key points:

## Provider Comparison

| Feature | Anthropic | Amazon Bedrock | Google Vertex AI |
|---------|-----------|----------------|-----------------|
| **Regions** | Supported countries | Multiple AWS regions | Multiple GCP regions |
| **Prompt Caching** | Enabled by default | Enabled by default | Enabled by default |
| **Authentication** | API Key | AWS credentials (IAM) | GCP credentials (OAuth/Service Account) |
| **Cost Tracking** | Dashboard | AWS Cost Explorer | GCP Billing |
| **Enterprise Features** | Teams, usage monitoring | IAM policies, CloudTrail | IAM roles, Cloud Audit Logs |

## Configuration Options

Claude Code supports flexible configuration combining different providers and infrastructure:

### **Enterprise Proxy**
Routes traffic through HTTP/HTTPS proxy (`HTTPS_PROXY` or `HTTP_PROXY`)

### **LLM Gateway**
Authentication handling service providing provider-compatible endpoints (`ANTHROPIC_BASE_URL`, `ANTHROPIC_BEDROCK_BASE_URL`, or `ANTHROPIC_VERTEX_BASE_URL`)

## Setup Examples

### Bedrock with Corporate Proxy
```bash
export CLAUDE_CODE_USE_BEDROCK=1
export AWS_REGION=us-east-1
export HTTPS_PROXY='https://proxy.example.com:8080'
```

### Bedrock with LLM Gateway
```bash
export CLAUDE_CODE_USE_BEDROCK=1
export ANTHROPIC_BEDROCK_BASE_URL='https://your-llm-gateway.com/bedrock'
export CLAUDE_CODE_SKIP_BEDROCK_AUTH=1  # Gateway handles AWS auth
```

### Vertex AI with Corporate Proxy
```bash
export CLAUDE_CODE_USE_VERTEX=1
export CLOUD_ML_REGION=us-east5
export ANTHROPIC_VERTEX_PROJECT_ID=your-project-id
export HTTPS_PROXY='https://proxy.example.com:8080'
```

## Choosing the Right Configuration

- **Direct Provider Access**: Simplest setup, existing AWS/GCP infrastructure
- **Corporate Proxy**: Existing proxy requirements, traffic monitoring needs
- **LLM Gateway**: Usage tracking across teams, dynamic model switching, centralized auth

## Debugging

Use `claude /status` slash command to view applied authentication, proxy, and URL settings.
Set `export ANTHROPIC_LOG=debug` for request logging.
