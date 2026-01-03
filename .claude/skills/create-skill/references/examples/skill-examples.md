# スキルの具体例

## シンプルスキル（単一ファイル）

### コミットメッセージ生成

```
commit-helper/
└── SKILL.md
```

```markdown
---
name: generating-commit-messages
description: git diffからコミットメッセージを生成する。コミットメッセージを書く際やステージされた変更をレビューする際に使用。
---

# コミットメッセージ生成

## Instructions
1. `git diff --staged` を実行して変更を確認
2. 以下の形式でコミットメッセージを提案:
   - 50文字以内の要約
   - 詳細な説明
   - 影響を受けるコンポーネント

## Best practices
- 現在形を使用
- 「何を」「なぜ」を説明（「どのように」は不要）
```

## ツール権限付きスキル

### コードレビュアー

```
code-reviewer/
└── SKILL.md
```

```markdown
---
name: code-reviewer
description: コードのベストプラクティスと潜在的な問題をレビュー。PRのレビューやコード品質の分析時に使用。
allowed-tools: Read, Grep, Glob
---

# コードレビュアー

## レビューチェックリスト
1. コードの構造と整理
2. エラーハンドリング
3. パフォーマンスの考慮
4. セキュリティの懸念
5. テストカバレッジ
```

## マルチファイルスキル（Task分離型）

### 技術記事ライター

```
tech-article-writer/
├── SKILL.md
├── agents/
│   ├── research-agent.md
│   ├── outline-agent.md
│   ├── writer-agent.md
│   └── reviewer-agent.md
├── references/
│   ├── writing-style.md
│   ├── structure-templates.md
│   └── examples/
│       └── good-article.md
└── scripts/
    └── format_article.py
```

**SKILL.md**:
```markdown
---
name: tech-article-writer
description: 技術記事を作成する。リサーチ、アウトライン作成、執筆、レビューの4フェーズで実行。
---

# 技術記事ライター

## ワークフロー

### Phase 1: リサーチ
`agents/research-agent.md` の仕様に従いリサーチTaskを起動

### Phase 2: アウトライン
`agents/outline-agent.md` の仕様に従いアウトラインTaskを起動

### Phase 3: 執筆
`agents/writer-agent.md` の仕様に従い執筆Taskを起動

### Phase 4: レビュー
`agents/reviewer-agent.md` の仕様に従いレビューTaskを起動
```

**agents/writer-agent.md**:
```markdown
# 執筆エージェント

## 責務
アウトラインを元に技術記事の本文を執筆する。

## 入力
- リサーチ結果: `workspace/research.md`
- アウトライン: `workspace/outline.md`

## 参照リソース
作業前に読むもの:
- `references/writing-style.md`

品質確認時:
- `references/examples/good-article.md`

## 出力
- 完成した記事: `workspace/draft.md`

## 注意事項
- 1セクションずつ順番に執筆
- 箇条書き3つだけで終わるセクションを作らない
```
