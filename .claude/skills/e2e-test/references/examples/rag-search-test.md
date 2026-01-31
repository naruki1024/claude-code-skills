# RAG検索比較機能 E2Eテスト例

## テスト対象

HeyGen Interactive PoC の RAG検索比較機能

- データソース: 議事録、思い出
- 検索方式: ローカル、Supabase
- 機能: 質問入力 → RAG検索 → LLM応答

---

## テストシナリオ概要

| ID | パターン | 優先度 |
|----|----------|--------|
| RAG-001 | 議事録 x ローカル検索 | P0 |
| RAG-002 | 議事録 x Supabase検索 | P0 |
| RAG-003 | 思い出 x ローカル検索 | P1 |
| RAG-004 | 思い出 x Supabase検索 | P1 |

---

## テストパターン詳細

### RAG-001: 議事録をローカル検索で取得

```json
{
  "id": "RAG-001",
  "priority": "P0",
  "name": "議事録をローカル検索で取得",
  "preconditions": [
    "開発サーバー起動済み",
    "議事録データが存在"
  ],
  "steps": [
    { "action": "navigate", "target": "http://localhost:3000" },
    { "action": "snapshot" },
    { "action": "select", "target": "データソース選択", "value": "議事録" },
    { "action": "select", "target": "検索方式選択", "value": "ローカル" },
    { "action": "type", "target": "入力フィールド", "value": "契約について教えて" },
    { "action": "click", "target": "送信ボタン" },
    { "action": "wait", "condition": "text", "value": "応答", "timeout": 30000 }
  ],
  "expected": {
    "text": ["応答が表示される"],
    "noErrors": true
  }
}
```

### RAG-002: 議事録をSupabase検索で取得

```json
{
  "id": "RAG-002",
  "priority": "P0",
  "name": "議事録をSupabase検索で取得",
  "preconditions": [
    "開発サーバー起動済み",
    "Supabaseに議事録データが存在"
  ],
  "steps": [
    { "action": "navigate", "target": "http://localhost:3000" },
    { "action": "snapshot" },
    { "action": "select", "target": "データソース選択", "value": "議事録" },
    { "action": "select", "target": "検索方式選択", "value": "Supabase" },
    { "action": "type", "target": "入力フィールド", "value": "契約について教えて" },
    { "action": "click", "target": "送信ボタン" },
    { "action": "wait", "condition": "text", "value": "応答", "timeout": 30000 }
  ],
  "expected": {
    "text": ["応答が表示される"],
    "noErrors": true
  }
}
```

### RAG-003: 思い出をローカル検索で取得

```json
{
  "id": "RAG-003",
  "priority": "P1",
  "name": "思い出をローカル検索で取得",
  "preconditions": [
    "開発サーバー起動済み",
    "思い出データが存在"
  ],
  "steps": [
    { "action": "navigate", "target": "http://localhost:3000" },
    { "action": "snapshot" },
    { "action": "select", "target": "データソース選択", "value": "思い出" },
    { "action": "select", "target": "検索方式選択", "value": "ローカル" },
    { "action": "type", "target": "入力フィールド", "value": "公園で遊んだ話を覚えてる？" },
    { "action": "click", "target": "送信ボタン" },
    { "action": "wait", "condition": "text", "value": "応答", "timeout": 30000 }
  ],
  "expected": {
    "text": ["応答が表示される"],
    "noErrors": true
  }
}
```

### RAG-004: 思い出をSupabase検索で取得

```json
{
  "id": "RAG-004",
  "priority": "P1",
  "name": "思い出をSupabase検索で取得",
  "preconditions": [
    "開発サーバー起動済み",
    "Supabaseに思い出データが存在"
  ],
  "steps": [
    { "action": "navigate", "target": "http://localhost:3000" },
    { "action": "snapshot" },
    { "action": "select", "target": "データソース選択", "value": "思い出" },
    { "action": "select", "target": "検索方式選択", "value": "Supabase" },
    { "action": "type", "target": "入力フィールド", "value": "公園で遊んだ話を覚えてる？" },
    { "action": "click", "target": "送信ボタン" },
    { "action": "wait", "condition": "text", "value": "応答", "timeout": 30000 }
  ],
  "expected": {
    "text": ["応答が表示される"],
    "noErrors": true
  }
}
```

---

## 実行例

### 手順1: ページアクセスとスナップショット

```
mcp__plugin_playwright_playwright__browser_navigate
{ "url": "http://localhost:3000" }

mcp__plugin_playwright_playwright__browser_snapshot
```

スナップショット出力例:
```
- heading "HeyGen Interactive PoC"
- combobox[0]: "データソース選択"
- combobox[1]: "検索方式選択"
- textbox[0]: "質問入力フィールド"
- button[0]: "送信"
```

### 手順2: データソース選択

```
mcp__plugin_playwright_playwright__browser_select_option
{ "ref": "combobox[0]", "values": ["議事録"] }
```

### 手順3: 検索方式選択

```
mcp__plugin_playwright_playwright__browser_select_option
{ "ref": "combobox[1]", "values": ["ローカル"] }
```

### 手順4: 質問入力

```
mcp__plugin_playwright_playwright__browser_type
{ "ref": "textbox[0]", "text": "契約について教えて" }
```

### 手順5: 送信

```
mcp__plugin_playwright_playwright__browser_click
{ "ref": "button[0]", "element": "送信ボタン" }
```

### 手順6: 応答待機

```
mcp__plugin_playwright_playwright__browser_wait_for
{ "text": "応答" }
```

注意: RAG処理は時間がかかる場合があるため、最大30秒程度待機する

### 手順7: 結果確認

```
mcp__plugin_playwright_playwright__browser_snapshot
```

### 手順8: エラー確認

```
mcp__plugin_playwright_playwright__browser_console_messages
{ "level": "error" }
```

---

## 検証ポイント

### 成功条件

1. ページが正常に読み込まれる
2. データソース/検索方式が選択できる
3. 質問入力ができる
4. 送信後に応答が表示される
5. コンソールにエラーがない

### 失敗パターン

| パターン | 確認方法 | 対処 |
|---------|---------|------|
| APIエラー | コンソールログ | ネットワークリクエスト確認 |
| タイムアウト | 待機時間超過 | 待機時間延長、API状態確認 |
| データなし | 応答が空 | テストデータ投入確認 |

---

## パフォーマンス計測

RAGパイプラインのレイテンシ目標:
- **総応答時間**: <7000ms
- **埋め込み**: <500ms
- **検索**: <200ms
- **LLM応答**: <3000ms

ネットワークリクエストから計測:
```
mcp__plugin_playwright_playwright__browser_network_requests
{ "includeStatic": false }
```

---

## トラブルシューティング

### 「応答」が表示されない

1. コンソールエラーを確認
2. ネットワークリクエストを確認（API呼び出しが発生しているか）
3. Supabaseの場合、環境変数が設定されているか確認

### 選択肢が表示されない

1. スナップショットで combobox の状態を確認
2. ページの読み込み完了を待機

### 応答が遅い

1. ネットワークリクエストで各APIの応答時間を確認
2. 待機時間を延長して再試行
