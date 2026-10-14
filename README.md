<p align="center">
  <img src="assets/actonomy_logo.png" alt="Actonomy logo, styled as ACT*ONOMY" width="440">
</p>

<h1 align="center">Actonomy: A Taxonomy for Describing and Analyzing Agent Behavior</h1>

<p align="center">
  A taxonomy, codebook, and tools for understanding what AI agents do.
</p>

<p align="center">
  <strong>How to Interpret Agent Behavior</strong><br>
  <a href="https://gaojie058.github.io/">Jie Gao</a> et al.<br>
  Accepted at <strong>NeurIPS 2026</strong><br>
  <a href="https://arxiv.org/abs/2605.13625">Paper (arXiv:2605.13625)</a> ·
  <a href="https://gaojie058.github.io/Act-onomy/">Project website</a>
</p>

**Actonomy** is an extensible taxonomy for **describing and analyzing agent behavior** at runtime. This official repository for [*How to Interpret Agent Behavior*](https://arxiv.org/abs/2605.13625) provides the codebook, datasets of behavior descriptions, and tools for automated agent trajectory analysis.

The name combines **action** and **taxonomy**. **Actonomy** is styled **ACT\*ONOMY** in the paper and logo, and also appears as **Act-onomy** (the GitHub repository name) and **Act·onomy**. These names refer to the same research project.

Developed through Grounded Theory, the taxonomy comprises **10 actions, 46 subactions, and 120 leaf categories**. Use it to annotate agent traces, compare behavioral profiles across agents, and examine patterns associated with successes and failures.

**Explore:** [Interactive website](https://gaojie058.github.io/Act-onomy/) · [Taxonomy and codebook](1_data/2_taxonomy/taxonomy.md) · [Automated trace analysis](2_tools/trace-qualitative-analyst/) · [Case studies](3_case_studies/) · [Contributing](CONTRIBUTING.md)

---

## Website

The [project website](https://gaojie058.github.io/Act-onomy/) includes the taxonomy explorer, two SWE-agent case studies, and a SWE-chat example with human feedback. GitHub Pages serves the static files in [`docs/`](docs/) from `main`; see [website maintenance notes](docs/README.md).

---

## Data

The datasets behind the empirical results in the paper.

| Subdirectory                                                           | Contents                                                                                                                                                         |
|------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `1_data/1_corpus_grounded_theory/` | The 35-paper grounded-theory corpus and the 780 behavior-description sentences extracted from it.<br><br>**Construction set** — 28 papers / 664 sentences: 20 papers (565 sentences) incorporated into V4.2, with 120 sentences quoted as evidence in the released codebook; the remaining 8 papers (99 sentences) were reviewed but judged off-topic for an agent-behavior taxonomy.<br>**Held-out set** — 7 papers / 116 sentences reserved for the Phase-2 reliability check; 50 sentences sampled for the human–human and human–LLM κ tests.<br><br>• `papers (35 items).csv` — per-paper index (title, domain tags, incorporation flag, anonymized reviewer, reliability-check flag); joins to the sentence CSVs on `paper_id`.<br>• `(construction set)behavioral_descriptions.csv` — 664 rows, one per (sentence, suggested code, human verdict).<br>• `(validation set) behavioral_descriptions_validation.csv` — 116 held-out sentences from the 7 validation papers. |
| `1_data/2_taxonomy/`               | The Actonomy codebook itself: the canonical CSV/JSON taxonomy, the human-readable `taxonomy.md`, the dependency map, and the taxonomy-development trace.        |
| `1_data/5_large_corpus/`           | A larger follow-up corpus: 210 agent papers and 3,455 behavior-description sentences extracted from them, used to stress-test Actonomy beyond the 35-paper set. |

---

## Tools

The three tools shipped with Actonomy, each implemented as a Claude Code skill under `2_tools/`.

| Tool                                                                          | What it does                                                                                  |
|-------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------|
| `Automated-Trace-Analysis-Tool`<br>`2_tools/trace-qualitative-analyst/`       | Takes a raw agent trajectory, tags each turn with the codebook, and renders an HTML report.   |
| `LLM-powered-Discovery-Qualitative-Analyst`<br>`2_tools/discovery-qualitative-analyst/` | Reads a new agent paper, compares its behaviors against the codebook, and proposes revisions. |
| `Automated-Codebook-Extension-Tool`<br>`2_tools/extension-tool/`              | Keeps the codebook and all files that depend on it in sync after edits.                       |

---

## Case studies

Files for reproducing the case studies in the paper.

| Folder                                                                                     | Question                                                                                                                             | Scope                                                                                                                                                                                       |
|--------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `3_case_studies/case1_three_agents/`         | Does Actonomy surface distinct behavioral profiles across agents that vary in architecture and task?                                | 300 trajectories across three agent collections (AG2/AutoGen, HyperAgent, SWE-Agent). Ships the aggregated `analysis_report.md` and `run_summaries.md` only; raw trajectories not included. |
| `3_case_studies/case2_swe_agent_two_traces/` | Within a single agent, does the behavior profile change with the task (e.g., the same SWE-agent on two different SWE-bench tickets)? | Two `swe_agent` trajectories on SWE-bench (`psf/requests-2317`, `django/django-14411`), each with raw JSON, annotated JSON, and a rendered HTML report.                                     |

---

## Citation

If you use the Actonomy taxonomy, datasets, or analysis tools, please cite the accompanying paper:

```bibtex
@article{gao2026interpret,
  title   = {How to Interpret Agent Behavior},
  author  = {Gao, Jie and Sun, Kaiser and Huang, Jen-tse and Van Koevering, Katherine and Ji, Sijie and Huang, Heyuan and Shi, Weiyan and Lu, Zhuoran and Xiao, Ziang and Khashabi, Daniel and Dredze, Mark},
  journal = {arXiv preprint arXiv:2605.13625},
  year    = {2026},
  doi     = {10.48550/arXiv.2605.13625},
  url     = {https://arxiv.org/abs/2605.13625}
}
```

Machine-readable citation metadata is available in [CITATION.cff](CITATION.cff).

---

## License

- **Source code** (under `2_tools/` and helper scripts): MIT, see `LICENSE`.
- **Codebook content** (`1_data/2_taxonomy/`) and **labeled datasets** (under `1_data/`): CC BY 4.0, see `LICENSE-codebook`.
- Third-party assets used in the case studies (`swe_agent`, AutoGen / AG2, CodeAct, HyperAgent trajectories; MAST failure taxonomy) are credited under their original licenses in the paper's appendix.
