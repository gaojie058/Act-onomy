# AgentAction

A community-extensible framework for describing and analyzing agent behavior at runtime.

> **Status.** Pre-release. This repository accompanies the NeurIPS 2026 submission *"How Do Researchers Interpret Agent Behavior?"* and is currently under double-blind review.

AgentAction has three components:

1. **Vocabulary layer** — a codebook of 11 top-level action categories instantiated by ~50 fine-grained sub-actions, grounded in CoALA and built via deductive coding on a 30-paper corpus (NeurIPS / ICML / ICLR / ACL Anthology, 2024–2026). See [`codebook.md`](codebook.md).
2. **Operational layer** — a Claude Skill that consumes the codebook plus a raw agent trajectory and emits an HTML report with quote-grounded category and sub-action labels. See [`skill/`](skill/).
3. **Governance layer** — a contribution protocol that lets the codebook grow as new agent designs appear, versioned as `vX.Y`. See [`CONTRIBUTING.md`](CONTRIBUTING.md) and [`CHANGELOG.md`](CHANGELOG.md).

## Repository layout

```
agent-action/
├── codebook.md                  Canonical codebook (latest)
├── codebook.v1.0.md             Frozen snapshot cited in the paper
├── CHANGELOG.md                 Codebook version history
├── CONTRIBUTING.md              How to propose extensions (governance)
├── skill/
│   ├── SKILL.md                 Skill prompt (Claude Code skill format)
│   ├── assets/
│   │   ├── template.html        Interactive HTML report template
│   │   └── example_pylint_5859.json  Worked example trajectory
│   ├── references/
│   │   └── codebook.md          Codebook the Skill loads at runtime
│   └── scripts/
│       ├── parse_trajectory.py  Stage 1: raw trajectory → annotated skeleton
│       └── render_artifact.py   Stage 4: annotated JSON → HTML artifact
├── data/
│   ├── kappa_human_human.csv    Phase 2 human–human reliability data
│   └── kappa_human_judge.csv    Operational-layer human–LLM reliability data
└── case_studies/
    ├── case1_three_agents/      Profiling across agents (Section 4.1)
    ├── case2_swe_agent_two_traces/  Within-agent task signatures (Section 4.2)
    └── case3_mast_astropy/      Failure-mode surfacing with MAST (Section 4.3)
```

## Quick start

The Skill is registered with [Claude Code](https://claude.com/claude-code) under the name `swe-agent-trajectory-analyzer`. To use it:

1. Drop a raw trajectory (`.traj` JSON file or pasted log) into your working directory.
2. Ask Claude: *"Analyze this trajectory with the swe-agent-trajectory-analyzer skill."*
3. The Skill walks four stages — parse, phase-label, annotate, render — and emits a self-contained interactive HTML report (pie chart of action types, per-turn timeline, quote-grounded evidence panel).

A worked example trajectory is included at [`skill/assets/example_pylint_5859.json`](skill/assets/example_pylint_5859.json). See [`skill/SKILL.md`](skill/SKILL.md) for the full Skill prompt and [`skill/README.md`](skill/README.md) for the layout.

> **Codebook versions.** The canonical [`codebook.md`](codebook.md) is the **v1.0 paper snapshot** (11 top-level categories). The Skill loads its operational mirror at [`skill/references/codebook.md`](skill/references/codebook.md), which adds a palette table and a small set of empirically-extra leaves accumulated during real annotation runs; the two files are kept in sync.

## Citation

If you use AgentAction in your work, please cite:

```bibtex
@inproceedings{agentaction2026,
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

AgentAction's vocabulary layer is grounded in the CoALA framework (Sumers et al., 2024) and informed by 30 peer-reviewed agent papers from NeurIPS / ICML / ICLR / ACL (2024–2026). Failure-mode pairing in Case Study 3 uses MAST (Cemri et al., 2025). Trajectories analyzed in the case studies come from the public releases of `swe_agent`, AutoGen / AG2, and HyperAgent. See the paper's appendix for the full asset-license table.
