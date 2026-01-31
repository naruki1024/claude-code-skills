# webapp 参照情報

admin プロジェクト作成時に参照する webapp の設定情報。

## package.json 主要パッケージ

### dependencies（必須）

| パッケージ | バージョン | 用途 |
|-----------|-----------|------|
| next | 16.0.10 | フレームワーク |
| react | 19.2.3 | UI |
| react-dom | 19.2.3 | DOM |
| clsx | 2.1.1 | クラス名結合 |
| tailwind-merge | 3.3.1 | Tailwind クラスマージ |
| lucide-react | 0.548.0 | アイコン |

### devDependencies（必須）

| パッケージ | バージョン | 用途 |
|-----------|-----------|------|
| typescript | ^5 | 型システム |
| @types/node | ^20 | Node.js 型定義 |
| @types/react | ^19 | React 型定義 |
| @types/react-dom | ^19 | ReactDOM 型定義 |
| tailwindcss | 4.1.16 | CSS |
| postcss | 8.5.6 | PostCSS |
| @tailwindcss/postcss | ^4 | Tailwind PostCSS |

### 後から追加するもの（#427以降）

| パッケージ | 用途 | 追加タイミング |
|-----------|------|----------------|
| drizzle-orm | ORM | #427 |
| better-auth | 認証 | #427 |
| mysql2 | DB接続 | #427 |

## tsconfig.json パス設定

```json
{
  "paths": {
    "@/*": ["./src/*"],
    "@canpass/shared": ["../packages/shared"],
    "@canpass/utils": ["../packages/utils"]
  }
}
```

## ファイル参照先

| ファイル | パス |
|----------|------|
| package.json | `webapp/package.json` |
| tsconfig.json | `webapp/tsconfig.json` |
| next.config.ts | `webapp/next.config.ts` |
| postcss.config.mjs | `webapp/postcss.config.mjs` |
| eslint.config.mjs | `webapp/eslint.config.mjs` |
| globals.css | `webapp/src/app/globals.css` |
| layout.tsx | `webapp/src/app/layout.tsx` |
