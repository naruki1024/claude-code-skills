# ブラウザモード設定ガイド

## モード一覧

### Headless モード（デフォルト）

ブラウザウィンドウを表示せずにバックグラウンドで実行。

**設定:**
```python
browser = Browser(headless=True)
```

**CLI:**
```bash
browser-use open <url> --headless
```

**特徴:**
- 高速
- リソース消費が少ない
- 目視確認不要な自動化に最適

**使用場面:**
- データ取得
- スクレイピング
- 定期実行タスク
- CI/CD パイプライン

### Headed モード

ブラウザウィンドウを表示して実行。

**設定:**
```python
browser = Browser(headless=False)
```

**CLI:**
```bash
browser-use open <url> --headed
```

**特徴:**
- 操作が目視できる
- デバッグしやすい
- ユーザーに進捗を見せられる

**使用場面:**
- デバッグ時
- 複雑な操作の確認
- ユーザーへのデモ
- 初回テスト時

### Real Chrome モード

ユーザーの既存の Chrome ブラウザプロファイルを使用。

**設定:**
```python
browser = Browser(
    chrome_instance_path="/path/to/chrome/profile"
)
```

**特徴:**
- 既存のログイン状態を維持
- Cookie、セッションが保持される
- 拡張機能が使用可能

**使用場面:**
- ログインが必要なサービス
- 2FA が設定されているサイト
- ユーザー固有の設定が必要な場合

**注意:**
- Chrome が起動していない状態で使用
- プロファイルのパスを正しく指定

### Cloud Browser モード

Browser Use Cloud を使用。

**設定:**
```python
from browser_use import CloudBrowser

browser = CloudBrowser()  # BROWSER_USE_API_KEY が必要
```

**特徴:**
- ステルス機能（ボット検出回避）
- プロキシ対応
- IP ローテーション
- 自動 CAPTCHA 処理

**使用場面:**
- ボット対策が厳しいサイト
- 地理的制限のあるコンテンツ
- 大規模スクレイピング
- 本番環境デプロイ

**料金:**
- 詳細は https://cloud.browser-use.com を参照

## モード選択ガイドライン

| 条件 | 推奨モード |
|------|-----------|
| 認証不要、シンプルな取得 | Headless |
| デバッグ、操作確認 | Headed |
| 既存ログイン状態が必要 | Real Chrome |
| ボット対策回避が必要 | Cloud Browser |
| 不明、初回実行 | Headed（確認のため） |

## Python コード例

### モード切り替え

```python
from browser_use import Agent, Browser, CloudBrowser

# Headless
browser = Browser(headless=True)

# Headed
browser = Browser(headless=False)

# Cloud
browser = CloudBrowser()

agent = Agent(
    task="タスク内容",
    browser=browser,
)
history = await agent.run()
```

### タイムアウト設定

```python
browser = Browser(
    headless=True,
    timeout=60000  # 60秒
)
```

## トラブルシューティング

### Headless で動作しない場合

一部のサイトは Headless を検出してブロックする。
→ Headed モードまたは Cloud Browser で試す。

### Real Chrome でプロファイルが見つからない

```bash
# Chrome プロファイルパスの確認（macOS）
ls ~/Library/Application\ Support/Google/Chrome/

# Linux
ls ~/.config/google-chrome/

# Windows
dir %LOCALAPPDATA%\Google\Chrome\User Data\
```

### タイムアウトが発生する

```python
browser = Browser(timeout=120000)  # 2分に延長
```
