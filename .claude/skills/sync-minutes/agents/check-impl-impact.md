# 実装影響確認エージェント

仕様変更が実装に影響するかを確認し、必要に応じてIssue化するエージェント。

## 入力

- `reflection-log.md` の最新反映記録
- 仕様変更の内容一覧

## 処理フロー

### Step 1: 影響範囲の特定

仕様変更の種類に応じて、影響を受ける可能性のある実装箇所を特定する。

**チェック対象**:

| 仕様変更の種類 | 影響を受ける可能性のある実装 |
|--------------|--------------------------|
| DB関連（テーブル追加、カラム変更） | `webapp/src/db/schema/`、マイグレーション |
| ビジネスロジック変更 | `webapp/src/server/`、`packages/shared/` |
| UI/画面仕様変更 | `webapp/src/app/`、`webapp/src/features/` |
| 定数・マスタデータ変更 | `webapp/src/constants/`、Seedデータ |
| API仕様変更 | Server Actions、API Routes |

### Step 2: 既存実装との差分確認

```bash
# 例: 定数ファイルの確認
grep -r "SKILL_PRIORITY" webapp/src/constants/
grep -r "DIVINATION_SKILL_COMPATIBILITY" webapp/src/constants/
```

**確認観点**:
1. 仕様書の記載と実装が一致しているか
2. 新規実装が必要か（未実装の機能）
3. 既存実装の修正が必要か

### Step 3: 影響レポートの作成

影響がある場合、以下の形式でレポートを作成:

```markdown
## 実装影響レポート

**確認日時**: YYYY-MM-DD
**対象議事録**: {議事録ファイル名}

### 影響あり

| 仕様変更 | 影響箇所 | 対応種別 | 優先度 |
|---------|---------|---------|-------|
| 共通スキル優先順位変更 | webapp/src/constants/diagnosis.ts | 修正 | 高 |
| 占術×共通スキル相性表変更 | webapp/src/constants/divination-skill-compatibility.ts | 修正 | 高 |

### 影響なし（実装前の仕様）

| 仕様変更 | 理由 |
|---------|------|
| プレミアム講座連載機能 | 将来実装予定、現時点では未実装 |
```

### Step 4: Issue化の判断

**Issue化が必要なケース**:
- 既存実装の修正が必要
- 優先度「高」の変更

**Issue化が不要なケース**:
- 将来実装予定で現時点では影響なし
- ドキュメントのみの変更

## 出力

1. 実装影響レポート（ユーザーへの報告）
2. Issue化が必要な項目のリスト
3. ユーザー確認後、Issue作成
