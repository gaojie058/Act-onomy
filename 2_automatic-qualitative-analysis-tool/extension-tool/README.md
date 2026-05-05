# extension-tool

Keep the Act-onomy codebook and its 8-tier dependent file tree in sync.

The codebook is the source of truth for a wide tree of derived artifacts (paper LaTeX, two skills, project READMEs, visualizations). When you change the codebook, several things have to be re-synced. This skill provides three scripts that automate the safe parts and surface the unsafe parts.

## Three scripts

```bash
# 1. Read-only audit — does everything still agree?
python3 scripts/check_consistency.py

# 2. Regenerate Tier-2 derived markdown from the CSV sources
python3 scripts/regenerate_docs.py

# 3. Mirror the trace-analysis-judge skill between .claude/skills/ and the github repo
python3 scripts/sync_skill_mirrors.py
```

| Script | Reads | Writes | Purpose |
|---|---|---|---|
| `check_consistency.py` | All known dependents | Nothing (stdout only) | Confirms CSV ↔ JSON match, all subaction-count strings match the CSV count, the trace-analysis-judge skill mirrors agree, and example annotations use only canonical V4.2 (group, sub) pairs |
| `regenerate_docs.py` | `act-onomy_codebook.csv`, `act-onomy_taxonomy.csv`, `table.tex` (for paper coverage) | `taxonomy.md` (×2 copies) and `codebook_v4.2.md` | Tier-2 rebuild from sources |
| `sync_skill_mirrors.py` | `.claude/skills/trace-analysis-judge/` | Github copy of same | Tier-4 mirror sync (also `--reverse` to push github → runtime) |

## Standard flow when you change the codebook

1. Edit `act-onomy_codebook.csv` and `act-onomy_taxonomy.csv` (in lockstep on the join key).
2. `python3 scripts/check_consistency.py` — see what's now out of sync.
3. `python3 scripts/regenerate_docs.py` — refresh Tier 2.
4. **Manually** update [`reports/codebook/table.tex`](../../../Desktop/data-analysis/reports/codebook/table.tex) — paper coverage values are paper-grounded judgement calls, not auto-derivable.
5. **Manually** update Tier 5 README counts (the checker tells you exact lines).
6. If you renamed a sub-action that the trace-analysis-judge example uses, edit `assets/example_pylint_5859.json` to migrate — then run sync_skill_mirrors.
7. `python3 scripts/check_consistency.py` again — should be clean.

## What the dependency manifest documents

[`references/CODEBOOK_DEPENDENCIES.md`](references/CODEBOOK_DEPENDENCIES.md) lists every file that depends on the codebook, organized into 8 tiers from source-of-truth to stale visualizations. Read it before making structural changes.

## File layout

```
extension-tool/
├── SKILL.md                           ← skill prompt for Claude (auto-invoked)
├── README.md                          ← this file
├── references/
│   └── CODEBOOK_DEPENDENCIES.md       ← 8-tier dep manifest with runbook
└── scripts/
    ├── check_consistency.py           ← read-only audit
    ├── regenerate_docs.py             ← Tier 2 rebuild
    └── sync_skill_mirrors.py          ← Tier 4 mirror cp
```

## Hard-coded paths

The scripts assume:

| Tier | Path |
|---|---|
| Tier 1 | `~/Documents/Github/Act-onomy/1_data/2_taxonomy/` |
| Tier 2 | `~/Desktop/data-analysis/reports/codebook/` |
| Tier 4 (runtime) | `~/.claude/skills/trace-analysis-judge/` |
| Tier 4 (github) | `~/Documents/Github/Act-onomy/2_automatic-qualitative-analysis-tool/trace-analysis-judge/` |
| Tier 5 | `~/Documents/Github/Act-onomy/{README.md, 1_data/1_corpus/README.md}` |

If you move the repo, edit the path constants at the top of each script.
