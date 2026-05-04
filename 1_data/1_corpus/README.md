# Corpus

The 927-sentence behavior-description corpus and its construction-phase audit trail. Each row records one behavior-description sentence extracted from the 30 corpus papers, together with the Discovery Judge's suggested code, the human reviewer's verdict, and whether the resulting code was retained in **Codebook V4** (= the v1.0 paper snapshot).

This is the dataset behind the Phase-1 outcome reported in the paper (§2): *"Of the 927 descriptions, 741 were confirmed under existing codes and 186 surfaced 157 candidate revisions, producing Codebook V3."*

## Files

| File | Description |
|---|---|
| `behavioral_descriptions.csv` | One row per (sentence, suggested code, human verdict). |
| `papers.csv` | Per-paper index: title, domain tags, behavior-analysis flags, and anonymized verifier. Joins to `behavioral_descriptions.csv` and `act-onomy_codebook.csv` on `paper_id`. |
| `act-onomy_codebook.csv` | The finalized human-verified codebook (V4.2): one row per leaf-level instance in the four-tier `Class → Action → Subaction → Instance` hierarchy. Each row carries the human reviewer(s) attributed to its evidence and a `taxonomy_code` joining to the published taxonomy under [`../taxonomy/`](../taxonomy/). |

## Schema — `behavioral_descriptions.csv`

| column | type | description |
|---|---|---|
| `sentence_id` | string | Unique ID for the sentence (e.g., `S0001`). |
| `paper_id` | string | Source paper ID, `P1`–`P30`. |
| `sentence_text` | string | Verbatim author-written behavior-description sentence. |
| `discovery_judge_suggested_code` | string | Code proposed by the Discovery Judge in Role ii: either an existing code from V2 / V3 or a candidate new code. |
| `judge_evidence_quote` | string | Verbatim span from `sentence_text` the judge used as evidence. |
| `paper-relevance` | enum | `include` if the source paper was incorporated into the shared codebook; `not include` otherwise. Mirrors the `Incorporated to shared codebook` column of the master paper-tracker. |
| `in_v2` | flag | `yes` if `sentence_text` matches a verbatim evidence quote in Codebook V2 (bidirectional substring); empty otherwise. |
| `in_v3` | flag | `yes` if `sentence_text` matches a verbatim evidence quote in Codebook V3; empty otherwise. |
| `in_v4` | flag | `yes` if `sentence_text` matches a verbatim evidence quote in Codebook V4 / v1.0; empty otherwise. |
| `in_final` | flag | `yes` if `sentence_text` matches a verbatim evidence quote in the finalized V4.2 codebook (`act-onomy_codebook.csv`); empty otherwise. |
| `reviewer_id` | string | Anonymized verifier label (`human reviewer 1` … `human reviewer 6`); `human reviewer 2 (main reviewer)` is the corpus lead. |

## Schema — `papers.csv`

Per-paper index covering `P1`–`P35`. Merges the paper-tracker (process state) with paper-domains (subject tags) and anonymizes verifiers.

| column | type | description |
|---|---|---|
| `paper_id` | string | Paper ID, `P1`–`P35`. |
| `title_full` | string | Full official paper title. |
| `primary_domain` | string | Primary research area / subject framing (e.g., `LLM Agents (Benchmark)`, `Reinforcement Learning Theory`, `Software Engineering`, `Position Paper`, `Embodied Agents`). |
| `secondary_domain` | string | Specific topic / application within the primary area (e.g., `Single-Cell Biology Analysis`, `Long-Context Pokemon Battles`, `MDP Exploration / Abstraction`). |
| `incorporated` | enum | `Yes` / `No` / empty — whether codes derived from the paper were incorporated into the shared codebook. |
| `validation` | enum | `Yes` if the paper is held out as a validation case (not part of the codebook-construction corpus); empty otherwise. Validation papers do not have an assigned `verifier`. |
| `verifier` | string | Anonymized reviewer label (`human reviewer 1` … `human reviewer 6`, with `human reviewer 2 (main reviewer)` as the corpus lead). Empty for validation papers. |

## Schema — `act-onomy_codebook.csv`

The finalized codebook (V4.2) flattened to one row per instance. **120 instances** organized as **4 Classes → 10 Actions → 42 Subactions → 120 Instances**.

