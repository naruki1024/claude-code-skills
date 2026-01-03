# API設計規約

## 1. エンドポイント設計

### URL構造
```
{base_url}/api/v{version}/{resource}
```

### 例
```
GET    /api/v1/users           # ユーザー一覧
GET    /api/v1/users/:id       # ユーザー詳細
POST   /api/v1/users           # ユーザー作成
PUT    /api/v1/users/:id       # ユーザー更新（全体）
PATCH  /api/v1/users/:id       # ユーザー更新（部分）
DELETE /api/v1/users/:id       # ユーザー削除
```

### 命名規則
- リソース名は複数形: `users`, `posts`, `comments`
- ケバブケース: `user-profiles`, `access-logs`
- 動詞は使用しない（HTTPメソッドで表現）

### ネストされたリソース
```
GET /api/v1/users/:userId/posts          # ユーザーの投稿一覧
GET /api/v1/users/:userId/posts/:postId  # ユーザーの特定投稿
```

### アクション（例外的に動詞を使用）
```
POST /api/v1/users/:id/activate    # ユーザーを有効化
POST /api/v1/users/:id/deactivate  # ユーザーを無効化
POST /api/v1/auth/login            # ログイン
POST /api/v1/auth/logout           # ログアウト
```

## 2. HTTPメソッド

| メソッド | 用途 | 冪等性 |
|---------|------|--------|
| GET | リソースの取得 | Yes |
| POST | リソースの作成 | No |
| PUT | リソースの完全更新 | Yes |
| PATCH | リソースの部分更新 | No |
| DELETE | リソースの削除 | Yes |

## 3. リクエスト

### クエリパラメータ（GET）
```
GET /api/v1/users?page=1&limit=20&sort=name&order=asc&status=active
```

| パラメータ | 説明 | デフォルト |
|-----------|------|-----------|
| page | ページ番号 | 1 |
| limit | 取得件数 | 20 |
| sort | ソートフィールド | createdAt |
| order | ソート順 | desc |

### リクエストボディ（POST/PUT/PATCH）
```json
{
  "name": "田中太郎",
  "email": "tanaka@example.com",
  "role": "user"
}
```

### Content-Type
- `application/json` を基本とする
- ファイルアップロード: `multipart/form-data`

## 4. レスポンス

### 成功レスポンス

#### 単一リソース
```json
{
  "data": {
    "id": "123",
    "name": "田中太郎",
    "email": "tanaka@example.com",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

#### リスト
```json
{
  "data": [
    { "id": "123", "name": "田中太郎" },
    { "id": "124", "name": "鈴木花子" }
  ],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 20,
    "totalPages": 5
  }
}
```

#### 作成成功（201 Created）
```json
{
  "data": {
    "id": "125",
    "name": "新規ユーザー",
    ...
  }
}
```

#### 削除成功（204 No Content）
レスポンスボディなし

### エラーレスポンス
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "入力内容に誤りがあります",
    "details": [
      {
        "field": "email",
        "message": "メールアドレスの形式が正しくありません"
      }
    ]
  }
}
```

## 5. ステータスコード

### 成功
| コード | 説明 | 使用場面 |
|--------|------|---------|
| 200 | OK | 取得・更新成功 |
| 201 | Created | 作成成功 |
| 204 | No Content | 削除成功 |

### クライアントエラー
| コード | 説明 | 使用場面 |
|--------|------|---------|
| 400 | Bad Request | バリデーションエラー |
| 401 | Unauthorized | 認証エラー |
| 403 | Forbidden | 権限エラー |
| 404 | Not Found | リソースが存在しない |
| 409 | Conflict | 重複エラー |
| 422 | Unprocessable Entity | ビジネスロジックエラー |

### サーバーエラー
| コード | 説明 | 使用場面 |
|--------|------|---------|
| 500 | Internal Server Error | サーバー内部エラー |
| 503 | Service Unavailable | サービス一時停止 |

## 6. エラーコード

```typescript
const ERROR_CODES = {
  // バリデーション
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_FORMAT: 'INVALID_FORMAT',
  REQUIRED_FIELD: 'REQUIRED_FIELD',

  // 認証・認可
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',

  // リソース
  NOT_FOUND: 'NOT_FOUND',
  ALREADY_EXISTS: 'ALREADY_EXISTS',

  // サーバー
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
} as const;
```

## 7. 認証

### Bearer Token
```
Authorization: Bearer {access_token}
```

### 認証が必要なエンドポイント
- 全ての保護されたエンドポイントでトークンを検証
- 有効期限切れの場合は 401 を返却

## 8. バージョニング

- URLパスでバージョンを指定: `/api/v1/`, `/api/v2/`
- 破壊的変更時は新バージョンを作成
- 旧バージョンは一定期間サポート

## 9. ページネーション

### オフセットベース（推奨）
```json
{
  "meta": {
    "total": 100,
    "page": 2,
    "limit": 20,
    "totalPages": 5
  }
}
```

### カーソルベース（大量データ向け）
```json
{
  "meta": {
    "nextCursor": "eyJpZCI6MTAwfQ==",
    "hasMore": true
  }
}
```

## 10. 日時フォーマット

- ISO 8601形式を使用: `2024-01-15T10:30:00Z`
- タイムゾーン: UTC（クライアント側で変換）
