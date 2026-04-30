# Data

Labeled datasets used to compute the reliability statistics reported in the paper.

| File | Description | Used for |
|---|---|---|
| `kappa_human_human.csv` | Author-written behavior sentences from 5 corpus papers, independently labeled by the first two authors with action and sub-action codes (multi-label allowed). | Human–human Cohen's κ at the vocabulary layer (Section 2, Phase 2). |
| `kappa_human_judge.csv` | Held-out trajectory turns labeled independently by the first author and the AgentAction Skill. | Human–LLM-judge Cohen's κ at the operational layer (Section 3.2). |

## Schema

Both CSVs share the columns:

| column | type | description |
|---|---|---|
| `id` | string | unique identifier for the labeled item (sentence or trajectory turn) |
| `source` | string | paper ID for sentences (e.g., `P1`), or `<paper>:<trajectory>:<turn>` for trajectory turns |
| `text` | string | the sentence or turn text being labeled |
| `coder` | string | one of `human-A`, `human-B`, `skill` |
| `category` | string | one of the 11 top-level categories |
| `sub_actions` | string | semicolon-separated list of sub-action codes |
| `specializations` | string | semicolon-separated list of specialization codes |

## License

CC BY 4.0 — see [`../LICENSE-codebook`](../LICENSE-codebook).
