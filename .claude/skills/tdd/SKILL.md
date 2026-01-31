---
name: tdd
description: TDD（テスト駆動開発）ワークフローを実行する。親Issue作成、サブIssue分解、テストスケルトン作成、テスト実装、Green達成までの一連のサイクルを支援。/tdd, /tdd-create-parent-issue, /tdd-issue-breakdown, /tdd-test-skeleton, /tdd-test-impl, /tdd-green コマンドで使用。
---

# TDD 開発フロースキル

TDD（テスト駆動開発）を実践するためのワークフロースキル。
バックエンド実装（Query/Command）を、テスト駆動で段階的に進めます。

## ワークフロー概要

```
Phase 0: 作業環境準備（worktree + env.local）
    ↓
Phase 1: 親Issue作成
    ↓ CHECKPOINT（人間レビュー）
Phase 2: サブIssue分解
    ↓ CHECKPOINT（人間レビュー）
Phase 3-5: サブIssueごとにTDDサイクル
    ├─ Phase 3: テストスケルトン作成 → Red状態
    │      ↓ CHECKPOINT（最重要）
    ├─ Phase 4: テストコード実装 → Red状態
    │      ↓ CHECKPOINT
    └─ Phase 5: 実装 → Green → Refactor
           ↓ CHECKPOINT
Phase 6: PR作成
```

---

## Phase 0: 作業環境準備（必須）

### 概要

git worktreeで作業ブランチを作成し、環境変数のシンボリックリンクを設定する。
**このフェーズは必須**。メインリポジトリから実行すること。

### 参照コマンド

1. **worktree作成**: [/gtr-worktree](../../commands/gtr-worktree.md)
2. **env.local symlink**: [/env-local-symlink](../../commands/env-local-symlink.md)

### 手順

#### 1. worktree作成

```bash
# メインリポジトリから実行
git fetch origin
git gtr new feature/<issue番号>-<機能名> --from tdd/main
```

**ブランチ命名規則**: `feature/<issue番号>-<機能名>`
- 例: `feature/483-instructor-list`
- 例: `feature/500-course-detail`

#### 2. env.local symlink作成

```bash
# 作成したworktreeに移動
cd $(git worktree list | grep "feature/<issue番号>" | awk '{print $1}')

# シンボリックリンク作成
./scripts/link-webapp-env-local.sh --profile "lightsail"
```

#### 3. 確認

```bash
# symlinkが正しく設定されていることを確認
ls -la webapp/.env.local

# エディタで開く
git gtr editor feature/<issue番号>-<機能名>
```

### 出力

- worktreeパス: `/path/to/worktrees/feature/<issue番号>-<機能名>`
- ブランチ: `feature/<issue番号>-<機能名>`
- env.local symlink: `webapp/.env.local` → 中央のenvファイル

### 注意事項

- **メインリポジトリから実行**: worktree内からではなく、メインリポジトリから実行
- **Phase 1以降はworktree内で作業**: 環境準備後はworktree内で作業を継続

---

## Phase 1: 親Issue作成

**このフェーズを実行する場合**: [agents/create-parent-issue.md](agents/create-parent-issue.md) を読み込んで指示に従う

**事前に読むリファレンス**: [references/branch-strategy.md](references/branch-strategy.md)

### 概要

フロント実装を分析し、バックエンド実装に必要なQuery/Commandを洗い出し、TDD実装のための親Issueを作成する。

### 入力

- 画面名（例: m-topページ）
- フロントIssue番号（例: #123）
- 機能概要書・仕様書

### 出力

- GitHub親Issue
- 親Issue専用ブランチ（`feature/{親Issue番号}-{機能名}`）
- ローカル作業ファイル（`.cursor/tdd-work/issue-{親Issue番号}/parent-issue.md`）

### CHECKPOINT

親Issue内容をレビュー → 承認後、Phase 2へ

---

## Phase 2: サブIssue分解

