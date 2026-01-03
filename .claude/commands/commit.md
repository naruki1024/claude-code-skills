---
description: 変更内容を確認してgitコミットを作成
allowed-tools: Bash(git add:*), Bash(git status:*), Bash(git commit:*), Bash(git diff:*), Bash(git log:*)
---

# Git コミットコマンド

## コンテキスト
- 現在のgitステータス: !`git status`
- ステージされた変更: !`git diff --cached --stat`
- 現在のブランチ: !`git branch --show-current`
- 最近のコミット: !`git log --oneline -5`

## タスク
上記の変更内容を確認し、適切なコミットメッセージを生成してコミットを作成します。

## コミットメッセージ規則
- 1行目: 50文字以内の要約（型: 説明）
- 型の例: feat, fix, docs, style, refactor, test, chore
- **メッセージは日本語で記述**（型は英語、略語可）
- 必要に応じて本文で詳細を説明

### 例
```
feat: Issue チェーンワークフロー追加
fix: API エンドポイントのバグ修正
refactor: ドキュメント構成を整理
```

## 手順
1. 変更内容を確認
2. 適切なコミットメッセージを提案
3. ユーザーの確認を得てからコミット実行
