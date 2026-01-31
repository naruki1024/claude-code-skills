---
name: e2e-test
description: Playwright MCPを使用したE2Eテスト・動作確認を実行する。「E2Eテスト」「動作確認」「ブラウザテスト」「画面テスト」と依頼された場合、または /develop-feature の Phase 3.2 から呼び出される場合に使用。
allowed-tools: Read, Bash, Task, mcp__plugin_playwright_playwright__*
---

# E2E Test Skill

## 概要

Playwright MCP ツールを活用してブラウザベースのE2Eテスト・動作確認を実行するスキル。

## ワークフロー

```
Phase 1: 準備
├── 1.1 開発サーバー起動確認
├── 1.2 テストシナリオ読み込み (scenario-loader)
└── 1.3 ブラウザ初期化

Phase 2: テスト実行
├── 2.1 各シナリオを実行 (browser-operator)
│   ├── ページアクセス
│   ├── UI操作実行
│   ├── 結果待機
│   └── 検証
└── 2.2 エラー時のリカバリ

Phase 3: 結果報告
└── 3.1 結果レポート作成 (result-reporter)
```

## 実行トリガー

- `/e2e-test`
- `/e2e-test {scenario-file}`
- `/e2e-test {url} {test-pattern}`
- develop-feature Phase 3.2 からの呼び出し

## 入力パターン

| パターン | 入力 | 動作 |
|---------|------|------|
| シナリオファイル指定 | `{scenario-file.md}` | ファイルからシナリオ読み込み |
| URL + パターン | `{url} {pattern}` | 指定URLで指定パターン実行 |
| 自動検出 | なし | git diff から変更検出、推測 |

## 出力

- `.claude/workspaces/{feature}/logs/e2e-test-{timestamp}.md`
- コンソール: サマリー（Pass/Fail件数、所要時間）

## Phase 1: 準備

### 1.1 開発サーバー起動確認

```bash
curl -s http://localhost:3000 > /dev/null && echo "OK" || echo "Not running"
```

サーバーが起動していない場合は、ユーザーに起動を促すか、バックグラウンドで起動する。

### 1.2 テストシナリオ読み込み

Task ツールで `scenario-loader` エージェントに委譲:

```
入力:
- シナリオファイルパス（指定がある場合）
- git diff --name-only の結果（自動検出の場合）

出力:
- テストパターンリスト（JSON形式）
```

エージェント仕様: `agents/scenario-loader.md`

### 1.3 ブラウザ初期化

```
mcp__plugin_playwright_playwright__browser_navigate
{ "url": "http://localhost:3000" }
```

## Phase 2: テスト実行

### 2.1 各シナリオを実行

Task ツールで `browser-operator` エージェントに委譲:

```
入力:
- テストパターンリスト
- ターゲットURL

出力:
- 各ステップの実行結果
- スクリーンショット（エラー時）
- コンソールログ
```

エージェント仕様: `agents/browser-operator.md`

### 2.2 エラー時のリカバリ

- タイムアウト時はスクリーンショットを取得
- 要素が見つからない場合はスナップショットを再取得
- 詳細は `references/troubleshooting.md` を参照

## Phase 3: 結果報告

### 3.1 結果レポート作成

Task ツールで `result-reporter` エージェントに委譲:

```
入力:
- 実行結果
- テストパターンリスト

出力:
- レポートファイル（.claude/workspaces/{feature}/logs/e2e-test-{timestamp}.md）
- サマリー（コンソール出力用）
```

エージェント仕様: `agents/result-reporter.md`

## 参照リソース

| リソース | 用途 |
|----------|------|
| `references/playwright-mcp-tools.md` | Playwright MCP ツール一覧 |
| `references/test-patterns.md` | テストパターンガイド |
| `references/troubleshooting.md` | トラブルシューティング |
| `references/examples/*.md` | 具体的なテスト例 |

## 使用例

### 基本実行

```
/e2e-test
```

git diff から変更を検出し、関連するテストパターンを自動推測して実行。

### シナリオファイル指定

```
/e2e-test docs/test-scenarios/rag-search.md
```

指定したシナリオファイルからテストパターンを読み込んで実行。

### URL + パターン指定

```
/e2e-test http://localhost:3000 basic-navigation
```

指定したURLで基本ナビゲーションパターンを実行。
