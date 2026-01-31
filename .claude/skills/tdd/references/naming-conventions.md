# 命名規則

## 関数名

| 種類 | 命名パターン | 例 |
|------|-------------|-----|
| Query（単体取得） | `get{対象}` | `getUserProfile`, `getCourse` |
| Query（一覧取得） | `get{対象}List`, `list{対象}s` | `getCourseList`, `listUsers` |
| Query（統合） | `get{画面名}Data` | `getMypageData`, `getMtopData` |
| Command（作成） | `create{対象}` | `createCourse`, `createUser` |
| Command（更新） | `update{対象}` | `updateCourse`, `updateUserSettings` |
| Command（削除） | `delete{対象}` | `deleteCourse`, `deleteUser` |
| Command（状態変更） | `{動詞}{対象}` | `publishCourse`, `archiveUser` |

## ファイル名

| 種類 | 命名パターン | 例 |
|------|-------------|-----|
| Query/Command | kebab-case | `get-course-list.ts` |
| テストファイル | kebab-case + `.test.ts` | `get-course-list.test.ts` |
| 型定義 | kebab-case | `course-types.ts` |

## ディレクトリ構造

```
webapp/src/server/{domain}/
├── queries/                    # 読み取り操作
│   ├── get-course-list.ts
│   └── get-user-profile.ts
├── commands/                   # 書き込み操作
│   ├── create-course.ts
│   └── update-user-settings.ts
└── __tests__/                  # テストファイル
    ├── get-course-list.test.ts
    └── create-course.test.ts
```

## 変数名

### 良い命名

```typescript
// 明確な意図を表現
const publishedCourses = courses.filter(c => c.status === 'published');
const activeLearningPaths = paths.filter(p => p.isActive);
const totalCourseCount = courses.length;
```

### 悪い命名

```typescript
// 意図が不明確
const data = courses.filter(c => c.status === 'published');
const list = paths.filter(p => p.isActive);
const count = courses.length;
```

## 型名

| 種類 | 命名パターン | 例 |
|------|-------------|-----|
| 入力パラメータ | `{関数名}Params` | `GetCourseListParams` |
| 出力型 | `{関数名}Result` | `GetCourseListResult` |
| DBから推論 | `typeof {table}.$inferSelect` | `typeof courses.$inferSelect` |

```typescript
// 入力パラメータの型
interface GetCourseListParams {
  limit?: number;
  offset?: number;
  categoryId?: string;
}

// 出力型（DBスキーマから推論）
type CourseListItem = typeof courses.$inferSelect;

// または明示的に定義
interface CourseListItem {
  id: string;
  title: string;
  description: string;
  // ...
}
```

## テストの命名

### describe の命名

```typescript
describe('{関数名} - {責務の日本語説明}', () => {
  // ...
});

// 例
describe('getCourseList - 講座一覧取得', () => {});
describe('createUser - ユーザー作成', () => {});
```

### it の命名

```typescript
// 振る舞いを日本語で記述
it('公開中の講座のみが取得されること', ...);
it('講座が存在しない場合、空配列が返ること', ...);
it('DBエラー時に適切なエラーがスローされること', ...);
```

## GitHub Issue/ブランチ

| 種類 | 命名パターン | 例 |
|------|-------------|-----|
| 親Issue | `[Prototype] {画面名}バックエンド実装` | `[Prototype] m-topページバックエンド実装` |
| サブIssue | `[TDD] {親番号}-{N}: {責務名}` | `[TDD] 136-1: 講座一覧取得Query` |
| 親ブランチ | `feature/{親番号}-{機能名}` | `feature/136-course-list-backend` |
| サブブランチ | `feature/{親番号}-{N}-{サブ機能名}` | `feature/136-1-get-course-list` |

## コミットメッセージ

| フェーズ | プレフィックス | 例 |
|---------|---------------|-----|
| テストスケルトン | `test:` | `test: Add test skeleton for getCourseList (#252)` |
| テスト実装 | `test:` | `test: Implement test cases for getCourseList (#252)` |
| 実装（Green） | `feat:` | `feat: Implement getCourseList to pass tests (#252)` |
| リファクタリング | `refactor:` | `refactor: Improve getCourseList code quality` |
