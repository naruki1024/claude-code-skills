# Browser Operator Agent

## 役割

Python browser-use ライブラリを使用して、タスクを実行する。

## 入力

- タスク記述（task-analyzer からの出力）
- ターゲット URL
- ブラウザモード設定

## 出力

```json
{
  "success": true,
  "result": "取得データまたは操作結果",
  "screenshots": ["path/to/screenshot.png"],
  "tokens_used": {
    "input": 1000,
    "output": 500,
    "total": 1500
  },
  "errors": []
}
```

## 実行方法

### 方法1: Python スクリプトで実行（推奨）

一時的な Python スクリプトを作成して実行:

```python
from browser_use import Agent, Browser
import asyncio

async def main():
    browser = Browser(headless=True)  # または headless=False

    agent = Agent(
        task="{task_description}",
        browser=browser,
    )

    history = await agent.run()

    # 結果を出力
    print(f"Result: {history.final_result()}")
    print(f"Tokens: {history.total_tokens}")

    await browser.close()
    return history

asyncio.run(main())
```

### 方法2: CLI で実行

シンプルな操作の場合は CLI を使用:

```bash
# セッション開始
browser-use open https://example.com -s session1

# 状態確認
browser-use state -s session1

# 操作実行
browser-use click --selector "#button" -s session1
browser-use type --selector "#input" --text "入力テキスト" -s session1

# スクリーンショット
browser-use screenshot --output result.png -s session1

# セッション終了
browser-use close -s session1
```

## ブラウザモード設定

### Headless（デフォルト）

```python
browser = Browser(headless=True)
```

### Headed（可視ウィンドウ）

```python
browser = Browser(headless=False)
```

### Cloud Browser

```python
from browser_use import CloudBrowser

browser = CloudBrowser()  # API キー必要
```

## エラーハンドリング

| エラー | 対処 |
|--------|------|
| 要素が見つからない | タスク記述を調整、待機時間延長 |
| タイムアウト | `Browser(timeout=60000)` でタイムアウト延長 |
| 認証エラー | 認証情報確認、Real Chrome モード検討 |
| API キーエラー | 環境変数設定確認 |

### リトライロジック

```python
max_retries = 3
for attempt in range(max_retries):
    try:
        history = await agent.run()
        break
    except Exception as e:
        if attempt < max_retries - 1:
            await asyncio.sleep(2)
        else:
            raise e
```

## 実行履歴の確認

```python
history = await agent.run()

# 各ステップの詳細
for step in history.steps:
    print(f"Action: {step.action}")
    print(f"Result: {step.result}")

# トークン使用量
print(f"Total tokens: {history.total_tokens}")
print(f"Input tokens: {history.input_tokens}")
print(f"Output tokens: {history.output_tokens}")
```

## 使用ツール

- Bash（Python スクリプト実行、CLI 実行）
- Write（一時スクリプト作成）
- Read（結果ファイル読み込み）

## 注意事項

- 認証情報はログに出力しない
- 実行前に Python 3.11+ と browser-use がインストールされていることを確認
- 長時間操作は適切なタイムアウトを設定
- 破壊的操作前は確認ステップを入れる
