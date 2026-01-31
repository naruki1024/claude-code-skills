#!/bin/bash
#
# Migration File Protection Hook
#
# マイグレーションファイルの直接編集を防止し、
# 環境間の不整合を防ぐためのPreToolUseフック
#

# JSON入力を読み取り
input=$(cat)
file_path=$(echo "$input" | jq -r '.tool_input.file_path // empty' 2>/dev/null)
tool_name=$(echo "$input" | jq -r '.tool_name // empty' 2>/dev/null)

# file_path が空なら何もしない
if [[ -z "$file_path" ]]; then
  exit 0
fi

# Edit/Write ツールのみをチェック
if [[ ! "$tool_name" =~ ^(Edit|Write)$ ]]; then
  exit 0
fi

# 保護対象パターン
declare -A protected_patterns=(
  ["drizzle/*.sql"]="Migration SQL files"
  ["drizzle/meta/"]="Migration metadata"
  ["prisma/migrations/"]="Prisma migrations"
)

# ファイルが保護対象かチェック
for pattern in "${!protected_patterns[@]}"; do
  if [[ "$file_path" == *"$pattern"* ]] || \
     ([[ "$pattern" == "drizzle/*.sql" ]] && [[ "$file_path" == *"drizzle/"* ]] && [[ "$file_path" == *".sql" ]]); then

    description="${protected_patterns[$pattern]}"

    cat >&2 <<EOF

╔════════════════════════════════════════════════════════════════╗
║  MIGRATION FILE PROTECTION                                     ║
╚════════════════════════════════════════════════════════════════╝

Cannot edit: $file_path
Category:    $description

REASON:
  Migration files must NOT be edited directly.
  Manual edits cause environment inconsistencies:
    - Other environments will fail on migration
    - Database schema mismatches
    - Data corruption risk

CORRECT APPROACH:
  1. Modify schema definition (e.g., src/db/schema/*.ts)
  2. Generate migration: npm run db:generate
  3. Apply migration:    npm run db:migrate

If you need to fix a migration issue:
  - Create a NEW migration to make corrections
  - Never modify existing migration files

EOF
    exit 2
  fi
done

exit 0
