# Playwright MCP ツールリファレンス

## ツール命名規則

すべてのツールは `mcp__plugin_playwright_playwright__` プレフィックスを持つ:

```
mcp__plugin_playwright_playwright__browser_navigate
mcp__plugin_playwright_playwright__browser_snapshot
mcp__plugin_playwright_playwright__browser_click
...
```

---

## ナビゲーション

### browser_navigate

ページを開く

```json
{ "url": "http://localhost:3000" }
```

### browser_navigate_back

前のページに戻る（パラメータなし）

---

## ページ状態取得

### browser_snapshot

アクセシビリティスナップショットを取得

- **推奨**: スクリーンショットより高速
- **用途**: 操作に必要な ref を取得

```json
{}
```

オプション:
```json
{ "filename": "snapshot.md" }
```

出力例:
```
- button[0]: "送信"
- textbox[0]: "検索入力"
- combobox[0]: "データソース選択"
- link[0]: "ホーム"
```

### browser_take_screenshot

スクリーンショットを撮影

```json
{ "type": "png" }
```

オプション:
```json
{
  "type": "png",
  "fullPage": true,
  "filename": "error-screenshot.png"
}
```

要素のスクリーンショット:
```json
{
  "type": "png",
  "ref": "button[0]",
  "element": "送信ボタン"
}
```

---

## 操作

### browser_click

要素をクリック

```json
{
  "ref": "button[0]",
  "element": "送信ボタン"
}
```

オプション:
```json
{
  "ref": "button[0]",
  "element": "送信ボタン",
  "button": "left",
  "doubleClick": false,
  "modifiers": ["Control"]
}
```

### browser_type

テキストを入力

```json
{
  "ref": "textbox[0]",
  "text": "入力テキスト"
}
```

オプション:
```json
{
  "ref": "textbox[0]",
  "text": "入力テキスト",
  "submit": true,
  "slowly": false
}
```

### browser_select_option

ドロップダウン選択

```json
{
  "ref": "combobox[0]",
  "values": ["option1"]
}
```

複数選択:
```json
{
  "ref": "combobox[0]",
  "values": ["option1", "option2"]
}
```

### browser_fill_form

複数フィールドを一括入力

```json
{
  "fields": [
    { "name": "ユーザー名", "type": "textbox", "ref": "textbox[0]", "value": "test" },
    { "name": "パスワード", "type": "textbox", "ref": "textbox[1]", "value": "pass" },
    { "name": "記憶する", "type": "checkbox", "ref": "checkbox[0]", "value": "true" }
  ]
}
```

### browser_hover

要素にホバー

```json
{
  "ref": "button[0]",
  "element": "メニューボタン"
}
```

### browser_drag

ドラッグ&ドロップ

```json
{
  "startRef": "item[0]",
  "startElement": "ドラッグ元",
  "endRef": "dropzone[0]",
  "endElement": "ドロップ先"
}
```

### browser_press_key

キーを押す

```json
{ "key": "Enter" }
```

特殊キー: `ArrowLeft`, `ArrowRight`, `ArrowUp`, `ArrowDown`, `Escape`, `Tab`

---

## 待機

### browser_wait_for

テキスト出現、消失、または時間待機

テキスト出現待機:
```json
{ "text": "読み込み完了" }
```

テキスト消失待機:
```json
{ "textGone": "読み込み中..." }
```

時間待機（秒）:
```json
{ "time": 5 }
```

---

## デバッグ

### browser_console_messages

コンソールメッセージを取得

```json
{ "level": "error" }
```

レベル: `error`, `warning`, `info`, `debug`

オプション:
```json
{
  "level": "info",
  "filename": "console.log"
}
```

### browser_network_requests

ネットワークリクエストを取得

```json
{ "includeStatic": false }
```

静的リソースを含める:
```json
{ "includeStatic": true }
```

### browser_evaluate

JavaScript を実行

```json
{
  "function": "() => document.title"
}
```

要素に対して実行:
```json
{
  "ref": "div[0]",
  "element": "コンテナ",
  "function": "(element) => element.innerText"
}
```

---

## タブ管理

### browser_tabs

タブの操作

一覧表示:
```json
{ "action": "list" }
```

新規タブ:
```json
{ "action": "new" }
```

タブを閉じる:
```json
{ "action": "close", "index": 0 }
```

タブを選択:
```json
{ "action": "select", "index": 1 }
```

---

## ダイアログ

### browser_handle_dialog

ダイアログを処理

承諾:
```json
{ "accept": true }
```

キャンセル:
```json
{ "accept": false }
```

プロンプトに入力:
```json
{
  "accept": true,
  "promptText": "入力テキスト"
}
```

---

## ファイル

### browser_file_upload

ファイルをアップロード

```json
{
  "paths": ["/absolute/path/to/file.pdf"]
}
```

複数ファイル:
```json
{
  "paths": [
    "/path/to/file1.pdf",
    "/path/to/file2.jpg"
  ]
}
```

---

## ブラウザ制御

### browser_resize

ウィンドウサイズを変更

```json
{
  "width": 1280,
  "height": 720
}
```

### browser_close

ブラウザを閉じる（パラメータなし）

### browser_install

ブラウザをインストール（パラメータなし）

ブラウザが見つからないエラー時に使用

---

## コード実行

### browser_run_code

Playwright コードスニペットを実行

```json
{
  "code": "async (page) => { await page.getByRole('button', { name: 'Submit' }).click(); return await page.title(); }"
}
```

---

## よく使うパターン

### 基本的なページアクセスと要素確認

```
1. browser_navigate { "url": "http://localhost:3000" }
2. browser_snapshot
3. (refを確認)
4. browser_click { "ref": "button[0]", "element": "対象ボタン" }
```

### フォーム入力と送信

```
1. browser_snapshot
2. browser_type { "ref": "textbox[0]", "text": "入力値" }
3. browser_click { "ref": "button[0]", "element": "送信ボタン" }
4. browser_wait_for { "text": "送信完了" }
```

### エラー確認

```
1. browser_console_messages { "level": "error" }
2. browser_network_requests { "includeStatic": false }
3. browser_take_screenshot { "type": "png", "fullPage": true }
```
