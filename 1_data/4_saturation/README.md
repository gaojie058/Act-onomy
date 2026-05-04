# Saturation

Theoretical-saturation evidence for Codebook V4 (= v1.0): how the cumulative count of unique top-level categories and sub-actions grows as new papers are processed in order, and what the Discovery Judge proposes when it sees out-of-corpus papers (Appendix E, Role iv).

## Files

| File | Description | Used for |
|---|---|---|
| `cumulative_counts.csv` | Per-paper cumulative count of unique top-level categories and sub-actions encountered so far. | Plots Figure 3 (saturation curve). |
| `holdout_proposals.csv` | Discovery-Judge proposals on the held-out paper set: every behavior sentence the judge extracted, every code it suggested, and the post-review disposition. | Substantiates the §2 saturation claim that no new top-level categories and only [N] sub-action candidates emerge from held-out papers, all absorbed under existing codes. |

## Schema — `cumulative_counts.csv`

| column | type | description |
|---|---|---|
| `paper_index` | int | 1-based processing order across both sets. |
| `paper_id` | string | `P1`–`P35` for the construction corpus; `H1`+ for held-out. |
| `set` | enum | `construction` or `holdout`. |
| `n_top_level_cumulative` | int | Unique top-level categories observed up to and including this paper. |
| `n_sub_actions_cumulative` | int | Unique sub-actions observed up to and including this paper. |

## Schema — `holdout_proposals.csv`

| column | type | description |
|---|---|---|
| `paper_id` | string | Held-out paper ID, `H1`+. |
| `sentence_id` | string | Unique sentence identifier within the held-out set. |
| `sentence_text` | string | Behavior-description sentence the judge extracted. |
| `judge_proposal_top_level` | string | Top-level category the judge proposed (existing or new). |
| `judge_proposal_sub_action` | string | Sub-action the judge proposed (existing or new). |
| `disposition` | enum | `absorbed` (mapped to existing code), `new_sub_action` (genuine sub-action addition), `new_top_level` (would have required a new top-level category). |
| `absorbed_into_code` | string | If `disposition = absorbed`, the existing V4 code it was absorbed into. Empty otherwise. |
| `note` | string | Free-text reviewer note (e.g., why a new sub-action was rejected). |

## License

CC BY 4.0 — see [`../../LICENSE-codebook`](../../LICENSE-codebook).
