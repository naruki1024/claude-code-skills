管理
# モニタリング
ページをコピー
Claude Codeに対してOpenTelemetryを有効にして設定する方法を学びます。ページをコピーClaude Codeはモニタリングと可観測性のためにOpenTelemetry (OTel)メトリクスとイベントをサポートしています。すべてのメトリクスはOpenTelemetryの標準メトリクスプロトコルを介してエクスポートされる時系列データであり、イベントはOpenTelemetryのログ/イベントプロトコルを介してエクスポートされます。メトリクスとログのバックエンドが適切に設定されており、集約の粒度がモニタリング要件を満たしていることを確認するのはユーザーの責任です。OpenTelemetryサポートは現在ベータ版であり、詳細は変更される可能性があります。
## ​]クイックスタート
環境変数を使用してOpenTelemetryを設定します:コピーAIに質問
```
# 1. テレメトリを有効にするexport CLAUDE_CODE_ENABLE_TELEMETRY=1# 2. エクスポーターを選択する (両方はオプション - 必要なものだけを設定してください)export OTEL_METRICS_EXPORTER=otlp # オプション: otlp, prometheus, consoleexport OTEL_LOGS_EXPORTER=otlp # オプション: otlp, console# 3. OTLPエンドポイントを設定する (OTLPエクスポーター用)export OTEL_EXPORTER_OTLP_PROTOCOL=grpcexport OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4317# 4. 認証を設定する (必要な場合)export OTEL_EXPORTER_OTLP_HEADERS="Authorization=Bearer your-token"# 5. デバッグ用: エクスポート間隔を短縮するexport OTEL_METRIC_EXPORT_INTERVAL=10000 # 10秒 (デフォルト: 60000ms)export OTEL_LOGS_EXPORT_INTERVAL=5000 # 5秒 (デフォルト: 5000ms)# 6. Claude Codeを実行するclaude
デフォルトのエクスポート間隔はメトリクスで60秒、ログで5秒です。セットアップ中は、デバッグ目的でより短い間隔を使用したい場合があります。本番環境での使用のためにこれらをリセットすることを忘れないでください。完全な設定オプションについては、[OpenTelemetry仕様]を参照してください。
## ​]管理者設定
管理者は、管理設定ファイルを通じてすべてのユーザーのOpenTelemetry設定を設定できます。これにより、組織全体のテレメトリ設定を一元的に制御できます。設定がどのように適用されるかについての詳細は、[設定の優先順位]を参照してください。管理設定ファイルは以下の場所にあります:
- macOS: `/Library/Application Support/ClaudeCode/managed-settings.json`
- Linux and WSL: `/etc/claude-code/managed-settings.json`
- Windows: `C:\ProgramData\ClaudeCode\managed-settings.json`管理設定設定の例:コピーAIに質問
{ "env": { "CLAUDE_CODE_ENABLE_TELEMETRY": "1", "OTEL_METRICS_EXPORTER": "otlp", "OTEL_LOGS_EXPORTER": "otlp", "OTEL_EXPORTER_OTLP_PROTOCOL": "grpc", "OTEL_EXPORTER_OTLP_ENDPOINT": "http://collector.company.com:4317", "OTEL_EXPORTER_OTLP_HEADERS": "Authorization=Bearer company-token" }}
管理設定はMDM (Mobile Device Management)または他のデバイス管理ソリューションを通じて配布できます。管理設定ファイルで定義された環境変数は優先度が高く、ユーザーによってオーバーライドすることはできません。
## ​]設定の詳細
### ​]一般的な設定変数
| 環境変数 | 説明 | 例の値 |
| `CLAUDE_CODE_ENABLE_TELEMETRY` | テレメトリ収集を有効にする (必須) | `1` |
| `OTEL_METRICS_EXPORTER` | メトリクスエクスポーターのタイプ (カンマ区切り) | `console`, `otlp`, `prometheus` |
| `OTEL_LOGS_EXPORTER` | ログ/イベントエクスポーターのタイプ (カンマ区切り) | `console`, `otlp` |
| `OTEL_EXPORTER_OTLP_PROTOCOL` | OTLPエクスポーターのプロトコル (すべてのシグナル) | `grpc`, `http/json`, `http/protobuf` |
| `OTEL_EXPORTER_OTLP_ENDPOINT` | OTLPコレクターエンドポイント (すべてのシグナル) | `http://localhost:4317` |
| `OTEL_EXPORTER_OTLP_METRICS_PROTOCOL` | メトリクスのプロトコル (一般的なものをオーバーライド) | `grpc`, `http/json`, `http/protobuf` |
| `OTEL_EXPORTER_OTLP_METRICS_ENDPOINT` | OTLPメトリクスエンドポイント (一般的なものをオーバーライド) | `http://localhost:4318/v1/metrics` |
| `OTEL_EXPORTER_OTLP_LOGS_PROTOCOL` | ログのプロトコル (一般的なものをオーバーライド) | `grpc`, `http/json`, `http/protobuf` |
| `OTEL_EXPORTER_OTLP_LOGS_ENDPOINT` | OTLPログエンドポイント (一般的なものをオーバーライド) | `http://localhost:4318/v1/logs` |
| `OTEL_EXPORTER_OTLP_HEADERS` | OTLPの認証ヘッダー | `Authorization=Bearer token` |
| `OTEL_EXPORTER_OTLP_METRICS_CLIENT_KEY` | mTLS認証用のクライアントキー | クライアントキーファイルへのパス |
| `OTEL_EXPORTER_OTLP_METRICS_CLIENT_CERTIFICATE` | mTLS認証用のクライアント証明書 | クライアント証明書ファイルへのパス |
| `OTEL_METRIC_EXPORT_INTERVAL` | エクスポート間隔 (ミリ秒) (デフォルト: 60000) | `5000`, `60000` |
| `OTEL_LOGS_EXPORT_INTERVAL` | ログエクスポート間隔 (ミリ秒) (デフォルト: 5000) | `1000`, `10000` |
| `OTEL_LOG_USER_PROMPTS` | ユーザープロンプトコンテンツのログを有効にする (デフォルト: 無効) | `1` で有効にする |
### ​]メトリクスカーディナリティ制御
以下の環境変数は、カーディナリティを管理するためにメトリクスに含まれる属性を制御します:
| 環境変数 | 説明 | デフォルト値 | 無効にする例 |
| `OTEL_METRICS_INCLUDE_SESSION_ID` | メトリクスにsession.id属性を含める | `true` | `false` |
| `OTEL_METRICS_INCLUDE_VERSION` | メトリクスにapp.version属性を含める | `false` | `true` |
| `OTEL_METRICS_INCLUDE_ACCOUNT_UUID` | メトリクスにuser.account_uuid属性を含める | `true` | `false` |これらの変数はメトリクスのカーディナリティを制御するのに役立ちます。これはメトリクスバックエンドのストレージ要件とクエリパフォーマンスに影響します。カーディナリティが低いほど、一般的にパフォーマンスが向上し、ストレージコストが低くなりますが、分析のためのデータの粒度が低くなります。
### ​]動的ヘッダー
動的認証が必要なエンタープライズ環境では、ヘッダーを動的に生成するスクリプトを設定できます:
#### ​]設定の設定
`.claude/settings.json`に追加します:コピーAIに質問
{ "otelHeadersHelper": "/bin/generate_opentelemetry_headers.sh"}
#### ​]スクリプト要件
スクリプトはHTTPヘッダーを表す文字列キーと値のペアを持つ有効なJSONを出力する必要があります:コピーAIに質問
#!/bin/bash# 例: 複数のヘッダーecho "{\"Authorization\": \"Bearer $(get-token.sh)\", \"X-API-Key\": \"$(get-api-key.sh)\"}"
#### ​]重要な制限事項
**ヘッダーはスタートアップ時にのみ取得され、実行時には取得されません。** これはOpenTelemetryエクスポーターアーキテクチャの制限によるものです。頻繁なトークンリフレッシュが必要なシナリオでは、OpenTelemetry Collectorをプロキシとして使用して、独自のヘッダーをリフレッシュできます。
### ​]マルチチーム組織サポート
複数のチームまたは部門を持つ組織は、`OTEL_RESOURCE_ATTRIBUTES`環境変数を使用してカスタム属性を追加して、異なるグループを区別できます:コピーAIに質問
# チーム識別用のカスタム属性を追加するexport OTEL_RESOURCE_ATTRIBUTES="department=engineering,team.id=platform,cost_center=eng-123"
これらのカスタム属性はすべてのメトリクスとイベントに含まれ、以下を可能にします:
- チームまたは部門別にメトリクスをフィルタリングする
- コストセンターごとのコストを追跡する
- チーム固有のダッシュボードを作成する
- 特定のチームのアラートを設定する**OTEL_RESOURCE_ATTRIBUTESの重要なフォーマット要件:**`OTEL_RESOURCE_ATTRIBUTES`環境変数は[W3C Baggage仕様]に従い、厳密なフォーマット要件があります:
- **スペースは許可されません**: 値にスペースを含めることはできません。例えば、`user.organizationName=My Company`は無効です
- **フォーマット**: カンマ区切りのkey=valueペアである必要があります: `key1=value1,key2=value2`
- **許可される文字**: 制御文字、空白、二重引用符、カンマ、セミコロン、バックスラッシュを除くUS-ASCII文字のみ
- **特殊文字**: 許可される範囲外の文字はパーセントエンコードする必要があります**例:**コピーAIに質問
# ❌ 無効 - スペースを含むexport OTEL_RESOURCE_ATTRIBUTES="org.name=John's Organization"# ✅ 有効 - 代わりにアンダースコアまたはキャメルケースを使用するexport OTEL_RESOURCE_ATTRIBUTES="org.name=Johns_Organization"export OTEL_RESOURCE_ATTRIBUTES="org.name=JohnsOrganization"# ✅ 有効 - 必要に応じて特殊文字をパーセントエンコードするexport OTEL_RESOURCE_ATTRIBUTES="org.name=John%27s%20Organization"
注: キーと値のペア全体をクォートする (例: `"key=value with spaces"`)はOpenTelemetry仕様でサポートされておらず、属性がクォートで接頭辞付けされることになります。
### ​]設定例
コピーAIに質問
# コンソールデバッグ (1秒間隔)export CLAUDE_CODE_ENABLE_TELEMETRY=1export OTEL_METRICS_EXPORTER=consoleexport OTEL_METRIC_EXPORT_INTERVAL=1000# OTLP/gRPCexport CLAUDE_CODE_ENABLE_TELEMETRY=1export OTEL_METRICS_EXPORTER=otlpexport OTEL_EXPORTER_OTLP_PROTOCOL=grpcexport OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4317# Prometheusexport CLAUDE_CODE_ENABLE_TELEMETRY=1export OTEL_METRICS_EXPORTER=prometheus# 複数のエクスポーターexport CLAUDE_CODE_ENABLE_TELEMETRY=1export OTEL_METRICS_EXPORTER=console,otlpexport OTEL_EXPORTER_OTLP_PROTOCOL=http/json# メトリクスとログの異なるエンドポイント/バックエンドexport CLAUDE_CODE_ENABLE_TELEMETRY=1export OTEL_METRICS_EXPORTER=otlpexport OTEL_LOGS_EXPORTER=otlpexport OTEL_EXPORTER_OTLP_METRICS_PROTOCOL=http/protobufexport OTEL_EXPORTER_OTLP_METRICS_ENDPOINT=http://metrics.company.com:4318export OTEL_EXPORTER_OTLP_LOGS_PROTOCOL=grpcexport OTEL_EXPORTER_OTLP_LOGS_ENDPOINT=http://logs.company.com:4317# メトリクスのみ (イベント/ログなし)export CLAUDE_CODE_ENABLE_TELEMETRY=1export OTEL_METRICS_EXPORTER=otlpexport OTEL_EXPORTER_OTLP_PROTOCOL=grpcexport OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4317# イベント/ログのみ (メトリクスなし)export CLAUDE_CODE_ENABLE_TELEMETRY=1export OTEL_LOGS_EXPORTER=otlpexport OTEL_EXPORTER_OTLP_PROTOCOL=grpcexport OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4317
## ​]利用可能なメトリクスとイベント
### ​]標準属性
すべてのメトリクスとイベントは、これらの標準属性を共有します:
| 属性 | 説明 | 制御者 |
| `session.id` | 一意のセッション識別子 | `OTEL_METRICS_INCLUDE_SESSION_ID` (デフォルト: true) |
| `app.version` | 現在のClaude Codeバージョン | `OTEL_METRICS_INCLUDE_VERSION` (デフォルト: false) |
| `organization.id` | 組織UUID (認証時) | 利用可能な場合は常に含まれる |
| `user.account_uuid` | アカウントUUID (認証時) | `OTEL_METRICS_INCLUDE_ACCOUNT_UUID` (デフォルト: true) |
| `terminal.type` | ターミナルタイプ (例: `iTerm.app`, `vscode`, `cursor`, `tmux`) | 検出された場合は常に含まれる |
### ​]メトリクス
Claude Codeは以下のメトリクスをエクスポートします:
| メトリクス名 | 説明 | ユニット |
| `claude_code.session.count` | 開始されたCLIセッションの数 | count |
| `claude_code.lines_of_code.count` | 変更されたコード行の数 | count |
| `claude_code.pull_request.count` | 作成されたプルリクエストの数 | count |
| `claude_code.commit.count` | 作成されたgitコミットの数 | count |
| `claude_code.cost.usage` | Claude Codeセッションのコスト | USD |
| `claude_code.token.usage` | 使用されたトークン数 | tokens |
| `claude_code.code_edit_tool.decision` | コード編集ツールの権限決定の数 | count |
| `claude_code.active_time.total` | 総アクティブ時間 (秒) | s |
### ​]メトリクスの詳細
#### ​]セッションカウンター
各セッションの開始時にインクリメントされます。**属性**:
- すべての標準属性]
#### ​]コード行カウンター
コードが追加または削除されるとインクリメントされます。**属性**:
- `type`: (`"added"`, `"removed"`)
#### ​]プルリクエストカウンター
Claude Codeを介してプルリクエストを作成するときにインクリメントされます。**属性**:
#### ​]コミットカウンター
Claude Codeを介してgitコミットを作成するときにインクリメントされます。**属性**:
#### ​]コストカウンター
各APIリクエスト後にインクリメントされます。**属性**:
- `model`: モデル識別子 (例: “claude-sonnet-4-5-20250929”)
#### ​]トークンカウンター
- `type`: (`"input"`, `"output"`, `"cacheRead"`, `"cacheCreation"`)
#### ​]コード編集ツール決定カウンター
ユーザーがEdit、Write、またはNotebookEditツールの使用を受け入れるか拒否するときにインクリメントされます。**属性**:
- `tool`: ツール名 (`"Edit"`, `"Write"`, `"NotebookEdit"`)
- `decision`: ユーザーの決定 (`"accept"`, `"reject"`)
- `language`: 編集されたファイルのプログラミング言語 (例: `"TypeScript"`, `"Python"`, `"JavaScript"`, `"Markdown"`)。認識されないファイル拡張子の場合は`"unknown"`を返します。
#### ​]アクティブ時間カウンター
Claude Codeを積極的に使用している実際の時間を追跡します (アイドル時間ではなく)。このメトリクスはプロンプトの入力や応答の受信などのユーザーインタラクション中にインクリメントされます。**属性**:
### ​]イベント
Claude Codeは、OpenTelemetryログ/イベント経由で以下のイベントをエクスポートします (`OTEL_LOGS_EXPORTER`が設定されている場合):
#### ​]ユーザープロンプトイベント
ユーザーがプロンプトを送信するときにログされます。**イベント名**: `claude_code.user_prompt`**属性**:
- `event.name`: `"user_prompt"`
- `event.timestamp`: ISO 8601タイムスタンプ
- `prompt_length`: プロンプトの長さ
- `prompt`: プロンプトコンテンツ (デフォルトではマスクされています。`OTEL_LOG_USER_PROMPTS=1`で有効にします)
#### ​]ツール結果イベント
ツールが実行を完了するときにログされます。**イベント名**: `claude_code.tool_result`**属性**:
- `event.name`: `"tool_result"`
- `tool_name`: ツールの名前
- `success`: `"true"` または `"false"`
- `duration_ms`: 実行時間 (ミリ秒)
- `error`: エラーメッセージ (失敗した場合)
- `decision`: `"accept"` または `"reject"`
- `source`: 決定ソース - `"config"`, `"user_permanent"`, `"user_temporary"`, `"user_abort"`, または `"user_reject"`
- `tool_parameters`: ツール固有のパラメータを含むJSON文字列 (利用可能な場合)
- Bashツール用: `bash_command`, `full_command`, `timeout`, `description`, `sandbox`を含む
#### ​]APIリクエストイベント
Claudeへの各APIリクエストについてログされます。**イベント名**: `claude_code.api_request`**属性**:
- `event.name`: `"api_request"`
- `model`: 使用されたモデル (例: “claude-sonnet-4-5-20250929”)
- `cost_usd`: 推定コスト (USD)
- `duration_ms`: リクエスト期間 (ミリ秒)
- `input_tokens`: 入力トークン数
- `output_tokens`: 出力トークン数
- `cache_read_tokens`: キャッシュから読み取られたトークン数
- `cache_creation_tokens`: キャッシュ作成に使用されたトークン数
#### ​]APIエラーイベント
ClaudeへのAPIリクエストが失敗するときにログされます。**イベント名**: `claude_code.api_error`**属性**:
- `event.name`: `"api_error"`
- `error`: エラーメッセージ
- `status_code`: HTTPステータスコード (該当する場合)
- `attempt`: 試行番号 (再試行されたリクエストの場合)
#### ​]ツール決定イベント
ツール権限決定が行われるときにログされます (受け入れ/拒否)。**イベント名**: `claude_code.tool_decision`**属性**:
- `event.name`: `"tool_decision"`
- `tool_name`: ツールの名前 (例: “Read”, “Edit”, “Write”, “NotebookEdit”など)
## ​]メトリクスとイベントデータの解釈
Claude Codeによってエクスポートされるメトリクスは、使用パターンと生産性に関する貴重な洞察を提供します。作成できる一般的な可視化と分析は次のとおりです:
### ​]使用状況モニタリング
| メトリクス | 分析の機会 |
| `claude_code.token.usage` | `type` (入力/出力)、ユーザー、チーム、またはモデル別に分類する |
| `claude_code.session.count` | 時間経過に伴う採用とエンゲージメントを追跡する |
| `claude_code.lines_of_code.count` | コード追加/削除を追跡して生産性を測定する |
| `claude_code.commit.count` & `claude_code.pull_request.count` | 開発ワークフローへの影響を理解する |
### ​]コストモニタリング
`claude_code.cost.usage`メトリクスは以下に役立ちます:
- チームまたは個人全体の使用トレンドを追跡する
- 最適化のための高使用セッションを特定するコストメトリクスは概算です。公式な請求データについては、APIプロバイダー (Claude Console、AWS Bedrock、またはGoogle Cloud Vertex)を参照してください。
### ​]アラートとセグメンテーション
検討すべき一般的なアラート:
- コストスパイク
- 異常なトークン消費
- 特定のユーザーからの高いセッションボリュームすべてのメトリクスは、`user.account_uuid`、`organization.id`、`session.id`、`model`、および`app.version`でセグメント化できます。
### ​]イベント分析
イベントデータはClaude Codeインタラクションに関する詳細な洞察を提供します:**ツール使用パターン**: ツール結果イベントを分析して以下を特定します:
- 最も頻繁に使用されるツール
- ツールの成功率
- 平均ツール実行時間
- ツールタイプ別のエラーパターン**パフォーマンスモニタリング**: APIリクエスト期間とツール実行時間を追跡して、パフォーマンスのボトルネックを特定します。
## ​]バックエンド考慮事項
メトリクスとログバックエンドの選択により、実行できる分析のタイプが決まります:
### ​]メトリクスの場合:
- **時系列データベース (例: Prometheus)**: レート計算、集約メトリクス
- **カラムナーストア (例: ClickHouse)**: 複雑なクエリ、一意のユーザー分析
- **フル機能の可観測性プラットフォーム (例: Honeycomb、Datadog)**: 高度なクエリ、可視化、アラート
### ​]イベント/ログの場合:
- **ログ集約システム (例: Elasticsearch、Loki)**: フルテキスト検索、ログ分析
- **カラムナーストア (例: ClickHouse)**: 構造化イベント分析
- **フル機能の可観測性プラットフォーム (例: Honeycomb、Datadog)**: メトリクスとイベント間の相関日次/週次/月次アクティブユーザー (DAU/WAU/MAU)メトリクスが必要な組織の場合は、効率的な一意値クエリをサポートするバックエンドを検討してください。
## ​]サービス情報
すべてのメトリクスとイベントは、以下のリソース属性でエクスポートされます:
- `service.name`: `claude-code`
- `service.version`: 現在のClaude Codeバージョン
- `os.type`: オペレーティングシステムタイプ (例: `linux`, `darwin`, `windows`)
- `os.version`: オペレーティングシステムバージョン文字列
- `host.arch`: ホストアーキテクチャ (例: `amd64`, `arm64`)
- `wsl.version`: WSLバージョン番号 (Windows Subsystem for Linuxで実行している場合のみ存在)
- メーター名: `com.anthropic.claude_code`
## ​]ROI測定リソース
テレメトリセットアップ、コスト分析、生産性メトリクス、および自動レポート生成を含むClaude CodeのROI (投資収益率)測定に関する包括的なガイドについては、[Claude Code ROI測定ガイド]を参照してください。このリポジトリは、すぐに使用できるDocker Compose設定、PrometheusおよびOpenTelemetryセットアップ、およびLinearなどのツールと統合された生産性レポート生成テンプレートを提供します。
## ​]セキュリティ/プライバシーに関する考慮事項
- テレメトリはオプトインであり、明示的な設定が必要です
- APIキーやファイルコンテンツなどの機密情報はメトリクスやイベントに含まれることはありません
- ユーザープロンプトコンテンツはデフォルトではマスクされています。プロンプト長のみが記録されます。ユーザープロンプトログを有効にするには、`OTEL_LOG_USER_PROMPTS=1`を設定します
## ​]Amazon Bedrock上のClaude Codeのモニタリング
Amazon Bedrock向けのClaude Code使用状況モニタリングガイダンスの詳細については、[Claude Code Monitoring Implementation (Bedrock)]を参照してください。
このページは役に立ちましたか？はいいいえ[データ使用][コスト]⌘I