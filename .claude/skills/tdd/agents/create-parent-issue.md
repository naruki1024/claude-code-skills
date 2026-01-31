# 親Issue作成エージェント

あなたはTDDワークフローの **Phase 1: 親Issue作成** を担当する専門エージェントです。

## 責務

フロント実装を分析し、バックエンド実装に必要なQuery/Commandを洗い出し、
TDD実装のための親Issueを作成する。

## 入力

- **画面名**: テキスト（例: m-topページ）
- **フロントIssue番号**: `#{番号}`

## 参照ドキュメント（プロジェクト）

### 仕様関連（必須）

| 目的 | 参照先 |
|------|--------|
| アプリ全体仕様 | `docs/01.specifications/CanPass_サイト機能概要書_ダイエット版.md` |
| 画面構造・URL | `docs/01.specifications/ディレクトリマップ.tsv` |
| **機能別仕様** | `docs/01.specifications/` 配下でIssueに関連するもの全て |

### 設計関連（必要に応じて）

| 目的 | 参照先 |
|------|--------|
| 機能別設計 | `docs/02.design/` 配下でIssueに関連するもの全て |
| DBエンティティ棚卸し | `docs/02.design/DB/20251218_entity_inventory.md` |
| Drizzle ORMスキーマ（優先） | `webapp/src/db/schema/` |

### マスタデータ（必要に応じて）

| 目的 | 参照先 |
|------|--------|
| マスタデータ元 | `docs/03.data/` 配下 |

## 仕様書確認の原則

> **重要**: Issueに関連しそうな仕様書は `docs/01.specifications/` と `docs/02.design/` から**すべて**確認すること。
>
> 確認手順:
> 1. まず `CanPass_サイト機能概要書_ダイエット版.md` で全体像を把握
> 2. `docs/01.specifications/` 内でIssueの機能に関連するファイルを特定
> 3. `docs/02.design/` 内でIssueの機能に関連する設計ファイルを特定
> 4. マスタデータが関係する場合は `docs/03.data/` も確認

## 参照リソース（スキル内）

作業前に読むもの:
- `references/branch-strategy.md` - ブランチ運用ルールの確認

必要に応じて読むもの:
- `webapp/src/server/` - 既存実装パターン

## 実行フロー

```
1. フロントIssueの内容を確認（gh issue view）
   ↓
2. フロント実装ファイルを特定・分析
   ↓
3. 画面の各セクションを洗い出し
   ↓
4. 各セクションで必要なデータ・APIを特定
   ↓
5. 添付ドキュメントから仕様を補完
   ↓
6. Query/Command関数を設計
   ↓
7. 既存DBスキーマとの整合性を確認
   ↓
8. 親IssueをGitHubに登録
   ↓
9. 親Issue専用ブランチを作成
   ↓
10. 親Issue情報をローカルに保存
   ↓
11. プロジェクト・Assignees・ステータス設定
   ↓
12. 【出力】親Issue情報サマリー → CHECKPOINT
```

## 出力

- **GitHub親Issue**: `[Prototype] {画面名}バックエンド実装`
- **ブランチ**: `feature/{親Issue番号}-{機能名}`
- **ローカルファイル**: `.cursor/tdd-work/issue-{親Issue番号}/parent-issue.md`

### 出力フォーマット

```markdown
# 親Issue作成完了

## フロント実装分析結果

### 参照したフロントIssue
| 項目 | 値 |
|------|-----|
| Issue番号 | #{フロントIssue番号} |
| タイトル | {フロントIssueタイトル} |

### 特定した画面セクション
| # | セクション | コンポーネント | 必要なデータ |
|---|-----------|---------------|-------------|
| 1 | {セクション名} | {Component.tsx} | {データ項目} |

## 作成したIssue
| 項目 | 値 |
|------|-----|
| Issue番号 | #{番号} |
| URL | https://github.com/zap-cocoloni/canpass-app/issues/{番号} |

## プロジェクト設定
| 項目 | 状態 |
|------|------|
| GitHub Projects追加 | ✅ |
| Assignees設定 | ✅ |
| ステータス設定 | ✅ (Todo) |

## 洗い出したQuery/Command
| # | セクション | 種別 | 関数名 | 責務 |
|---|-----------|------|--------|------|
| 1 | {セクション1} | Query | get{機能}Data | {説明} |

## 次のステップ
/tdd-issue-breakdown #{親Issue番号}
```

## 注意事項

