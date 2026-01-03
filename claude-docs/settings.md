設定
# Claude Code 設定
ページをコピー
Claude Code をグローバル設定とプロジェクトレベルの設定、および環境変数で構成します。ページをコピーClaude Code は、ニーズに合わせて動作を構成するためのさまざまな設定を提供します。インタラクティブ REPL を使用する際に `/config` コマンドを実行することで Claude Code を構成できます。これにより、ステータス情報を表示し、構成オプションを変更できるタブ付き設定インターフェースが開きます。
## ​]設定ファイル
`settings.json` ファイルは、階層的な設定を通じて Claude Code を構成するための公式メカニズムです。
- **ユーザー設定**は `~/.claude/settings.json` で定義され、すべてのプロジェクトに適用されます。
- **プロジェクト設定**はプロジェクトディレクトリに保存されます。
- `.claude/settings.json` はソース管理にチェックインされ、チームと共有される設定用です。
- `.claude/settings.local.json` はチェックインされない設定用で、個人的な設定と実験に役立ちます。Claude Code は作成時に `.claude/settings.local.json` を無視するように git を構成します。
- Claude Code のエンタープライズデプロイメントの場合、**エンタープライズ管理ポリシー設定**もサポートしています。これらはユーザー設定とプロジェクト設定より優先されます。システム管理者は以下にポリシーをデプロイできます。
- macOS: `/Library/Application Support/ClaudeCode/managed-settings.json`
- Linux と WSL: `/etc/claude-code/managed-settings.json`
- Windows: `C:\ProgramData\ClaudeCode\managed-settings.json`
- エンタープライズデプロイメントは、ユーザーが構成したサーバーをオーバーライドする**管理 MCP サーバー**も構成できます。[エンタープライズ MCP 構成]を参照してください。
- macOS: `/Library/Application Support/ClaudeCode/managed-mcp.json`
- Linux と WSL: `/etc/claude-code/managed-mcp.json`
- Windows: `C:\ProgramData\ClaudeCode\managed-mcp.json`Example settings.jsonコピーAIに質問