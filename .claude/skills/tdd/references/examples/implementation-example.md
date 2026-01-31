# 実装例

## Query関数の典型パターン

### 講座一覧取得（getCourseList）

```typescript
// webapp/src/server/courses/get-course-list.ts

import { db } from '@/db';
import { courses, users } from '@/db/schema';
import { eq, desc, and } from 'drizzle-orm';

// 入力パラメータの型定義
interface GetCourseListParams {
  limit?: number;
  offset?: number;
  categoryId?: string;
}

// 戻り値の型（DBスキーマから推論）
type CourseListItem = typeof courses.$inferSelect;

/**
 * 講座一覧を取得する
 *
 * - 公開中（status='published'）の講座のみ取得
 * - 新着順（publishedAt降順）でソート
 */
export async function getCourseList(
  params: GetCourseListParams = {}
): Promise<CourseListItem[]> {
  const { limit = 20, offset = 0, categoryId } = params;

  // limit=0 の場合は空配列を返す
  if (limit === 0) {
    return [];
  }

  // 条件を動的に構築（and()で結合）
  const conditions = categoryId
    ? and(eq(courses.status, 'published'), eq(courses.categoryId, categoryId))
    : eq(courses.status, 'published');

  return db
    .select()
    .from(courses)
    .where(conditions)
    .orderBy(desc(courses.publishedAt))
    .limit(limit)
    .offset(offset);
}
```

### ユーザープロフィール取得（getUserProfile）

```typescript
// webapp/src/server/user/get-user-profile.ts

import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

// 戻り値の型
interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
}

/**
 * ユーザープロフィールを取得する
 *
 * @param userId - ユーザーID
 * @returns ユーザープロフィール、存在しない場合はnull
 */
export async function getUserProfile(
  userId: string
): Promise<UserProfile | null> {
  const result = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      avatarUrl: users.avatarUrl,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  return result[0] ?? null;
}
```

## Command関数の典型パターン

### 講座作成（createCourse）

```typescript
// webapp/src/server/courses/create-course.ts

import { db } from '@/db';
import { courses } from '@/db/schema/courses';
import { z } from 'zod';
import { nanoid } from 'nanoid';

// 入力バリデーションスキーマ
const CreateCourseInput = z.object({
  title: z.string().min(1).max(100),
  description: z.string().max(1000),
  instructorId: z.string(),
  categoryId: z.string(),
});

type CreateCourseInput = z.infer<typeof CreateCourseInput>;

/**
 * 新規講座を作成する
 *
 * @param input - 講座作成パラメータ
 * @returns 作成した講座のID
 */
export async function createCourse(
  input: CreateCourseInput
): Promise<{ id: string }> {
  // バリデーション
  const validated = CreateCourseInput.parse(input);

  // 講座作成
  const id = nanoid();
  await db.insert(courses).values({
    id,
    ...validated,
    status: 'draft',
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return { id };
}
```

## JOINを使用するQuery

### 講座詳細取得（getCourseDetail）

```typescript
// webapp/src/server/courses/get-course-detail.ts

import { db } from '@/db';
import { courses, users, categories } from '@/db/schema';
import { eq } from 'drizzle-orm';

interface CourseDetail {
  id: string;
  title: string;
  description: string;
  instructor: {
    id: string;
    name: string;
  };
  category: {
    id: string;
    name: string;
  };
}

export async function getCourseDetail(
  courseId: string
): Promise<CourseDetail | null> {
  const result = await db
    .select({
      id: courses.id,
      title: courses.title,
      description: courses.description,
      instructor: {
        id: users.id,
        name: users.name,
      },
      category: {
        id: categories.id,
        name: categories.name,
      },
    })
    .from(courses)
    .leftJoin(users, eq(courses.instructorId, users.id))
    .leftJoin(categories, eq(courses.categoryId, categories.id))
    .where(eq(courses.id, courseId))
    .limit(1);

  return result[0] ?? null;
}
```

## 実装のポイント

### 最小限の実装

```typescript
// ✅ テストをパスする最小限の実装
export async function getCourseList(): Promise<Course[]> {
  return db
    .select()
    .from(courses)
    .where(eq(courses.status, 'published'));
}

// ❌ 過剰な実装（テストにないキャッシュ機能）
export async function getCourseList(): Promise<Course[]> {
  const cached = await redis.get('courses');
  if (cached) return cached;

  const result = await db
    .select()
    .from(courses)
    .where(eq(courses.status, 'published'));

  await redis.set('courses', result, 3600);
  return result;
}
```

### 配置場所

```
webapp/src/server/{domain}/
├── queries/
│   ├── get-course-list.ts
│   └── get-course-detail.ts
├── commands/
│   └── create-course.ts
└── __tests__/
    ├── get-course-list.test.ts
    └── create-course.test.ts
```
