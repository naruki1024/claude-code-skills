# テストスケルトン例

## 講座一覧取得（getCourseList）

```typescript
import { describe, it, expect } from 'vitest';

describe('getCourseList - 講座一覧取得', () => {
  describe('正常系', () => {
    it('公開中の講座のみが取得されること', async () => {
      // TODO: Arrange/Act/Assert を実装
      expect(true).toBe(false); // 意図的に失敗（Red）
    });

    it('講座が存在しない場合、空配列が返ること', async () => {
      expect(true).toBe(false);
    });

    it('講座に講師情報が含まれること', async () => {
      expect(true).toBe(false);
    });

    it('講座にサムネイルURLが含まれること', async () => {
      expect(true).toBe(false);
    });

    it('新着順（publishedAt降順）でソートされること', async () => {
      expect(true).toBe(false);
    });
  });

  describe('ページネーション', () => {
    it('limit指定で取得件数が制限されること', async () => {
      expect(true).toBe(false);
    });

    it('offset指定で開始位置がスキップされること', async () => {
      expect(true).toBe(false);
    });
  });

  describe('フィルタリング', () => {
    it('カテゴリIDで絞り込みができること', async () => {
      expect(true).toBe(false);
    });

    it('タイトルに部分一致する講座が返ること', async () => {
      expect(true).toBe(false);
    });
  });

  describe('異常系', () => {
    it('DBエラー時に適切なエラーがスローされること', async () => {
      expect(true).toBe(false);
    });
  });

  describe('境界値', () => {
    it('limit=0の場合、空配列が返ること', async () => {
      expect(true).toBe(false);
    });

    it('offsetがデータ件数を超える場合、空配列が返ること', async () => {
      expect(true).toBe(false);
    });
  });
});
```

## ユーザープロフィール取得（getUserProfile）

```typescript
import { describe, it, expect } from 'vitest';

describe('getUserProfile - ユーザープロフィール情報取得', () => {
  describe('正常系', () => {
    it('ユーザーIDでプロフィールが取得できること', async () => {
      expect(true).toBe(false);
    });

    it('プロフィールにユーザー名が含まれること', async () => {
      expect(true).toBe(false);
    });

    it('プロフィールにアバターURLが含まれること', async () => {
      expect(true).toBe(false);
    });

    it('プロフィールにメールアドレスが含まれること', async () => {
      expect(true).toBe(false);
    });
  });

  describe('異常系', () => {
    it('存在しないユーザーIDの場合、nullが返ること', async () => {
      expect(true).toBe(false);
    });

    it('無効なユーザーIDの場合、バリデーションエラーがスローされること', async () => {
      expect(true).toBe(false);
    });
  });
});
```

## 振る舞い記述のポイント

### 良い例

```typescript
// 業務的な振る舞いを記述
it('公開中の講座のみが取得されること', ...);
it('新着順（publishedAt降順）でソートされること', ...);
it('存在しないユーザーIDの場合、nullが返ること', ...);
```

### 悪い例

```typescript
// 実装詳細に依存した記述
it('SQLのWHERE句が正しいこと', ...);
it('配列のsortメソッドが呼ばれること', ...);
it('DBクエリが1回だけ実行されること', ...);
```
