# browser-use CLI リファレンス

## インストール

```bash
# pip でインストール
pip install browser-use[cli]

# または uv でインストール
uv add browser-use
uvx browser-use install  # Chromium インストール
```

## 基本コマンド

### ブラウザを開く

```bash
browser-use open <url>
```

指定した URL をブラウザで開く。

### 現在の状態を取得

```bash
browser-use state
```

現在のページ状態（DOM、URL など）を取得。

### 要素をクリック

```bash
browser-use click --selector "<selector>"
```

CSS セレクタで指定した要素をクリック。

### テキストを入力

```bash
browser-use type --selector "<selector>" --text "<text>"
```

指定した要素にテキストを入力。

### スクリーンショットを撮影

```bash
browser-use screenshot --output <filename>
```

現在の画面をスクリーンショットとして保存。

## セッション管理

複数のブラウザセッションを並行管理:

```bash
# セッションを指定して実行
browser-use open <url> -s <session_id>
browser-use click --selector "<selector>" -s <session_id>

# 別セッション
browser-use open <another_url> -s session2

# セッションを終了
browser-use close -s <session_id>
```

## オプション

| オプション | 説明 |
|-----------|------|
| `-s, --session` | セッション ID を指定 |
| `--headless` | ヘッドレスモードで実行（デフォルト） |
| `--headed` | ヘッド付きモードで実行（ウィンドウ表示） |
| `--timeout` | タイムアウト時間（秒） |
| `--wait` | 操作後の待機時間（秒） |

## 高度な使用法

### JavaScript の実行

```bash
browser-use eval "document.title"
```

### 複数操作のスクリプト

```bash
browser-use script <<EOF
open https://example.com
wait 2
click --selector "#login-btn"
type --selector "#email" --text "user@example.com"
type --selector "#password" --text "password123"
click --selector "#submit"
screenshot --output result.png
EOF
```

## 環境変数

| 変数 | 説明 |
|------|------|
| `BROWSER_USE_API_KEY` | ChatBrowserUse モデル用 API キー |
| `OPENAI_API_KEY` | OpenAI 使用時の API キー |

## トラブルシューティング

| 問題 | 解決策 |
|------|--------|
| Chromium が見つからない | `uvx browser-use install` を実行 |
| API キーエラー | 環境変数を設定 |
| タイムアウト | `--timeout` オプションで延長 |
| 要素が見つからない | セレクタを確認、待機時間を追加 |