**このフェーズを実行する場合**: [agents/issue-breakdown.md](agents/issue-breakdown.md) を読み込んで指示に従う

**事前に読むリファレンス**: [references/tdd-principles.md](references/tdd-principles.md)

### 概要

親Issueをテスト可能な最小単位（サブIssue）に分解し、TDD実装に適した順序で整理する。

### 入力

- 親Issue番号
- 親Issueファイル（`.cursor/tdd-work/issue-{親Issue番号}/parent-issue.md`）

### 出力

- GitHubサブIssue（複数）
- サブIssue作業ファイル（`.cursor/tdd-work/issue-{親Issue番号}/sub-issues/`）
- 実装順序（依存関係考慮）

### CHECKPOINT

サブIssue分解結果をレビュー → 承認後、Phase 3へ

---

## Phase 3: テストスケルトン作成（Red）

**このフェーズを実行する場合**: [agents/test-skeleton.md](agents/test-skeleton.md) を読み込んで指示に従う

**事前に読むリファレンス**: [references/test-patterns.md](references/test-patterns.md)

**具体例が必要な場合**: [references/examples/test-skeleton-example.md](references/examples/test-skeleton-example.md)

### 概要

テストの骨格（describe/it構造）を作成する。**テストの中身は書かず**、振る舞いの定義のみを行う。

### 入力

- Sub-Issue番号
- サブIssueファイル

### 出力

- テストファイル（`webapp/src/server/{domain}/__tests__/{function-name}.test.ts`）
- describe/it構造（日本語で振る舞いを記述）
- 意図的に失敗するテスト（Red状態）

### CHECKPOINT（最重要）

振る舞い定義をレビュー → **ここがズレると以降のテスト・実装が全て無駄になる** → 承認後、Phase 4へ

---

## Phase 4: テストコード実装（Red）

**このフェーズを実行する場合**: [agents/test-impl.md](agents/test-impl.md) を読み込んで指示に従う

**事前に読むリファレンス**: [references/test-patterns.md](references/test-patterns.md)

**具体例が必要な場合**: [references/examples/test-impl-example.md](references/examples/test-impl-example.md)

### 概要

Arrange/Act/Assertパターンでテストコードを実装する。**プロダクションコードは書かず**、テストコードのみを完成させる。

### 入力

- Sub-Issue番号
- テストスケルトンファイル

### 出力

- 完成したテストコード（まだRed状態）
- DBセットアップ/クリーンアップ

### CHECKPOINT

テストデータ・アサーションをレビュー → 承認後、Phase 5へ

---

## Phase 5: 実装（Green）

**このフェーズを実行する場合**: [agents/green.md](agents/green.md) を読み込んで指示に従う

**事前に読むリファレンス**: [references/naming-conventions.md](references/naming-conventions.md)

**具体例が必要な場合**: [references/examples/implementation-example.md](references/examples/implementation-example.md)

### 概要

テストをパスする最小限の実装を作成し、リファクタリングを経て品質を向上させる。

### 入力

- Sub-Issue番号
- 完成したテストコード

### 出力

- 実装ファイル（`webapp/src/server/{domain}/{function-name}.ts`）
- Green状態のテスト
- リファクタリング済みコード

### CHECKPOINT

実装・リファクタリングをレビュー → 承認後、次のサブIssueへ（または全完了ならPhase 6へ）

---

## Phase 6: PR作成

全サブIssue完了後、tdd/mainに向けてPRを作成。

```bash
gh pr create --base tdd/main --head feature/{親Issue番号}-{機能名} \
  --title "feat: {機能名} バックエンド実装 (#{親Issue番号})"
```

---

## リファレンス一覧

必要に応じて参照:

