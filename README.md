# Act-onomy

A community-extensible framework for describing and analyzing agent behavior at runtime.

> **Status.** Pre-release. This repository accompanies the NeurIPS 2026 submission *"How Do Researchers Interpret Agent Behavior?"* and is currently under double-blind review.

Act-onomy has three components:

1. **Vocabulary layer** — a codebook of 11 top-level action categories instantiated by ~50 fine-grained sub-actions, grounded in CoALA and built via deductive coding on a 30-paper corpus (NeurIPS / ICML / ICLR / ACL Anthology, 2024–2026). See [`codebook.md`](codebook.md).
2. **Operational layer** — Claude Skills that operationalize the codebook on agent papers and trajectories. See [`skill/`](skill/), which contains [`qualitative-analysis-judge/`](skill/qualitative-analysis-judge/) (the LLM-judge that emits an HTML report from a raw trajectory) and [`discovery-judge/`](skill/discovery-judge/) (the codebook-iteration pipeline used during taxonomy construction).
3. **Governance layer** — a contribution protocol that lets the codebook grow as new agent designs appear, versioned as `vX.Y`. See [`CONTRIBUTING.md`](CONTRIBUTING.md) and [`CHANGELOG.md`](CHANGELOG.md).

## Repository layout

```
Act-onomy/
├── codebook.md                  Canonical codebook (latest)
├── codebook.v1.0.md             Frozen snapshot cited in the paper
├── CHANGELOG.md                 Codebook version history
├── CONTRIBUTING.md              How to propose extensions (governance)
├── skill/
│   ├── qualitative-analysis-judge/   Operational layer: trajectory → HTML report
│   │   ├── SKILL.md             Skill prompt (Claude Code skill format)
│   │   ├── assets/
│   │   │   ├── template.html    Interactive HTML report template
│   │   │   └── example_pylint_5859.json  Worked example trajectory
│   │   ├── references/
│   │   │   └── codebook.md      Codebook the Skill loads at runtime
│   │   └── scripts/
│   │       ├── parse_trajectory.py  Stage 1: raw trajectory → annotated skeleton
│   │       └── render_artifact.py   Stage 4: annotated JSON → HTML artifact
│   └── discovery-judge/         Codebook-iteration pipeline (paper → revised codebook)
│       ├── SKILL.md             Three-stage extraction / refinement / new-version skill
│       ├── references/          Diagnostic and revision-pattern reference docs
│       └── scripts/             docx builders for F1/F2/F3 deliverables
├── data/
│   ├── corpus/                  927-sentence behavior corpus + coding audit trail
│   ├── reliability/             Cohen's κ datasets (vocabulary + operational layers)
│   └── saturation/              Theoretical-saturation curve and held-out proposals
└── case_studies/
    ├── case1_three_agents/      Profiling across agents (Section 4.1)
    ├── case2_swe_agent_two_traces/  Within-agent task signatures (Section 4.2)
    └── case3_mast_astropy/      Failure-mode surfacing with MAST (Section 4.3)
```

## Quick start

The Skill is registered with [Claude Code](https://claude.com/claude-code) under the name `qualitative-analysis-judge`. To use it:

1. Drop a raw trajectory (`.traj` JSON file or pasted log) into your working directory.
2. Ask Claude: *"Analyze this trajectory with the qualitative-analysis-judge skill."*
3. The Skill walks four stages — parse, phase-label, annotate, render — and emits a self-contained interactive HTML report (pie chart of action types, per-turn timeline, quote-grounded evidence panel).

A worked example trajectory is included at [`skill/qualitative-analysis-judge/assets/example_pylint_5859.json`](skill/qualitative-analysis-judge/assets/example_pylint_5859.json). See [`skill/qualitative-analysis-judge/SKILL.md`](skill/qualitative-analysis-judge/SKILL.md) for the full Skill prompt and [`skill/qualitative-analysis-judge/README.md`](skill/qualitative-analysis-judge/README.md) for the layout.

> **Codebook versions.** The canonical [`codebook.md`](codebook.md) is the **v1.0 paper snapshot** (11 top-level categories). The Skill loads its operational mirror at [`skill/qualitative-analysis-judge/references/codebook.md`](skill/qualitative-analysis-judge/references/codebook.md), which adds a palette table and a small set of empirically-extra leaves accumulated during real annotation runs; the two files are kept in sync.

## Citation

If you use Act-onomy in your work, please cite:

```bibtex
@inproceedings{actonomy2026,
  title  = {How Do Researchers Interpret Agent Behavior?},
  author = {Anonymous},
  booktitle = {Neural Information Processing Systems},
  year   = {2026},
  note   = {Under review}
}
```

## License

- **Source code** (under `skill/` and helper scripts): MIT, see [`LICENSE`](LICENSE).
- **Codebook content** (`codebook.md`, `codebook.v*.md`) and **labeled datasets** (under `data/`): CC BY 4.0, see [`LICENSE-codebook`](LICENSE-codebook).

## Acknowledgement

Act-onomy's vocabulary layer is grounded in the CoALA framework (Sumers et al., 2024) and informed by 30 peer-reviewed agent papers from NeurIPS / ICML / ICLR / ACL (2024–2026). Failure-mode pairing in Case Study 3 uses MAST (Cemri et al., 2025). Trajectories analyzed in the case studies come from the public releases of `swe_agent`, AutoGen / AG2, and HyperAgent. See the paper's appendix for the full asset-license table.
