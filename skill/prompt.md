# AgentAction Skill — Prompt Template

> **Status: placeholder.** The full prompt template is being prepared for release alongside the camera-ready paper. The schema below describes the contract that any implementation must satisfy.

## Inputs

The skill is invoked with:

1. **Codebook** (markdown). The full content of `codebook.md` from this repository.
2. **Trajectory** (JSONL or equivalent). An ordered sequence of turns, each a triple:
   ```json
   {"turn": 0, "observation": "...", "thought": "...", "action": "..."}
   ```
   Trajectories from heterogeneous frameworks (SWE-agent, browser agents, multi-agent dialog systems, game-playing agents) should be normalized into this triple form via a thin adapter before invocation.
3. **Annotation mode.** One of:
   - `thought-grounded` (default) — annotation anchors to the thought text. Use when the action is a thin shell-command surface and almost all cognitive content lives in the thought (e.g., SWE-agent on SWE-bench).
   - `action-grounded` — annotation anchors to the action surface. Use when the action surface itself is the cognitively rich one (e.g., AutoGen / AG2 / MAST multi-agent dialog), where the agent's emitted message *is* the action.

## Output (per turn)

For each turn, the skill emits:

```json
{
  "turn": 0,
  "category": "Reasoning",
  "sub_actions": ["Inferring", "Diagnosing"],
  "specializations": ["Pinpoint root cause", "Infer dataflow"],
  "evidence": [
    {"surface": "thought", "quote": "..."},
    {"surface": "thought", "quote": "..."}
  ]
}
```

Constraints:
- `category` must be one of the 11 top-level categories defined in the codebook.
- `sub_actions` and `specializations` must be drawn from the codebook for the chosen category.
- `evidence` must contain 2–5 verbatim quotes from the trajectory turn that ground each label. Quote-level grounding is required so that downstream readers can audit every label.
- Pure-planning turns with no executable surface remain valid with zero quotes.

## Rendering

Aggregated output is rendered through `report_template.html` to produce a four-panel HTML report:

1. category-level distribution (pie chart);
2. per-turn timeline of category and sub-action labels;
3. sub-action frequency table within each category;
4. evidence panel where any label is hover-linked to its underlying quote.
