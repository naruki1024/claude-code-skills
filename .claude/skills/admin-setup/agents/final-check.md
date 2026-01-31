# Task 4: 最終チェックエージェント

## 責務

Issue #426 の完了条件を全て確認し、問題があれば修正する。

## 前提

- Task 1-3 完了済み

## チェック手順

### 1. 開発サーバー起動確認

```bash
cd admin && npm run dev
```

**確認**:
- ターミナルに `Ready` が表示される
- http://localhost:3001/console/login にアクセス可能

**エラー対応**:
- ポート競合 → 3001 以外のポートを使用
- モジュール未解決 → npm install 再実行

### 2. ビルド確認

```bash
cd admin && npm run build
```

**確認**:
- `Build completed` が表示される
- `.next/` ディレクトリが生成される

**エラー対応**:
- 型エラー → 該当ファイルを修正
- インポートエラー → パス設定を確認

### 3. 型チェック確認

```bash
cd admin && npm run type-check
```

**確認**:
- エラーなしで完了

**エラー対応**:
- 型定義不足 → @types/* を追加
- any 型警告 → 適切な型を指定

### 4. ページ表示確認

| URL | 期待表示 |
|-----|----------|
| `/console/login` | ログインフォーム |
| `/console` | ダッシュボード placeholder |

### 5. デザイン確認（dashboard-design準拠）

- [ ] Cool foundation カラー（slate系）
- [ ] Borders-only approach（影なし、border のみ）
- [ ] 4px grid spacing
- [ ] Geometric sans typography

## 完了条件チェックリスト

Issue #426 の完了条件:

- [ ] `npm run dev` で開発サーバーが起動する
- [ ] `/console/login` でログイン画面が表示される
- [ ] `npm run build` が成功する
- [ ] `npm run type-check` が成功する

## 出力ファイル一覧

```
admin/
├── package.json
├── package-lock.json
├── tsconfig.json
├── next.config.ts
├── postcss.config.mjs
├── eslint.config.mjs
├── node_modules/
└── src/
    └── app/
        ├── globals.css
        ├── layout.tsx
        └── console/
            ├── page.tsx
            └── login/
                └── page.tsx
```

## 問題があった場合

1. エラーメッセージを確認
2. 該当 Task のエージェントを参照
3. 修正を適用
4. 再度チェックを実行

## 完了報告テンプレート

```markdown
## Issue #426 完了報告

### チェック結果
- [x] npm run dev: OK
- [x] /console/login 表示: OK
- [x] npm run build: OK
- [x] npm run type-check: OK

### 作成ファイル
- admin/package.json
- admin/tsconfig.json
- admin/next.config.ts
- admin/src/app/layout.tsx
- admin/src/app/globals.css
- admin/src/app/console/page.tsx
- admin/src/app/console/login/page.tsx

### 次のステップ
Issue #427 (管理者ログイン／ログアウト機能) に着手
```
