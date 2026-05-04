# Case Studies

Reproducibility artifacts for the three case studies in the paper.

| Folder | Paper section | Question |
|---|---|---|
| [`case1_swe_agent_two_traces/`](case1_swe_agent_two_traces/) | §4.2 | Within a single agent, does the profile bend with the task at hand (i.e., is the right unit "agent on a task" rather than "agent")? |
| [`case2_three_agents/`](case2_three_agents/) | §4.1 | Does Act-onomy surface distinct behavioral profiles across agents that vary in architecture and task? |
| [`case3_mast_astropy/`](case3_mast_astropy/) | §4.3 | Can MAST-style failure modes (e.g., trajectory restart, step repetition) be made legible as patterns in the Act-onomy-coded sequence? |

Each folder contains (or will contain in a forthcoming release):

- `trajectory.jsonl` — the normalized `(observation, thought, action)` triples fed to the Skill.
- `labels.json` — the Skill's per-turn output (category, sub-actions, specializations, evidence).
- `report.html` — the rendered four-panel report.
- `notes.md` — pointers back to the paper figure(s) reproduced from this artifact.
