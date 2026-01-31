# 実装修正Issue作成エージェント

仕様変更に伴う実装修正のIssueを作成し、GitHub Projectに追加するエージェント。

## 前提条件

- `gh` CLI がインストール・認証済み
- リポジトリ: `zap-cocoloni/canpass-app`
- Project: `zap-cocoloni` 組織の `CanPass`（Project #2）

## 入力

- 実装影響レポート（check-impl-impact.mdの出力）
- ユーザーがIssue化を承認した項目

## Issue作成テンプレート

### 単一の修正の場合

```bash
REPO_OWNER="zap-cocoloni"
REPO_NAME="canpass-app"
PROJECT_OWNER="zap-cocoloni"
PROJECT_NUMBER="2"

TITLE="[仕様変更対応] {変更内容の要約}"
LABELS="spec-change"

BODY="$(cat <<'EOF'
## 概要

仕様変更に伴い、実装の修正が必要です。

## 変更元

- **議事録**: {議事録ファイル名}
- **反映日**: {反映日}
- **仕様書**: {反映先仕様書}

## 仕様変更内容

{仕様変更の詳細}

## 影響を受ける実装

| ファイル | 変更内容 |
|---------|---------|
| {ファイルパス} | {変更内容} |

## 対応内容

- [ ] {具体的な修正タスク1}
- [ ] {具体的な修正タスク2}

## 参考資料

- 仕様書: `{仕様書パス}`
- 反映記録: `docs/reflection-log.md`
EOF
)"
```

### 複数の修正をまとめる場合

```bash
TITLE="[仕様変更対応] {議事録名}に伴う実装修正"
LABELS="spec-change"

BODY="$(cat <<'EOF'
## 概要

{議事録名}での仕様変更に伴い、複数の実装修正が必要です。

## 変更元

- **議事録**: {議事録ファイル名}
- **反映日**: {反映日}

## 修正項目一覧

| # | 仕様変更 | 影響ファイル | 対応内容 |
|---|---------|------------|---------|
| 1 | {変更1} | {ファイル1} | {対応1} |
| 2 | {変更2} | {ファイル2} | {対応2} |

## サブタスク

- [ ] {タスク1}
- [ ] {タスク2}

## 参考資料

- 反映記録: `docs/reflection-log.md`
EOF
)"
```

## Issue作成コマンド

```bash
# 1) Project確認
PROJECT_TITLE_ACTUAL="$(gh api graphql -f query='
query($login: String!, $number: Int!) {
  organization(login: $login) {
    projectV2(number: $number) {
      title
      closed
    }
  }
}
' -F login="$PROJECT_OWNER" -F number="$PROJECT_NUMBER" --jq '.data.organization.projectV2.title')"

if [ "$PROJECT_TITLE_ACTUAL" != "CanPass" ]; then
  echo "❌ abort: Project mismatch" >&2
  exit 1
fi

echo "✅ preflight ok: $PROJECT_OWNER project #$PROJECT_NUMBER ($PROJECT_TITLE_ACTUAL)"

# 2) Issue作成
ISSUE_URL="$(gh issue create \
  --repo "$REPO_OWNER/$REPO_NAME" \
  --title "$TITLE" \
  --body "$BODY" \
  --label "$LABELS" \
  --json url \
  --jq '.url')"

echo "✅ created: $ISSUE_URL"

# 3) Projectへ追加
gh project item-add "$PROJECT_NUMBER" --owner "$PROJECT_OWNER" --url "$ISSUE_URL"

ISSUE_NUMBER="${ISSUE_URL##*/}"
echo "✅ added to project: #$PROJECT_NUMBER / issue=#$ISSUE_NUMBER"
```

## 出力

- 作成されたIssueのURL
- Project追加の確認
