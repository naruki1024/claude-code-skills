# プロジェクト全体仕様

このファイルはプロジェクト固有の情報を記載するためのテンプレートです。
実際のプロジェクトで使用する際は、以下の項目を埋めてください。

## プロジェクト概要

- プロジェクト名: {project-name}
- 技術スタック: {tech-stack}
- リポジトリ: {repository-url}

## 全体仕様ファイルの場所

整合性チェックで参照する仕様ファイル:

| 種別 | パス | 説明 |
|------|-----|------|
| API仕様 | `docs/api-spec.yaml` | OpenAPI仕様 |
| データモデル | `docs/data-model.md` | ER図、スキーマ定義 |
| 画面一覧 | `docs/screens.md` | 画面遷移図 |
| 用語集 | `docs/glossary.md` | ドメイン用語定義 |

## ディレクトリ構造

```
src/
├── app/           # Next.js App Router
├── components/    # UIコンポーネント
│   ├── ui/        # 汎用コンポーネント
│   └── features/  # 機能別コンポーネント
├── lib/           # ユーティリティ
├── hooks/         # カスタムフック
├── types/         # 型定義
└── api/           # APIルート（Backend）
```

## 命名規則

### ファイル・ディレクトリ
- コンポーネント: PascalCase（例: `UserList.tsx`）
- ユーティリティ: camelCase（例: `formatDate.ts`）
- 定数: SCREAMING_SNAKE_CASE（例: `API_ENDPOINTS.ts`）

### コード
- 変数・関数: camelCase
- クラス・コンポーネント: PascalCase
- 定数: SCREAMING_SNAKE_CASE
- 型・インターフェース: PascalCase（I プレフィックスなし）

## 環境変数

| 変数名 | 用途 | 必須 |
|--------|------|------|
| `DATABASE_URL` | DB接続文字列 | Yes |
| `NEXTAUTH_SECRET` | 認証シークレット | Yes |
| `API_BASE_URL` | APIベースURL | Yes |

## 認証・認可

- 認証方式: {NextAuth / Clerk / カスタム}
- セッション管理: {JWT / Session}
- 権限レベル: {admin, user, guest}

## 関連ドキュメント

- 設計ドキュメント: `docs/design/`
- 運用マニュアル: `docs/operations/`
- 開発ガイド: `docs/development/`
