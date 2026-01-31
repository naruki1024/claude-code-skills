# Task 1: プロジェクト初期化エージェント

## 責務

`admin/` ディレクトリに Next.js プロジェクトの基盤を作成する。

## 前提

- 作業ディレクトリ: `canpass-app-feature-admin/`
- `admin/` には `.keep` ファイルのみ存在

## 実行手順

### 1. admin/ ディレクトリ準備

```bash
cd admin
rm -f .keep  # 不要ファイル削除
```

### 2. package.json 作成

webapp/package.json を参照し、admin用に調整して作成。

**必須パッケージ（webappと同バージョン）**:

```json
{
  "name": "canpass-admin",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --turbopack -p 3001",
    "build": "next build",
    "start": "next start",
    "type-check": "tsc --noEmit",
    "lint": "eslint"
  },
  "dependencies": {
    "next": "16.0.10",
    "react": "19.2.3",
    "react-dom": "19.2.3",
    "clsx": "2.1.1",
    "tailwind-merge": "3.3.1",
    "lucide-react": "0.548.0"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "postcss": "8.5.6",
    "tailwindcss": "4.1.16",
    "typescript": "^5"
  }
}
```

**ポイント**:
- ポートは `3001`（webappの3000と分離）
- 認証・DB関連は #427 で追加するため、ここでは含めない

### 3. npm install 実行

```bash
cd admin && npm install
```

## 確認コマンド

```bash
ls admin/package.json        # ファイル存在確認
ls admin/node_modules        # 依存インストール確認
cat admin/package.json | grep '"next"'  # バージョン確認
```

## エラー対応

| エラー | 対処 |
|--------|------|
| npm install 失敗 | エラーメッセージを確認、依存関係のバージョン調整 |
| node_modules 未生成 | npm cache clean --force してリトライ |

## 出力

- `admin/package.json`
- `admin/package-lock.json`
- `admin/node_modules/`
