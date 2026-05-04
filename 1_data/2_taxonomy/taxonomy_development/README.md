# Taxonomy Development

The version-by-version development trail of the Action Space Taxonomy. Each version captures one milestone in the iterative codebook-construction process: from a hand-extracted bullet-list seed (V1) through validated Verb+Noun tables (V2, V3) to the multi-tier classification reorganized under Sense / Think / Act / Adapt mega-sections (V4.2).

The finalized human-verified V4.2 codebook lives in [`../corpus/act-onomy_codebook.csv`](../corpus/act-onomy_codebook.csv) (with reviewer attribution); the published taxonomy view derived from it lives in [`../corpus/act-onomy_taxonomy.csv`](../corpus/act-onomy_taxonomy.csv) and [`../corpus/act-onomy_taxonomy.json`](../corpus/act-onomy_taxonomy.json). This directory keeps the development history (PDFs + JSON-extracted equivalents).

## Files

| File | Description |
|---|---|
| `Action Space Codebook (v1).pdf` | V1 source PDF — bullet-list outline, manually extracted from the seed paper. |
| `Action Space Codebook (v2).pdf` | V2 source PDF — first Verb+Noun table form, validated. |
| `Action Space Codebook (v3).pdf` | V3 source PDF — adds quoted evidence; introduces Planning / Reflection / Tool Use / Synthesis / Evaluate / Boundary-Aware / Role Conditioning categories. |
| `Action Space Codebook (v4.1).pdf` | V4.1 source PDF — flattens super-categories into nested sub-categories with paper-anchored examples; introduces an `Unclassified` holding-pen for items pending categorization. |
| `Action Space Codebook (V4.2).pdf` | V4.2 source PDF — final reorganization under four mega-sections: `Sense`, `Think`, `Act`, `Adapt`. |
| `codebook_v1.json` | V1 extracted to JSON. |
| `codebook_v2.json` | V2 extracted to JSON. |
| `codebook_v3.json` | V3 extracted to JSON (strikethrough/deprecated entries excluded). |
| `codebook_v4.1.json` | V4.1 extracted to JSON. |
| `codebook_v4.2.json` | V4.2 extracted to JSON, regenerated from `../corpus/act-onomy_codebook.csv`. Includes the per-instance `reviewers` attribution. |

## Version progression

| Version | Super-categories | Sub-categories | Leaves | Key change |
|---|---:|---:|---:|---|
| V1 | 6 | 16 | 56 | Hand-extracted bullet outline; no Verb+Noun normalization, no quoted evidence. |
| V2 | 6 | 6 (flat) | 43 | Verb+Noun action labels with plain-English explanations; first validated form. |
| V3 | 13 | 13 (flat) | 135 | Adds quoted evidence column. Introduces 7 new super-categories: Planning, Reflection, Tool Use, Synthesis, Evaluate, Boundary-Aware, Role Conditioning. |
| V4.1 | 11 | 67 | 146 | Tree structure (super → sub → leaf) with paper-anchored examples. Cover declares "9 main actions, 54 sub-actions"; body adds `Memory Actions`, `Role Conditioning Actions`, and an `Unclassified` holding-pen. Supersedes the earlier V4 / v1.0 snapshot. |
| V4.2 | 10 | 42 | 120 | Final reorganization under four mega-sections (`Sense`, `Think`, `Act`, `Adapt`). `Unclassified` is dissolved; entries are absorbed into mainline categories. Hierarchy is `Class → Action → Subaction → Instance`. Each instance carries a human-reviewer attribution. |

V4.1 → V4.2 net leaf change: 146 → 120. Instance count drops because some redundant leaves were merged and the `Unclassified` holding-pen was resolved into mainline categories rather than carried forward.

V1 → V2 reduces leaf count because hand-listed examples were normalized to a single Verb+Noun action per row.

## JSON schema

