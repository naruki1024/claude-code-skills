Claude Codeで構築
# エージェント スキル
ページをコピー
Claude Code でスキルを作成、管理、共有して Claude の機能を拡張します。ページをコピーこのガイドでは、Claude Code でエージェント スキルを作成、使用、管理する方法を説明します。スキルは、指示、スクリプト、リソースを含む整理されたフォルダを通じて Claude の機能を拡張するモジュール式の機能です。
## ​]前提条件
- Claude Code バージョン 1.0 以降
- [Claude Code] の基本的な知識
## ​]エージェント スキルとは
エージェント スキルは、専門知識を発見可能な機能にパッケージ化します。各スキルは、Claude が関連する場合に読む指示を含む `SKILL.md` ファイルと、スクリプトやテンプレートなどのオプションのサポート ファイルで構成されています。**スキルの呼び出し方法**: スキルは**モデル呼び出し**です。Claude はリクエストとスキルの説明に基づいて、自律的にいつスキルを使用するかを決定します。これはスラッシュ コマンドとは異なります。スラッシュ コマンドは**ユーザー呼び出し**です（明示的に `/command` と入力してトリガーします）。**利点**:
- 特定のワークフロー用に Claude の機能を拡張
- git を通じてチーム全体で専門知識を共有
- 反復的なプロンプトを削減
- 複雑なタスク用に複数のスキルを組み合わせる詳細については、[エージェント スキルの概要]を参照してください。エージェント スキルのアーキテクチャと実世界での応用についての詳細は、エンジニアリング ブログをご覧ください: [Equipping agents for the real world with Agent Skills]。
## ​]スキルを作成する
スキルは `SKILL.md` ファイルを含むディレクトリとして保存されます。
### ​]個人用スキル
個人用スキルはすべてのプロジェクトで利用できます。`~/.claude/skills/` に保存します:コピーAIに質問
```
mkdir -p ~/.claude/skills/my-skill-name
**個人用スキルの用途**:
- 個人のワークフローと設定
- 開発中の実験的なスキル
- 個人の生産性ツール
### ​]プロジェクト スキル
プロジェクト スキルはチームと共有されます。プロジェクト内の `.claude/skills/` に保存します:コピーAIに質問
mkdir -p .claude/skills/my-skill-name
**プロジェクト スキルの用途**:
- チームのワークフローと規約
- プロジェクト固有の専門知識
- 共有ユーティリティとスクリプトプロジェクト スキルは git にチェックインされ、チーム メンバーが自動的に利用できます。
### ​]プラグイン スキル
スキルは [Claude Code プラグイン] から取得することもできます。プラグインはスキルをバンドルでき、プラグインがインストールされると自動的に利用できます。これらのスキルは個人用スキルとプロジェクト スキルと同じように機能します。
## ​]SKILL.md を作成する
YAML フロントマターと Markdown コンテンツを含む `SKILL.md` ファイルを作成します:コピーAIに質問
---name: your-skill-namedescription: Brief description of what this Skill does and when to use it---# Your Skill Name## InstructionsProvide clear, step-by-step guidance for Claude.## ExamplesShow concrete examples of using this Skill.
**フィールド要件**:
- `name`: 小文字、数字、ハイフンのみを使用する必要があります（最大 64 文字）
- `description`: スキルが何をするか、いつ使用するかの簡潔な説明（最大 1024 文字）`description` フィールドは、Claude がスキルをいつ使用するかを発見するために重要です。スキルが何をするか、Claude がいつそれを使用すべきかの両方を含める必要があります。完全な作成ガイダンス（検証ルールを含む）については、[ベスト プラクティス ガイド]を参照してください。
## ​]サポート ファイルを追加する
SKILL.md の横に追加ファイルを作成します:コピーAIに質問
my-skill/├── SKILL.md (required)├── reference.md (optional documentation)├── examples.md (optional examples)├── scripts/│ └── helper.py (optional utility)└── templates/ └── template.txt (optional template)
SKILL.md からこれらのファイルを参照します:コピーAIに質問
For advanced usage, see [reference.md](reference.md).Run the helper script:```bashpython scripts/helper.py input.txt```
Claude は必要な場合にのみこれらのファイルを読み、段階的な開示を使用してコンテキストを効率的に管理します。
## ​]allowed-tools でツール アクセスを制限する
`allowed-tools` フロントマター フィールドを使用して、スキルがアクティブな場合に Claude が使用できるツールを制限します:コピーAIに質問
---name: safe-file-readerdescription: Read files without making changes. Use when you need read-only file access.allowed-tools: Read, Grep, Glob---# Safe File ReaderThis Skill provides read-only file access.## Instructions1. Use Read to view file contents2. Use Grep to search within files3. Use Glob to find files by pattern
このスキルがアクティブな場合、Claude は指定されたツール（Read、Grep、Glob）のみを使用でき、許可を求める必要がありません。これは以下の場合に便利です:
- ファイルを変更してはいけない読み取り専用スキル
- スコープが限定されたスキル（例：データ分析のみ、ファイル書き込みなし）
- 機能を制限したいセキュリティに敏感なワークフロー`allowed-tools` が指定されていない場合、Claude は標準的な許可モデルに従い、通常どおりツールを使用するための許可を求めます。`allowed-tools` は Claude Code のスキルでのみサポートされています。
## ​]利用可能なスキルを表示する
スキルは Claude によって 3 つのソースから自動的に検出されます:
- 個人用スキル: `~/.claude/skills/`
- プロジェクト スキル: `.claude/skills/`
- プラグイン スキル: インストール済みプラグインにバンドルされています**利用可能なすべてのスキルを表示するには**、Claude に直接質問します:コピーAIに質問
What Skills are available?
またはコピーAIに質問
List all available Skills
これにより、プラグイン スキルを含むすべてのソースからすべてのスキルが表示されます。**特定のスキルを検査するには**、ファイルシステムを確認することもできます:コピーAIに質問
# List personal Skillsls ~/.claude/skills/# List project Skills (if in a project directory)ls .claude/skills/# View a specific Skill's contentcat ~/.claude/skills/my-skill/SKILL.md
## ​]スキルをテストする
スキルを作成した後、説明と一致する質問をして、スキルをテストします。**例**: 説明に「PDF ファイル」が記載されている場合:コピーAIに質問
Can you help me extract text from this PDF?
Claude は自律的にリクエストと一致する場合、スキルを使用することを決定します。明示的に呼び出す必要はありません。スキルは質問のコンテキストに基づいて自動的にアクティブになります。
## ​]スキルをデバッグする
Claude がスキルを使用しない場合は、これらの一般的な問題を確認してください:
### ​]説明を具体的にする
**曖昧すぎる**:コピーAIに質問
description: Helps with documents
**具体的**:コピーAIに質問
description: Extract text and tables from PDF files, fill forms, merge documents. Use when working with PDF files or when the user mentions PDFs, forms, or document extraction.
説明にスキルが何をするか、いつ使用するかの両方を含めます。
### ​]ファイル パスを確認する
**個人用スキル**: `~/.claude/skills/skill-name/SKILL.md`**プロジェクト スキル**: `.claude/skills/skill-name/SKILL.md`ファイルが存在することを確認します:コピーAIに質問
# Personalls ~/.claude/skills/my-skill/SKILL.md# Projectls .claude/skills/my-skill/SKILL.md
### ​]YAML 構文を確認する
無効な YAML はスキルの読み込みを防ぎます。フロントマターを確認します:コピーAIに質問
cat SKILL.md | head -n 10
以下を確認します:
- 1 行目に開始 `---`
- Markdown コンテンツの前に終了 `---`
- 有効な YAML 構文（タブなし、正しいインデント）
### ​]エラーを表示する
Claude Code をデバッグ モードで実行して、スキル読み込みエラーを確認します:コピーAIに質問
claude --debug
## ​]チームとスキルを共有する
**推奨される方法**: [プラグイン]を通じてスキルを配布します。プラグイン経由でスキルを共有するには:
- `skills/` ディレクトリにスキルを含むプラグインを作成します
- プラグインをマーケットプレイスに追加します
- チーム メンバーがプラグインをインストールします完全な手順については、[プラグインにスキルを追加する]を参照してください。プロジェクト リポジトリを通じてスキルを直接共有することもできます:
### ​]ステップ 1: スキルをプロジェクトに追加する
プロジェクト スキルを作成します:コピーAIに質問
mkdir -p .claude/skills/team-skill# Create SKILL.md
### ​]ステップ 2: git にコミットする
コピーAIに質問
git add .claude/skills/git commit -m "Add team Skill for PDF processing"git push
### ​]ステップ 3: チーム メンバーが自動的にスキルを取得する
チーム メンバーが最新の変更をプルすると、スキルが即座に利用可能になります:コピーAIに質問
git pullclaude # Skills are now available
## ​]スキルを更新する
SKILL.md を直接編集します:コピーAIに質問
# Personal Skillcode ~/.claude/skills/my-skill/SKILL.md# Project Skillcode .claude/skills/my-skill/SKILL.md
変更は Claude Code を次回起動するときに有効になります。Claude Code が既に実行されている場合は、再起動して更新を読み込みます。
## ​]スキルを削除する
スキル ディレクトリを削除します:コピーAIに質問
# Personalrm -rf ~/.claude/skills/my-skill# Projectrm -rf .claude/skills/my-skillgit commit -m "Remove unused Skill"
## ​]ベスト プラクティス
### ​]スキルを焦点を絞ったものにする
1 つのスキルは 1 つの機能に対応する必要があります:**焦点を絞ったもの**:
- 「PDF フォーム入力」
- 「Excel データ分析」
- 「Git コミット メッセージ」**範囲が広すぎる**:
- 「ドキュメント処理」（個別のスキルに分割）
- 「データ ツール」（データ型または操作で分割）
### ​]明確な説明を書く
説明に特定のトリガーを含めることで、Claude がスキルをいつ使用するかを発見するのに役立ちます:**明確**:コピーAIに質問
description: Analyze Excel spreadsheets, create pivot tables, and generate charts. Use when working with Excel files, spreadsheets, or analyzing tabular data in .xlsx format.
**曖昧**:コピーAIに質問
description: For files
### ​]チームでテストする
チーム メンバーにスキルを使用させ、フィードバックを提供してもらいます:
- スキルは予想どおりにアクティブになりますか?
- 指示は明確ですか?
- 欠落している例やエッジ ケースはありますか?
### ​]スキル バージョンを文書化する
SKILL.md コンテンツでスキル バージョンを文書化して、時間の経過に伴う変更を追跡できます。バージョン履歴セクションを追加します:コピーAIに質問
# My Skill## Version History- v2.0.0 (2025-10-01): Breaking changes to API- v1.1.0 (2025-09-15): Added new features- v1.0.0 (2025-09-01): Initial release
これにより、チーム メンバーはバージョン間で何が変わったかを理解するのに役立ちます。
## ​]トラブルシューティング
### ​]Claude がスキルを使用しない
**症状**: 関連する質問をしても Claude がスキルを使用しません。**確認**: 説明は十分に具体的ですか?曖昧な説明は発見を困難にします。スキルが何をするか、いつ使用するか、ユーザーが言及するキー用語の両方を含めます。**汎用すぎる**:コピーAIに質問
description: Helps with data
description: Analyze Excel spreadsheets, generate pivot tables, create charts. Use when working with Excel files, spreadsheets, or .xlsx files.
**確認**: YAML は有効ですか?検証を実行して構文エラーを確認します:コピーAIに質問
# View frontmattercat .claude/skills/my-skill/SKILL.md | head -n 15# Check for common issues# - Missing opening or closing ---# - Tabs instead of spaces# - Unquoted strings with special characters
**確認**: スキルは正しい場所にありますか?コピーAIに質問
# Personal Skillsls ~/.claude/skills/*/SKILL.md# Project Skillsls .claude/skills/*/SKILL.md
### ​]スキルにエラーがある
**症状**: スキルは読み込まれますが、正しく機能しません。**確認**: 依存関係は利用可能ですか?Claude は必要な依存関係を自動的にインストールします（またはインストール許可を求めます）。**確認**: スクリプトに実行権限がありますか?コピーAIに質問
chmod +x .claude/skills/my-skill/scripts/*.py
**確認**: ファイル パスは正しいですか?すべてのパスでフォワード スラッシュ（Unix スタイル）を使用します:**正しい**: `scripts/helper.py`**間違い**: `scripts\helper.py`（Windows スタイル）
### ​]複数のスキルが競合する
**症状**: Claude が間違ったスキルを使用するか、同様のスキル間で混乱しているようです。**説明で具体的にする**: 説明で異なるトリガー用語を使用して、Claude が正しいスキルを選択するのに役立ちます。代わりに:コピーAIに質問
# Skill 1description: For data analysis# Skill 2description: For analyzing data
以下を使用します:コピーAIに質問
# Skill 1description: Analyze sales data in Excel files and CRM exports. Use for sales reports, pipeline analysis, and revenue tracking.# Skill 2description: Analyze log files and system metrics data. Use for performance monitoring, debugging, and system diagnostics.
## ​]例
### ​]シンプル スキル（単一ファイル）
commit-helper/└── SKILL.md
---name: generating-commit-messagesdescription: Generates clear commit messages from git diffs. Use when writing commit messages or reviewing staged changes.---# Generating Commit Messages## Instructions1. Run `git diff --staged` to see changes2. I'll suggest a commit message with: - Summary under 50 characters - Detailed description - Affected components## Best practices- Use present tense- Explain what and why, not how
### ​]ツール権限を持つスキル
code-reviewer/└── SKILL.md
---name: code-reviewerdescription: Review code for best practices and potential issues. Use when reviewing code, checking PRs, or analyzing code quality.allowed-tools: Read, Grep, Glob---# Code Reviewer## Review checklist1. Code organization and structure2. Error handling3. Performance considerations4. Security concerns5. Test coverage## Instructions1. Read the target files using Read tool2. Search for patterns using Grep3. Find related files using Glob4. Provide detailed feedback on code quality
### ​]マルチファイル スキル
pdf-processing/├── SKILL.md├── FORMS.md├── REFERENCE.md└── scripts/ ├── fill_form.py └── validate.py
**SKILL.md**:コピーAIに質問
---name: pdf-processingdescription: Extract text, fill forms, merge PDFs. Use when working with PDF files, forms, or document extraction. Requires pypdf and pdfplumber packages.---# PDF Processing## Quick startExtract text:```pythonimport pdfplumberwith pdfplumber.open("doc.pdf") as pdf: text = pdf.pages[0].extract_text()```For form filling, see [FORMS.md](FORMS.md).For detailed API reference, see [REFERENCE.md](REFERENCE.md).## RequirementsPackages must be installed in your environment:```bashpip install pypdf pdfplumber```
必要なパッケージを説明に記載してください。Claude がそれらを使用する前に、パッケージを環境にインストールする必要があります。Claude は必要な場合にのみ追加ファイルを読み込みます。
## ​]次のステップ
[
## 作成のベスト プラクティス
Claude が効果的に使用できるスキルを作成します][
## エージェント スキルの概要
Claude 製品全体でスキルがどのように機能するかを学びます][
## Agent SDK でスキルを使用する
TypeScript と Python でプログラム的にスキルを使用します][
## エージェント スキルを始める
最初のスキルを作成します]
このページは役に立ちましたか？はいいいえ[プラグイン][出力スタイル]⌘I