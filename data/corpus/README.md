# Corpus

The 927-sentence behavior-description corpus and its construction-phase audit trail. Each row records one behavior-description sentence extracted from the 30 corpus papers, together with the Discovery Judge's suggested code, the human reviewer's verdict, and whether the resulting code was retained in **Codebook V4** (= the v1.0 paper snapshot).

This is the dataset behind the Phase-1 outcome reported in the paper (§2): *"Of the 927 descriptions, 741 were confirmed under existing codes and 186 surfaced 157 candidate revisions, producing Codebook V3."*

## Files

| File | Description |
|---|---|
| `coded_sentences.csv` | One row per (sentence, suggested code, human verdict). |

## Schema — `coded_sentences.csv`

| column | type | description |
|---|---|---|
| `sentence_id` | string | Unique ID for the sentence (e.g., `S0001`). |
| `paper_id` | string | Source paper ID, `P1`–`P30`. |
| `sentence_text` | string | Verbatim author-written behavior-description sentence. |
| `discovery_judge_suggested_code` | string | Code proposed by the Discovery Judge in Role ii: either an existing code from V2 / V3 or a candidate new code. |
| `judge_evidence_quote` | string | Verbatim span from `sentence_text` the judge used as evidence. |
| `human_verdict` | enum | One of `accept` (suggestion adopted), `propose` (reviewer wrote a different new code), `rename` (kept the suggestion's intent but renamed for clarity), `discard` (rejected). |
| `final_code` | string | The code the sentence ultimately maps to in Codebook V4. Empty if `human_verdict = discard`. |
| `in_v4` | bool | `true` if `final_code` appears in the released V4 / v1.0 codebook; `false` otherwise. |
| `batch` | int | 1–5: which co-author review batch this sentence was assigned to. |
| `reviewer_id` | string | Anonymized reviewer ID, `R1`–`R5`. |

## Notes

- The Abstract reports 947 descriptions; §2 and Appendix C report 927. The 927 figure is the verified Phase-1 count and is used here.
- Sentences with `human_verdict = discard` are retained in the CSV (rather than deleted) so reviewers can audit *why* a candidate code was rejected.
- The Discovery Judge prompts that produced `discovery_judge_suggested_code` are released under [`../../skill/discovery-judge/`](../../skill/discovery-judge/).
