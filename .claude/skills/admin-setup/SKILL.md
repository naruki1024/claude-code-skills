---
name: admin-setup
description: 管理画面用Next.jsプロジェクト（admin/）をwebappと同じ構成で立ち上げる。Issue #426の完了を目指す。/admin-setup コマンドで使用。
---

# Admin Setup スキル

管理画面用の Next.js プロジェクトを `admin/` ディレクトリに新規作成し、
webapp と同じ技術スタック・構成で統一する。

## ワークフロー概要

```
Task 1: プロジェクト初期化
    ↓ 確認
Task 2: 設定ファイル移植
    ↓ 確認
Task 3: 基本ページ作成（dashboard-designスキル使用）
    ↓ 確認
Task 4: 最終チェック
```

---

## Task 1: プロジェクト初期化

**実行エージェント**: [agents/init-project.md](agents/init-project.md)

### 作業内容

1. `admin/` ディレクトリに Next.js プロジェクトを作成
2. package.json を webapp と同じバージョンで構成
3. `npm install` 実行

### 確認ポイント

- [ ] `admin/package.json` が存在する
- [ ] 主要パッケージがwebappと同バージョン
- [ ] `node_modules/` が生成されている

### 軌道修正

- npm install 失敗 → エラーメッセージを確認し依存関係を修正
- バージョン不整合 → webapp/package.json を再確認

---

## Task 2: 設定ファイル移植

**実行エージェント**: [agents/copy-configs.md](agents/copy-configs.md)

### 作業内容

1. tsconfig.json（paths設定含む）
2. next.config.ts
3. postcss.config.mjs
4. eslint.config.mjs
5. Tailwind CSS 設定（globals.css）
6. biome.json

### 確認ポイント

- [ ] TypeScript エラーが出ない
- [ ] パス解決（@/）が動作する

### 軌道修正

- パスエラー → tsconfig.json の paths 設定を確認
- 設定ファイルエラー → webapp版と差分比較

---

## Task 3: 基本ページ作成

**実行エージェント**: [agents/create-pages.md](agents/create-pages.md)

**使用スキル**: `dashboard-design` - 管理画面UIのデザイン原則

### 作業内容

1. `src/app/layout.tsx` - ルートレイアウト
2. `src/app/console/page.tsx` - ダッシュボード（認証後トップ）
3. `src/app/console/login/page.tsx` - ログインページ
4. `src/app/globals.css` - グローバルスタイル

### デザイン方針（dashboard-design準拠）

- **Personality**: Sophistication & Trust（管理画面として信頼感）
- **Color Foundation**: Cool foundations（slate, blue-gray）
- **Layout**: Sidebar navigation（将来の拡張を見据えて）
- **Typography**: Geometric sans（Geist, Inter系）
- **Depth**: Borders-only approach（シンプル・技術的）

### 確認ポイント

- [ ] `/console/login` でログイン画面が表示される
- [ ] デザインがdashboard-design原則に準拠

### 軌道修正

- ページ表示エラー → App Router の構造を確認
- スタイル適用されない → Tailwind CSS 設定を確認

---

## Task 4: 最終チェック

**実行エージェント**: [agents/final-check.md](agents/final-check.md)

### チェック項目

```bash
cd admin
npm run dev          # 開発サーバー起動確認
npm run build        # ビルド成功確認
npm run type-check   # 型チェック成功確認
```

### 完了条件（Issue #426）

- [ ] `npm run dev` で開発サーバーが起動する
- [ ] `/console/login` でログイン画面が表示される
- [ ] `npm run build` が成功する
- [ ] `npm run type-check` が成功する

### 軌道修正

- ビルドエラー → エラーメッセージに従い修正
- 型エラー → 該当ファイルの型定義を修正

---

## 参照ドキュメント

| 種別 | ファイル |
|------|----------|
| Issue定義 | `.cursor/tdd-work/admin-issues/issue-426-project-setup.md` |
| webapp package.json | `webapp/package.json` |
| webapp tsconfig | `webapp/tsconfig.json` |
| デザイン原則 | `.claude/skills/dashboard-design/SKILL.md` |

## 主要パッケージバージョン

| パッケージ | バージョン |
|-----------|-----------|
| next | 16.0.10 |
| react | 19.2.3 |
| drizzle-orm | 0.45.1 |
| tailwindcss | 4.1.16 |
| typescript | ^5 |

## ディレクトリ構成（目標）

```
admin/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── globals.css
│   │   └── console/
│   │       ├── page.tsx         # ダッシュボード
│   │       └── login/
│   │           └── page.tsx     # ログイン
│   ├── components/
│   │   └── ui/                  # 共通UIコンポーネント
│   └── lib/                     # ユーティリティ
├── package.json
├── tsconfig.json
├── next.config.ts
├── postcss.config.mjs
├── eslint.config.mjs
└── biome.json
```
