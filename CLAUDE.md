# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## リポジトリ概要

Claude Code のカスタムスキル、コマンド、GitHub Actions ワークフローを管理するリポジトリ。

## コミット規則

- **メッセージは日本語で記述**（型は英語、略語可）
- 型: feat, fix, docs, style, refactor, test, chore
- 例: `feat: Issue チェーンワークフロー追加`

## アーキテクチャ

```
.claude/
├── commands/           # スラッシュコマンド定義
│   ├── commit.md      # /commit - コミット作成
│   ├── review.md      # /review - コードレビュー
│   ├── explain.md     # /explain - コード説明
│   └── fetch-docs.md  # /fetch-docs - ドキュメント取得
│
└── skills/
    └── develop-feature/    # 機能開発スキル
        ├── SKILL.md        # スキル定義（4フェーズワークフロー）
        ├── agents/         # サブエージェント定義
        │   ├── analysis/   # 要件分析、整合性チェック
        │   ├── backend/    # API設計、TDD実装
        │   ├── frontend/   # デザイン解析、コンポーネント実装
        │   ├── quality/    # E2E設計・実行、品質チェック
        │   └── integration/# 統合、PR作成
        └── references/     # 参照ドキュメント

.github/
├── ISSUE_TEMPLATE/
│   └── feature-epic.yml   # Epic Issue テンプレート
└── workflows/
    └── claude-issue-chain.yml  # Issue チェーンワークフロー

docs/
├── claude-code/    # Claude Code 公式ドキュメント
└── agent-sdk/      # Agent SDK ドキュメント
```

## Issue チェーンワークフロー

GitHub Actions で `.claude/skills/` が使用できないため、Issue チェーン方式で自動化:

1. **Epic Issue 作成** (`epic` + `claude-workflow` ラベル)
2. **自動でサブIssue生成** → 各フェーズを順次実行
3. **Issue Close** → 次のサブIssue 自動作成
4. **最終的にPR作成**

ワークスペース: `.claude/workspaces/{feature-name}/`
