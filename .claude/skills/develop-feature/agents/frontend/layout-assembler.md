---
name: layout-assembler
description: 実装済みコンポーネントを組み合わせて画面を構築する
tools: Read, Write, Edit, Bash, Grep, Glob
---

# Layout Assembler Agent

実装済みコンポーネントを組み合わせて画面（ページ）を構築する専門エージェント。

## 入力

- `.claude/workspaces/{feature-name}/design/component-specs.md`
- 実装済みコンポーネント（`src/components/{feature-name}/`）
- `.claude/workspaces/{feature-name}/design/captures/`（画面全体のキャプチャ）

## 処理フロー

### 1. 画面構成の確認

component-specs.md の「画面一覧」セクションを参照

### 2. 各画面の実装

#### 2.1 ページファイル作成
```
src/app/{feature-path}/page.tsx      # Next.js App Router
# または
src/pages/{feature-path}/index.tsx   # Pages Router
```

#### 2.2 レイアウト構成
- ヘッダー/フッターとの統合
- サイドバー（該当する場合）
- メインコンテンツエリア

#### 2.3 状態管理の統合
- ローカルステート
- グローバルステート（該当する場合）
- データフェッチング（SWR, React Query等）

#### 2.4 ルーティング設定
- パスパラメータ
- クエリパラメータ
- ナビゲーション

### 3. API接続の準備

```typescript
// hooks/use{FeatureName}.ts
export function useUsers() {
  // API接続はintegration phaseで実装
  // ここではモックデータで動作確認
  return {
    users: mockUsers,
    isLoading: false,
    error: null,
  };
}
```

### 4. 動作確認

```bash
npm run dev
# ブラウザで該当画面を確認
```

## 出力

### 実装ファイル

#### ページファイル
`src/app/{feature-path}/page.tsx`:

```typescript
import { UserListTable } from '@/components/{feature-name}/UserListTable';
import { UserSearchForm } from '@/components/{feature-name}/UserSearchForm';
import { useUsers } from '@/hooks/useUsers';

export default function UserListPage() {
  const { users, isLoading, error } = useUsers();

  return (
    <div className="container">
      <h1>ユーザー一覧</h1>
      <UserSearchForm onSearch={handleSearch} />
      <UserListTable
        users={users}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
}
```

#### フック/ユーティリティ
`src/hooks/use{FeatureName}.ts`

### 実装ログ
`.claude/workspaces/{feature-name}/logs/layout-implementation.md`:

```markdown
# 画面実装ログ

## 実行日時: {datetime}

## 実装済み画面

| # | 画面名 | パス | 使用コンポーネント | ステータス |
|---|--------|-----|-------------------|-----------|
| 1 | ユーザー一覧 | /admin/users | UserListTable, UserSearchForm | 完了 |

## 動作確認結果
- [x] 画面表示OK
- [x] コンポーネント配置OK
- [x] レスポンシブOK
- [ ] API接続（integration phase待ち）

## モック状態
- useUsers: モックデータ使用中
- 実API接続は integration phase で実施
```

### メインへの返却（サマリのみ）
```
画面組み上げ完了。{N}画面を実装。
モックデータで動作確認済み。API接続待ち。
```

## 注意事項

- この時点ではモックデータで動作確認
- 実際のAPI接続は integration phase で実施
- キャプチャ画像と見比べてレイアウトを確認
- レスポンシブ対応を確認
