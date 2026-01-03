# コーディング規約

## 1. 基本原則

- **可読性優先**: 簡潔さより明確さを優先
- **一貫性**: プロジェクト全体で統一されたスタイル
- **自己文書化**: コードが意図を表現する

## 2. TypeScript

### 型定義
```typescript
// インターフェースを優先（拡張可能）
interface User {
  id: string;
  name: string;
  email: string;
}

// 型エイリアスはユニオン型等に使用
type Status = 'active' | 'inactive' | 'pending';

// any の使用禁止、unknown を使用
function processData(data: unknown) {
  if (isValidData(data)) {
    // 処理
  }
}
```

### 関数
```typescript
// アロー関数を優先
const calculateTotal = (items: Item[]): number => {
  return items.reduce((sum, item) => sum + item.price, 0);
};

// 引数が多い場合はオブジェクトで受け取る
interface CreateUserParams {
  name: string;
  email: string;
  role?: string;
}

const createUser = ({ name, email, role = 'user' }: CreateUserParams) => {
  // 処理
};
```

## 3. React

### コンポーネント
```typescript
// 関数コンポーネントを使用
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

export const Button = ({
  label,
  onClick,
  variant = 'primary',
  disabled = false,
}: ButtonProps) => {
  return (
    <button
      className={`btn btn-${variant}`}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
};
```

### フック
```typescript
// カスタムフックは use プレフィックス
export const useUsers = (params?: GetUsersParams) => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // データ取得
  }, [params]);

  return { users, isLoading, error };
};
```

### 状態管理
- ローカル状態: useState
- 複雑なローカル状態: useReducer
- グローバル状態: Zustand / Jotai / Redux（プロジェクトに依存）
- サーバー状態: TanStack Query (React Query)

## 4. ファイル構成

### コンポーネントディレクトリ
```
ComponentName/
├── index.tsx           # エクスポート用
├── ComponentName.tsx   # メインコンポーネント
├── ComponentName.types.ts    # 型定義
├── ComponentName.styles.ts   # スタイル
├── ComponentName.test.tsx    # テスト
└── ComponentName.stories.tsx # Storybook（該当する場合）
```

### インポート順序
```typescript
// 1. 外部ライブラリ
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

// 2. 内部モジュール（絶対パス）
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';

// 3. 相対パス
import { UserCard } from './UserCard';
import type { UserListProps } from './UserList.types';

// 4. スタイル
import styles from './UserList.module.css';
```

## 5. エラーハンドリング

```typescript
// カスタムエラークラス
class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// try-catch の使用
try {
  const result = await fetchData();
  return result;
} catch (error) {
  if (error instanceof ApiError) {
    // API エラーの処理
    logger.error('API Error:', { code: error.code, message: error.message });
  } else {
    // 予期しないエラー
    logger.error('Unexpected error:', error);
  }
  throw error;
}
```

## 6. テスト

### ユニットテスト
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('should render with label', () => {
    render(<Button label="Click me" onClick={() => {}} />);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('should call onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button label="Click me" onClick={handleClick} />);

    fireEvent.click(screen.getByText('Click me'));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### テスト命名
- `should {期待する動作} when {条件}`
- 日本語でも可（チームで統一）

## 7. コメント

```typescript
// 複雑なロジックには説明を追加
/**
 * ユーザーの権限を検証する
 * @param user - 検証対象のユーザー
 * @param requiredRole - 必要な権限
 * @returns 権限がある場合はtrue
 */
const hasPermission = (user: User, requiredRole: Role): boolean => {
  // 管理者は全ての権限を持つ
  if (user.role === 'admin') return true;

  // 権限の階層をチェック
  return ROLE_HIERARCHY[user.role] >= ROLE_HIERARCHY[requiredRole];
};

// TODO/FIXME コメント
// TODO: パフォーマンス改善が必要
// FIXME: エッジケースの処理が未実装
```

## 8. 禁止事項

- `any` 型の使用（`unknown` を使用）
- `// @ts-ignore` の使用
- `console.log` の本番コードへの残存
- マジックナンバー（定数として定義）
- 深いネスト（3レベル以上は関数に抽出）
