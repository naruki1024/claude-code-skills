---
name: download-cursor-invoice
description: Cursorコンソールから最新の請求書PDFをダウンロードする
allowed-tools: Read, Write, Bash
---

# Download Cursor Invoice

Cursorの課金コンソールにアクセスし、最新の請求書PDFをダウンロードするスキル。

## 概要

Playwrightを使用してブラウザを自動操作し、Cursorの請求書ページから最新のPDFをダウンロードします。

## 前提条件

- Node.js がインストールされていること
- Playwright がインストールされていること（なければ自動インストール）
- Cursorアカウントにログイン可能であること

## 使用方法

```bash
# スクリプトを実行
node .claude/skills/download-cursor-invoice/scripts/download-invoice.js
```

## 処理フロー

1. ブラウザを起動（headed モード - 画面表示あり）
2. Cursor課金ページにアクセス
3. ログイン待機（手動でログインが必要な場合）
4. 請求書一覧から最新のものを特定
5. PDFをダウンロード
6. ダウンロード完了を通知

## 出力

- ダウンロード先: `~/Downloads/cursor-invoices/`
- ファイル名: `cursor-invoice-{YYYY-MM}.pdf`

## 注意事項

- 初回実行時はログインが必要です
- ブラウザは操作が見える状態で起動します（headedモード）
- ダウンロード完了まで待機してからブラウザを閉じます
