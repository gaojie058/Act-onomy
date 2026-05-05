# Codebook dependency manifest

When the codebook changes (rename a sub-action, add/remove an instance, restructure a category, bump a count), several artifacts across this repo and the sibling `data-analysis` tree must be kept in sync. This file is the canonical "what to update next" checklist.

The codebook has 4 tiers in this repo: **(1) canonical sources** → **(2) derived data files** → **(3) human-readable docs** → **(4) downstream artifacts** (skills, paper tables, project READMEs, visualizations). A change to any source-of-truth file should propagate down.

---

## Tier 1 — Source of truth

These are the files you edit directly. Everything else is downstream.

| File | What it holds | Edit when |
|---|---|---|
| `act-onomy_codebook.csv` | Class / Action / Subaction / Instance + `examples_raw` + `papers_cited` + `human reviewers`, one row per leaf (120 leaves) | Always — this is the master |
| `act-onomy_taxonomy.csv` | Same hierarchy + `definition` column | Always — paired with `act-onomy_codebook.csv` |
| `act-onomy_taxonomy.json` | Tree form + `summary` (`tier_1..4` counts) | Auto-derive; update `summary` if structure changes |
| `taxonomy_development/codebook_v4.2.json` | Rich tree form (mega → super → sub → leaves with reviewer info) + `summary` (`n_mega_sections`, `n_super_categories`, `n_sub_categories`, `n_leaves`) + `version_note` | When restructuring (e.g., PlanB Retrieval); bump `version_note` |
| `taxonomy_development/Action Space Codebook (v4.2).pdf` | Visual reference (the source for codebook_v4.2.json) | When the visual layout changes (re-export from Google Docs / source) |

**Invariant.** All five must agree on (a) the set of (Class, Action, Subaction, Instance) tuples and (b) the per-leaf metadata. Discrepancies between CSV and JSON are bugs.

---

## Tier 2 — Derived data mirrors (regenerated)

Auto-derive from Tier 1. Don't hand-edit; run the build script.

| File | Derived from | Build script |
|---|---|---|
| `1_data/2_taxonomy/taxonomy.md` | `act-onomy_codebook.csv` + `act-onomy_taxonomy.csv` + `reports/codebook/table.tex` (for paper coverage) | `/tmp/build_taxonomy_md.py` (kept in `data-analysis/scripts/` if persisted) |
| `data-analysis/reports/codebook/taxonomy.md` | Same | Same script — copy of the above |
| `data-analysis/reports/codebook/codebook_v4.2.md` | `act-onomy_codebook.csv` ⨝ `act-onomy_taxonomy.csv` | Same script (second output) |

---


## Tier 4 — Skill: `trace-analysis-judge`

Two mirrored copies. Edit ONE, then `cp` to the other and `diff -r` to verify.

| File (×2 copies) | What's codebook-bound | Update when |
|---|---|---|
| `references/codebook.md` | Full subgroup list with empirical-extra leaves; palette table; total counts | Any sub-action add/remove/rename |
| `SKILL.md` | Stage-3 example annotations (line ~140); signature example (line ~283); 10-group enumeration (line ~124) | Sub-action rename anywhere referenced in examples |
| `README.md` | Total counts | Any count change |
| `assets/example_pylint_5859.json` | Per-quote `(grp, sub, leaf)` triples; `findings` body (mentions subgroup names by name) | Sub-action rename used in this trajectory |
| `scripts/render_artifact.py` | `GROUP_COLOURS` dict (10 keys) | Group rename / add (NOT sub-action) — the 10 groups are stable for V4.x |

**Two mirrors.** The `.claude/skills/` copy is what the runtime loads; the Github copy is the source-of-truth in version control. Sync command:

```bash
SRC=~/.claude/skills/trace-analysis-judge
DST=~/Documents/Github/Act-onomy/2_automatic-qualitative-analysis-tool/trace-analysis-judge
cp "$SRC/SKILL.md" "$SRC/README.md" "$DST/"
cp "$SRC/references/codebook.md" "$DST/references/"
cp "$SRC/assets/example_pylint_5859.json" "$DST/assets/"
diff -r "$SRC" "$DST"  # must be empty
```

