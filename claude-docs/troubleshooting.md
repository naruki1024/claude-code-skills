Claude Codeで構築
# トラブルシューティング
ページをコピー
Claude Codeのインストールと使用に関する一般的な問題の解決策を発見してください。ページをコピー
## ​]一般的なインストールの問題
### ​]Windowsインストールの問題：WSLでのエラー
WSLで以下の問題が発生する可能性があります：**OS/プラットフォーム検出の問題**：インストール中にエラーが発生した場合、WSLがWindows `npm`を使用している可能性があります。以下を試してください：
- インストール前に`npm config set os linux`を実行
- `npm install -g @anthropic-ai/claude-code --force --no-os-check`でインストール（`sudo`は使用しないでください）**Nodeが見つからないエラー**：`claude`を実行時に`exec: node: not found`が表示される場合、WSL環境がWindows版のNode.jsを使用している可能性があります。`which npm`と`which node`で確認でき、これらは`/mnt/c/`ではなく`/usr/`で始まるLinuxパスを指している必要があります。これを修正するには、Linuxディストリビューションのパッケージマネージャーまたは[`nvm`]を使用してNodeをインストールしてみてください。**nvmバージョンの競合**：WSLとWindowsの両方にnvmがインストールされている場合、WSLでNodeバージョンを切り替える際にバージョンの競合が発生する可能性があります。これは、WSLがデフォルトでWindows PATHをインポートするため、Windows nvm/npmがWSLインストールより優先されることが原因です。この問題は以下で識別できます：
- `which npm`と`which node`を実行 - これらがWindowsパス（`/mnt/c/`で始まる）を指している場合、Windowsバージョンが使用されています
- WSLでnvmを使用してNodeバージョンを切り替えた後に機能が破損するこの問題を解決するには、Linux node/npmバージョンが優先されるようにLinux PATHを修正してください：**主要な解決策：nvmがシェルで適切に読み込まれていることを確認**最も一般的な原因は、nvmが非対話型シェルで読み込まれていないことです。シェル設定ファイル（`~/.bashrc`、`~/.zshrc`など）に以下を追加してください：コピーAIに質問
```
# nvmが存在する場合は読み込むexport NVM_DIR="$HOME/.nvm"[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
または現在のセッションで直接実行：コピーAIに質問
source ~/.nvm/nvm.sh
**代替案：PATH順序の調整**nvmが適切に読み込まれているがWindowsパスが依然として優先される場合、シェル設定でLinuxパスを明示的にPATHの前に追加できます：コピーAIに質問
export PATH="$HOME/.nvm/versions/node/$(node -v)/bin:$PATH"
Windows PATHインポートの無効化（`appendWindowsPath = false`）は、WSLからWindows実行ファイルを簡単に呼び出す機能を破損するため避けてください。同様に、Windows開発に使用している場合は、WindowsからNode.jsをアンインストールすることも避けてください。
### ​]LinuxとMacのインストール問題：権限またはコマンドが見つからないエラー
npmでClaude Codeをインストールする際、`PATH`の問題により`claude`にアクセスできない場合があります。
npmグローバルプレフィックスがユーザー書き込み可能でない場合（例：`/usr`、または`/usr/local`）、権限エラーが発生する可能性もあります。
#### ​]推奨解決策：ネイティブClaude Codeインストール
Claude Codeには、npmやNode.jsに依存しないネイティブインストールがあります。ネイティブClaude Codeインストーラーは現在ベータ版です。以下のコマンドを使用してネイティブインストーラーを実行してください。**macOS、Linux、WSL：**コピーAIに質問
# 安定版をインストール（デフォルト）curl -fsSL https://claude.ai/install.sh | bash# 最新版をインストールcurl -fsSL https://claude.ai/install.sh | bash -s latest# 特定のバージョン番号をインストールcurl -fsSL https://claude.ai/install.sh | bash -s 1.0.58
**Windows PowerShell：**コピーAIに質問
# 安定版をインストール（デフォルト）irm https://claude.ai/install.ps1 | iex# 最新版をインストール& ([scriptblock]::Create((irm https://claude.ai/install.ps1))) latest# 特定のバージョン番号をインストール& ([scriptblock]::Create((irm https://claude.ai/install.ps1))) 1.0.58
このコマンドは、お使いのオペレーティングシステムとアーキテクチャに適したClaude Codeのビルドをインストールし、`~/.local/bin/claude`のインストールにシンボリックリンクを追加します。システムPATHにインストールディレクトリがあることを確認してください。インストールの確認：コピーAIに質問
claude doctor # インストールの健全性をチェック
## ​]権限と認証
### ​]繰り返される権限プロンプト
同じコマンドを繰り返し承認している場合は、`/permissions`コマンドを使用して特定のツールを承認なしで実行できるようにすることができます。[権限ドキュメント]を参照してください。
### ​]認証の問題
認証の問題が発生している場合：
- `/logout`を実行して完全にサインアウト
- Claude Codeを閉じる
- `claude`で再起動し、認証プロセスを再度完了問題が続く場合は、以下を試してください：コピーAIに質問
rm -rf ~/.config/claude-code/auth.jsonclaude
これにより保存された認証情報が削除され、クリーンなログインが強制されます。
## ​]パフォーマンスと安定性
### ​]高いCPUまたはメモリ使用量
Claude Codeはほとんどの開発環境で動作するように設計されていますが、大規模なコードベースを処理する際に大量のリソースを消費する可能性があります。パフォーマンスの問題が発生している場合：
- `/compact`を定期的に使用してコンテキストサイズを削減
- 主要なタスクの間でClaude Codeを閉じて再起動
- 大きなビルドディレクトリを`.gitignore`ファイルに追加することを検討
### ​]コマンドのハングまたはフリーズ
Claude Codeが応答しない場合：
- Ctrl+Cを押して現在の操作をキャンセルしようとする
- 応答しない場合は、ターミナルを閉じて再起動する必要がある場合があります
### ​]検索と発見の問題
検索ツール、`@file`メンション、カスタムエージェント、カスタムスラッシュコマンドが機能しない場合は、システム`ripgrep`をインストールしてください：コピーAIに質問
# macOS（Homebrew） brew install ripgrep# Windows（winget）winget install BurntSushi.ripgrep.MSVC# Ubuntu/Debiansudo apt install ripgrep# Alpine Linuxapk add ripgrep# Arch Linuxpacman -S ripgrep
次に、[環境]で`USE_BUILTIN_RIPGREP=0`を設定してください。
### ​]WSLでの遅いまたは不完全な検索結果
WSLで[ファイルシステム間での作業]時のディスク読み取りパフォーマンスのペナルティにより、WSLでClaude Codeを使用する際に期待より少ないマッチ（ただし検索機能の完全な欠如ではない）が生じる可能性があります。この場合、`/doctor`は検索をOKとして表示します。**解決策：**
- **より具体的な検索を送信**：ディレクトリやファイルタイプを指定して検索するファイル数を減らす：「auth-serviceパッケージでJWT検証ロジックを検索」または「JSファイルでmd5ハッシュの使用を見つける」。
- **プロジェクトをLinuxファイルシステムに移動**：可能であれば、プロジェクトがWindowsファイルシステム（`/mnt/c/`）ではなくLinuxファイルシステム（`/home/`）に配置されていることを確認してください。
- **代わりにネイティブWindowsを使用**：より良いファイルシステムパフォーマンスのために、WSLを通してではなくWindows上でClaude Codeをネイティブに実行することを検討してください。
## ​]IDE統合の問題
### ​]WSL2でJetBrains IDEが検出されない
WSL2でJetBrains IDEと共にClaude Codeを使用していて「利用可能なIDEが検出されません」エラーが発生する場合、これはWSL2のネットワーク設定またはWindows Firewallが接続をブロックしていることが原因の可能性があります。
#### ​]WSL2ネットワークモード
WSL2はデフォルトでNATネットワークを使用し、これがIDE検出を妨げる可能性があります。2つのオプションがあります：**オプション1：Windows Firewallを設定**（推奨）
- WSL2 IPアドレスを見つける：コピーAIに質問
wsl hostname -I# 出力例：172.21.123.456
- 管理者としてPowerShellを開き、ファイアウォールルールを作成：コピーAIに質問
New-NetFirewallRule -DisplayName "Allow WSL2 Internal Traffic" -Direction Inbound -Protocol TCP -Action Allow -RemoteAddress 172.21.0.0/16 -LocalAddress 172.21.0.0/16
（ステップ1のWSL2サブネットに基づいてIP範囲を調整）
- IDEとClaude Codeの両方を再起動**オプション2：ミラードネットワークに切り替え**Windowsユーザーディレクトリの`.wslconfig`に追加：コピーAIに質問
[wsl2]networkingMode=mirrored
次に、PowerShellから`wsl --shutdown`でWSLを再起動。これらのネットワーク問題はWSL2のみに影響します。WSL1はホストのネットワークを直接使用し、これらの設定は必要ありません。追加のJetBrains設定のヒントについては、[IDE統合ガイド]を参照してください。
### ​]Windows IDE統合問題の報告（ネイティブとWSLの両方）
WindowsでIDE統合の問題が発生している場合は、以下の情報と共に[問題を作成]してください：ネイティブ（git bash）かWSL1/WSL2か、WSLネットワークモード（NATまたはミラード）、IDE名/バージョン、Claude Code拡張/プラグインバージョン、シェルタイプ（bash/zsh/など）
### ​]JetBrains（IntelliJ、PyCharmなど）ターミナルでESCキーが機能しない
JetBrainsターミナルでClaude Codeを使用していて、ESCキーが期待通りにエージェントを中断しない場合、これはJetBrainsのデフォルトショートカットとのキーバインドの競合が原因の可能性があります。この問題を修正するには：
- 設定 → ツール → ターミナルに移動
- 以下のいずれかを実行：
- 「Escapeでエディターにフォーカスを移動」のチェックを外す、または
- 「ターミナルキーバインドを設定」をクリックし、「エディターにフォーカスを切り替え」ショートカットを削除
- 変更を適用これによりESCキーがClaude Code操作を適切に中断できるようになります。
## ​]Markdownフォーマットの問題
Claude Codeは時々、コードフェンスに言語タグが欠けているMarkdownファイルを生成し、GitHub、エディター、ドキュメントツールでの構文ハイライトと可読性に影響を与える可能性があります。
### ​]コードブロックの言語タグの欠如
生成されたMarkdownで以下のようなコードブロックに気づいた場合：コピーAIに質問
```function example() { return "hello";}```
適切にタグ付けされたブロックの代わりに：コピーAIに質問
```javascriptfunction example() { return "hello";}```
**解決策：**
- **Claudeに言語タグの追加を依頼**：単純に「このMarkdownファイルのすべてのコードブロックに適切な言語タグを追加してください」と要求。
- **後処理フックを使用**：欠けている言語タグを検出して追加する自動フォーマットフックを設定。実装の詳細については[Markdownフォーマットフックの例]を参照。
- **手動検証**：Markdownファイルを生成した後、適切なコードブロックフォーマットを確認し、必要に応じて修正を要求。
### ​]一貫性のない間隔とフォーマット
生成されたMarkdownに過度の空行や一貫性のない間隔がある場合：**解決策：**
- **フォーマット修正を要求**：Claudeに「このMarkdownファイルの間隔とフォーマットの問題を修正してください」と依頼。
- **フォーマットツールを使用**：生成されたMarkdownファイルで`prettier`やカスタムフォーマットスクリプトなどのMarkdownフォーマッターを実行するフックを設定。
- **フォーマット設定を指定**：プロンプトやプロジェクト[メモリ]ファイルにフォーマット要件を含める。
### ​]Markdown生成のベストプラクティス
フォーマットの問題を最小限に抑えるために：
- **要求で明示的に**：「言語タグ付きコードブロックを含む適切にフォーマットされたMarkdown」を要求
- **プロジェクト規約を使用**：[CLAUDE.md]で好みのMarkdownスタイルを文書化
- **検証フックを設定**：一般的なフォーマット問題を自動的に検証・修正する後処理フックを使用
## ​]さらなるヘルプの取得
ここでカバーされていない問題が発生している場合：
- Claude Code内で`/bug`コマンドを使用してAnthropicに直接問題を報告
- 既知の問題について[GitHubリポジトリ]を確認
- `/doctor`を実行してClaude Codeインストールの健全性をチェック
- Claudeの機能と特徴について直接Claudeに質問 - Claudeはそのドキュメントへの組み込みアクセスを持っています
このページは役に立ちましたか？はいいいえ[Model Context Protocol (MCP)]⌘I