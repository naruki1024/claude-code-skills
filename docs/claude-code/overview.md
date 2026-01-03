# Claude Code 概要

## 30秒で始める

**前提条件:**
- Claude.ai (推奨) または Claude Console アカウント

**Claude Code をインストール:**

### macOS/Linux
```bash
curl -fsSL https://claude.ai/install.sh | bash
```

### Homebrew
```bash
brew install --cask claude-code
```

### Windows
```powershell
irm https://claude.ai/install.ps1 | iex
```

### NPM
```bash
npm install -g @anthropic-ai/claude-code
```
*Node.js 18+ が必要です*

**Claude Code の使用を開始:**
```bash
cd your-project
claude
```

初回使用時にログインするよう促されます。

**注:** 新しい VS Code 拡張機能 (ベータ版) が利用可能です。グラフィカルインターフェースをお好みの場合は、VS Code 拡張機能をマーケットプレイスからインストールしてください。

---

## Claude Code があなたのためにすること

- **説明からフィーチャーを構築**: Claude に平易な英語で何を構築したいかを伝えます。計画を立て、コードを書き、それが機能することを確認します。

- **バグをデバッグして修正**: バグを説明するか、エラーメッセージを貼り付けます。Claude Code はコードベースを分析し、問題を特定し、修正を実装します。

- **任意のコードベースをナビゲート**: チームのコードベースについて何でも質問し、思慮深い回答を得ます。Claude Code はプロジェクト全体の構造を認識し、ウェブから最新情報を見つけることができ、MCP を使用すると Google Drive、Figma、Slack などの外部データソースから取得できます。

- **退屈なタスクを自動化**: 厄介な lint の問題を修正し、マージコンフリクトを解決し、リリースノートを作成します。開発者マシンから単一のコマンドで、または CI で自動的にすべてを実行します。

---

## 開発者が Claude Code を愛する理由

- **ターミナルで動作**: 別のチャットウィンドウではありません。別の IDE ではありません。Claude Code はあなたが既に作業している場所で、既に愛用しているツールで、あなたに会います。

- **アクションを実行**: Claude Code はファイルを直接編集し、コマンドを実行し、コミットを作成できます。MCP を使用すると、Claude は Google Drive のデザインドキュメントを読み、Jira のチケットを更新したり、あなたのカスタム開発者ツーリングを使用したりできます。

- **Unix 哲学**: Claude Code は構成可能でスクリプト化可能です。
  ```bash
  tail -f app.log | claude -p "Slack me if you see any anomalies appear in this log stream"
  ```
  が動作します。CI は以下を実行できます:
  ```bash
  claude -p "If there are new text strings, translate them into French and raise a PR for @lang-fr-team to review"
  ```

- **エンタープライズ対応**: Claude API を使用するか、AWS または GCP でホストします。エンタープライズグレードのセキュリティ、プライバシー、およびコンプライアンスが組み込まれています。

---

## 次のステップ

- **クイックスタート**: 実践的な例で Claude Code の動作を確認してください
- **一般的なワークフロー**: ワークフローのステップバイステップガイド
- **トラブルシューティング**: 一般的な問題の解決策
- **IDE セットアップ**: IDE に Claude Code を追加

---

## 追加リソース

- **Agent SDK で構築**: Claude Agent SDK でカスタム AI エージェントを作成
- **AWS または GCP でホスト**: Amazon Bedrock または Google Vertex AI で Claude Code を構成
- **設定**: ワークフローに合わせて Claude Code をカスタマイズ
- **コマンド**: CLI コマンドとコントロールについて学ぶ
- **リファレンス実装**: 開発コンテナリファレンス実装をクローン
- **セキュリティ**: Claude Code のセーフガードと安全な使用のベストプラクティス
- **プライバシーとデータ使用**: Claude Code がデータをどのように処理するかを理解
