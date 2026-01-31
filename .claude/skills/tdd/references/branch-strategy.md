# ブランチ運用ルール

## ブランチ構造

```
tdd/main（TDD統合ブランチ）
    │
    ├── feature/{親Issue番号}-{機能名}（親Issue専用ブランチ）
    │       │
    │       ├── feature/{親Issue番号}-{N}-{サブ機能名}（サブIssue専用）
    │       │       └── TDD実装 → 親ブランチにマージ
    │       │
    │       ├── feature/{親Issue番号}-{N+1}-{サブ機能名}
    │       │       └── TDD実装 → 親ブランチにマージ
    │       │
    │       └── ... 全サブIssue完了 → tdd/main に PR
```

## ブランチ命名規則

| ブランチ種別 | 命名パターン | 例 |
|-------------|-------------|-----|
| TDD統合ブランチ | `tdd/main` | `tdd/main` |
| 親Issue専用 | `feature/{親Issue番号}-{機能名}` | `feature/136-course-list-backend` |
| サブIssue専用 | `feature/{親Issue番号}-{N}-{サブ機能名}` | `feature/136-1-get-course-list` |

## 作業フロー

### 1. 親Issue専用ブランチ作成

```bash
git checkout tdd/main
git pull origin tdd/main
git checkout -b feature/{親Issue番号}-{機能名}
git push -u origin feature/{親Issue番号}-{機能名}
```

### 2. サブIssue専用ブランチ作成

```bash
git checkout feature/{親Issue番号}-{機能名}
git checkout -b feature/{親Issue番号}-{N}-{サブ機能名}
```

### 3. TDDサイクル実行

```
/tdd-test-skeleton → /tdd-test-impl → /tdd-green
```

### 4. サブIssue完了 → 親ブランチにマージ

```bash
git checkout feature/{親Issue番号}-{機能名}
git merge feature/{親Issue番号}-{N}-{サブ機能名}
```

### 5. 次のサブIssueへ

```bash
git checkout -b feature/{親Issue番号}-{N+1}-{次のサブ機能名}
```

### 6. 全サブIssue完了 → PR作成

```bash
git push origin feature/{親Issue番号}-{機能名}
gh pr create --base tdd/main --head feature/{親Issue番号}-{機能名} \
  --title "feat: {機能名} バックエンド実装 (#{親Issue番号})"
```

## 注意事項

1. **tdd/main は直接コミット・マージしない**
   - 必ず親Issue専用ブランチからPRを作成してマージ

2. **サブIssueは順番に実装**
   - 依存関係を考慮して実装順序を決定
   - 並行実装可能なサブIssueは別途判断

3. **PR レビュー後にマージ**
   - CodeRabbit AI レビューを活用

4. **CHECKPOINT を省略しない**
   - 特に「振る舞い定義レビュー」は最重要

## マージコンフリクト時の対応

```bash
# 親ブランチの最新を取り込む
git checkout feature/{親Issue番号}-{機能名}
git pull origin feature/{親Issue番号}-{機能名}

# サブIssueブランチでrebase
git checkout feature/{親Issue番号}-{N}-{サブ機能名}
git rebase feature/{親Issue番号}-{機能名}

# コンフリクト解消後
git rebase --continue
```
