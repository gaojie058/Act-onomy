# Reliability

Labeled datasets used to compute the Cohen's κ statistics reported in the paper. Two judges, each operating at a distinct level, with both human–human and human–judge comparisons for each.

## Two judges, two levels

| Judge | Level | Item being labeled |
|---|---|---|
| **discovery-judge** | Paper | Sentences from agent papers, labeled with codebook tags. |
| **qualitative-analysis-judge** | Trace | Behavior sentences already extracted from agent trajectories, labeled with codebook tags. |

For each judge, two κ comparisons are reported:

- **Human–human** — definitional clarity baseline. Do two independent human coders assign the same codes?
- **Human–judge** — judge reliability. Does the LLM judge reproduce the human's coding decisions on the same items?

## Files

| File | Judge | Comparison | Paper section |
|---|---|---|---|
| `kappa_discovery_human_human.csv` | discovery-judge | Human ↔ Human (paper sentences) | §2, Phase 2 |
| `kappa_discovery_human_judge.csv` | discovery-judge | Human ↔ LLM judge (paper sentences) | §2, Phase 2 |
| `kappa_qualitative_human_human.csv` | qualitative-analysis-judge | Human ↔ Human (trace behavior sentences) | §3.2 / Appendix F |
| `kappa_qualitative_human_judge.csv` | qualitative-analysis-judge | Human ↔ LLM judge (trace behavior sentences) | §3.2 / Appendix F |

Within each judge, the two files share `id` so the same items can be cross-joined for human–human vs. human–LLM analysis.

## Schema (all four files share these columns)

| column | type | description |
|---|---|---|
| `id` | string | Unique identifier for the labeled item. Paper sentences use `S<n>`; trace behavior sentences use `<paper>:<trajectory>:T<turn>`. |
| `source` | string | Paper ID (e.g., `P1`) for discovery-judge files; `<framework>:<trajectory>` for qualitative-analysis-judge files. |
| `text` | string | The sentence being labeled. |
| `coder` | string | One of `human-A`, `human-B`, `llm-judge`. Each file uses the subset relevant to that comparison. |
| `category` | string | One of the 11 top-level categories from Codebook V4 / v1.0. |
| `sub_actions` | string | Semicolon-separated list of sub-action codes. |
| `specializations` | string | Semicolon-separated list of leaf specialization codes. |

## Reported κ

### discovery-judge (paper level)

- Human–human: `κ = 0.53` (top level), `κ = 0.48` (sub-action).
- Human–LLM-judge: `[TODO]` at the top level, `[TODO]` at the sub-action level (paper still has placeholders).

### qualitative-analysis-judge (trace level)

- Human–human: `[TODO]` (to be added).
- Human–LLM-judge: `κ = 0.48` (paper marks this as "to be updated").

## License

CC BY 4.0 — see [`../../LICENSE-codebook`](../../LICENSE-codebook).
