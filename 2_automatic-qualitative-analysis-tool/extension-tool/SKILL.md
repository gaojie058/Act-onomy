---
name: extension-tool
description: Maintain consistency across all files that depend on the Act-onomy codebook. Use when the canonical taxonomy (`act-onomy_codebook.csv` / `act-onomy_taxonomy.csv` / `codebook_v4.2.json`) changes — renaming a sub-action, adding/removing a leaf, restructuring a category, bumping a version. The skill checks all 8 dependency tiers documented in `references/CODEBOOK_DEPENDENCIES.md`, regenerates derived markdown views (`taxonomy.md`, `codebook_v4.2.md`), reports stale references, and mirrors the `trace-qualitative-analyst` skill between the `.claude/skills/` runtime location and the Github source-of-truth copy. Trigger phrases: "extend the codebook", "propagate codebook changes", "check codebook consistency", "regenerate taxonomy.md", "sync skill mirrors", "what files need to update after changing the codebook".
---

# Codebook extension tool

The Act-onomy codebook is the source of truth for a wide tree of derived files (paper LaTeX, two skills, project READMEs, visualizations). When you change the codebook, **8 tiers of dependents** need to be re-synced. This skill automates the safe parts and flags the unsafe parts.

The full dependency manifest is in [`references/CODEBOOK_DEPENDENCIES.md`](references/CODEBOOK_DEPENDENCIES.md). Read that first if you have not — it explains why each tier is structured the way it is.

## When to use this skill

- Adding / removing / renaming a sub-action or a leaf instance
- Restructuring a category (e.g., the V4.2 PlanB Retrieval flatten: `1 placeholder Retrieve` → `5 first-class subactions`)
- Bumping the codebook version (V4.x → V5.0)
- Verifying consistency before a release / before re-running `trace-qualitative-analyst`
- Investigating "why does file X say 42 sub-actions when file Y says 46?"

If the user is editing the codebook PDF or CSV by hand and asks "what else do I need to update?", invoke this skill.

## What this skill does

| Capability | Script | Safe to auto-run? |
|---|---|---|
| Detect stale subaction counts (e.g., "42" left over after a 42→46 change) | `scripts/check_consistency.py` | Yes — read-only |
| Detect legacy V1 retrieval / subgroup names in active artifacts | `scripts/check_consistency.py` | Yes — read-only |
| Verify CSV ↔ JSON ↔ taxonomy.json structural agreement | `scripts/check_consistency.py` | Yes — read-only |
| Regenerate `taxonomy.md` (Tier 2) from CSVs | `scripts/regenerate_docs.py` | Yes — overwrites with canonical content |
| Regenerate `codebook_v4.2.md` (Tier 2) from CSVs | `scripts/regenerate_docs.py` | Yes — same |
| Mirror `trace-qualitative-analyst` between `.claude/skills/` and Github | `scripts/sync_skill_mirrors.py` | Yes — `cp` + `diff -r` verify |
| Update `table.tex` (Tier 3) | — | **No** — coverage values are paper-grounded, manual decisions |
| Update project READMEs (Tier 5) | — | Manual — but checker tells you exactly which lines and counts |
| Update `trace-qualitative-analyst` per-quote annotations | — | Manual — semantic decision (which V4.2 subgroup does each old V1 quote map to?) |

## How to invoke

```bash
# 1. Read-only consistency report (no writes)
python3 scripts/check_consistency.py

# 2. Regenerate derived docs from current CSVs
python3 scripts/regenerate_docs.py

# 3. Sync the trace-qualitative-analyst skill between .claude and Github
python3 scripts/sync_skill_mirrors.py
```

Each script prints a one-line summary at the end: green check if all-clear, yellow warning if there are flagged issues, red cross if a critical mismatch is found.

## Working with the user

When the user says "I just changed the codebook" or names a specific change ("I renamed Retrieval › Retrieve to 5 sub-actions"), the standard flow is:

1. **First run `check_consistency.py`** to surface the current state of inconsistencies. This is the diagnostic step.
2. **Walk the user through the report**, classifying each flagged item as:
   - **Auto-fixable** (counts in READMEs, derived markdown) → propose to run `regenerate_docs.py` and an Edit pass
   - **Manual but mechanical** (rename in trace-qualitative-analyst example JSON) → write the migration map in conversation and apply with a small one-off script
   - **Semantic decision required** (which V4.2 name does this V1 reference map to?) → ask the user
3. **After fixes**, re-run `check_consistency.py` to verify the report is clean.
4. **Run `sync_skill_mirrors.py`** if the trace-qualitative-analyst skill files were touched.

Do not auto-edit Tier 7 files (`behavioral_descriptions.csv`) — those are frozen historical records. The checker will flag them as informational only.

## Output schema (check_consistency.py)

```json
{
  "summary": {"errors": 0, "warnings": 3, "info": 1},
  "tier1_integrity": {"csv_json_match": true, "leaf_count": 120, "subaction_count": 46},
  "tier2_derived": {"taxonomy_md_count": 46, "codebook_md_count": 46, "stale": false},
  "tier3_paper": {"table_tex_count": 46, "multirow_check": "ok"},
  "tier4_skill": {"runtime_count": 46, "github_count": 46, "in_sync": true, "example_subgroups_valid": true},
  "tier5_readmes": [
    {"file": "...", "line": 9,  "found_count": 46, "expected": 46, "ok": true},
    {"file": "...", "line": 47, "found_count": 46, "expected": 46, "ok": true}
  ],
  "stale_legacy_names": [
    {"file": "...", "line": 35, "name": "Retrieve knowledge from semantic memory", "tier": 6, "severity": "info"}
  ]
}
```

The orchestrator agent (you) reads this JSON and tells the user in plain English which fixes are needed.

## File layout

```
extension-tool/
├── SKILL.md                           ← this file
├── README.md                          ← human-readable overview
├── references/
│   └── CODEBOOK_DEPENDENCIES.md       ← the 8-tier dep manifest
└── scripts/
    ├── check_consistency.py           ← diagnostic, read-only
    ├── regenerate_docs.py             ← Tier 2 rebuild from CSVs
    └── sync_skill_mirrors.py          ← Tier 4 mirror sync
```

## Repo paths the scripts assume

| Tier | Path |
|---|---|
| Tier 1 (sources) | `~/Documents/Github/Act-onomy/1_data/2_taxonomy/` |
| Tier 2/3 (derived + paper) | `~/Desktop/data-analysis/reports/codebook/` |
| Tier 4 (skill, runtime) | `~/.claude/skills/trace-qualitative-analyst/` |
| Tier 4 (skill, github) | `~/Documents/Github/Act-onomy/2_automatic-qualitative-analysis-tool/trace-qualitative-analyst/` |
| Tier 5 (READMEs) | `~/Documents/Github/Act-onomy/README.md`, `~/Documents/Github/Act-onomy/1_data/1_corpus/README.md` |

Scripts hard-code these paths. If the repo moves, edit the path constants at the top of each script.
