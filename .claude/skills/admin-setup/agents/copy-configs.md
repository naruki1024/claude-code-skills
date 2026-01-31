# Task 2: 設定ファイル移植エージェント

## 責務

webapp の設定ファイルを admin 用に調整して移植する。

## 前提

- Task 1 完了済み（package.json, node_modules 存在）

## 実行手順

### 1. tsconfig.json 作成

webapp/tsconfig.json をベースに作成。

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"],
      "@canpass/shared": ["../packages/shared"],
      "@canpass/utils": ["../packages/utils"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### 2. next.config.ts 作成

admin用にシンプル化。

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
};

export default nextConfig;
```

### 3. postcss.config.mjs 作成

```javascript
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
```

### 4. eslint.config.mjs 作成

webapp/eslint.config.mjs を参照して作成（簡略版でOK）。

```javascript
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default eslintConfig;
```

### 5. ディレクトリ構造作成

```bash
mkdir -p admin/src/app/console/login
mkdir -p admin/src/components/ui
mkdir -p admin/src/lib
```

## 確認コマンド

```bash
ls admin/tsconfig.json
ls admin/next.config.ts
ls admin/postcss.config.mjs
```

## エラー対応

| エラー | 対処 |
|--------|------|
| paths解決失敗 | tsconfig.json の baseUrl を確認 |
| ESLint設定エラー | @eslint/eslintrc の依存追加 |

## 出力

- `admin/tsconfig.json`
- `admin/next.config.ts`
- `admin/postcss.config.mjs`
- `admin/eslint.config.mjs`
- `admin/src/` ディレクトリ構造
