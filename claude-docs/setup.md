# Claude Code のセットアップ手順

このページは Claude Code のインストール、認証、更新方法を詳しく説明しています。

## システム要件

- **OS**: macOS 10.15+、Ubuntu 20.04+/Debian 10+、Windows 10+（WSL 1/2 または Git for Windows）
- **RAM**: 4GB 以上
- **Node.js**: 18+ （NPM インストールの場合のみ）
- **ネットワーク**: インターネット接続が必須
- **シェル**: Bash、Zsh、Fish に対応
- **場所**: [Anthropic がサポートしている国](https://www.anthropic.com/supported-countries)

## インストール方法

### 1. ネイティブインストール（推奨）

**macOS、Linux、WSL:**
```bash
curl -fsSL https://claude.ai/install.sh | bash
```

**Windows PowerShell:**
```powershell
irm https://claude.ai/install.ps1 | iex
```

**Windows CMD:**
```cmd
curl -fsSL https://claude.ai/install.cmd -o install.cmd && install.cmd && del install.cmd
```

### 2. Homebrew
```bash
brew install --cask claude-code
```

### 3. NPM
```bash
npm install -g @anthropic-ai/claude-code
```

⚠️ `sudo npm install -g` は使用しないでください。

## 起動

インストール後、プロジェクトディレクトリで:
```bash
cd your-awesome-project
claude
```

## 認証オプション

1. **Claude Console** - デフォルト。console.anthropic.com でアクティブな課金が必須
2. **Claude App**（Pro/Max プラン）- claude.com でログイン
3. **エンタープライズプラットフォーム** - Amazon Bedrock または Google Vertex AI

## 更新方法

### 自動更新
Claude Code は自動的に最新の状態を保ちます。無効にするには：
```bash
export DISABLE_AUTOUPDATER=1
```

### 手動更新
```bash
claude update
```
