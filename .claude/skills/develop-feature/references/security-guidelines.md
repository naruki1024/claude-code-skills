# セキュリティガイドライン

## 1. 入力バリデーション

### 必須ルール
- **全ての外部入力をバリデート**: リクエストボディ、クエリパラメータ、パスパラメータ
- **ホワイトリスト方式**: 許可するパターンを明示的に定義
- **型の厳密なチェック**: zod等のスキーマバリデーションを使用

### 実装例
```typescript
import { z } from 'zod';

const userSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(100),
  age: z.number().int().positive().optional(),
});

// バリデーション
const result = userSchema.safeParse(input);
if (!result.success) {
  throw new ValidationError(result.error);
}
```

## 2. 認証・認可

### 認証
- 全ての保護されたエンドポイントで認証を確認
- トークンの有効期限を適切に設定
- リフレッシュトークンの安全な管理

### 認可
```typescript
// 権限チェックの例
async function handler(req: Request) {
  const session = await getSession(req);

  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!hasPermission(session.user, 'admin')) {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }

  // 処理続行
}
```

## 3. インジェクション対策

### SQLインジェクション
- **必須**: パラメータ化クエリを使用
- **禁止**: 文字列連結でのクエリ構築

```typescript
// NG
const query = `SELECT * FROM users WHERE id = ${userId}`;

// OK
const query = 'SELECT * FROM users WHERE id = $1';
await db.query(query, [userId]);

// OK (ORM使用)
await prisma.user.findUnique({ where: { id: userId } });
```

### XSS対策
- ユーザー入力をHTMLに出力する際は必ずエスケープ
- React: デフォルトでエスケープされる（`dangerouslySetInnerHTML`は避ける）
- Content-Security-Policy ヘッダーの設定

### コマンドインジェクション
- シェルコマンドの実行を避ける
- 必要な場合は入力を厳密にバリデート

## 4. データ保護

### 機密情報の取り扱い
- パスワード: bcrypt等でハッシュ化
- APIキー: 環境変数で管理、コードにハードコードしない
- 個人情報: 必要最小限のみ保持

### ログ出力
```typescript
// NG: 機密情報をログに出力
console.log('User login:', { email, password });

// OK: 機密情報をマスク
console.log('User login:', { email, password: '***' });
```

### エラーメッセージ
```typescript
// NG: 内部情報を露出
return Response.json({
  error: 'Database connection failed: ECONNREFUSED 127.0.0.1:5432'
}, { status: 500 });

// OK: 汎用メッセージ
return Response.json({
  error: 'Internal server error'
}, { status: 500 });
```

## 5. HTTPS

- 本番環境では必ずHTTPSを使用
- HSTS (HTTP Strict Transport Security) ヘッダーの設定
- セキュアなCookie設定（Secure, HttpOnly, SameSite）

## 6. CORS

```typescript
// 許可するオリジンを明示的に指定
const allowedOrigins = [
  'https://example.com',
  'https://app.example.com',
];

// ワイルドカード (*) は開発環境のみ
```

## 7. レート制限

- 認証エンドポイントにレート制限を設定
- API全体に適切なレート制限を設定
- ブルートフォース攻撃への対策

## 8. 依存関係の管理

```bash
# 脆弱性のチェック
npm audit

# 脆弱性の修正
npm audit fix
```

## 9. チェックリスト

### API実装時
- [ ] 入力バリデーション実装
- [ ] 認証チェック実装
- [ ] 認可チェック実装
- [ ] エラーハンドリング（内部情報を露出しない）
- [ ] ログ出力（機密情報をマスク）

### レビュー時
- [ ] SQLインジェクション対策
- [ ] XSS対策
- [ ] CSRF対策（該当する場合）
- [ ] 機密情報の取り扱い
