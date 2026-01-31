# テストパターンガイド

## パターン構造

各テストパターンは以下のJSON構造を持つ:

```json
{
  "id": "TS-001",
  "priority": "P0",
  "name": "テスト名",
  "preconditions": ["前提条件1", "前提条件2"],
  "steps": [
    { "action": "navigate", "target": "/path" },
    { "action": "click", "target": "button#submit" },
    { "action": "type", "target": "input#search", "value": "検索文字" },
    { "action": "wait", "condition": "text", "value": "結果表示" }
  ],
  "expected": {
    "elements": ["result-list", "pagination"],
    "text": ["検索結果"],
    "noErrors": true
  }
}
```

---

## 優先度分類

| 優先度 | 基準 | 例 |
|--------|------|-----|
| **P0** | ビジネスクリティカル、必ずテストすべき | ログイン、主要機能、データ送信 |
| **P1** | 重要機能、多くのユーザーが使用 | 検索、フィルタリング、一覧表示 |
| **P2** | あると望ましい、使用頻度が低い | ソート、エクスポート、詳細設定 |

### 優先度の判断基準

- **P0**: 機能しないとアプリケーションが使えない
- **P1**: 機能しないと主要なワークフローが阻害される
- **P2**: 機能しなくても代替手段がある

---

## アクション種別

| アクション | 説明 | 必須パラメータ | オプション |
|-----------|------|---------------|-----------|
| `navigate` | ページ遷移 | `target` (URL) | - |
| `click` | クリック | `target` (セレクタ or ref) | `button`, `modifiers` |
| `type` | テキスト入力 | `target`, `value` | `submit`, `clear` |
| `select` | ドロップダウン選択 | `target`, `value` | - |
| `wait` | 待機 | `condition`, `value` | `timeout` |
| `snapshot` | スナップショット取得 | - | `filename` |
| `screenshot` | スクリーンショット | - | `filename`, `fullPage` |
| `assert` | アサーション | `type`, `value` | - |

### wait の condition

| condition | 説明 | value |
|-----------|------|-------|
| `text` | テキストが表示される | 待機するテキスト |
| `textGone` | テキストが消える | 消えるテキスト |
| `time` | 指定時間待機 | 秒数 |

### assert の type

| type | 説明 | value |
|------|------|-------|
| `visible` | 要素が表示されている | セレクタ or ref |
| `hidden` | 要素が非表示 | セレクタ or ref |
| `text` | テキストが含まれる | 期待するテキスト |
| `noErrors` | コンソールエラーがない | - |

---

## シナリオファイル形式

Markdown形式でのシナリオ記述:

```markdown
# テストシナリオ: 機能名

## 概要

このシナリオは○○機能のE2Eテストを定義します。

## 前提条件

- 開発サーバーが起動している（http://localhost:3000）
- テストデータが投入されている

---

### TS-001: ユーザー一覧表示 [P0]

**前提条件:**
- 管理者としてログイン済み

**手順:**
1. /admin/users にアクセス
2. ユーザー一覧テーブルが表示されるまで待機

**期待結果:**
- テーブルが表示される
- ページネーションが表示される
- 件数が表示される

---

### TS-002: ユーザー検索 [P1]

**前提条件:**
- ユーザー一覧ページを表示

**手順:**
1. 検索フィールドに「田中」と入力
2. 検索ボタンをクリック
3. 結果が表示されるまで待機

**期待結果:**
- 「田中」を含むユーザーのみ表示される
- 検索結果件数が更新される
```

---

## パターン変換ルール

### Markdown → JSON 変換

```markdown
### TS-001: ユーザー一覧表示 [P0]
```

↓

```json
{
  "id": "TS-001",
  "priority": "P0",
  "name": "ユーザー一覧表示"
}
```

### 手順の変換

```markdown
1. /admin/users にアクセス
2. ユーザー一覧テーブルが表示されるまで待機
```

↓

```json
"steps": [
  { "action": "navigate", "target": "http://localhost:3000/admin/users" },
  { "action": "wait", "condition": "text", "value": "ユーザー一覧" }
]
```

### キーワード対応

| 手順の記述 | action |
|-----------|--------|
| 〜にアクセス | `navigate` |
| 〜をクリック | `click` |
| 〜と入力 | `type` |
| 〜を選択 | `select` |
| 〜まで待機 | `wait` |
| 〜を確認 | `snapshot` + `assert` |

---

## 基本パターンテンプレート

### ページアクセス確認

```json
{
  "id": "BASIC-001",
  "priority": "P0",
  "name": "トップページ表示",
  "steps": [
    { "action": "navigate", "target": "http://localhost:3000" },
    { "action": "snapshot" }
  ],
  "expected": {
    "noErrors": true
  }
}
```

### フォーム送信

```json
{
  "id": "FORM-001",
  "priority": "P0",
  "name": "検索フォーム送信",
  "steps": [
    { "action": "navigate", "target": "http://localhost:3000" },
    { "action": "snapshot" },
    { "action": "type", "target": "textbox[0]", "value": "検索ワード" },
    { "action": "click", "target": "button[0]" },
    { "action": "wait", "condition": "text", "value": "検索結果" }
  ],
  "expected": {
    "text": ["検索結果"],
    "noErrors": true
  }
}
```

### ナビゲーション

```json
{
  "id": "NAV-001",
  "priority": "P1",
  "name": "ページ間遷移",
  "steps": [
    { "action": "navigate", "target": "http://localhost:3000" },
    { "action": "snapshot" },
    { "action": "click", "target": "link[0]" },
    { "action": "wait", "condition": "text", "value": "詳細ページ" },
    { "action": "snapshot" }
  ],
  "expected": {
    "noErrors": true
  }
}
```

---

## 変更ファイルからの推測ルール

| 変更ファイルパターン | 推測パターン |
|---------------------|-------------|
| `src/app/page.tsx` | 基本ナビゲーション、UI表示 |
| `src/app/api/**` | API応答確認、エラーハンドリング |
| `src/components/**` | コンポーネント表示確認 |
| `src/lib/**` | 関連機能の動作確認 |
| `public/**` | 静的リソースの読み込み確認 |
