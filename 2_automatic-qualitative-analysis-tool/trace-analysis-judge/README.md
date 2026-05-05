# Skill — `trace-analysis-judge`

A Claude Code Skill from Act-onomy that takes a raw agent trajectory, grounds each turn to the codebook with verbatim quote evidence, and renders an interactive HTML report.

## Layout

```
skill/
├── SKILL.md                          # The Skill prompt (Claude Code skill format)
├── assets/
│   ├── template.html                 # Interactive HTML report template
│   └── example_pylint_5859.json      # Worked example trajectory
├── references/
│   └── codebook.md                   # Codebook the Skill loads at runtime
└── scripts/
    ├── parse_trajectory.py           # Stage 1: raw trajectory → annotated skeleton
    └── render_artifact.py            # Stage 4: annotated JSON → HTML artifact
```

## How to invoke

This skill is registered with Claude Code. To use it:

1. Place a raw trajectory (`.traj` JSON file or pasted text) in your working directory.
2. Ask Claude: *"Analyze this trajectory with the trace-analysis-judge skill."*
3. The skill walks through four stages — parse, phase-label, annotate, render — emitting a self-contained HTML artifact.

The `(observation, thought, action)` triple schema accepts trajectories from heterogeneous frameworks via a thin adapter (see `scripts/parse_trajectory.py`).

## Reference codebook vs. canonical taxonomy

[`references/codebook.md`](references/codebook.md) is the version the Skill loads at runtime. It mirrors the canonical taxonomy at [`../../1_data/2_taxonomy/act-onomy_taxonomy.csv`](../../1_data/2_taxonomy/act-onomy_taxonomy.csv) (v4.2: 4 Classes × 10 Actions × 46 Subactions × 120 Instances — Sense / Think / Act / Adapt, with Actions: Retrieval, Memory, Planning, Reasoning, Evaluate, Deciding, Grounding, Executing, Learning, Reflection) and additionally carries:

- a **palette table** that maps each group to a hex color (consumed by the renderer and the HTML template);
- empirically-extra leaves accumulated during real annotation runs that the canonical taxonomy does not yet enumerate (e.g., `Pinpoint root cause mechanism` under Reasoning › Inferring).

The two files are kept in sync: any change to the canonical taxonomy should be reflected here, and any new leaf added during annotation should be promoted into the canonical taxonomy before the next versioned release.

## License

The Skill source (SKILL.md, scripts, template) is MIT-licensed; see [`../LICENSE`](../LICENSE). The reference codebook is CC BY 4.0; see [`../LICENSE-codebook`](../LICENSE-codebook).
