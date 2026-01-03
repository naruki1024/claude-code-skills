---
name: develop-feature
description: GitHub issueから機能を開発し、PRを作成するまでの完全なワークフロー
allowed-tools: Read, Write, Edit, Bash, Grep, Glob, Task
---

# Feature Development Workflow

GitHub issueを起点として、設計・実装・テスト・PR作成までを一貫して行うワークフロー。

## ワークフロー概要

```
Phase 1: 分析・設計
├── 1.1 要件理解 (requirements-analyst)
├── 1.2 整合性チェック (consistency-checker)
└── 1.3 E2Eテスト設計 (e2e-designer)

Phase 2: 実装（並列可能）
├── Backend Track
│   ├── 2.1 API設計 (api-designer)
│   └── 2.2 各APIをTDD実装 (tdd-implementer) × N本
│       └── 2.3 品質チェック (quality-checker)
│
└── Frontend Track
    ├── 2.4 デザイン解析 (design-analyzer)
    ├── 2.5 コンポーネント実装 (component-builder)
    └── 2.6 画面組み上げ (layout-assembler)

Phase 3: 統合・検証
├── 3.1 Frontend/Backend統合 (integrator)
└── 3.2 E2Eテスト実行 (e2e-executor) ※Red→Green→Refactor

Phase 4: 完了
└── 4.1 PR作成 (pr-creator)
```

## 実行手順

### Phase 1: 分析・設計

#### Step 1.1: 要件理解
```
エージェント: agents/analysis/requirements-analyst.md
入力: GitHub issue URL
出力: .claude/workspaces/{feature}/requirements.md
```

#### Step 1.2: 整合性チェック
```
エージェント: agents/analysis/consistency-checker.md
入力:
  - .claude/workspaces/{feature}/requirements.md
  - プロジェクトの全体仕様ファイル（references/project-specs.md で定義）
出力:
  - 整合性レポート
  - 必要に応じて requirements.md を修正
```

#### Step 1.3: E2Eテスト設計
```
エージェント: agents/quality/e2e-designer.md
入力: .claude/workspaces/{feature}/requirements.md
出力:
  - .claude/workspaces/{feature}/e2e/test-scenarios.md
  - .claude/workspaces/{feature}/e2e/test-skeleton.spec.ts
```

### Phase 2: 実装

#### Backend Track

##### Step 2.1: API設計
```
エージェント: agents/backend/api-designer.md
入力: .claude/workspaces/{feature}/requirements.md
出力: .claude/workspaces/{feature}/api-specs/*.md（API数分）
```

##### Step 2.2: 各APIをTDD実装（API数分繰り返し）
```
エージェント: agents/backend/tdd-implementer.md
入力: .claude/workspaces/{feature}/api-specs/{api-name}.md
出力:
  - 実装コード
  - テストファイル
  - .claude/workspaces/{feature}/logs/{api-name}-implementation.md
```

##### Step 2.3: 品質チェック（各API実装後）
```
エージェント: agents/quality/quality-checker.md
入力: 実装されたAPIコード
チェック項目:
  - セキュリティ（references/security-guidelines.md）
  - コーディングガイドライン（references/coding-standards.md）
出力: 品質レポート、必要に応じて修正
```

#### Frontend Track

##### Step 2.4: デザイン解析
```
エージェント: agents/frontend/design-analyzer.md
入力:
  - GitHub issue（Figmaリンク）
  - MCP or Figma CLI経由でデザインデータ取得
出力: .claude/workspaces/{feature}/design/component-specs.md
```

##### Step 2.5: コンポーネント実装
```
エージェント: agents/frontend/component-builder.md
入力: .claude/workspaces/{feature}/design/component-specs.md
出力: 各コンポーネントファイル
```

##### Step 2.6: 画面組み上げ
```
エージェント: agents/frontend/layout-assembler.md
入力:
  - 実装済みコンポーネント
  - .claude/workspaces/{feature}/design/component-specs.md
出力: 画面ファイル
```

### Phase 3: 統合・検証

#### Step 3.1: Frontend/Backend統合
```
エージェント: agents/integration/integrator.md
入力:
  - 実装済みのFrontendコード
  - 実装済みのBackend API
出力:
  - API接続設定
  - 統合テスト結果
```

#### Step 3.2: E2Eテスト実行（Red→Green→Refactor）
```
エージェント: agents/quality/e2e-executor.md
入力:
  - .claude/workspaces/{feature}/e2e/test-skeleton.spec.ts
  - 統合済みのアプリケーション
プロセス:
  1. Red: テストスケルトンを実行（失敗確認）
  2. Green: テストが通るよう実装を調整
  3. Refactor: コード品質改善
出力: 全テストパスの確認
```

### Phase 4: 完了

#### Step 4.1: PR作成
```
エージェント: agents/integration/pr-creator.md
前提条件: E2Eテストがすべてパス
プロセス:
  1. 機能ブランチで全変更をコミット
  2. リモートにプッシュ
  3. mainブランチに対してPR作成
出力: PR URL
```

## ワークスペース構造

```
.claude/workspaces/{feature-name}/
├── context.md              # 現在の進捗状態
├── requirements.md         # 抽出・検証済み要件
├── api-specs/              # API仕様
│   ├── get-users.md
│   ├── search-users.md
│   └── export-users.md
├── design/                 # フロントエンド設計
│   └── component-specs.md
├── e2e/                    # E2Eテスト
│   ├── test-scenarios.md
│   └── test-skeleton.spec.ts
└── logs/                   # 実行ログ
    ├── requirements-analysis.md
    ├── api-1-implementation.md
    └── ...
```

## 重要ルール

1. **コンテキスト節約**: 各タスクは結果サマリ（1-3行）のみメインに返却
2. **ファイル引き継ぎ**: 詳細情報は必ずワークスペースに書き出し
3. **品質ゲート**: 各フェーズ完了時に品質チェックを通過すること
4. **ログ記録**: 詳細な作業ログは logs/ に保存