**Verification step (always run after edits):**

```bash
cd ~/.claude/skills/trace-analysis-judge
python3 scripts/render_artifact.py assets/example_pylint_5859.json --output /tmp/check.html
# expect: 0 warnings; "N codebook groups represented" matches what example uses
```

---

## Tier 5 — Project READMEs (counts only)

Search for the count and update.

| File | Phrases that need updating |
|---|---|
| `README.md` (Github root) | `instantiated by N sub-actions and 120 leaf-level instances` (line ~9); `4 Classes × 10 Actions × N Subactions × 120 Instances` (line ~56) |
| `1_data/1_corpus/README.md` | `4 Classes → 10 Actions → N Subactions → 120 Instances` (line ~47); per-Class subactions table (line ~53–57) |

**Sanity check:** Per-Class subaction counts should sum to the total. Currently:

| Class | Subactions |
|---|---:|
| Sense | 10 (Retrieval 5 + Memory 5) |
| Think | 20 (Planning 4 + Reasoning 9 + Evaluate 3 + Deciding 4) |
| Act | 8 (Grounding 5 + Executing 3) |
| Adapt | 8 (Learning 5 + Reflection 3) |
| **Total** | **46** |

---

## Tier 6 — Skill: `discovery-judge` (illustrative refs only)

| File | What's codebook-bound | Notes |
|---|---|---|
| `2_automatic-qualitative-analysis-tool/discovery-judge/scripts/spec-schema.md` | Hypothetical example uses `Retrieve knowledge from semantic memory` (legacy V1 leaf name) | Not codebook-loading — illustrative text in methodology discussion. Update if you want the example to track current names; otherwise low-priority |
| `2_automatic-qualitative-analysis-tool/discovery-judge/references/diagnostics.md` | Same — uses `Retrieve knowledge from semantic memory` as illustrative leaf in stretch-fit pattern docs | Low-priority; methodology point is clear regardless of which name appears |

---

## Tier 7 — Frozen historical records (DO NOT MODIFY)

| File | Why frozen |
|---|---|
| `1_data/1_corpus/behavioral_descriptions.csv` | Audit trail of original 565 behavior descriptions extracted during codebook construction. Each row's `original_action_label` (e.g., `Execution _ Retrieve Domain Context`) is a record of the V1-era taxonomy code that was annotated at the time. Re-coding to V4.2 names would erase the trail. If you need V4.2 mappings, add a new column; do not overwrite the legacy column. |

---


## Standard runbook — "I just changed the codebook"

1. **Edit Tier 1** — modify `act-onomy_codebook.csv` and `act-onomy_taxonomy.csv` (in lockstep on `taxonomy_code`/`code`). For structural changes, also edit `taxonomy_development/codebook_v4.2.json`.
2. **Sync the JSON `summary` blocks** in `act-onomy_taxonomy.json` (`tier_3`) and `codebook_v4.2.json` (`n_sub_categories`, `n_leaves`). Append to `version_note` describing the change.
3. **Regenerate Tier 2** — run the build script to refresh `taxonomy.md` and `codebook_v4.2.md` in both `1_data/2_taxonomy/` and `data-analysis/reports/codebook/`.
4. **Update Tier 4** (skill) — patch `references/codebook.md` (subgroup list + count); patch `SKILL.md` / `README.md` if counts or sample names changed; migrate `example_pylint_5859.json` if any used subgroup was renamed; mirror to GitHub copy; run `render_artifact.py` to verify 0 warnings.
5. **Update Tier 5** (READMEs) — bump `N Subactions` in 2 files (3 lines).
6. **Decide on Tier 6** — only update illustrative example names if you want them to track current naming.
7. **Skip Tier 7** — never modify frozen records.


**Final verification:**

```bash
# all subaction-count references should now equal the new total
cd ~/Documents/Github/Act-onomy && grep -rn "Subactions\|sub-actions" --include="*.md" --include="*.tex" | grep -E "[0-9]+ [Ss]ub"

cd ~/Desktop/data-analysis && grep -rn "Subactions\|sub-actions" --include="*.md" --include="*.tex" | grep -E "[0-9]+ [Ss]ub"

# all should print the same number
```
