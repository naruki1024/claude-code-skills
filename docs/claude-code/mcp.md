# Claude Code を MCP 経由でツールに接続する

## 概要

Claude Code は Model Context Protocol (MCP) を通じて、数百の外部ツールとデータソースに接続できます。MCP サーバーは Claude Code にツール、データベース、API へのアクセスを提供します。

## MCP でできること

MCP サーバーが接続されている場合、Claude Code に以下を依頼できます：

- **イシュー トラッキング**: JIRA イシューから機能を実装し、GitHub に PR を作成
- **監視データ分析**: Sentry と Statsig をチェックして使用状況を確認
- **データベースクエリ**: Postgres データベースをクエリしてユーザー情報を検索
- **デザイン統合**: Figma デザインに基づいてメールテンプレートを更新
- **ワークフロー自動化**: ユーザーを招待する Gmail ドラフトを作成

## MCP サーバーのインストール

### オプション 1: リモート HTTP サーバーを追加する

HTTP サーバーは、リモート MCP サーバーに接続するための推奨オプションです。

```bash
# 基本的な構文
claude mcp add --transport http <name> <url>

# 実際の例: Notion に接続する
claude mcp add --transport http notion https://mcp.notion.com/mcp

# Bearer トークンを使用した例
claude mcp add --transport http secure-api https://api.example.com/mcp \
  --header "Authorization: Bearer your-token"
```

### オプション 2: リモート SSE サーバーを追加する

SSE (Server-Sent Events) トランスポートは非推奨です。利用可能な場合は HTTP サーバーを使用してください。

```bash
# 基本的な構文
claude mcp add --transport sse <name> <url>

# 実際の例: Asana に接続する
claude mcp add --transport sse asana https://mcp.asana.com/sse
```

### オプション 3: ローカル stdio サーバーを追加する

Stdio サーバーはマシン上のローカル プロセスとして実行されます。

```bash
# 基本的な構文
claude mcp add --transport stdio <name> <command> [args...]

# 実際の例: Airtable サーバーを追加する
claude mcp add --transport stdio airtable --env AIRTABLE_API_KEY=YOUR_KEY \
  -- npx -y airtable-mcp-server
```

**重要**: `--`（ダブル ダッシュ）は Claude のフラグを MCP サーバーのコマンドと引数から分離します。

### サーバーの管理

```bash
# すべての設定済みサーバーをリストする
claude mcp list

# 特定のサーバーの詳細を取得する
claude mcp get github

# サーバーを削除する
claude mcp remove github

# (Claude Code 内) サーバーのステータスを確認する
/mcp
```

## MCP インストール スコープ

MCP サーバーは 3 つのスコープレベルで設定できます：

### ローカル スコープ

- デフォルトの設定レベル
- プロジェクト固有のユーザー設定に保存
- あなたにのみプライベート

```bash
# ローカル スコープを明示的に指定する
claude mcp add --transport http stripe --scope local https://mcp.stripe.com
```

### プロジェクト スコープ

- プロジェクトルートの `.mcp.json` ファイルに保存
- チーム全体がアクセス可能
- バージョン管理にチェックイン可能

```bash
# プロジェクト スコープ サーバーを追加する
claude mcp add --transport http paypal --scope project https://mcp.paypal.com/mcp
```

結果の `.mcp.json` ファイル形式：

```json
{
  "mcpServers": {
    "shared-server": {
      "command": "/path/to/server",
      "args": [],
      "env": {}
    }
  }
}
```

### ユーザー スコープ

- すべてのプロジェクト全体で利用可能
- ユーザーアカウントにプライベート

```bash
# ユーザー サーバーを追加する
claude mcp add --transport http hubspot --scope user https://mcp.hubspot.com/anthropic
```

## スコープの選択ガイド

| スコープ | 用途 |
|---------|------|
| ローカル | 個人サーバー、実験的な設定、機密認証情報 |
| プロジェクト | チーム共有サーバー、プロジェクト固有のツール |
| ユーザー | 複数プロジェクト向けのユーティリティ、開発ツール |

## スコープ階層と優先順位

同じ名前のサーバーが複数のスコープに存在する場合：

1. ローカル スコープ（最優先）
2. プロジェクト スコープ
3. ユーザー スコープ（最後）

## `.mcp.json` での環境変数展開

Claude Code は `.mcp.json` ファイルでの環境変数展開をサポート：

```json
{
  "mcpServers": {
    "api-server": {
      "type": "http",
      "url": "${API_BASE_URL:-https://api.example.com}/mcp",
      "headers": {
        "Authorization": "Bearer ${API_KEY}"
      }
    }
  }
}
```

**サポートされる構文：**
- `${VAR}` - 環境変数 VAR の値に展開
- `${VAR:-default}` - VAR が設定されている場合は展開、そうでない場合は default を使用

## 実践的な例

### 例 1: Sentry でエラーを監視する

```bash
# 1. Sentry MCP サーバーを追加する
claude mcp add --transport http sentry https://mcp.sentry.dev/mcp

# 2. /mcp を使用して Sentry アカウントで認証する
> /mcp

# 3. 本番環境の問題をデバッグする
> "What are the most common errors in the last 24 hours?"
> "Show me the stack trace for error ID abc123"
```

### 例 2: GitHub に接続する

```bash
# 1. GitHub MCP サーバーを追加する
claude mcp add --transport http github https://api.githubcopilot.com/mcp/

# 2. Claude Code で認証する
> /mcp

# 3. GitHub で作業する
> "Review PR #456 and suggest improvements"
> "Create a new issue for the bug we just found"
```

