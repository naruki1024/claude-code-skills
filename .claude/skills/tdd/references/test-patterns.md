# テストパターン

## Arrange/Act/Assert パターン

すべてのテストは3フェーズで構成する。

```typescript
it('公開中の講座のみが取得されること', async () => {
  // ===== Arrange（準備）=====
  // テストデータをセットアップ
  await db.insert(courses).values([
    { id: 'course-1', status: 'published', ... },
    { id: 'course-2', status: 'draft', ... },
  ]);

  // ===== Act（実行）=====
  // テスト対象の関数を呼び出し
  const result = await getCourseList();

  // ===== Assert（検証）=====
  // 期待する結果を検証
  expect(result).toHaveLength(1);
  expect(result[0].status).toBe('published');
});
```

## 振る舞い記述のルール

### 良い記述（振る舞いベース）

```typescript
describe('getCourseList - 講座一覧取得', () => {
  it('公開中の講座のみが取得されること', ...);
  it('講座が存在しない場合、空配列が返ること', ...);
  it('新着順（publishedAt降順）でソートされること', ...);
  it('limit指定で取得件数が制限されること', ...);
});
```

### 悪い記述（実装ベース）

```typescript
// ❌ これらは避ける
it('SQLクエリが正しいこと', ...);
it('filterメソッドが呼ばれること', ...);
it('配列がソートされること', ...);  // → 「新着順でソートされること」に
```

## DBテストのパターン

### セットアップ/クリーンアップ

```typescript
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { db } from '@/db';
import { courses } from '@/db/schema/courses';

describe('getCourseList - 講座一覧取得', () => {
  beforeEach(async () => {
    // テストデータをクリア
    await db.delete(courses);
  });

  afterEach(async () => {
    // テストデータをクリア
    await db.delete(courses);
  });

  // ... テストケース
});
```

### テストデータの作成

```typescript
it('新着順でソートされること', async () => {
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
  ]);

  // ===== Act =====
  const result = await getCourseList();

  // ===== Assert =====
  expect(result[0].id).toBe('course-new');
  expect(result[1].id).toBe('course-old');
});
```

## エラーケースのテスト

```typescript
describe('異常系', () => {
  it('DBエラー時に適切なエラーがスローされること', async () => {
    // ===== Arrange =====
    vi.spyOn(db, 'select').mockRejectedValueOnce(
      new Error('DB connection failed')
    );

    // ===== Act & Assert =====
    await expect(getCourseList()).rejects.toThrow('DB connection failed');
  });
});
```

## 境界値テスト

```typescript
describe('ページネーション', () => {
  it('limit=0の場合、空配列が返ること', async () => {
    // ===== Arrange =====
    await db.insert(courses).values([
      { id: 'course-1', status: 'published', ... },
    ]);

    // ===== Act =====
    const result = await getCourseList({ limit: 0 });

    // ===== Assert =====
    expect(result).toEqual([]);
  });

  it('offset がデータ件数を超える場合、空配列が返ること', async () => {
    // ===== Arrange =====
    await db.insert(courses).values([
      { id: 'course-1', status: 'published', ... },
    ]);

    // ===== Act =====
    const result = await getCourseList({ offset: 100 });

    // ===== Assert =====
    expect(result).toEqual([]);
  });
});
```

## テストスケルトン（Red状態）

```typescript
describe('{関数名} - {責務の日本語説明}', () => {
  describe('正常系', () => {
    it('{期待される振る舞い}', async () => {
      // TODO: Arrange/Act/Assert を実装
      expect(true).toBe(false); // 意図的に失敗
    });
  });

  describe('異常系', () => {
    it('{エラー条件での振る舞い}', async () => {
      expect(true).toBe(false);
    });
  });

  describe('境界値', () => {
    it('{エッジケースでの振る舞い}', async () => {
      expect(true).toBe(false);
    });
  });
});
```

## ベストプラクティス

1. **1つのテストで1つの振る舞い**
2. **テストデータは最小限**
3. **マジックナンバーを避ける**
4. **テスト間で状態を共有しない**
5. **DBスキーマとの整合性を確認**
