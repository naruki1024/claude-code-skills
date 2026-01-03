リファレンス
# スラッシュコマンド
ページをコピー
インタラクティブセッション中にスラッシュコマンドを使用してClaudeの動作を制御します。ページをコピー
## ​]組み込みスラッシュコマンド
| コマンド | 目的 |
| `/add-dir` | 追加の作業ディレクトリを追加 |
| `/agents` | 特殊なタスク用のカスタムAIサブエージェントを管理 |
| `/bashes` | バックグラウンドタスクをリストおよび管理 |
| `/bug` | バグを報告（会話をAnthropicに送信） |
| `/clear` | 会話履歴をクリア |
| `/compact [instructions]` | オプションのフォーカス指示付きで会話をコンパクト化 |
| `/config` | 設定インターフェース（設定タブ）を開く |
| `/context` | 現在のコンテキスト使用状況をカラーグリッドで可視化 |
| `/cost` | トークン使用統計を表示（サブスクリプション固有の詳細については[コスト追跡ガイド]を参照） |
| `/doctor` | Claude Codeインストールの健全性をチェック |
| `/exit` | REPLを終了 |
| `/export [filename]` | 現在の会話をファイルまたはクリップボードにエクスポート |
| `/help` | 使用方法ヘルプを取得 |
| `/hooks` | ツールイベント用のフック設定を管理 |
| `/init` | CLAUDE.mdガイドでプロジェクトを初期化 |
| `/login` | Anthropicアカウントを切り替え |
| `/logout` | Anthropicアカウントからサインアウト |
| `/mcp` | MCPサーバー接続とOAuth認証を管理 |
| `/memory` | CLAUDE.mdメモリファイルを編集 |
| `/model` | AIモデルを選択または変更 |
| `/output-style [style]` | 出力スタイルを直接設定するか、選択メニューから設定 |
| `/permissions` | [権限]を表示または更新 |
| `/pr_comments` | プルリクエストコメントを表示 |
| `/privacy-settings` | プライバシー設定を表示および更新 |
| `/review` | コードレビューをリクエスト |
| `/sandbox` | より安全で自律的な実行のためのファイルシステムとネットワーク分離を備えたサンドボックス化されたbashツールを有効化 |
| `/rewind` | 会話またはコードを巻き戻し |
| `/status` | 設定インターフェース（ステータスタブ）を開く（バージョン、モデル、アカウント、接続性を表示） |
| `/statusline` | Claude CodeのステータスラインUIをセットアップ |
| `/terminal-setup` | 改行用のShift+Enterキーバインディングをインストール（iTerm2およびVSCodeのみ） |
| `/todos` | 現在のTODOアイテムをリスト |
| `/usage` | プラン使用制限とレート制限ステータスを表示（サブスクリプションプランのみ） |
| `/vim` | vimモードに入る（挿入モードとコマンドモードを交互に切り替え） |
## ​]カスタムスラッシュコマンド
カスタムスラッシュコマンドを使用すると、頻繁に使用するプロンプトをMarkdownファイルとして定義でき、Claude Codeが実行できます。コマンドはスコープ（プロジェクト固有または個人用）で整理され、ディレクトリ構造を通じた名前空間をサポートします。
### ​]構文
コピーAIに質問
```
/<command-name> [arguments]
#### ​]パラメータ
| パラメータ | 説明 |
| `<command-name>` | Markdownファイル名から派生した名前（`.md`拡張子なし） |
| `[arguments]` | コマンドに渡されるオプション引数 |
### ​]コマンドタイプ
#### ​]プロジェクトコマンド
リポジトリに保存され、チームと共有されるコマンド。`/help`にリストされる場合、これらのコマンドは説明の後に「(project)」と表示されます。**場所**: `.claude/commands/`次の例では、`/optimize`コマンドを作成します：コピーAIに質問
# プロジェクトコマンドを作成mkdir -p .claude/commandsecho "Analyze this code for performance issues and suggest optimizations:" > .claude/commands/optimize.md
#### ​]個人用コマンド
すべてのプロジェクト全体で利用可能なコマンド。`/help`にリストされる場合、これらのコマンドは説明の後に「(user)」と表示されます。**場所**: `~/.claude/commands/`次の例では、`/security-review`コマンドを作成します：コピーAIに質問
# 個人用コマンドを作成mkdir -p ~/.claude/commandsecho "Review this code for security vulnerabilities:" > ~/.claude/commands/security-review.md
### ​]機能
#### ​]名前空間
サブディレクトリ内でコマンドを整理します。サブディレクトリは組織用に使用され、コマンド説明に表示されますが、コマンド名自体には影響しません。説明には、コマンドがプロジェクトディレクトリ（`.claude/commands`）またはユーザーレベルディレクトリ（`~/.claude/commands`）のどちらから来ているか、およびサブディレクトリ名が表示されます。ユーザーレベルとプロジェクトレベルのコマンド間の競合はサポートされていません。それ以外の場合、同じベースファイル名を持つ複数のコマンドが共存できます。たとえば、`.claude/commands/frontend/component.md`のファイルは、説明に「(project:frontend)」と表示される`/component`コマンドを作成します。
一方、`~/.claude/commands/component.md`のファイルは、説明に「(user)」と表示される`/component`コマンドを作成します。
#### ​]引数
引数プレースホルダーを使用して、コマンドに動的値を渡します：
##### `$ARGUMENTS`を使用したすべての引数
`$ARGUMENTS`プレースホルダーは、コマンドに渡されたすべての引数をキャプチャします：コピーAIに質問
# コマンド定義echo 'Fix issue #$ARGUMENTS following our coding standards' > .claude/commands/fix-issue.md# 使用方法> /fix-issue 123 high-priority# $ARGUMENTSは「123 high-priority」になります
##### `$1`、`$2`などを使用した個別引数
位置パラメータ（シェルスクリプトと同様）を使用して、特定の引数に個別にアクセスします：コピーAIに質問
# コマンド定義 echo 'Review PR #$1 with priority $2 and assign to $3' > .claude/commands/review-pr.md# 使用方法> /review-pr 456 high alice# $1は「456」、$2は「high」、$3は「alice」になります
位置引数を使用する場合：
- コマンドのさまざまな部分で引数に個別にアクセスする必要がある
- 欠落している引数のデフォルトを提供する
- 特定のパラメータロールを持つより構造化されたコマンドを構築する
#### ​]Bashコマンド実行
`!`プレフィックスを使用して、スラッシュコマンドが実行される前にbashコマンドを実行します。出力はコマンドコンテキストに含まれます。`allowed-tools`に`Bash`ツールを含める必要がありますが、許可する特定のbashコマンドを選択できます。例：コピーAIに質問
---allowed-tools: Bash(git add:*), Bash(git status:*), Bash(git commit:*)description: Create a git commit---## Context- Current git status: !`git status`- Current git diff (staged and unstaged changes): !`git diff HEAD`- Current branch: !`git branch --show-current`- Recent commits: !`git log --oneline -10`## Your taskBased on the above changes, create a single git commit.
#### ​]ファイル参照
`@`プレフィックスを使用してコマンドにファイルコンテンツを含め、[ファイルを参照]します。例：コピーAIに質問
# 特定のファイルを参照Review the implementation in @src/utils/helpers.js# 複数のファイルを参照Compare @src/old-version.js with @src/new-version.js
#### ​]思考モード
スラッシュコマンドは、[拡張思考キーワード]を含めることで拡張思考をトリガーできます。
### ​]フロントマター
コマンドファイルはフロントマターをサポートしており、コマンドに関するメタデータを指定するのに便利です：
| フロントマター | 目的 | デフォルト |
| `allowed-tools` | コマンドが使用できるツールのリスト | 会話から継承 |
| `argument-hint` | スラッシュコマンドに予想される引数。例：`argument-hint: add [tagId] | remove [tagId] | list`。このヒントはスラッシュコマンドをオートコンプリートするときにユーザーに表示されます。 | なし |
| `description` | コマンドの簡潔な説明 | プロンプトの最初の行を使用 |
| `model` | 特定のモデル文字列（[モデル概要]を参照） | 会話から継承 |
| `disable-model-invocation` | `SlashCommand`ツールがこのコマンドを呼び出すのを防ぐかどうか | false |例：コピーAIに質問
---allowed-tools: Bash(git add:*), Bash(git status:*), Bash(git commit:*)argument-hint: [message]description: Create a git commitmodel: claude-3-5-haiku-20241022---Create a git commit with message: $ARGUMENTS
位置引数を使用した例：コピーAIに質問
---argument-hint: [pr-number] [priority] [assignee]description: Review pull request---Review PR #$1 with priority $2 and assign to $3.Focus on security, performance, and code style.
## ​]プラグインコマンド
[プラグイン]はClaude Codeとシームレスに統合されるカスタムスラッシュコマンドを提供できます。プラグインコマンドはユーザー定義コマンドと同じように機能しますが、[プラグインマーケットプレイス]を通じて配布されます。
### ​]プラグインコマンドの仕組み
プラグインコマンドは：
- **名前空間化**: コマンドは競合を避けるために`/plugin-name:command-name`形式を使用できます（名前の衝突がない限り、プラグインプレフィックスはオプション）
- **自動的に利用可能**: プラグインがインストールされて有効になると、そのコマンドが`/help`に表示されます
- **完全に統合**: すべてのコマンド機能をサポート（引数、フロントマター、bash実行、ファイル参照）
### ​]プラグインコマンド構造
**場所**: プラグインルート内の`commands/`ディレクトリ**ファイル形式**: フロントマター付きMarkdownファイル**基本的なコマンド構造**:コピーAIに質問
---description: Brief description of what the command does---# Command NameDetailed instructions for Claude on how to execute this command.Include specific guidance on parameters, expected outcomes, and any special considerations.
**高度なコマンド機能**:
- **引数**: コマンド説明で`{arg1}`のようなプレースホルダーを使用
- **サブディレクトリ**: 名前空間化のためにサブディレクトリ内でコマンドを整理
- **Bash統合**: コマンドはシェルスクリプトとプログラムを実行できます
- **ファイル参照**: コマンドはプロジェクトファイルを参照および変更できます
### ​]呼び出しパターン
競合がない場合の直接コマンドコピーAIに質問