### 例 3: PostgreSQL データベースをクエリする

```bash
# 1. データベース サーバーを追加する
claude mcp add --transport stdio db -- npx -y @bytebase/dbhub \
  --dsn "postgresql://readonly:password@db.example.com:5432/analytics"

# 2. データベースを自然にクエリする
> "What's our total revenue this month?"
> "Find customers who haven't made a purchase in 90 days"
```

## リモート MCP サーバーで認証する

多くのクラウドベースの MCP サーバーは OAuth 2.0 認証が必要です：

1. 認証が必要なサーバーを追加
2. Claude Code 内で `/mcp` コマンドを使用
3. ブラウザのステップに従ってログイン

**ヒント：**
- トークンは安全に保存され、自動的に更新
- `/mcp` メニューで「Clear authentication」を使用してアクセスを取り消す
- OAuth 認証は HTTP サーバーで機能

## JSON 設定から MCP サーバーを追加する

```bash
# 基本的な構文
claude mcp add-json <name> '<json>'

# HTTP サーバーの例
claude mcp add-json weather-api '{"type":"http","url":"https://api.weather.com/mcp","headers":{"Authorization":"Bearer token"}}'

# Stdio サーバーの例
claude mcp add-json local-weather '{"type":"stdio","command":"/path/to/weather-cli","args":["--api-key","abc123"],"env":{"CACHE_DIR":"/tmp"}}'
```

## Claude Desktop から MCP サーバーをインポートする

```bash
# Claude Desktop からサーバーをインポートする
claude mcp add-from-claude-desktop
```

その後、インポートするサーバーを選択するインタラクティブ ダイアログが表示されます。

**対応プラットフォーム：** macOS と WSL のみ

## Claude Code を MCP サーバーとして使用する

```bash
# Claude を stdio MCP サーバーとして起動する
claude mcp serve
```

Claude Desktop の設定に追加：

```json
{
  "mcpServers": {
    "claude-code": {
      "type": "stdio",
      "command": "claude",
      "args": ["mcp", "serve"],
      "env": {}
    }
  }
}
```

実行可能ファイルパスを見つける：

```bash
which claude
```

## MCP 出力制限と警告

- **警告しきい値**: 10,000 トークンを超える場合に警告
- **デフォルト制限**: 25,000 トークン
- **設定方法**: `MAX_MCP_OUTPUT_TOKENS` 環境変数で調整

```bash
# MCP ツール出力の制限を高くする
export MAX_MCP_OUTPUT_TOKENS=50000
claude
```

## MCP リソースを使用する

### MCP リソースを参照する

プロンプトで `@` を入力して利用可能なリソースを表示：

```
> Can you analyze @github:issue://123 and suggest a fix?
> Please review the API documentation at @docs:file://api/authentication
> Compare @postgres:schema://users with @docs:file://database/user-model
```

## MCP プロンプトをスラッシュコマンドとして使用する

`/` を入力して利用可能なコマンドを表示。MCP プロンプトは `/mcp__servername__promptname` 形式：

```
> /mcp__github__list_prs
> /mcp__github__pr_review 456
> /mcp__jira__create_issue "Bug in login flow" high
```

## エンタープライズ MCP 設定

### セットアップ場所

- **macOS**: `/Library/Application Support/ClaudeCode/managed-mcp.json`
- **Windows**: `C:\ProgramData\ClaudeCode\managed-mcp.json`
- **Linux**: `/etc/claude-code/managed-mcp.json`

### 設定例

```json
{
  "mcpServers": {
    "github": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/"
    },
    "sentry": {
      "type": "http",
      "url": "https://mcp.sentry.dev/mcp"
    },
    "company-internal": {
      "type": "stdio",
      "command": "/usr/local/bin/company-mcp-server",
      "args": ["--config", "/etc/company/mcp-config.json"],
      "env": {
        "COMPANY_API_URL": "https://internal.company.com"
      }
    }
  }
}
```

### 許可リストと拒否リスト

`managed-settings.json` を使用して制御：

```json
{
  "allowedMcpServers": [
    { "serverName": "github" },
    { "serverName": "sentry" },
    { "serverName": "company-internal" }
  ],
  "deniedMcpServers": [
    { "serverName": "filesystem" }
  ]
}
```

**許可リスト動作：**
- `undefined`（デフォルト）: 制限なし
- 空の配列 `[]`: 完全なロックダウン
- サーバー名のリスト: 指定されたサーバーのみ

**拒否リスト動作：**
- `undefined`（デフォルト）: サーバーはブロックされない
- サーバー名のリスト: 指定されたサーバーはすべてブロック

## プラグイン提供の MCP サーバー

プラグインは `.mcp.json` または `plugin.json` で MCP サーバーを定義でき、プラグイン有効化時に自動的に起動：

```json
{
  "database-tools": {
    "command": "${CLAUDE_PLUGIN_ROOT}/servers/db-server",
    "args": ["--config", "${CLAUDE_PLUGIN_ROOT}/config.json"],
    "env": {
      "DB_URL": "${DB_URL}"
    }
  }
}
```

**プラグイン MCP の特徴：**
- 自動ライフサイクル管理
- `${CLAUDE_PLUGIN_ROOT}` で相対パスをサポート
- ユーザー環境変数へのアクセス
- 複数のトランスポートタイプ対応（stdio、SSE、HTTP）

## Windows ユーザーへの注意

ネイティブ Windows では、`npx` を使用するローカル MCP サーバーに `cmd /c` ラッパーが必要：

```bash
# cmd /c ラッパーを使用
claude mcp add --transport stdio my-server -- cmd /c npx -y @some/package
```
