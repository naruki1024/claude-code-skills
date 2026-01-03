Claude Codeで構築
# ヘッドレスモード
ページをコピー
インタラクティブUIなしでClaudeコードをプログラムで実行するページをコピー
## ​]概要
ヘッドレスモードを使用すると、コマンドラインスクリプトと自動化ツールからClaudeコードをプログラムで実行でき、インタラクティブUIは不要です。
## ​]基本的な使用方法
Claude Codeへの主なコマンドラインインターフェースは`claude`コマンドです。`--print`（または`-p`）フラグを使用して非インタラクティブモードで実行し、最終結果を出力します：コピーAIに質問
```
claude -p "Stage my changes and write a set of commits for them" \ --allowedTools "Bash,Read" \ --permission-mode acceptEdits
## ​]設定オプション
ヘッドレスモードはClaude Codeで利用可能なすべてのCLIオプションを活用します。自動化とスクリプティングの主要なオプションは以下の通りです：
| フラグ | 説明 | 例 |
| `--print`, `-p` | 非インタラクティブモードで実行 | `claude -p "query"` |
| `--output-format` | 出力形式を指定（`text`、`json`、`stream-json`） | `claude -p --output-format json` |
| `--resume`, `-r` | セッションIDで会話を再開 | `claude --resume abc123` |
| `--continue`, `-c` | 最新の会話を続行 | `claude --continue` |
| `--verbose` | 詳細ログを有効化 | `claude --verbose` |
| `--append-system-prompt` | システムプロンプトに追加（`--print`のみ） | `claude --append-system-prompt "Custom instruction"` |
| `--allowedTools` | スペース区切りの許可ツールリスト、または
コンマ区切りのツールリスト文字列 | `claude --allowedTools mcp__slack mcp__filesystem`
`claude --allowedTools "Bash(npm install),mcp__filesystem"` |
| `--disallowedTools` | スペース区切りの拒否ツールリスト、または
コンマ区切りの拒否ツールリスト文字列 | `claude --disallowedTools mcp__splunk mcp__github`
`claude --disallowedTools "Bash(git commit),mcp__github"` |
| `--mcp-config` | JSONファイルからMCPサーバーをロード | `claude --mcp-config servers.json` |
| `--permission-prompt-tool` | パーミッションプロンプトを処理するMCPツール（`--print`のみ） | `claude --permission-prompt-tool mcp__auth__prompt` |CLIオプションと機能の完全なリストについては、[CLIリファレンス]ドキュメントを参照してください。
## ​]マルチターン会話
マルチターン会話の場合、会話を再開するか最新のセッションから続行できます：コピーAIに質問
# 最新の会話を続行claude --continue "Now refactor this for better performance"# セッションIDで特定の会話を再開claude --resume 550e8400-e29b-41d4-a716-446655440000 "Update the tests"# 非インタラクティブモードで再開claude --resume 550e8400-e29b-41d4-a716-446655440000 "Fix all linting issues" --no-interactive
## ​]出力形式
### ​]テキスト出力（デフォルト）
コピーAIに質問
claude -p "Explain file src/components/Header.tsx"# Output: This is a React component showing...
### ​]JSON出力
メタデータを含む構造化データを返します：コピーAIに質問
claude -p "How does the data layer work?" --output-format json
レスポンス形式：コピーAIに質問
{ "type": "result", "subtype": "success", "total_cost_usd": 0.003, "is_error": false, "duration_ms": 1234, "duration_api_ms": 800, "num_turns": 6, "result": "The response text here...", "session_id": "abc123"}
### ​]ストリーミングJSON出力
受信時に各メッセージをストリーミングします：コピーAIに質問
claude -p "Build an application" --output-format stream-json
各会話は初期`init`システムメッセージで始まり、その後ユーザーとアシスタントのメッセージのリストが続き、最後に統計情報を含む最終`result`システムメッセージが続きます。各メッセージは個別のJSONオブジェクトとして出力されます。
## ​]入力形式
### ​]テキスト入力（デフォルト）
# 直接引数claude -p "Explain this code"# stdinからecho "Explain this code" | claude -p
### ​]ストリーミングJSON入力
`stdin`経由で提供されるメッセージのストリーム。各メッセージはユーザーターンを表します。これにより、`claude`バイナリを再起動することなく複数ターンの会話が可能になり、モデルがリクエストを処理している間にガイダンスを提供できます。各メッセージはJSON「ユーザーメッセージ」オブジェクトで、出力メッセージスキーマと同じ形式に従います。メッセージは[jsonl]形式を使用してフォーマットされ、入力の各行は完全なJSONオブジェクトです。ストリーミングJSON入力には`-p`と`--output-format stream-json`が必要です。コピーAIに質問
echo '{"type":"user","message":{"role":"user","content":[{"type":"text","text":"Explain this code"}]}}' | claude -p --output-format=stream-json --input-format=stream-json --verbose
## ​]エージェント統合の例
### ​]SREインシデント対応ボット
#!/bin/bash# 自動化されたインシデント対応エージェントinvestigate_incident() { local incident_description="$1" local severity="${2:-medium}" claude -p "Incident: $incident_description (Severity: $severity)" \ --append-system-prompt "You are an SRE expert. Diagnose the issue, assess impact, and provide immediate action items." \ --output-format json \ --allowedTools "Bash,Read,WebSearch,mcp__datadog" \ --mcp-config monitoring-tools.json}# 使用方法investigate_incident "Payment API returning 500 errors" "high"
### ​]自動セキュリティレビュー
# プルリクエストのセキュリティ監査エージェントaudit_pr() { local pr_number="$1" gh pr diff "$pr_number" | claude -p \ --append-system-prompt "You are a security engineer. Review this PR for vulnerabilities, insecure patterns, and compliance issues." \ --output-format json \ --allowedTools "Read,Grep,WebSearch"}# 使用方法とファイルに保存audit_pr 123 > security-report.json
### ​]マルチターン法務アシスタント
# セッション永続化を伴う法務文書レビューsession_id=$(claude -p "Start legal review session" --output-format json | jq -r '.session_id')# 複数のステップで契約書をレビューclaude -p --resume "$session_id" "Review contract.pdf for liability clauses"claude -p --resume "$session_id" "Check compliance with GDPR requirements"claude -p --resume "$session_id" "Generate executive summary of risks"
## ​]ベストプラクティス
- **JSON出力形式を使用**してレスポンスをプログラムで解析します：コピーAIに質問
# jqでJSON応答を解析result=$(claude -p "Generate code" --output-format json)code=$(echo "$result" | jq -r '.result')cost=$(echo "$result" | jq -r '.cost_usd')
- **エラーを適切に処理**してください。終了コードとstderrを確認します：コピーAIに質問
if ! claude -p "$prompt" 2>error.log; then echo "Error occurred:" >&2 cat error.log >&2 exit 1fi
- **セッション管理を使用**してマルチターン会話でコンテキストを維持します
- **長時間実行される操作のタイムアウトを検討**します：コピーAIに質問
timeout 300 claude -p "$complex_prompt" || echo "Timed out after 5 minutes"
- **複数のリクエストを行う場合は、呼び出し間に遅延を追加してレート制限を尊重**します
## ​]関連リソース
- [CLIの使用方法とコントロール] - 完全なCLIドキュメント
- [一般的なワークフロー] - 一般的なユースケースのステップバイステップガイド
このページは役に立ちましたか？はいいいえ[Claude Code フックの使い始め][Claude Code GitHub Actions]⌘I