Claude Codeで構築
# Claude Code GitHub Actions
ページをコピー
Claude Code GitHub Actionsを開発ワークフローに統合する方法について学びますページをコピーClaude Code GitHub Actionsは、GitHub ワークフローにAI駆動の自動化をもたらします。任意のPRまたはissueで`@claude`と言及するだけで、Claudeはコードを分析し、プルリクエストを作成し、機能を実装し、バグを修正できます。すべてプロジェクトの標準に従いながら。Claude Code GitHub Actionsは[Claude Code SDK]の上に構築されており、Claude Codeのプログラマティック統合をアプリケーションに有効にします。SDKを使用して、GitHub Actions以外のカスタム自動化ワークフローを構築できます。
## ​]Claude Code GitHub Actionsを使用する理由は何ですか？
- **インスタントPR作成**: 必要なものを説明すると、Claudeは必要なすべての変更を含む完全なPRを作成します
- **自動コード実装**: issueを単一のコマンドで動作するコードに変換します
- **標準に従う**: Claudeは`CLAUDE.md`ガイドラインと既存のコードパターンを尊重します
- **シンプルなセットアップ**: インストーラーとAPIキーで数分で開始できます
- **デフォルトで安全**: コードはGithubのランナーに留まります
## ​]Claudeは何ができますか？
Claude Codeは、コードの操作方法を変える強力なGitHub Actionを提供します：
### ​]Claude Code Action
このGitHub Actionにより、GitHub Actionsワークフロー内でClaude Codeを実行できます。これを使用して、Claude Code上に任意のカスタムワークフローを構築できます。[リポジトリを表示 →]
## ​]セットアップ
## ​]クイックセットアップ
このアクションをセットアップする最も簡単な方法は、ターミナルのClaude Codeを使用することです。claudeを開いて`/install-github-app`を実行するだけです。このコマンドは、GitHubアプリと必要なシークレットのセットアップをガイドします。
- GitHubアプリをインストールしてシークレットを追加するには、リポジトリ管理者である必要があります
- GitHubアプリは、Contents、Issues、およびPull requestsの読み取り＆書き込み権限をリクエストします
- このクイックスタート方法は、直接Claude APIユーザーのみが利用できます。AWS BedrocまたはGoogle Vertex AIを使用している場合は、AWS Bedrock＆Google Vertex AIで使用する]セクションを参照してください。
## ​]手動セットアップ
`/install-github-app`コマンドが失敗した場合、または手動セットアップを希望する場合は、以下の手動セットアップ手順に従ってください：
- **Claude GitHubアプリをリポジトリにインストール**: [https://github.com/apps/claude]Claude GitHubアプリには、以下のリポジトリ権限が必要です：
- **Contents**: 読み取り＆書き込み（リポジトリファイルを変更するため）
- **Issues**: 読み取り＆書き込み（issueに応答するため）
- **Pull requests**: 読み取り＆書き込み（PRを作成して変更をプッシュするため）セキュリティと権限の詳細については、[セキュリティドキュメント]を参照してください。
- **ANTHROPIC_API_KEYをリポジトリシークレットに追加** ([GitHub Actionsでシークレットを使用する方法を学ぶ])
- **ワークフローファイルをコピー**[examples/claude.yml]からリポジトリの`.github/workflows/`へクイックスタートまたは手動セットアップのいずれかを完了した後、issueまたはPRコメントで`@claude`をタグ付けしてアクションをテストしてください！
## ​]ベータ版からのアップグレード
Claude Code GitHub Actions v1.0は、ベータ版からv1.0にアップグレードするためにワークフローファイルを更新する必要がある破壊的な変更を導入します。現在Claude Code GitHub Actionsのベータ版を使用している場合は、ワークフローをGA版を使用するように更新することをお勧めします。新しいバージョンは、自動モード検出などの強力な新機能を追加しながら、設定を簡素化します。
### ​]重要な変更
すべてのベータユーザーは、アップグレードするためにワークフローファイルに以下の変更を加える必要があります：
- **アクションバージョンを更新**: `@beta`を`@v1`に変更
- **モード設定を削除**: `mode: "tag"`または`mode: "agent"`を削除（現在は自動検出）
- **プロンプト入力を更新**: `direct_prompt`を`prompt`に置き換え
- **CLIオプションを移動**: `max_turns`、`model`、`custom_instructions`などを`claude_args`に変換
### ​]破壊的な変更リファレンス
| 古いベータ入力 | 新しいv1.0入力 |
| `mode` | *(削除 - 自動検出)* |
| `direct_prompt` | `prompt` |
| `override_prompt` | `prompt`（GitHubの変数付き） |
| `custom_instructions` | `claude_args: --system-prompt` |
| `max_turns` | `claude_args: --max-turns` |
| `model` | `claude_args: --model` |
| `allowed_tools` | `claude_args: --allowedTools` |
| `disallowed_tools` | `claude_args: --disallowedTools` |
| `claude_env` | `settings` JSON形式 |
### ​]ビフォー・アフター例
**ベータ版:**コピーAIに質問
```
- uses: anthropics/claude-code-action@beta with: mode: "tag" direct_prompt: "Review this PR for security issues" anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }} custom_instructions: "Follow our coding standards" max_turns: "10" model: "claude-sonnet-4-5-20250929"
**GA版（v1.0）:**コピーAIに質問
- uses: anthropics/claude-code-action@v1 with: prompt: "Review this PR for security issues" anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }} claude_args: | --system-prompt "Follow our coding standards" --max-turns 10 --model claude-sonnet-4-5-20250929
アクションは、設定に基づいて、インタラクティブモード（`@claude`メンションに応答）または自動化モード（プロンプト付きで即座に実行）で実行するかどうかを自動的に検出します。
## ​]ユースケース例
Claude Code GitHub Actionsは、さまざまなタスクに役立ちます。[examplesディレクトリ]には、異なるシナリオ用の使用可能なワークフローが含まれています。
### ​]基本的なワークフロー
コピーAIに質問
name: Claude Codeon: issue_comment: types: [created] pull_request_review_comment: types: [created]jobs: claude: runs-on: ubuntu-latest steps: - uses: anthropics/claude-code-action@v1 with: anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }} # Responds to @claude mentions in comments
### ​]スラッシュコマンドの使用
name: Code Reviewon: pull_request: types: [opened, synchronize]jobs: review: runs-on: ubuntu-latest steps: - uses: anthropics/claude-code-action@v1 with: anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }} prompt: "/review" claude_args: "--max-turns 5"
### ​]プロンプトを使用したカスタム自動化
name: Daily Reporton: schedule: - cron: "0 9 * * *"jobs: report: runs-on: ubuntu-latest steps: - uses: anthropics/claude-code-action@v1 with: anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }} prompt: "Generate a summary of yesterday's commits and open issues" claude_args: "--model claude-opus-4-1-20250805"
### ​]一般的なユースケース
issueまたはPRコメント内：コピーAIに質問
@claude implement this feature based on the issue description@claude how should I implement user authentication for this endpoint?@claude fix the TypeError in the user dashboard component
Claudeは自動的にコンテキストを分析し、適切に応答します。
## ​]ベストプラクティス
### ​]CLAUDE.md設定
リポジトリルートに`CLAUDE.md`ファイルを作成して、コードスタイルガイドライン、レビュー基準、プロジェクト固有のルール、および推奨パターンを定義します。このファイルは、Claudeのプロジェクト標準の理解をガイドします。
### ​]セキュリティに関する考慮事項
APIキーをリポジトリに直接コミットしないでください！権限、認証、およびベストプラクティスを含む包括的なセキュリティガイダンスについては、[Claude Code Actionセキュリティドキュメント]を参照してください。常にAPIキーにGitHub Secretsを使用してください：
- APIキーを`ANTHROPIC_API_KEY`という名前のリポジトリシークレットとして追加
- ワークフローで参照：`anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}`
- アクション権限を必要なものだけに制限
- マージ前にClaudeの提案を確認ワークフローファイルにAPIキーを直接ハードコーディングするのではなく、常にGitHub Secrets（例：`${{ secrets.ANTHROPIC_API_KEY }}`）を使用してください。
### ​]パフォーマンスの最適化
issueテンプレートを使用してコンテキストを提供し、`CLAUDE.md`を簡潔で焦点を絞ったものに保ち、ワークフローに適切なタイムアウトを設定します。
### ​]CI コスト
Claude Code GitHub Actionsを使用する場合、関連するコストに注意してください：**GitHub Actionsコスト：**
- Claude Codeはgithub ホストランナーで実行され、GitHub Actionsの分を消費します
- 詳細な価格設定と分の制限については、[GitHubの請求ドキュメント]を参照してください**APIコスト：**
- 各Claude相互作用は、プロンプトと応答の長さに基づいてAPIトークンを消費します
- トークン使用量は、タスクの複雑さとコードベースのサイズによって異なります
- 現在のトークンレートについては、[Claudeの価格ページ]を参照してください**コスト最適化のヒント：**
- 特定の`@claude`コマンドを使用して、不要なAPI呼び出しを減らします
- `claude_args`で適切な`--max-turns`を設定して、過度な反復を防ぎます
- ワークフローレベルのタイムアウトを設定して、暴走ジョブを回避します
- GitHubの同時実行制御を使用して、並列実行を制限することを検討してください
## ​]設定例
Claude Code Action v1は、統一されたパラメータで設定を簡素化します：コピーAIに質問
- uses: anthropics/claude-code-action@v1 with: anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }} prompt: "Your instructions here" # Optional claude_args: "--max-turns 5" # Optional CLI arguments
主な機能：
- **統一されたプロンプトインターフェース** - すべての指示に`prompt`を使用
- **スラッシュコマンド** - `/review`や`/fix`などの事前構築されたプロンプト
- **CLIパススルー** - `claude_args`経由のClaude Code CLIの任意の引数
- **柔軟なトリガー** - 任意のGitHubイベントで動作完全なワークフローファイルについては、[examplesディレクトリ]を参照してください。issueまたはPRコメントに応答する場合、Claudeは自動的に@claudeメンションに応答します。その他のイベントの場合は、`prompt`パラメータを使用して指示を提供します。
## ​]AWS Bedrock＆Google Vertex AIで使用する
エンタープライズ環境では、Claude Code GitHub Actionsを独自のクラウドインフラストラクチャで使用できます。このアプローチにより、データレジデンシーと請求を制御しながら、同じ機能を維持できます。
### ​]前提条件
クラウドプロバイダーでClaude Code GitHub Actionsをセットアップする前に、以下が必要です：
#### ​]Google Cloud Vertex AIの場合：
- Vertex AIが有効になっているGoogle Cloudプロジェクト
- GitHub Actionsに設定されたWorkload Identity Federation
- 必要な権限を持つサービスアカウント
- GitHubアプリ（推奨）またはデフォルトのGITHUB_TOKENを使用
#### ​]AWS Bedrockの場合：
- Amazon Bedrockが有効になっているAWSアカウント
- AWSで設定されたGitHub OIDCアイデンティティプロバイダー
- Bedrock権限を持つIAMロール
- GitHubアプリ（推奨）またはデフォルトのGITHUB_TOKENを使用1
カスタムGitHubアプリを作成（3Pプロバイダーに推奨）Vertex AIやBedrockなどの3Pプロバイダーを使用する場合、最適な制御とセキュリティのために、独自のGitHubアプリを作成することをお勧めします：
- [https://github.com/settings/apps/newにアクセス]
- 基本情報を入力：
- **GitHub App name**: 一意の名前を選択（例：「YourOrg Claude Assistant」）
- **Homepage URL**: 組織のウェブサイトまたはリポジトリURL
- アプリ設定を設定：
- **Webhooks**: 「Active」をチェック解除（この統合には不要）
- 必要な権限を設定：
- **Repository permissions**:
- Contents: Read & Write
- Issues: Read & Write
- Pull requests: Read & Write
- 「Create GitHub App」をクリック
- 作成後、「Generate a private key」をクリックしてダウンロードした`.pem`ファイルを保存
- アプリ設定ページからアプリIDをメモ
- アプリをリポジトリにインストール：
- アプリの設定ページから、左側のサイドバーの「Install App」をクリック
- アカウントまたは組織を選択
- 「Only select repositories」を選択して特定のリポジトリを選択
- 「Install」をクリック
- プライベートキーをリポジトリシークレットとして追加：
- リポジトリの設定 → シークレットと変数 → アクションに移動
- `.pem`ファイルの内容を含む`APP_PRIVATE_KEY`という名前の新しいシークレットを作成
- アプリIDをシークレットとして追加：
- GitHubアプリのIDを含む`APP_ID`という名前の新しいシークレットを作成このアプリは、[actions/create-github-app-token]アクションで使用され、ワークフロー内で認証トークンを生成します。**Claude APIの場合またはGithubアプリをセットアップしたくない場合の代替案**: 公式Anthropicアプリを使用：
- [https://github.com/apps/claudeからインストール]
- 認証に追加の設定は不要2
クラウドプロバイダー認証を設定クラウドプロバイダーを選択し、安全な認証をセットアップ：
AWS Bedrock**認証情報を保存せずに、GitHub ActionsがAWSに安全に認証できるようにAWSを設定します。****セキュリティに関する注意**: リポジトリ固有の設定を使用し、最小限の必要な権限のみを付与します。**必要なセットアップ**:
- **Amazon Bedrockを有効化**:
- Amazon Bedrockでのクラウドモデルへのアクセスをリクエスト
- クロスリージョンモデルの場合、すべての必要なリージョンでアクセスをリクエスト
- **GitHub OIDCアイデンティティプロバイダーをセットアップ**:
- プロバイダーURL: `https://token.actions.githubusercontent.com`
- オーディエンス: `sts.amazonaws.com`
- **GitHub Actions用のIAMロールを作成**:
- 信頼されたエンティティタイプ: Web identity
- アイデンティティプロバイダー: `token.actions.githubusercontent.com`
- 権限: `AmazonBedrockFullAccess`ポリシー
- 特定のリポジトリの信頼ポリシーを設定**必要な値**:セットアップ後、以下が必要です：
- **AWS_ROLE_TO_ASSUME**: 作成したIAMロールのARNOIDCは、認証情報が一時的で自動的にローテーションされるため、静的なAWSアクセスキーを使用するよりも安全です。詳細なOIDCセットアップ手順については、[AWSドキュメント]を参照してください。
Google Vertex AI**認証情報を保存せずに、GitHub ActionsがGoogle Cloudに安全に認証できるようにGoogle Cloudを設定します。****セキュリティに関する注意**: リポジトリ固有の設定を使用し、最小限の必要な権限のみを付与します。**必要なセットアップ**:
- **Google Cloudプロジェクトで APIを有効化**:
- IAM Credentials API
- Security Token Service (STS) API
- Vertex AI API
- **Workload Identity Federationリソースを作成**:
- Workload Identity Poolを作成
- 以下を含むGitHub OIDCプロバイダーを追加：
- Issuer: `https://token.actions.githubusercontent.com`
- リポジトリと所有者の属性マッピング
- **セキュリティ推奨**: リポジトリ固有の属性条件を使用
- **サービスアカウントを作成**:
- `Vertex AI User`ロールのみを付与
- **セキュリティ推奨**: リポジトリごとに専用のサービスアカウントを作成
- **IAMバインディングを設定**:
- Workload Identity Poolがサービスアカウントをなりすまし可能にする
- **セキュリティ推奨**: リポジトリ固有のプリンシパルセットを使用**必要な値**:セットアップ後、以下が必要です：
- **GCP_WORKLOAD_IDENTITY_PROVIDER**: 完全なプロバイダーリソース名
- **GCP_SERVICE_ACCOUNT**: サービスアカウントのメールアドレスWorkload Identity Federationは、ダウンロード可能なサービスアカウントキーの必要性を排除し、セキュリティを向上させます。詳細なセットアップ手順については、[Google Cloud Workload Identity Federationドキュメント]を参照してください。