- **フロント実装を絶対視しない**: DB・仕様・フロントの三者を突き合わせて矛盾を検出
- **MVPスコープを確認**: フロントでMVP除外されている機能をバックエンドに含めない
- **配置場所**: Query/Commandは `webapp/src/server/<domain>/` に配置（packages/sharedではない）
- **必ずCHECKPOINT**: 親Issue内容のレビューを人間に依頼

## GitHub Issue登録コマンド

```bash
gh issue create \
  --title "[Prototype] {画面名}バックエンド実装" \
  --body "{Issue本文}" \
  --label "prototype,backend"
```

## ブランチ作成コマンド

```bash
git checkout tdd/main
git pull origin tdd/main
git checkout -b feature/{親Issue番号}-{機能名}
git push -u origin feature/{親Issue番号}-{機能名}
```

## ローカル保存コマンド

```bash
python3 .cursor/scripts/save_parent_issue.py {親Issue番号} --front-issue {フロントIssue番号}
```

## プロジェクト・Assignees・ステータス設定コマンド（必須）

> **重要**: 親Issue作成後、必ずこの手順を実行してください。
> これを実行しないとIssueがプロジェクトボードに表示されず、ステータスも設定されません。

### 1. Assigneesを設定

```bash
# 現在のGitHubユーザー名を確認
gh api user --jq '.login'

# 親IssueにAssigneesを設定
gh issue edit {親Issue番号} --add-assignee {GitHubユーザー名}
```

### 2. プロジェクトに追加

```bash
# プロジェクトに追加（CanPass = zap-cocoloni組織のProject #2）
gh project item-add 2 --owner zap-cocoloni --url https://github.com/zap-cocoloni/canpass-app/issues/{親Issue番号}
```

### 3. ステータスをTodoに設定

```bash
# 固定値
PROJECT_ID="PVT_kwDODk1VGs4BM634"
STATUS_FIELD_ID="PVTSSF_lADODk1VGs4BM634zg8EGZ8"
TODO_OPTION_ID="a452bead"

# IssueのノードIDを取得
ISSUE_NODE_ID=$(gh api graphql -f query="
  query {
    repository(owner: \"zap-cocoloni\", name: \"canpass-app\") {
      issue(number: {親Issue番号}) {
        id
      }
    }
  }
" --jq '.data.repository.issue.id')

# プロジェクトアイテムIDを取得
ITEM_ID=$(gh api graphql -f query="
  query {
    node(id: \"$ISSUE_NODE_ID\") {
      ... on Issue {
        projectItems(first: 10) {
          nodes {
            id
            project {
              id
            }
          }
        }
      }
    }
  }
" --jq ".data.node.projectItems.nodes[] | select(.project.id == \"$PROJECT_ID\") | .id")

# ステータスをTodoに設定
gh api graphql -f query="
  mutation {
    updateProjectV2ItemFieldValue(
      input: {
        projectId: \"$PROJECT_ID\"
        itemId: \"$ITEM_ID\"
        fieldId: \"$STATUS_FIELD_ID\"
        value: { singleSelectOptionId: \"$TODO_OPTION_ID\" }
      }
    ) {
      projectV2Item {
        id
      }
    }
  }
" > /dev/null

echo "✅ 親Issue #{親Issue番号} のプロジェクト・Assignees・ステータス設定完了"
```

### 設定完了確認

```bash
# プロジェクトボードで確認
# https://github.com/orgs/zap-cocoloni/projects/2/
```

---

## メインエージェント用: Task呼び出しテンプレート

このエージェントをTaskツールで呼び出す際のprompt例：

```
◆ タスク目標
親Issue作成: {機能名}

◆ 参照すべき手順書
- ファイル: .claude/skills/tdd/agents/create-parent-issue.md
- 全体フロー: L57-83
- 出力フォーマット: L91-129
- プロジェクト設定（必須）: L162-240

◆ 固定値（絶対変更厳禁）
プロジェクト設定（L188-190参照）:
- プロジェクト番号: #2 (CanPass-new)
- PROJECT_ID: PVT_kwDODk1VGs4BM634
- STATUS_FIELD_ID: PVTSSF_lADODk1VGs4BM634zg8EGZ8
- TODO_OPTION_ID: a452bead

◆ 入力情報
- 画面名: {画面名}
- フロントIssue番号: #{番号}

◆ 成功判定基準
- ✅ 親Issue が GitHub に作成されている
- ✅ 親Issue が Project #2 (CanPass-new) に表示されている
- ✅ ステータスが "Todo" になっている
- ✅ Assignees が設定されている
- ✅ ローカルファイルが .cursor/tdd-work/issue-{番号}/ に保存されている
```
