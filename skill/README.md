# Skill — `swe-agent-trajectory-analyzer`

This is the operational layer of AgentAction: a Claude Code Skill that takes a raw agent trajectory, grounds each turn to the codebook with verbatim quote evidence, and renders an interactive HTML report.

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
2. Ask Claude: *"Analyze this trajectory with the swe-agent-trajectory-analyzer skill."*
3. The skill walks through four stages — parse, phase-label, annotate, render — emitting a self-contained HTML artifact.

The `(observation, thought, action)` triple schema accepts trajectories from heterogeneous frameworks via a thin adapter (see `scripts/parse_trajectory.py`).

## Reference codebook vs. canonical codebook

> **Heads-up.** [`references/codebook.md`](references/codebook.md) is the version the Skill currently loads at runtime: 9 top-level groups (Reasoning, Executing, Evaluating, Reflection, Retrieval, Grounding, Planning, Memory, DecisionMaking) with hex colors used for chart styling. The repository's canonical [`../codebook.md`](../codebook.md) is the **v1.0 paper snapshot** with 11 categories (it adds Generating and Learning). Re-aligning the Skill's reference codebook to the canonical 11-category version is tracked as a v1.1 task.

## License

The Skill source (SKILL.md, scripts, template) is MIT-licensed; see [`../LICENSE`](../LICENSE). The reference codebook is CC BY 4.0; see [`../LICENSE-codebook`](../LICENSE-codebook).