V1 – V4.1 share the same `super_categories → sub_categories → leaves` shape. V4.2 adds a `mega_sections` wrapper above `super_categories` and a per-leaf `reviewers` field.

### V1 – V4.1

```json
{
  "source_pdf": "Action Space Codebook (vX).pdf",
  "version": "vX",
  "version_note": "...",
  "summary": {"n_super_categories": N, "n_sub_categories": M, "n_leaves": K},
  "super_categories": [
    {
      "name": "...",
      "flat": true,
      "sub_categories": [
        {
          "name": "...",
          "leaves": [
            {"action": "...", "examples_raw": "...", "papers_cited": ["P1", "P2"]}
          ]
        }
      ]
    }
  ]
}
```

### V4.2

```json
{
  "source_pdf": "Action Space Codebook (V4.2).pdf",
  "source_csv": "data/corpus/finalized_human_verified_codebook.csv",
  "version": "v4.2",
  "summary": {"n_mega_sections": 4, "n_super_categories": 10, "n_sub_categories": 42, "n_leaves": 120},
  "mega_sections": [
    {
      "name": "Sense",
      "super_categories": [
        {
          "name": "Retrieval",
          "sub_categories": [
            {
              "name": "Retrieve",
              "leaves": [
                {
                  "action": "...",
                  "examples_raw": "...",
                  "papers_cited": ["P1"],
                  "reviewers": ["main reviewer (human reviewer 2)"]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

| field | description |
|---|---|
| `source_pdf` | Relative path to the source PDF the JSON was extracted from. |
| `source_csv` | (V4.2 only) The canonical CSV the JSON was regenerated from. |
| `version` / `version_note` | Version label and a short note on what changed in this version. |
| `summary` | Counts at each tier of the hierarchy. |
| `mega_sections[].name` | (V4.2 only) Top-level grouping: `Sense`, `Think`, `Act`, or `Adapt`. |
| `super_categories[].name` | Top-level action class in V1 – V4.1; nested under `mega_sections` in V4.2. |
| `super_categories[].flat` | Optional. `true` when a super-category has no internal sub-categorization (V2 and V3 use this; one synthetic sub-category named after the super-category holds all leaves). |
| `super_categories[].sub_categories[].name` | Sub-category (e.g., `Decompose task`, `Generating`). In V4.2 CSV terms this is the `Subaction` column. |
| `leaves[].action` | Leaf-level action label. In V4.2 CSV terms this is the `Instance` column. |
| `leaves[].examples_raw` | Verbatim example sentences and quoted evidence supporting the leaf, with paper-ID anchors (e.g., `(P1)`, `(P28)`) inline. Empty for purely typological/theory-driven entries. |
| `leaves[].papers_cited` | Source paper IDs referenced by the leaf (subset of `P1` – `P34`). Empty for theory-driven entries. |
| `leaves[].reviewers` | (V4.2 only) Anonymized reviewer attribution: `main reviewer (human reviewer 2)`, `human reviewer 1`, `human reviewer 3` – `6`, or `theory-driven`. Derived from `../corpus/behavioral_descriptions.csv`; instances citing papers outside the Phase-1 corpus (`P5`, `P10`, `P12`, `P25`) are attributed to the main reviewer; instances with no paper citation are tagged `theory-driven`. |

## Notes

- Strikethrough/deprecated entries from review (visible in V3 / V4.1 PDFs) are **not** carried into the JSON — only the active entries from each version are extracted.
- Some V3 / V4.1 PDFs also contain a copy of the previous version below the validated section for reference; the JSON only captures the named-version content (`V3 (validated):`, etc.), not the trailing reference copy.
- Paper-ID conventions match `../corpus/behavioral_descriptions.csv`.
- The earlier V4 / v1.0 snapshot (against which `../corpus/behavioral_descriptions.csv` `in_v4` was computed) is no longer kept here, since V4.1 supersedes it. The `in_v4` flag values are already stored in the CSV — no recomputation against the V4 PDF is needed for normal use.
