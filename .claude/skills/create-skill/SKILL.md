---
name: create-skill
description: Claude Code用のAgent Skillを作成する。新しいスキルの設計・実装、SKILL.mdの作成、agents/references/scriptsの構成を支援。スキル作成、スキル設計、ワークフロー自動化を行う際に使用。
---

# Agent Skill 作成スキル

Claude Code用のAgent Skillを設計・作成するためのスキル。コンテキストエンジニアリングの原則に従い、効率的なスキル構造を構築する。

## このスキルが提供するもの

- スキルの構造設計
- SKILL.md の作成
- agents/*.md の設計
- references/ の構成
- 段階的ロードの最適化

## ワークフロー概要

```
Phase 1: 要件ヒアリング
    ↓
Phase 2: 構造設計
    ↓
Phase 3: SKILL.md 作成
    ↓
Phase 4: agents/ 設計（必要な場合）
    ↓
Phase 5: references/ 構成（必要な場合）
    ↓
Phase 6: 品質確認
```

---

## Phase 1: 要件ヒアリング

`agents/requirements-agent.md` の仕様に従いTaskを起動する。

**目的**: ユーザーからスキル要件を聞き出し、方向性を明確化

**出力**: スキル要件定義（目的、トリガー条件、期待出力、複雑さ）

---

## Phase 2: 構造設計

`agents/structure-agent.md` の仕様に従いTaskを起動する。

**作業前に読むこと**: [references/skill-structure.md](references/skill-structure.md)

**目的**: 要件に基づいてディレクトリ構造を設計

**出力**: 構造設計書（ディレクトリ構成、各ファイルの役割、段階的ロード計画）

---

## Phase 3: SKILL.md 作成

`agents/skillmd-agent.md` の仕様に従いTaskを起動する。

**作業前に読むこと**: [references/skill-md-format.md](references/skill-md-format.md)

**目的**: スキルの中核となるSKILL.mdを作成

**出力**: `.claude/skills/{skill-name}/SKILL.md`

---

## Phase 4: agents/ 設計

`agents/agents-agent.md` の仕様に従いTaskを起動する。

**作業前に読むこと**: [references/agents-design.md](references/agents-design.md)

**目的**: 各Task用の仕様書を作成

**出力**: `.claude/skills/{skill-name}/agents/*.md`

**スキップ条件**: シンプルスキル（SKILL.mdのみ）の場合

---

## Phase 5: references/ 構成

`agents/references-agent.md` の仕様に従いTaskを起動する。

**作業前に読むこと**: [references/references-design.md](references/references-design.md)

**目的**: 知識を外部化してreferences/に配置

**出力**: `.claude/skills/{skill-name}/references/*.md`

**スキップ条件**: 外部化すべき知識がない場合

---

## Phase 6: 品質確認

`agents/quality-agent.md` の仕様に従いTaskを起動する。

**品質確認時に読むこと**: [references/examples/skill-examples.md](references/examples/skill-examples.md)

**深い理解が必要な場合**: [references/context-engineering.md](references/context-engineering.md)

**目的**: 作成したスキル全体をレビュー

**出力**: 品質レビュー結果（合格/要修正と具体的な改善案）

---

## コンテキストエンジニアリングの原則

このスキル自体が段階的ロードの実践例となっている:

| フェーズ | 読み込むリファレンス |
|----------|----------------------|
| Phase 2 | `skill-structure.md` |
| Phase 3 | `skill-md-format.md` |
| Phase 4 | `agents-design.md` |
| Phase 5 | `references-design.md` |
| Phase 6 | `examples/skill-examples.md`, `context-engineering.md` |

**重要な原則**:
- Skillsはコンテキストを占有しない（段階的ロード）
- Taskでコンテキストを分離（結果だけメインに返す）
- 知識は外部化（references/に逃がす）
