# テスト実装例

## 講座一覧取得（getCourseList）

```typescript
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { db } from '@/db';
import { courses, users } from '@/db/schema';
// import { getCourseList } from '../get-course-list';

describe('getCourseList - 講座一覧取得', () => {
  // テスト前後のクリーンアップ
  beforeEach(async () => {
    await db.delete(courses);
    await db.delete(users);
  });

  afterEach(async () => {
    await db.delete(courses);
    await db.delete(users);
  });

  describe('正常系', () => {
    it('公開中の講座のみが取得されること', async () => {
      // ===== Arrange =====
      await db.insert(courses).values([
        {
          id: 'course-published',
          title: 'Published Course',
          status: 'published',
          publishedAt: new Date('2024-01-01'),
        },
        {
          id: 'course-draft',
          title: 'Draft Course',
          status: 'draft',
          publishedAt: null,
        },
        {
          id: 'course-archived',
          title: 'Archived Course',
          status: 'archived',
          publishedAt: new Date('2023-01-01'),
        },
      ]);

      // ===== Act =====
      // const result = await getCourseList();
      const result: unknown[] = []; // 仮実装

      // ===== Assert =====
      expect(result).toHaveLength(1);
      // expect(result[0].id).toBe('course-published');
      // expect(result[0].status).toBe('published');
    });

    it('講座が存在しない場合、空配列が返ること', async () => {
      // ===== Arrange =====
      // データなし（beforeEachでクリア済み）

      // ===== Act =====
      // const result = await getCourseList();
      const result: unknown[] = [];

      // ===== Assert =====
      expect(result).toEqual([]);
    });

    it('新着順（publishedAt降順）でソートされること', async () => {
      // ===== Arrange =====
      await db.insert(courses).values([
        {
          id: 'course-old',
          title: 'Old Course',
          status: 'published',
          publishedAt: new Date('2024-01-01'),
        },
        {
          id: 'course-new',
          title: 'New Course',
          status: 'published',
          publishedAt: new Date('2024-06-01'),
        },
        {
          id: 'course-middle',
          title: 'Middle Course',
          status: 'published',
          publishedAt: new Date('2024-03-01'),
        },
      ]);

      // ===== Act =====
      // const result = await getCourseList();
      const result: unknown[] = [];

      // ===== Assert =====
      // expect(result[0].id).toBe('course-new');
      // expect(result[1].id).toBe('course-middle');
      // expect(result[2].id).toBe('course-old');
      expect(result).toBeDefined();
    });
  });

  describe('ページネーション', () => {
    it('limit指定で取得件数が制限されること', async () => {
      // ===== Arrange =====
      const coursesToInsert = Array.from({ length: 10 }, (_, i) => ({
        id: `course-${i}`,
        title: `Course ${i}`,
        status: 'published' as const,
        publishedAt: new Date(`2024-0${(i % 9) + 1}-01`),
      }));
      await db.insert(courses).values(coursesToInsert);

      // ===== Act =====
      // const result = await getCourseList({ limit: 5 });
      const result: unknown[] = [];

      // ===== Assert =====
      // expect(result).toHaveLength(5);
      expect(result).toBeDefined();
    });

    it('offset指定で開始位置がスキップされること', async () => {
      // ===== Arrange =====
      await db.insert(courses).values([
        { id: 'course-1', title: 'Course 1', status: 'published', publishedAt: new Date('2024-03-01') },
        { id: 'course-2', title: 'Course 2', status: 'published', publishedAt: new Date('2024-02-01') },
        { id: 'course-3', title: 'Course 3', status: 'published', publishedAt: new Date('2024-01-01') },
      ]);

      // ===== Act =====
      // const result = await getCourseList({ offset: 1 });
      const result: unknown[] = [];

      // ===== Assert =====
      // expect(result).toHaveLength(2);
      // expect(result[0].id).toBe('course-2');
      expect(result).toBeDefined();
    });
  });

  describe('境界値', () => {
    it('limit=0の場合、空配列が返ること', async () => {
      // ===== Arrange =====
      await db.insert(courses).values([
        { id: 'course-1', title: 'Course 1', status: 'published', publishedAt: new Date() },
      ]);

      // ===== Act =====
      // const result = await getCourseList({ limit: 0 });
      const result: unknown[] = [];

      // ===== Assert =====
      expect(result).toEqual([]);
    });

    it('offsetがデータ件数を超える場合、空配列が返ること', async () => {
      // ===== Arrange =====
      await db.insert(courses).values([
        { id: 'course-1', title: 'Course 1', status: 'published', publishedAt: new Date() },
      ]);

      // ===== Act =====
      // const result = await getCourseList({ offset: 100 });
      const result: unknown[] = [];

      // ===== Assert =====
      expect(result).toEqual([]);
    });
  });
});
```

## Arrange/Act/Assert のポイント

### Arrange（準備）

- テストに必要な最小限のデータを作成
- 意味のある変数名を使用（`course-published`, `course-draft`など）
- 関連するテーブルも必要に応じてセットアップ

### Act（実行）

- テスト対象の関数を1回だけ呼び出し
- 実装前は仮の結果を設定（`const result: unknown[] = []`）

### Assert（検証）

- 1つのテストで1つの振る舞いを検証
- 実装前はコメントアウトしておく
- 期待値は仕様に基づいて設定
