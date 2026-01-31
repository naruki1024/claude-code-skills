# トラブルシューティングガイド

## 開発サーバー関連

### サーバーが起動していない

**症状**: `browser_navigate` でページが読み込めない、タイムアウトする

**確認方法**:
```bash
curl -s http://localhost:3000 > /dev/null && echo "OK" || echo "Not running"
```

**対処**:
```bash
# バックグラウンドで起動
npm run dev &
sleep 10

# 起動確認
curl -s http://localhost:3000 > /dev/null && echo "Started" || echo "Failed"
```

### ポートが使用中

**症状**: サーバー起動時に「Port 3000 is already in use」

**確認方法**:
```bash
lsof -i :3000
```

**対処**:
```bash
# プロセスを終了
kill -9 $(lsof -t -i :3000)

# 再起動
npm run dev
```

### ビルドエラー

**症状**: サーバーは起動するがページが表示されない

**対処**:
```bash
# クリーンビルド
rm -rf .next
npm run build
npm run dev
```

---

## ブラウザ関連

### ブラウザがインストールされていない

**症状**: 「Browser not installed」エラー

**対処**:
```
mcp__plugin_playwright_playwright__browser_install
```

### ブラウザがクラッシュ

**症状**: 操作中に応答がなくなる

**対処**:
```
mcp__plugin_playwright_playwright__browser_close
mcp__plugin_playwright_playwright__browser_navigate { "url": "http://localhost:3000" }
```

---

## 要素が見つからない

### ref が取得できない

**症状**: `browser_click` で「Element not found」

**原因**:
1. 要素がまだ読み込まれていない
2. 要素が動的に生成される
3. スナップショットが古い

**対処**:
```
# 1. 最新のスナップショットを取得
mcp__plugin_playwright_playwright__browser_snapshot

# 2. 要素の出現を待機
mcp__plugin_playwright_playwright__browser_wait_for { "text": "対象要素のテキスト" }

# 3. 再度スナップショットを取得
mcp__plugin_playwright_playwright__browser_snapshot
```

### 要素が非表示

**症状**: スナップショットに要素が表示されない

**原因**:
1. 要素がスクロール外にある
2. 要素が CSS で非表示
3. 要素が条件付きで表示

**対処**:
```
# スクロールして表示
mcp__plugin_playwright_playwright__browser_evaluate {
  "function": "() => document.querySelector('#target').scrollIntoView()"
}

# 再度スナップショット
mcp__plugin_playwright_playwright__browser_snapshot
```

### セレクタが変更された

**症状**: 以前動作していたテストが失敗

**対処**:
1. スナップショットで最新の ref を確認
2. テストパターンを更新
3. セレクタに依存しない方法を検討（テキストベースの待機など）

---

## タイムアウト

### ページ読み込みが遅い

**症状**: `browser_navigate` がタイムアウト

**対処**:
```
# ネットワーク状態を確認
mcp__plugin_playwright_playwright__browser_network_requests { "includeStatic": false }

# より長い待機時間を設定
mcp__plugin_playwright_playwright__browser_wait_for { "time": 30 }
```

### API応答が遅い

**症状**: フォーム送信後の結果表示がタイムアウト

**確認方法**:
```
mcp__plugin_playwright_playwright__browser_network_requests { "includeStatic": false }
```

**対処**:
```
# より長い待機
mcp__plugin_playwright_playwright__browser_wait_for { "text": "結果", "timeout": 60000 }
```

### 無限ローディング

**症状**: 「読み込み中...」が消えない

**確認方法**:
```
mcp__plugin_playwright_playwright__browser_console_messages { "level": "error" }
```

**対処**:
1. コンソールエラーを確認
2. ネットワークリクエストを確認
3. スクリーンショットを取得して報告

---

## 認証関連

### ログインが必要

**症状**: ページにアクセスするとログイン画面にリダイレクト

**対処**:
テスト前にログインフローを実行:
```
1. browser_navigate { "url": "http://localhost:3000/login" }
2. browser_snapshot
3. browser_type { "ref": "textbox[0]", "text": "username" }
4. browser_type { "ref": "textbox[1]", "text": "password" }
5. browser_click { "ref": "button[0]" }
6. browser_wait_for { "text": "ダッシュボード" }
```

### セッション切れ

**症状**: テスト中に認証エラー

**対処**:
1. 再ログインを実行
2. テストシナリオにセッション維持のステップを追加

---

## ダイアログ・ポップアップ

### 予期しないダイアログ

**症状**: alert や confirm で操作がブロック

**対処**:
```
mcp__plugin_playwright_playwright__browser_handle_dialog { "accept": true }
```

### Cookie同意バナー

**症状**: バナーが他の要素を隠す

**対処**:
```
# バナーを閉じる
mcp__plugin_playwright_playwright__browser_click { "ref": "button[accept-cookies]" }

# または JavaScript で非表示
mcp__plugin_playwright_playwright__browser_evaluate {
  "function": "() => document.querySelector('.cookie-banner').style.display = 'none'"
}
```

---

## デバッグ手順

### 失敗時の情報収集

```
# 1. スクリーンショット
mcp__plugin_playwright_playwright__browser_take_screenshot { "type": "png", "fullPage": true }

# 2. コンソールエラー
mcp__plugin_playwright_playwright__browser_console_messages { "level": "error" }

# 3. ネットワークリクエスト
mcp__plugin_playwright_playwright__browser_network_requests { "includeStatic": false }

# 4. ページのHTML（デバッグ用）
mcp__plugin_playwright_playwright__browser_evaluate { "function": "() => document.body.innerHTML" }
```

### 問題の切り分け

1. **ページは読み込まれているか?** → スナップショットを確認
2. **要素は存在するか?** → スナップショットで ref を確認
3. **操作は実行されたか?** → 状態変化を確認
4. **エラーは発生しているか?** → コンソールログを確認
5. **APIは正常か?** → ネットワークリクエストを確認

---

## よくあるエラーメッセージ

| エラー | 原因 | 対処 |
|--------|------|------|
| `Element not found` | ref が無効 | スナップショットを再取得 |
| `Timeout waiting for` | 要素/テキストが表示されない | 待機時間を延長、条件を確認 |
| `Navigation failed` | URLが無効、サーバー停止 | サーバー起動確認 |
| `Browser not installed` | Playwright未設定 | `browser_install` を実行 |
| `Dialog is blocking` | ダイアログ未処理 | `browser_handle_dialog` を実行 |
