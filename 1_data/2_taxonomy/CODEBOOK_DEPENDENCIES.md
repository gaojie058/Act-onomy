# Codebook dependency manifest

When the codebook changes (rename a sub-action, add/remove an instance, restructure a category, bump a count), several artifacts in this repo must be kept in sync. This file is the canonical "what to update next" checklist.

The codebook has 6 tiers: **(1) canonical sources** → **(2) derived data files** → **(3) skill: trace-qualitative-analyst** → **(4) project READMEs** → **(5) skill: discovery-qualitative-analyst)** → **(6) frozen records**. A change to any source-of-truth file should propagate down.

---

## Tier 1 — Source of truth

The single file you edit directly. Everything else is downstream.

| File | What it holds | Edit when |
|---|---|---|
| `1_data/2_taxonomy/taxonomy_development/Action Space Codebook (v4.2).pdf` | Visual master — the authoritative layout of all Classes, Actions, Subactions, and Instances | Whenever the taxonomy changes (re-export from Google Docs / source) |

---

## Tier 2 — Derived structured data (update after editing Tier 1)

These files must be manually updated to reflect every change made in the PDF.

| File | What it holds | Update when |
|---|---|---|
| `1_data/2_taxonomy/act-onomy_codebook.csv` | Class / Action / Subaction / Instance + `examples_raw` + `papers_cited` + `human reviewers`, one row per leaf (120 leaves) | Any leaf-level change |
| `1_data/2_taxonomy/act-onomy_taxonomy.csv` | Same hierarchy + `definition` column | Any leaf-level change — keep in lockstep with codebook.csv |
| `1_data/2_taxonomy/act-onomy_taxonomy.json` | Tree form + `summary` (`tier_1..4` counts) | When restructuring; update `summary` if structure changes |
| `1_data/2_taxonomy/taxonomy_development/codebook_v4.2.json` | Rich tree form + `summary` (`n_mega_sections`, `n_super_categories`, `n_sub_categories`, `n_leaves`) + `version_note` | Any structural change; bump `version_note` |
| `hf_release/taxonomy/act-onomy_codebook.csv` | Mirror of `1_data/2_taxonomy/act-onomy_codebook.csv` | Copy after editing above |
| `hf_release/taxonomy/act-onomy_taxonomy.csv` | Mirror of `1_data/2_taxonomy/act-onomy_taxonomy.csv` | Copy after editing above |
| `hf_release/taxonomy/act-onomy_taxonomy.json` | Mirror of `1_data/2_taxonomy/act-onomy_taxonomy.json` | Copy after editing above |
| `1_data/2_taxonomy/taxonomy.md` | Human-readable derived view | `2_automatic-qualitative-analysis-tool/extension-tool/scripts/regenerate_docs.py` |
| `hf_release/taxonomy/taxonomy.md` | Same — release copy | Same script |

**Invariant.** All four structured files (two CSVs + two JSONs) must agree on the set of (Class, Action, Subaction, Instance) tuples. Discrepancies are bugs.

---

## Tier 3 — Skill: `trace-qualitative-analyst`

Source of truth is the copy inside this repo. The runtime copy at `~/.claude/skills/` is a local installation and is not tracked here.

| File | What's codebook-bound | Update when |
|---|---|---|
| `2_automatic-qualitative-analysis-tool/trace-qualitative-analyst/references/codebook.md` | Full subgroup list with empirical-extra leaves; palette table; total counts | Any sub-action add/remove/rename |
| `2_automatic-qualitative-analysis-tool/trace-qualitative-analyst/SKILL.md` | Stage-3 example annotations (line ~140); signature example (line ~283); 10-group enumeration (line ~124) | Sub-action rename anywhere referenced in examples |
| `2_automatic-qualitative-analysis-tool/trace-qualitative-analyst/README.md` | Total counts | Any count change |
| `2_automatic-qualitative-analysis-tool/trace-qualitative-analyst/assets/example_pylint_5859.json` | Per-quote `(grp, sub, leaf)` triples; `findings` body (mentions subgroup names by name) | Sub-action rename used in this trajectory |
| `2_automatic-qualitative-analysis-tool/trace-qualitative-analyst/scripts/render_artifact.py` | `GROUP_COLOURS` dict (10 keys) | Group rename / add (NOT sub-action) — the 10 groups are stable for V4.x |

