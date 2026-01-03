# Claude Code 出力スタイル ドキュメント

## ページ概要
このページは、Claude Codeの出力スタイル機能について説明しています。出力スタイルを使用すると、Claude Codeをソフトウェアエンジニアリング以外の用途に適応させることができます。

## 主な内容

### 1. 組み込み出力スタイル

Claude Codeには3つの出力スタイルがあります：

- **デフォルト**: 既存のシステムプロンプト。ソフトウェアエンジニアリングタスクを効率的に完了するように設計されている

- **説明的（Explanatory）**: ソフトウェアエンジニアリングタスク完了を支援しながら、教育的な「インサイト」を提供。実装の選択肢とコードベースのパターン理解に役立つ

- **学習（Learning）**: 協調的な学習型モード。Claude Codeはコーディング中に「インサイト」を共有し、小さな戦略的なコードの一部を自分で実装するよう求める。実装するためにコード内に`TODO(human)`マーカーを追加する

### 2. 出力スタイルの仕組み

- 出力スタイルはClaude Codeのシステムプロンプトを直接変更する
- デフォルト以外の出力スタイルは、コード生成と効率的な出力に固有の指示を除外
- これらの出力スタイルにはシステムプロンプトに追加されたカスタム指示がある

### 3. 出力スタイルを変更する

2つの方法で変更可能：

```bash
# メニュー経由（/config メニューからもアクセス可能）
/output-style

# 直接切り替え
/output-style explanatory
/output-style learning
```

変更はローカルプロジェクトレベルに適用され、`.claude/settings.local.json`に保存される

### 4. カスタム出力スタイルを作成する

Claudeの助けを借りて新しい出力スタイルを作成：

```bash
/output-style:new I want an output style that ...
```

作成された出力スタイルはユーザーレベルで`~/.claude/output-styles`にマークダウンファイルとして保存される

#### カスタム出力スタイルの構造

```markdown
---
name: My Custom Style
description:
  A brief description of what this style does, to be displayed to the user
---

# Custom Style Instructions

You are an interactive CLI tool that helps users with software engineering
tasks. [Your custom instructions here...]

## Specific Behaviors

[Define how the assistant should behave in this style...]
```

また、独自の出力スタイルマークダウンファイルを以下の場所に保存することもできます：
- ユーザーレベル：`~/.claude/output-styles`
- プロジェクトレベル：`.claude/output-styles`

### 5. 関連機能との比較

#### 出力スタイル対CLAUDE.md対`--append-system-prompt`

- **出力スタイル**: Claude Codeのデフォルトシステムプロンプトのソフトウェアエンジニアリング固有の部分を完全に「オフ」にする
- **CLAUDE.md**: コンテンツをユーザーメッセージとして追加（デフォルトシステムプロンプトの後）
- **`--append-system-prompt`**: コンテンツをシステムプロンプトに追加

#### 出力スタイル対エージェント

- 出力スタイル：メインエージェントループに直接影響し、システムプロンプトのみに影響
- エージェント：特定のタスク処理のため呼び出され、モデル、ツール、使用時期などの追加設定を含める

#### 出力スタイル対カスタムスラッシュコマンド

- 出力スタイル：「保存されたシステムプロンプト」
- カスタムスラッシュコマンド：「保存されたプロンプト」
