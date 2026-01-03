# SKILL.md のフォーマット

## 基本構造

```markdown
---
name: skill-name
description: スキルの説明（何をするか＋いつ使うか）
allowed-tools: Read, Grep, Glob  # オプション
---

# スキル名

## Instructions
ステップバイステップのガイダンス

## Examples
具体的な使用例
```

## YAMLフロントマター

### 必須フィールド

| フィールド | 制約 | 説明 |
|------------|------|------|
| `name` | 小文字・数字・ハイフンのみ、最大64文字 | スキルの識別子 |
| `description` | 最大1024文字 | **何をするか + いつ使うか**の両方を含める |

### オプションフィールド

| フィールド | 説明 |
|------------|------|
| `allowed-tools` | 使用可能なツールを制限（カンマ区切り） |

## description の書き方

### 悪い例（曖昧すぎる）
```yaml
description: ドキュメントを処理する
description: データを分析する
```

### 良い例（具体的）
```yaml
description: PDFファイルからテキストを抽出し、フォームを入力する。PDFファイルや文書抽出を扱う際に使用。
description: Excelスプレッドシートを分析し、ピボットテーブルを作成する。.xlsxファイルや表形式データを扱う際に使用。
```

## allowed-tools の使い方

読み取り専用スキルの例:
```yaml
allowed-tools: Read, Grep, Glob
```

利用可能なツール:
- `Read` - ファイル読み込み
- `Write` - ファイル書き込み
- `Edit` - ファイル編集
- `Bash` - シェルコマンド実行
- `Grep` - 内容検索
- `Glob` - ファイルパターン検索
- `WebFetch` - Web取得
- `WebSearch` - Web検索
