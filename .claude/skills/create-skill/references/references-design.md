# references/ の設計原則

## references/ の役割

> 「必要なときにだけ取りに行く知識の外部ストレージ」

常にコンテキストに載せておくものではなく、「必要な瞬間にだけ読む教科書」として扱う。

## 設計の3原則

### 1. 1ファイル1トピック

**悪い例**: 1ファイルに全部詰め込む
```
references/
└── all-guidelines.md  # 8000トークン超え
```

**良い例**: トピックごとに分割
```
references/
├── writing-style.md       # 文体ルール
├── structure-patterns.md  # 構成パターン
├── seo-guidelines.md      # SEO方針
└── examples/
    ├── good-article.md    # 良い例
    └── bad-article.md     # 悪い例
```

### 2. 読み込みタイミングを明確化

agents/*.md で「いつ読むか」を指定:

```markdown
## 参照リソース

作業前に絶対読むもの:
- `references/writing-style.md`

品質チェック時に読むもの:
- `references/examples/good-article.md`

条件付きで読むもの:
- `references/advanced-patterns.md` - 長文記事の場合のみ
```

### 3. 具体例は別フォルダに逃がす

具体例（サンプルコード、記事例など）はトークンを食うため、`references/examples/` に分離して「本当に必要なときだけ開く」扱いにする。

## ファイル構成のパターン

```
references/
├── {core-concept}.md      # 基本概念・ルール
├── {workflow-guide}.md    # 作業手順
├── {templates}.md         # テンプレート
└── examples/
    ├── {good-example}.md  # 良い例
    ├── {bad-example}.md   # 悪い例
    └── {case-study}.md    # ケーススタディ
```

## なぜ知識の外部化が重要か

### Task仕様書に全部書くと...
- Task実行直前に全文がロード
- 複数Taskで繰り返しロード
- 会話ログ・作業結果と合わせてコンテキスト破綻

### 外部化すると...
- Taskごとのコンテキストサイズを抑制
- 長いワークフローでも安定
- 知識の再利用性が向上（複数Taskから同じreferencesを参照可能）