Per-Class counts (Actions / Subactions / Instances):

| Class | Actions | Subactions | Instances |
|---|---:|---:|---:|
| Sense | 2 (Retrieval, Memory) | 6 | 18 |
| Think | 4 (Planning, Reasoning, Evaluate, Deciding) | 20 | 53 |
| Act | 2 (Grounding, Executing) | 8 | 28 |
| Adapt | 2 (Learning, Reflection) | 8 | 21 |
| **Total** | **10** | **42** | **120** |

| column | type | description |
|---|---|---|
| `taxonomy_code` | string | Stable identifier joining to `../taxonomy/act-onomy_taxonomy.csv` — format `T<class>.<action>.<subaction>.<instance>` (e.g., `T1.1.1.1`). |
| `Class` | enum | Top-level grouping: `Sense`, `Think`, `Act`, or `Adapt`. |
| `Action` | string | Super-category within the class (e.g., `Retrieval`, `Memory`, `Planning`, `Reasoning`, `Evaluate`, `Deciding`, `Grounding`, `Executing`, `Learning`, `Reflection`). |
| `Subaction` | string | Sub-category within an action (e.g., `Decompose task`, `Generating`, `Interact with users`). `Retrieval` is flat — its single subaction label is `Retrieve`. |
| `Instance` | string | Leaf-level behavior label. |
| `examples_raw` | string | Verbatim example sentences and quoted evidence supporting the instance, with paper-ID anchors (e.g., `(P1)`, `(P28)`) inline. |
| `papers_cited` | string | Semicolon-separated list of source paper IDs referenced by this instance. Empty for theory-driven entries with no paper anchor. |
| `human reviewers` | string | Semicolon-separated list of reviewers attributed to the entry. Values: `main reviewer (human reviewer 2)`, `human reviewer 1`, `human reviewer 3`–`6`, or `theory-driven`. Reviewer attribution is derived by mapping each cited paper to the `reviewer_id` it received in `behavioral_descriptions.csv`; instances citing papers outside the Phase-1 corpus (`P5`, `P10`, `P12`, `P25`) are attributed to the main reviewer who introduced them in V4.2; instances with no paper citation (purely typological/theoretical entries) are tagged `theory-driven`. |

The distribution-ready taxonomy view (without evidence / quotes / reviewers) lives separately at [`../taxonomy/`](../taxonomy/) — `act-onomy_taxonomy.csv` (flat with stable codes) and `act-onomy_taxonomy.json` (nested tree). Join to this codebook on `taxonomy_code`.

## Notes

- The Abstract reports 947 descriptions; §2 and Appendix C report 927. The 927 figure is the verified Phase-1 count and is used here.
- The Discovery Judge prompts that produced `discovery_judge_suggested_code` are released under [`../../skill/discovery-judge/`](../../skill/discovery-judge/).
- `in_v2` / `in_v3` / `in_v4` / `in_final` are computed at the **evidence-quote** level: each codebook leaf's `examples_raw` / `evidence_raw` is scanned for verbatim quoted strings (text inside `"…"` of length ≥ 15 chars), and a row is flagged `yes` iff its `sentence_text` is contained in (or contains) any such quote after lowercasing and punctuation-stripping. This captures the F1 sentences that survived into the codebook as cited evidence, but conservatively skips paraphrased coverage. `in_final` corresponds to the V4.2 snapshot in `act-onomy_codebook.csv`; 103 of 664 sentences are flagged (41 newly cited only in V4.2, 46 carried through V3→V4→V4.2, 16 other trajectories).
- `act-onomy_codebook.csv` is the V4.2 snapshot superseding the V4 / v1.0 codebook used for the `in_v4` flag. Reviewer-tag distribution across the 120 instances (a single instance can carry multiple tags when it cites papers from different reviewers; tag-occurrence total 141 > 120):

  | Tag | Instances |
  |---|---:|
  | `main reviewer (human reviewer 2)` | 73 |
  | `human reviewer 1` | 19 |
  | `theory-driven` | 19 |
  | `human reviewer 5` | 14 |
  | `human reviewer 4` | 7 |
  | `human reviewer 6` | 7 |
  | `human reviewer 3` | 2 |
