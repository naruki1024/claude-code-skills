# JetBrains IDE - Claude Code Documentation

## サポートされている IDE

Claude Code プラグインは、以下を含むほとんどの JetBrains IDE で動作します：

- IntelliJ IDEA
- PyCharm
- Android Studio
- WebStorm
- PhpStorm
- GoLand

## 機能

- **クイック起動**: `Cmd+Esc`（Mac）または `Ctrl+Esc`（Windows/Linux）を使用してエディターから直接 Claude Code を開くか、UI の Claude Code ボタンをクリック
- **Diff ビューイング**: コード変更は、ターミナルではなく IDE diff ビューアーに直接表示可能
- **選択コンテキスト**: IDE の現在の選択/タブが自動的に Claude Code と共有
- **ファイル参照ショートカット**: `Cmd+Option+K`（Mac）または `Alt+Ctrl+K`（Linux/Windows）を使用してファイル参照（例：@File#L1-99）を挿入
- **診断共有**: IDE からの診断エラー（lint、構文など）が自動的に Claude と共有

## インストール

### マーケットプレイスからのインストール

JetBrains マーケットプレイスから [Claude Code プラグイン](https://plugins.jetbrains.com/plugin/27310-claude-code-beta-) を見つけてインストールし、IDE を再起動します。

### 自動インストール

統合ターミナルで `claude` を実行すると、プラグインが自動的にインストールされることもあります。効果を発揮するには IDE を完全に再起動する必要があります。

**注意**: プラグインをインストール後、効果を発揮するには IDE を完全に再起動する必要があります。複数回の再起動が必要な場合があります。

## 使用方法

### IDE から

IDE の統合ターミナルから `claude` を実行すると、すべての統合機能がアクティブになります。

### 外部ターミナルから

任意の外部ターミナルで `/ide` コマンドを使用して Claude Code を JetBrains IDE に接続し、すべての機能をアクティブにします：

```bash
claude
> /ide
```

**注意**: Claude が IDE と同じファイルにアクセスできるようにしたい場合は、IDE プロジェクトルートと同じディレクトリから Claude Code を起動してください。

## 設定

### Claude Code 設定

Claude Code の設定を通じて IDE 統合を設定します：

1. `claude` を実行
2. `/config` コマンドを入力
3. diff ツールを `auto` に設定して自動 IDE 検出を実行

### プラグイン設定

**Settings → Tools → Claude Code [Beta]** に移動して Claude Code プラグインを設定します。

#### 一般設定

- **Claude command**: Claude を実行するカスタムコマンドを指定（例：`claude`、`/usr/local/bin/claude`、または `npx @anthropic/claude`）
- **Suppress notification for Claude command not found**: Claude コマンドが見つからないことに関する通知をスキップ
- **Enable using Option+Enter for multi-line prompts**（macOS のみ）: 有効にすると、Option+Enter は Claude Code プロンプトに新しい行を挿入。Option キーが予期せずキャプチャされる問題が発生している場合は無効に（ターミナルの再起動が必要）
- **Enable automatic updates**: プラグインの更新を自動的にチェックしてインストール（再起動時に適用）

**WSL ユーザー向け**: Claude コマンドとして `wsl -d Ubuntu -- bash -lic "claude"` を設定します（`Ubuntu` を WSL ディストリビューション名に置き換える）

#### ESC キー設定

ESC キーが JetBrains ターミナルで Claude Code 操作を中断しない場合：

1. **Settings → Tools → Terminal** に移動
2. 以下のいずれかを実行：
   - 「Move focus to the editor with Escape」をオフにするか、
   - 「Configure terminal keybindings」をクリックして「Switch focus to Editor」ショートカットを削除
3. 変更を適用

## 特別な設定

### リモート開発

JetBrains リモート開発を使用する場合、**Settings → Plugin (Host)** を通じてリモートホストにプラグインをインストールする必要があります。

**警告**: プラグインはローカルクライアントマシンではなく、リモートホストにインストールする必要があります。

### WSL 設定

WSL ユーザーは IDE 検出が正常に機能するために追加の設定が必要な場合があります。詳細なセットアップ手順については、[WSL トラブルシューティングガイド](/ja/troubleshooting#jetbrains-ide-not-detected-on-wsl2) を参照してください。

WSL 設定には以下が必要な場合があります：

- 適切なターミナル設定
- ネットワークモード調整
- ファイアウォール設定の更新

## トラブルシューティング

### プラグインが動作しない

- プロジェクトルートディレクトリから Claude Code を実行していることを確認
- JetBrains プラグインが IDE 設定で有効になっていることを確認
- IDE を完全に再起動（複数回の再起動が必要な場合があります）
- リモート開発の場合、プラグインがリモートホストにインストールされていることを確認

### IDE が検出されない

- プラグインがインストールされ、有効になっていることを確認
- IDE を完全に再起動
- 統合ターミナルから Claude Code を実行していることを確認
- WSL ユーザーの場合、[WSL トラブルシューティングガイド](/ja/troubleshooting#jetbrains-ide-not-detected-on-wsl2) を参照

### コマンドが見つからない

Claude アイコンをクリックして「command not found」が表示される場合：

1. Claude Code がインストールされていることを確認：`npm list -g @anthropic-ai/claude-code`
2. プラグイン設定で Claude コマンドパスを設定
3. WSL ユーザーの場合、設定セクションで説明されている WSL コマンド形式を使用

## セキュリティに関する考慮事項

Claude Code が自動編集権限が有効になっている JetBrains IDE で実行される場合、IDE によって自動的に実行される可能性のある IDE 設定ファイルを変更できる場合があります。これにより、自動編集モードで Claude Code を実行するリスクが増加し、bash 実行に対する Claude Code の権限プロンプトをバイパスできる可能性があります。

JetBrains IDE で実行する場合、以下を検討してください：

- 編集に対して手動承認モードを使用
- Claude が信頼できるプロンプトでのみ使用されることを確認するために特に注意
- Claude Code がアクセスして変更できるファイルを認識

追加のヘルプについては、[トラブルシューティングガイド](/ja/troubleshooting) を参照してください。
