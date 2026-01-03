設定
# ステータスライン設定
ページをコピー
Claude Codeのカスタムステータスラインを作成して、コンテキスト情報を表示しますページをコピーClaude Codeをカスタムステータスラインでカスタマイズしましょう。このステータスラインはClaude Codeインターフェースの下部に表示され、Oh-my-zshなどのシェルのターミナルプロンプト（PS1）と同様に機能します。
## ​]カスタムステータスラインを作成する
以下のいずれかを実行できます：
- `/statusline`を実行してClaude Codeにカスタムステータスラインのセットアップを支援してもらいます。デフォルトではターミナルのプロンプトを再現しようとしますが、`/statusline show the model name in orange`など、Claude Codeに希望する動作に関する追加の指示を提供できます
- `.claude/settings.json`に直接`statusLine`コマンドを追加します：コピーAIに質問
```
{ "statusLine": { "type": "command", "command": "~/.claude/statusline.sh", "padding": 0 // オプション：ステータスラインを端まで表示する場合は0に設定 }}
## ​]仕組み
- ステータスラインは会話メッセージが更新されるときに更新されます
- 更新は最大300msごとに実行されます
- コマンドからのstdoutの最初の行がステータスラインテキストになります
- ステータスラインのスタイリングのためにANSIカラーコードがサポートされています
- Claude Codeは現在のセッション（モデル、ディレクトリなど）に関するコンテキスト情報をJSON形式でstdinを介してスクリプトに渡します
## ​]JSON入力構造
ステータスラインコマンドはJSON形式でstdinを介して構造化されたデータを受け取ります：コピーAIに質問
{ "hook_event_name": "Status", "session_id": "abc123...", "transcript_path": "/path/to/transcript.json", "cwd": "/current/working/directory", "model": { "id": "claude-opus-4-1", "display_name": "Opus" }, "workspace": { "current_dir": "/current/working/directory", "project_dir": "/original/project/directory" }, "version": "1.0.80", "output_style": { "name": "default" }, "cost": { "total_cost_usd": 0.01234, "total_duration_ms": 45000, "total_api_duration_ms": 2300, "total_lines_added": 156, "total_lines_removed": 23 }}
## ​]スクリプト例
### ​]シンプルなステータスライン
コピーAIに質問
#!/bin/bash# stdinからJSON入力を読み込むinput=$(cat)# jqを使用して値を抽出MODEL_DISPLAY=$(echo "$input" | jq -r '.model.display_name')CURRENT_DIR=$(echo "$input" | jq -r '.workspace.current_dir')echo "[$MODEL_DISPLAY] 📁 ${CURRENT_DIR##*/}"
### ​]Git対応ステータスライン
#!/bin/bash# stdinからJSON入力を読み込むinput=$(cat)# jqを使用して値を抽出MODEL_DISPLAY=$(echo "$input" | jq -r '.model.display_name')CURRENT_DIR=$(echo "$input" | jq -r '.workspace.current_dir')# gitリポジトリにいる場合はgitブランチを表示GIT_BRANCH=""if git rev-parse --git-dir > /dev/null 2>&1; then BRANCH=$(git branch --show-current 2>/dev/null) if [ -n "$BRANCH" ]; then GIT_BRANCH=" | 🌿 $BRANCH" fifiecho "[$MODEL_DISPLAY] 📁 ${CURRENT_DIR##*/}$GIT_BRANCH"
### ​]Pythonの例
#!/usr/bin/env python3import jsonimport sysimport os# stdinからJSONを読み込むdata = json.load(sys.stdin)# 値を抽出model = data['model']['display_name']current_dir = os.path.basename(data['workspace']['current_dir'])# gitブランチをチェックgit_branch = ""if os.path.exists('.git'): try: with open('.git/HEAD', 'r') as f: ref = f.read().strip() if ref.startswith('ref: refs/heads/'): git_branch = f" | 🌿 {ref.replace('ref: refs/heads/', '')}" except: passprint(f"[{model}] 📁 {current_dir}{git_branch}")
### ​]Node.jsの例
#!/usr/bin/env nodeconst fs = require('fs');const path = require('path');// stdinからJSONを読み込むlet input = '';process.stdin.on('data', chunk => input += chunk);process.stdin.on('end', () => { const data = JSON.parse(input); // 値を抽出 const model = data.model.display_name; const currentDir = path.basename(data.workspace.current_dir); // gitブランチをチェック let gitBranch = ''; try { const headContent = fs.readFileSync('.git/HEAD', 'utf8').trim(); if (headContent.startsWith('ref: refs/heads/')) { gitBranch = ` | 🌿 ${headContent.replace('ref: refs/heads/', '')}`; } } catch (e) { // gitリポジトリではないか、HEADを読み込めない } console.log(`[${model}] 📁 ${currentDir}${gitBranch}`);});
### ​]ヘルパー関数アプローチ
より複雑なbashスクリプトの場合、ヘルパー関数を作成できます：コピーAIに質問
#!/bin/bash# JSON入力を一度読み込むinput=$(cat)# 一般的な抽出用のヘルパー関数get_model_name() { echo "$input" | jq -r '.model.display_name'; }get_current_dir() { echo "$input" | jq -r '.workspace.current_dir'; }get_project_dir() { echo "$input" | jq -r '.workspace.project_dir'; }get_version() { echo "$input" | jq -r '.version'; }get_cost() { echo "$input" | jq -r '.cost.total_cost_usd'; }get_duration() { echo "$input" | jq -r '.cost.total_duration_ms'; }get_lines_added() { echo "$input" | jq -r '.cost.total_lines_added'; }get_lines_removed() { echo "$input" | jq -r '.cost.total_lines_removed'; }# ヘルパーを使用MODEL=$(get_model_name)DIR=$(get_current_dir)echo "[$MODEL] 📁 ${DIR##*/}"
## ​]ヒント
- ステータスラインは簡潔に保つ - 1行に収まるべきです
- 絵文字（ターミナルがサポートしている場合）と色を使用して情報をスキャン可能にします
- Bashでは`jq`をJSON解析に使用します（上記の例を参照）
- モックJSON入力でスクリプトを手動で実行してテストします：`echo '{"model":{"display_name":"Test"},"workspace":{"current_dir":"/test"}}' | ./statusline.sh`
- 必要に応じて、高コストの操作（gitステータスなど）をキャッシュすることを検討してください
## ​]トラブルシューティング
- ステータスラインが表示されない場合は、スクリプトが実行可能であることを確認してください（`chmod +x`）
- スクリプトがstdoutに出力していることを確認してください（stderrではなく）
このページは役に立ちましたか？はいいいえ[メモリ管理]⌘I