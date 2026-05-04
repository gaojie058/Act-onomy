# Act-onomy

A community-extensible framework for describing and analyzing agent behavior at runtime.

> **Status.** Pre-release.

Act-onomy ships three things:

- A **codebook** of 10 top-level action categories (organised under 4 classes: Sense / Think / Act / Adapt) instantiated by 42 sub-actions and 120 leaf-level instances, grounded in CoALA and built via deductive coding on a 35-paper corpus (20 incorporated into the shared codebook; NeurIPS / ICML / ICLR / ACL Anthology, 2024–2026). See [`1_data/2_taxonomy/`](1_data/2_taxonomy/).
- Two **Claude Skills** that apply the codebook to agent papers and trajectories: [`trace-analysis-judge/`](skill/trace-analysis-judge/) (LLM-judge that emits an HTML report from a raw trajectory) and [`discovery-judge/`](skill/discovery-judge/) (codebook-iteration pipeline used during taxonomy construction).
- A **contribution protocol** that lets the codebook grow as new agent designs appear, versioned as `vX.Y`. See [`CONTRIBUTING.md`](CONTRIBUTING.md) and [`CHANGELOG.md`](CHANGELOG.md).

## Repository layout

```
Act-onomy/
├── codebook.md                  Canonical codebook (latest)
├── codebook.v1.0.md             Frozen snapshot cited in the paper
├── CHANGELOG.md                 Codebook version history
├── CONTRIBUTING.md              How to propose extensions (governance)
├── skill/
│   ├── trace-analysis-judge/   Trajectory → HTML report
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
│   ├── reliability/             Cohen's κ datasets (paper-level + trace-level judges)
│   └── saturation/              Theoretical-saturation curve and held-out proposals
└── case_studies/
    ├── case1_three_agents/      Profiling across agents (Section 4.1)
    ├── case2_swe_agent_two_traces/  Within-agent task signatures (Section 4.2)
    └── case3_mast_astropy/      Failure-mode surfacing with MAST (Section 4.3)
```

## Quick start

The Skill is registered with [Claude Code](https://claude.com/claude-code) under the name `trace-analysis-judge`. To use it:

1. Drop a raw trajectory (`.traj` JSON file or pasted log) into your working directory.
2. Ask Claude: *"Analyze this trajectory with the trace-analysis-judge skill."*
3. The Skill walks four stages — parse, phase-label, annotate, render — and emits a self-contained interactive HTML report (pie chart of action types, per-turn timeline, quote-grounded evidence panel).

A worked example trajectory is included at [`skill/trace-analysis-judge/assets/example_pylint_5859.json`](skill/trace-analysis-judge/assets/example_pylint_5859.json). See [`skill/trace-analysis-judge/SKILL.md`](skill/trace-analysis-judge/SKILL.md) for the full Skill prompt and [`skill/trace-analysis-judge/README.md`](skill/trace-analysis-judge/README.md) for the layout.

> **Codebook versions.** The canonical taxonomy at [`1_data/2_taxonomy/`](1_data/2_taxonomy/) is the **v4.2 snapshot** (4 Classes × 10 Actions × 42 Subactions × 120 Instances). The Skill loads its operational mirror at [`2_automatic-qualitative-analysis-tool/trace-analysis-judge/references/codebook.md`](2_automatic-qualitative-analysis-tool/trace-analysis-judge/references/codebook.md), which adds a palette table and a small set of empirically-extra leaves accumulated during real annotation runs; the two are kept in sync.


## License

- **Source code** (under `skill/` and helper scripts): MIT, see [`LICENSE`](LICENSE).
- **Codebook content** (`codebook.md`, `codebook.v*.md`) and **labeled datasets** (under `data/`): CC BY 4.0, see [`LICENSE-codebook`](LICENSE-codebook).

## Acknowledgement

Act-onomy's codebook is grounded in the CoALA framework (Sumers et al., 2024) and informed by 35 peer-reviewed agent papers from NeurIPS / ICML / ICLR / ACL (2024–2026), of which 20 were incorporated into the shared codebook. Failure-mode pairing in Case Study 3 uses MAST (Cemri et al., 2025). Trajectories analyzed in the case studies come from the public releases of `swe_agent`, AutoGen / AG2, and HyperAgent. See the paper's appendix for the full asset-license table.
