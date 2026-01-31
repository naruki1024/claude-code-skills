---
name: browser-use
description: Python browser-useライブラリを使用したAIエージェントによるブラウザ自動操作。自然言語でタスクを指示し、Webサイトのナビゲート、フォーム入力、データ収集を自動実行する。
allowed-tools: Read, Write, Bash, Task, Glob, Grep
---

# Browser Use Skill

## 概要

Python の browser-use ライブラリを活用して、AIエージェントによるブラウザ自動操作を実行するスキル。自然言語でタスクを指示するだけで、Webサイトをナビゲートし、フォーム入力、データ収集、各種操作を自動実行する。

**リポジトリ**: https://github.com/browser-use/browser-use
**ドキュメント**: https://docs.browser-use.com

## ユースケース

- 自然言語指示でのWebブラウザ操作
- Webスクレイピング・データ収集
- フォームへの自動入力・送信
- 複数ページにまたがる情報収集
- ログインが必要なサイトでの操作
- リサーチ自動化

## 実行トリガー

- `/browser-use`
- `/browser-use {url} {task-description}`
- 「browser-useを使って〜」
- 「Pythonでブラウザ操作して〜」
- 「自然言語でWebを操作して〜」

## ワークフロー

```
Phase 1: 環境準備
├── 1.1 Python環境確認 (3.11+)
├── 1.2 browser-useインストール確認
└── 1.3 API キー設定確認

Phase 2: タスク実行
├── 2.1 タスク分析 (task-analyzer)
├── 2.2 ブラウザ操作実行 (browser-operator)
└── 2.3 エラーハンドリング

Phase 3: 結果抽出
├── 3.1 データ抽出 (result-extractor)
├── 3.2 スクリーンショット整理
└── 3.3 結果レポート
```

---

## Phase 1: 環境準備

### 1.1 Python環境確認

```bash
python3 --version  # 3.11以上が必要
```

### 1.2 browser-use インストール確認・実行

```bash
# インストール確認
pip show browser-use

# 未インストールの場合
pip install browser-use[cli]
# または
uv add browser-use && uvx browser-use install
```

### 1.3 API キー設定（オプション）

ChatBrowserUse モデルを使用する場合:
```bash
export BROWSER_USE_API_KEY=your-api-key
```

OpenAI を使用する場合:
```bash
export OPENAI_API_KEY=your-api-key
```

---

## Phase 2: タスク実行

### 2.1 タスク分析

Task ツールで `task-analyzer` エージェントに委譲:

```
入力:
- ユーザーからの自然言語タスク指示
- ターゲット URL（指定がある場合）

出力:
- 実行可能なタスク記述
- ブラウザモード推奨
- 認証要件の有無
```

エージェント仕様: `agents/task-analyzer.md`

### 2.2 ブラウザ操作実行

Task ツールで `browser-operator` エージェントに委譲:

```
入力:
- タスク記述
- ターゲット URL
- ブラウザモード設定

出力:
- 操作結果
- 取得データ
- スクリーンショット（必要時）
```

エージェント仕様: `agents/browser-operator.md`

### 実行方法

#### CLI での実行

```bash
# URLを開く
browser-use open https://example.com

# 現在の状態取得
browser-use state

# 要素クリック
browser-use click --selector "#login-btn"

# テキスト入力
browser-use type --selector "#email" --text "user@example.com"

# スクリーンショット
browser-use screenshot --output result.png
```

#### Python スクリプトでの実行

```python
from browser_use import Agent, Browser
import asyncio

async def main():
    browser = Browser()
    agent = Agent(
        task="GitHubリポジトリのスター数を調べてください",
        browser=browser,
    )
    history = await agent.run()
    return history

asyncio.run(main())
```

### ブラウザモード

| モード | 選択基準 | 設定方法 |
|--------|----------|----------|
| Headless | デフォルト。高速、GUIなし | `--headless` |
| Headed | 可視ウィンドウで動作確認 | `--headed` |
| Real Chrome | 既存ログイン状態を維持 | プロファイル指定 |
| Cloud Browser | ステルス+プロキシ対応 | `CloudBrowser()` |

---

## Phase 3: 結果抽出

### 3.1 データ抽出

Task ツールで `result-extractor` エージェントに委譲:

```
入力:
- 操作結果
- 抽出対象の指定
- 期待する出力形式

出力:
- 構造化データ（JSON/テキスト）
- メタデータ（取得日時、ソースURL）
```

エージェント仕様: `agents/result-extractor.md`

### 3.2 結果レポート

ユーザーへの報告内容:
- 実行したタスクの概要
- 取得したデータ/結果
- 操作中の注意点・エラー（あれば）
- スクリーンショット（必要時）

---

## 参照リソース

| リソース | 用途 | 読み込みタイミング |
|----------|------|-------------------|
| `references/cli-reference.md` | CLI コマンド一覧 | CLI実行時 |
| `references/browser-modes.md` | ブラウザモード設定 | モード選択時 |
| `references/task-patterns.md` | タスクパターン | タスク分析時 |
| `references/error-handling.md` | エラー処理 | エラー発生時 |

---

## 使用例

### 基本: ページ情報取得

```
/browser-use https://example.com ページの概要を教えて
```

### リサーチ自動化

```
/browser-use RTX 4090とRTX 4080の価格と性能を比較して
```

### フォーム入力

```
/browser-use https://form.example.com 問い合わせフォームに以下を入力: 名前=山田太郎
```

### データ収集

```
/browser-use https://news.example.com 最新ニュースの見出しを5件取得
```

---

## 注意事項

- Python 3.11以上が必要
- 認証情報はログに出力しない
- 破壊的な操作（削除、送信）は実行前に確認
- レート制限のあるサイトでは適切な待機を入れる
- 個人情報を含むデータの取り扱いに注意
- Playwright MCP と同時使用時はブラウザ競合に注意

## e2e-test スキルとの使い分け

| 観点 | browser-use | e2e-test (Playwright MCP) |
|------|-------------|---------------------------|
| 操作方式 | 自然言語指示 | セレクタ/ref指定 |
| 用途 | 汎用ブラウザ自動化 | テスト・検証 |
| 言語 | Python | TypeScript (MCP経由) |
| 強み | 柔軟な指示、スクレイピング | 再現性、テストレポート |
