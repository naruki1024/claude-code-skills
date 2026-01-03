# Claude Code クイックスタート - 主要内容の要約

## ページの概要
Claude Code Docsのクイックスタートページ。Anthropicの公式CLI「Claude Code」の導入と基本的な使用方法を説明しています。

## 主要セクション

### 1. **始める前に（前提条件）**
- ターミナル/コマンドプロンプト
- コードプロジェクト
- Claude.ai または Claude Console アカウント

### 2. **インストール方法**

**macOS, Linux, WSL:**
```bash
curl -fsSL https://claude.ai/install.sh | bash
```

**Windows PowerShell:**
```powershell
irm https://claude.ai/install.ps1 | iex
```

**Homebrew:**
```bash
brew install --cask claude-code
```

**NPM:**
```bash
npm install -g @anthropic-ai/claude-code
```

### 3. **ログイン**
```bash
claude
# または
/login
```

### 4. **セッション開始**
```bash
cd /path/to/your/project
claude
```

### 5. **基本的な使用例**
- プロジェクト分析: `> what does this project do?`
- コード変更: `> add a hello world function to the main file`
- Git操作: `> commit my changes with a descriptive message`
- デバッグ: `> there's a bug where users can submit empty forms - fix it`

## 必須コマンド

| コマンド | 機能 |
|---------|------|
| `claude` | インタラクティブモード開始 |
| `claude "task"` | 1回限りのタスク実行 |
| `claude -p "query"` | クエリ実行して終了 |
| `claude -c` | 最新の会話を続行 |
| `/help` | 利用可能なコマンド表示 |

## 重要なポイント
- Claude Codeは開発者のペアプログラマーとして機能
- 自然言語で指示が可能
- Git操作やコードレビューに対応
- 複数のアカウントタイプ対応（Claude.ai/Claude Console）
