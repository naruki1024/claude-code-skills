# TDD作業ファイル

Issue情報をローカルに保存し、各フェーズで参照する。

## ディレクトリ構造

```
.cursor/tdd-work/issue-{親Issue番号}/
├── parent-issue.md          # 親イシューの内容
├── summary.md               # サブイシュー一覧サマリー
├── issue-index.md           # Issue番号 → ファイル対応表
└── sub-issues/
    ├── done/                # 完了済みサブイシュー
    └── #{GitHub Issue番号}.md   # 各サブイシュー
```

## 各ファイルの役割

### parent-issue.md

親Issueの内容を保存。フロント実装の分析結果やQuery/Command設計が含まれる。

```markdown
# 親Issue #{番号}

## 関連Issue
- フロント実装: #{フロントIssue番号}

## 画面セクション構成
| # | セクション | コンポーネント | 対応Query/Command |
|---|-----------|---------------|------------------|
| 1 | ヘッダー | Header.tsx | getUserProfile |
| 2 | 進捗サマリー | ProgressSummary.tsx | getLearningSummary |

## 洗い出したQuery/Command
...
```

### summary.md

サブIssue一覧と実装順序のサマリー。

```markdown
# サブIssue サマリー

| # | サブIssue | 責務 | 依存 | GitHub Issue |
|---|-----------|------|------|--------------|
| 1 | 136-1 | ユーザープロフィール取得 | - | #252 |
| 2 | 136-2 | 学習進捗サマリー取得 | - | #253 |

## 推奨実装順序
1. #252 (依存なし)
2. #253 (依存なし)
```

### issue-index.md

GitHub Issue番号とファイルの対応表。

```markdown
# Issue Index

| GitHub Issue | サブIssue名 | ファイル |
|--------------|------------|---------|
| #252 | 136-1-get-user-profile | #252.md |
| #253 | 136-2-get-learning-summary | #253.md |
```

### sub-issues/#{Issue番号}.md

各サブIssueの詳細。テスト観点や実装ファイルパスが含まれる。

```markdown
# [TDD] 136-1: ユーザープロフィール情報取得Query

## 責務
ユーザーのプロフィール情報を取得する

## テスト観点
- [ ] 正常系: ユーザーIDでプロフィールが取得できること
- [ ] 正常系: アバターURLが含まれること
- [ ] 異常系: 存在しないユーザーIDの場合、nullが返ること

## 実装ファイル
- テスト: `webapp/src/server/user/__tests__/get-user-profile.test.ts`
- 実装: `webapp/src/server/user/get-user-profile.ts`

## 依存関係
- 前提: なし
- 後続: #254
```

## 保存スクリプト

### 親Issue保存

```bash
python3 .cursor/scripts/save_parent_issue.py {親Issue番号} --front-issue {フロントIssue番号}
```

### サブIssue保存

```bash
python3 .cursor/scripts/save_tdd_issues.py {親Issue番号}
```

## 各コマンドでの活用

| コマンド | 参照するファイル | 目的 |
|---------|-----------------|------|
| `/tdd-issue-breakdown` | `parent-issue.md` | 親Issueの分析結果確認 |
| `/tdd-test-skeleton` | `sub-issues/#{番号}.md` | テスト観点の確認 |
| `/tdd-test-impl` | `sub-issues/#{番号}.md` | テストデータの設計根拠 |
| `/tdd-green` | `sub-issues/#{番号}.md`, `parent-issue.md` | 実装方針の確認 |

## サブIssueファイルの探し方

```bash
# TDDコマンドで指定したIssue番号から直接ファイルを特定
cat .cursor/tdd-work/issue-{親Issue番号}/sub-issues/#252.md

# または issue-index.md で対応を確認
cat .cursor/tdd-work/issue-{親Issue番号}/issue-index.md
```

## ファイルが存在しない場合

```bash
# 親Issueファイルがない場合
python3 .cursor/scripts/save_parent_issue.py {親Issue番号}

# サブIssueファイルがない場合
python3 .cursor/scripts/save_tdd_issues.py {親Issue番号}
```