**Verification step (always run after edits):**

```bash
cd ~/Documents/Github/Act-onomy
python3 2_automatic-qualitative-analysis-tool/trace-qualitative-analyst/scripts/render_artifact.py \
  2_automatic-qualitative-analysis-tool/trace-qualitative-analyst/assets/example_pylint_5859.json \
  --output /tmp/check.html
# expect: 0 warnings; "N codebook groups represented" matches what example uses
```

---

## Tier 4 — Project READMEs (counts only)

Search for the count and update.

| File | Phrases that need updating |
|---|---|
| `README.md` (repo root) | `instantiated by N sub-actions and 120 leaf-level instances` (line ~9); `4 Classes × 10 Actions × N Subactions × 120 Instances` (line ~56) |
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

## Tier 5 — Skill: `discovery-qualitative-analyst` (illustrative refs only)

| File | What's codebook-bound | Notes |
|---|---|---|
| `2_automatic-qualitative-analysis-tool/discovery-qualitative-analyst/scripts/spec-schema.md` | Hypothetical example uses `Retrieve knowledge from semantic memory` (legacy V1 leaf name) | Not codebook-loading — illustrative text in methodology discussion. Update if you want the example to track current names; otherwise low-priority |
| `2_automatic-qualitative-analysis-tool/discovery-qualitative-analyst/references/diagnostics.md` | Same — uses `Retrieve knowledge from semantic memory` as illustrative leaf in stretch-fit pattern docs | Low-priority; methodology point is clear regardless of which name appears |

---

## Tier 6 — Frozen historical records (DO NOT MODIFY)

| File | Why frozen |
|---|---|
| `1_data/1_corpus/behavioral_descriptions.csv` | Audit trail of original 565 behavior descriptions extracted during codebook construction. Each row's `original_action_label` (e.g., `Execution _ Retrieve Domain Context`) is a record of the V1-era taxonomy code that was annotated at the time. Re-coding to V4.2 names would erase the trail. If you need V4.2 mappings, add a new column; do not overwrite the legacy column. |

---

## Standard runbook — "I just changed the codebook"

1. **Edit Tier 1** — update `1_data/2_taxonomy/taxonomy_development/Action Space Codebook (v4.2).pdf` (re-export from Google Docs).
2. **Update Tier 2 structured files** — modify `act-onomy_codebook.csv` and `act-onomy_taxonomy.csv` (in lockstep). For structural changes, also update `codebook_v4.2.json` and bump its `version_note`; sync `summary` counts in both JSON files.
3. **Regenerate Tier 2 docs** — run `2_automatic-qualitative-analysis-tool/extension-tool/scripts/regenerate_docs.py` to refresh `1_data/2_taxonomy/taxonomy.md`. Copy updated CSVs/JSON to `hf_release/taxonomy/`.
4. **Update Tier 3** (skill) — patch `references/codebook.md` (subgroup list + count); patch `SKILL.md` / `README.md` if counts or sample names changed; migrate `example_pylint_5859.json` if any used subgroup was renamed; run `render_artifact.py` to verify 0 warnings.
5. **Update Tier 4** (READMEs) — bump `N Subactions` in 2 files (3 lines).
6. **Decide on Tier 5** — only update illustrative example names if you want them to track current naming.
7. **Skip Tier 6** — never modify frozen records.

**Final verification:**

```bash
# all subaction-count references should now equal the new total
cd ~/Documents/Github/Act-onomy && grep -rn "Subactions\|sub-actions" --include="*.md" --include="*.tex" | grep -E "[0-9]+ [Ss]ub"
# all should print the same number
```