| リファレンス | 内容 | 参照タイミング |
|-------------|------|---------------|
| [tdd-principles.md](references/tdd-principles.md) | TDDの原則・分解粒度 | Phase 2 |
| [branch-strategy.md](references/branch-strategy.md) | ブランチ運用ルール | Phase 1, 全フェーズ |
| [test-patterns.md](references/test-patterns.md) | テストパターン・AAA | Phase 3, 4 |
| [naming-conventions.md](references/naming-conventions.md) | 命名規則 | Phase 5 |
| [review-checklist.md](references/review-checklist.md) | レビューチェックリスト | 各CHECKPOINT |
| [tdd-work-files.md](references/tdd-work-files.md) | TDD作業ファイル説明 | 全フェーズ |

---

## 具体例

| 例 | 内容 |
|----|------|
| [test-skeleton-example.md](references/examples/test-skeleton-example.md) | テストスケルトンの書き方 |
| [test-impl-example.md](references/examples/test-impl-example.md) | Arrange/Act/Assertの実装例 |
| [implementation-example.md](references/examples/implementation-example.md) | Query/Commandの実装例 |

---

## CHECKPOINTの確認観点

**詳細**: [references/review-checklist.md](references/review-checklist.md)

| CHECKPOINT | 確認観点 | 重要度 |
|------------|---------|--------|
| 親Issue | フロント整合性、Query/Command設計 | 必須 |
| サブIssue分解 | 粒度・依存関係・順序 | 必須 |
| 振る舞い定義 | describe/itが仕様を正しく反映しているか | **最重要** |
| テストデータ | Arrangeのデータが仕様の意図を表現しているか | 必須 |
| 実装 | 過剰な実装・抽象化がないか | 必須 |

---

## ブランチ運用

**詳細**: [references/branch-strategy.md](references/branch-strategy.md)

```
tdd/main（TDD統合ブランチ）
    │
    ├── feature/{親Issue番号}-{機能名}（親Issue専用ブランチ）
    │       │
    │       ├── feature/{親Issue番号}-{N}-{サブ機能名}
    │       │       └── TDDサイクル → 親ブランチにマージ
    │       │
    │       └── ... 全サブIssue完了 → tdd/main に PR
```

---

## TDD作業ファイル

**詳細**: [references/tdd-work-files.md](references/tdd-work-files.md)

```
.cursor/tdd-work/issue-{親Issue番号}/
├── parent-issue.md          # 親イシューの内容
├── summary.md               # サブイシュー一覧サマリー
├── issue-index.md           # Issue番号 → ファイル対応表
└── sub-issues/
    └── #{GitHub Issue番号}.md
```

---

## 前提条件

- **git worktree運用（必須）**: メインリポジトリからworktreeを作成して作業
- **env.local symlink設定（必須）**: `./scripts/link-webapp-env-local.sh` でシンボリックリンクを設定
- canpass-appディレクトリ内で作業中
- `gh` CLIがインストール・認証済み
- `tdd/main` ブランチが存在
- Vitest環境がセットアップ済み
- Drizzle ORM環境がセットアップ済み

---

## 参照ドキュメント（プロジェクト）

### 仕様関連

| 目的 | 参照先 |
|------|--------|
| アプリ全体仕様 | `docs/01.specifications/CanPass_サイト機能概要書_ダイエット版.md` |
| 画面構造・URL | `docs/01.specifications/ディレクトリマップ.tsv` |
| **機能別仕様** | `docs/01.specifications/` 配下でIssueに関連するもの全て |

### 設計関連

| 目的 | 参照先 |
|------|--------|
| 機能別設計 | `docs/02.design/` 配下でIssueに関連するもの全て |
| DBエンティティ棚卸し | `docs/02.design/DB/20251218_entity_inventory.md` |
| Drizzle ORMスキーマ（優先） | `webapp/src/db/schema/` |

### マスタデータ

| 目的 | 参照先 |
|------|--------|
| マスタデータ元 | `docs/03.data/` 配下 |

### 仕様書確認の原則

> **重要**: Issueに関連しそうな仕様書は `docs/01.specifications/` と `docs/02.design/` から**すべて**確認すること。
