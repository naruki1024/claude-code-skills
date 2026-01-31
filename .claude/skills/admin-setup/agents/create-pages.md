# Task 3: 基本ページ作成エージェント

## 責務

管理画面の基本ページを dashboard-design スキルに準拠して作成する。

## 前提

- Task 2 完了済み（設定ファイル移植済み）
- **dashboard-design スキルを読み込むこと**: `.claude/skills/dashboard-design/SKILL.md`

## デザイン方針

dashboard-design から採用する方向性:

| 項目 | 選択 |
|------|------|
| Personality | **Sophistication & Trust** - 管理画面として信頼感 |
| Color Foundation | **Cool foundations** - slate, blue-gray |
| Layout | **Sidebar navigation** - 将来の拡張を見据えて |
| Typography | **Geometric sans** - Geist Mono |
| Depth | **Borders-only** - シンプル・技術的 |

## 実行手順

### 1. globals.css 作成

```css
@import "tailwindcss";

:root {
  /* Cool foundation - Sophistication & Trust */
  --background: #f8fafc;
  --foreground: #0f172a;
  --muted: #64748b;
  --border: #e2e8f0;
  --card: #ffffff;
  --accent: #3b82f6;

  /* 4px grid system */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;
}

body {
  background: var(--background);
  color: var(--foreground);
  font-family: "Geist", system-ui, sans-serif;
}
```

### 2. layout.tsx 作成

```tsx
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "CanPass 管理画面",
  description: "CanPass 運営管理システム",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
```

### 3. console/login/page.tsx 作成

dashboard-design 原則に準拠したログインページ。

```tsx
export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-sm">
        {/* Card - borders-only approach */}
        <div className="bg-white border border-slate-200 rounded-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-xl font-semibold text-slate-900 tracking-tight">
              CanPass 管理画面
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              管理者アカウントでログイン
            </p>
          </div>

          {/* Form placeholder - 認証は #427 で実装 */}
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                メールアドレス
              </label>
              <input
                type="email"
                className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="admin@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                パスワード
              </label>
              <input
                type="password"
                className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 bg-slate-900 text-white text-sm font-medium rounded-md
                       hover:bg-slate-800 transition-colors duration-150"
            >
              ログイン
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-400 mt-4">
          占いCanPass 管理システム
        </p>
      </div>
    </div>
  );
}
```

### 4. console/page.tsx 作成（ダッシュボード placeholder）

```tsx
export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="px-6 py-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-slate-900">
            CanPass 管理画面
          </h1>
          <span className="text-sm text-slate-500">
            管理者
          </span>
        </div>
      </header>

      {/* Main content placeholder */}
      <main className="p-6">
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <h2 className="text-lg font-medium text-slate-900 mb-2">
            ダッシュボード
          </h2>
          <p className="text-sm text-slate-500">
            認証機能は Issue #427 で実装予定です。
          </p>
        </div>
      </main>
    </div>
  );
}
```

## 確認コマンド

```bash
cd admin && npm run dev
# ブラウザで http://localhost:3001/console/login を確認
```

## デザインチェックポイント

- [ ] 4px グリッドに沿ったスペーシング
- [ ] Cool foundation カラー使用
- [ ] Borders-only アプローチ（影なし）
- [ ] Typography: 600 weight for headlines, tight letter-spacing

## 出力

- `admin/src/app/globals.css`
- `admin/src/app/layout.tsx`
- `admin/src/app/console/page.tsx`
- `admin/src/app/console/login/page.tsx`
