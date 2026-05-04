# Data

Released datasets supporting the empirical claims in the paper. Three subdirectories, each documented in its own `README.md`:

| Subdirectory | Contents | Paper section |
|---|---|---|
| [`corpus/`](corpus/) | The 927-sentence behavior-description corpus and its construction-phase audit trail (suggested code, human verdict, final code, V4 inclusion). | §2 Phase 1, Appendix C. |
| [`reliability/`](reliability/) | Four κ datasets — for each of the two judges (discovery-judge at paper level, qualitative-analysis-judge at trace level), one human–human baseline and one human–LLM-judge comparison. | §2 Phase 2, §3.2 / Appendix F. |
| [`saturation/`](saturation/) | Cumulative top-level / sub-action counts per paper (Figure 3), plus held-out paper proposals from the Discovery Judge. | §2 Theoretical Saturation, Appendix E Role iv. |

## Status

The CSV files currently ship with **header rows only** as a schema skeleton; the actual labeled data will be populated in a forthcoming release.

## License

CC BY 4.0 — see [`../LICENSE-codebook`](../LICENSE-codebook).
