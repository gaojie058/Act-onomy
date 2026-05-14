# Spec JSON Schemas for the Three Docx Builders

This file documents the JSON input format for each of the three builders in this directory. Read this before constructing any spec.

All three builders share common conventions:
- Missing optional fields are tolerated — omit them rather than passing `null`.
- Evidence quotes should be verbatim from the paper, ≤15 words each (copyright safety + readability).
- A single quote can be a string; multiple quotes use a string array.
- Use `""` or `null` for evidence to render an em-dash placeholder.

All three builders write a validated .docx. After running, always validate with:
```bash
python /mnt/skills/public/docx/scripts/office/validate.py <output.docx>
```

---

## F1 — Behavior Extraction Report spec

```json
{
  "title": "Behavior Extraction Report",
  "paper_title": "CellAgent: LLM-Driven Multi-Agent Framework ... (ICLR 2026)",
  "analysis_date": "2026-04-16",

  "stats": [
    { "label": "Behaviors extracted", "value": "28" },
    { "label": "Categories hit",       "value": "6 / 7" },
    { "label": "Agent roles",          "value": "3" },
    { "label": "Dominant pattern",     "value": "Plan-Execute-Evaluate" }
  ],

  "behaviors": [
    {
      "behavior": "Planning",
      "sub_behavior": "Decompose Task",
      "source_text": "decomposes complex user requests into manageable subtasks",
      "agent": "Planner"
    },
    {
      "behavior": "Execution",
      "sub_behavior": "Execute Code",
      "source_text": "each step of the generated code are executed within a Jupyter Notebook environment",
      "agent": "Executor"
    }
  ],

  "sub_behavior_frequencies": [
    { "sub_behavior": "Execute Code",   "count": 3 },
    { "sub_behavior": "Decompose Task", "count": 2 },
    { "sub_behavior": "Select Tool",    "count": 2 }
  ],

  "category_frequencies": [
    { "category": "Execution",   "count": 9 },
    { "category": "Evaluation",  "count": 7 },
    { "category": "Reflection",  "count": 6 },
    { "category": "Planning",    "count": 5 },
    { "category": "Communication", "count": 2 },
    { "category": "Reasoning",   "count": 1 }
  ],

  "_note_on_frequencies": "Both frequency arrays are OPTIONAL. If omitted or empty, the builder computes them automatically from the behaviors array. Pass them explicitly only if you want a custom sort or grouping.",

  "dominant_pattern_prose": "The agent follows a three-layer nested loop: an outer main pipeline, a middle Plan-Execute-Evaluate loop per subtask, and inner self-correction/optimization loops.",
  "dominant_pattern_flow": "Decompose Task → Generate Plan → [Execute → Evaluate] → Synthesize Response",

  "loops": [
    { "name": "Outer main pipeline", "description": "Decompose Task → Generate Plan → Execute → Evaluate → Synthesize Response" },
    { "name": "Middle loop (per subtask)", "description": "Select Tool → Generate Code → Execute Code → Assess Outcome → Select Best" },
    { "name": "Inner loop 1 (self-debug)", "description": "Generate Code ↔ Correct Error ↔ Adjust Parameters, up to 3 times" }
  ],

  "observations": [
    { "title": "Anonymize Input before scoring", "body": "The Evaluator masks algorithm identifiers before scoring — a rare debiasing step." },
    { "title": "Discard Memory after success",   "body": "Local memory is explicitly cleared upon subtask completion, an active forgetting behavior." }
  ],

  "missing_behaviors": [
    { "label": "Revise Plan",          "explanation": "Plan is frozen after the Planner's initial output — downstream evaluation cannot trigger replanning." },
    { "label": "Generate Hypothesis",  "explanation": "No evidence of generating new biological hypotheses; the agent only selects from pre-registered tools." }
  ]
}
```

**Field notes:**
- `behavior` must be one of: `Planning, Reasoning, Execution, Evaluation, Reflection, Communication, Others`.
- `sub_behavior` (recommended) or `sub-behavior` (also accepted) — the builder tolerates both.
- `agent` is optional — include only if the paper describes distinct agent roles. If ANY behavior has `agent`, the Agent column appears in the table for ALL behaviors.
- `dominant_pattern_flow` is a single line, rendered in monospaced font. Use arrows: `→ ← ↔ ⇄`.
- `loops` is optional — include only if the paper describes iteration structures.

---

## F2 — Codebook Refinement Report spec

```json
{
  "title": "Codebook Refinement Report",
  "subtitle": "CellAgent V2 → V3 iteration",
  "anchor": "Based on: CellAgent (ICLR 2026) · Codebook version: V2",

  "stats": [
    { "label": "F1 behaviors mapped", "value": "28" },
    { "label": "Clean-fit rate",      "value": "37%" },
    { "label": "Revisions proposed",  "value": "8" },
    { "label": "New categories",      "value": "2" }
  ],

  "mappings": [
    {
      "sub_behavior": "Decompose Task",
      "source_text": "decomposes complex user requests into manageable subtasks",
      "outcome": "no-fit",
      "best_fit_entry": "—",
      "notes": "No category in V2 fits a multi-step structured plan generation action."
    },
    {
      "sub_behavior": "Execute Code",
      "source_text": "each step of the generated code are executed within a Jupyter Notebook",
      "outcome": "clean",
      "best_fit_entry": "Grounding → Execute code",
      "notes": ""
    },
    {
      "sub_behavior": "Select Tool",
      "source_text": "Tool Selector queries the available toolset to identify the most appropriate tools",
      "outcome": "forced",
      "best_fit_entry": "Decision-Making → Propose action candidates",
      "notes": "Tool selection from registry differs from brainstorming N candidates."
    }
  ],

  "unused_entries": [
    { "entry": "Grounding → Affect physical environments via robotic planners", "note": "embodied-specific; retain for cross-agent comparability" }
  ],
  "overloaded_entries": [
    { "entry": "Decision-Making → Evaluate actions via heuristics, LLM, or learned values", "hit_count": 4, "note": "absorbs LLM-judge, metric-based, and voting behaviors" }
  ],
  "adjacent_pairs": [
    { "entry_a": "Retrieve knowledge from semantic memory", "entry_b": "Apply constraint or domain rule", "note": "rule-application behaviors repeatedly forced into retrieval entry" }
  ],

  "proposals": [
    {
      "id": 1,
      "type": "NEW CATEGORY",
      "new_category_name": "Planning",
      "scope": "Actions that produce or modify a multi-step structured plan.",
      "contains": [
        { "name": "Decompose task into subtasks", "explanation": "Break a goal into ordered subtasks.", "evidence": "decomposes complex user requests into manageable subtasks" },
        { "name": "Formulate workflow from task structure", "explanation": "Choose methods suited to task type.", "evidence": "formulates a comprehensive analysis workflow" }
      ],
      "why_new": "Considered Reasoning (single-step) and Decision-Making (single-choice); neither fits multi-step plan generation.",
      "boundary": "Reasoning transforms current information; Planning structures future actions."
    },
    {
      "id": 2,
      "type": "SPLIT",
      "current_entry": "Decision-Making → Evaluate actions via heuristics, LLM, or learned values",
      "children_list": [
        { "name": "Evaluate actions via LLM-as-judge", "explanation": "Use an LLM to score candidates qualitatively." },
        { "name": "Evaluate actions via quantitative metrics", "explanation": "Apply a numeric metric to each candidate." },
        { "name": "Evaluate actions via learned value function", "explanation": "Use a trained scorer." }
      ],
      "scope_rule": "LLM prompted with rubric → judge; formula → quantitative; trained model → learned value.",
      "evidence": [
        "the Evaluator agent assesses the outcome",
        "quantitatively assesses batch effect removal using batch correction metrics"
      ],
      "migration_note": "Prior annotations should be re-examined and assigned to the appropriate child."
    },
    {
      "id": 3,
      "type": "ADD",
      "category": "Memory Actions",
      "new_entry": "Discard information from working memory",
      "explanation": "Explicitly clear short-term state at a defined boundary (e.g. subtask completion).",
      "evidence": "the local memory is discarded upon successful completion of the subtask",
      "justification": "V2 had only store-style memory actions; deliberate forgetting is a distinct architectural choice."
    },
    {
      "id": 4,
      "type": "RENAME / RESCOPE",
      "entry": "Reflect on failed episodes",
      "old_explanation": "Do a post-mortem on what went wrong and avoid repeating the mistake.",
      "new_explanation": "Do a post-mortem AND persist the lesson for future tasks. In-episode-only correction → Reflection category.",
      "scope_change": "Now explicitly cross-task; in-episode correction moves to a new Reflection category.",
      "justification": "Under V2 wording, in-episode self-correction was conflated with cross-task learning."
    },
    {
      "id": 5,
      "type": "REMOVE",
      "removing": "Entertain people",
      "reason": "Unused across the paper and redundant with Accept instructions from humans.",
      "migration": "No prior annotations in this codebook have used this entry.",
      "risk": "Would lose ability to code casual-chat-only agents if encountered later."
    }
  ],

  "clean_fit_rate": "37% (10 clean / 28 total)",
  "clean_fit_interpretation": "Substantial coverage issues. Expect multiple ADDs and at least one NEW CATEGORY, which the proposals reflect.",
  "conclusion": "CellAgent exhibits strong planning and reflection behaviors that V2 cannot express cleanly. Adopting R1-R8 brings clean-fit to ~90% on this paper. Crosswalk in F3 preserves backward compatibility with V2 annotations.",
  "single_paper_warning": "These proposals are based on a single paper. Before freezing V3, validate against at least one more agent paper (ideally a non-biology agent) to check for single-paper overfitting."
}
```

**Proposal type-specific fields:**

| Type | Required fields |
|---|---|
| `ADD` | `category`, `new_entry`, `explanation`, `evidence`, `justification` |
| `SPLIT` | `current_entry`, `children_list` (array of `{name, explanation}`), `scope_rule`, `evidence`, `migration_note` |
| `MERGE` | `merging` (array), `into`, `explanation`, `justification`, `migration_note` |
| `RENAME` or `RENAME / RESCOPE` | `entry`, `old_explanation`, `new_explanation`, `scope_change`, `justification` |
| `NEW CATEGORY` | `new_category_name`, `scope`, `contains` (array), `why_new`, `boundary` |
| `REMOVE` | `removing`, `reason`, `migration`, `risk` |

**Outcome values for mappings:**
`clean`, `forced`, `no-fit`, `multi-fit` (also accepts `no_fit` / `multi_fit` / `nofit` / `multifit` variants).

---

## F3 — Refined Codebook spec

```json
{
  "title": "Act-onomy Codebook — V3 (Refined)",
  "subtitle": "Verb + Noun format · with plain-English explanations and evidence",
  "anchor": "Evidence drawn from: CellAgent (ICLR 2026)",

  "changelog_heading": "Changelog: V2 → V3",
  "changelog_intro": "This revision was driven by cross-analysis against CellAgent. The F2 refinement report contains the full justification.",
  "changelog": [
    { "title": "Two new top-level categories added.", "body": "Planning and Reflection are now first-class." },
    { "title": "Evaluation split three ways.",         "body": "LLM-judge / quantitative / learned value." }
  ],

  "legend": {
    "new": "Action did not exist in V2. Added to close a coverage gap.",
    "refined": "Action existed in V2 but was split, renamed, or scope-tightened.",
    "unchanged": "Kept from V2 unchanged."
  },
  "evidence_note": "Quotations are drawn from CellAgent (ICLR 2026). Dash indicates the action is defined but not instantiated by this paper — retained for cross-agent comparability.",

  "column_names": ["Action (Verb + Noun)", "Plain Explanation", "Evidence"],

  "categories": [
    {
      "name": "Memory Actions",
      "is_new": false,
      "intro": "Actions over internal state stores. Memory writes; Retrieval reads.",
      "entries": [
        { "action": "Store information in working memory", "explanation": "Put recent inputs on a scratch pad.", "evidence": "a local memory operates as a short-term workspace", "kind": null },
        { "action": "Discard information from working memory", "explanation": "Explicitly clear short-term state at subtask boundary.", "evidence": "the local memory is discarded upon successful completion of the subtask", "kind": "new" }
      ]
    },
    {
      "name": "Planning",
      "is_new": true,
      "intro": "Actions that produce or modify a multi-step structured plan.",
      "entries": [
        { "action": "Decompose task into subtasks", "explanation": "Break a goal into ordered subtasks.", "evidence": "decomposes complex user requests into manageable subtasks", "kind": "new" }
      ]
    }
  ],

  "crosswalk": [
    { "previous": "V2: (no category)", "treatment": "New Planning category hosts Decompose, Formulate workflow.", "kind": "new" },
    { "previous": "V2: Evaluate actions via heuristics, LLM, or learned values", "treatment": "Split three ways.", "kind": "refined" }
  ],

  "summary": [
    { "category": "1. Memory", "count": "5 (+2)", "notes": "Added Discard and Consolidate." },
    { "category": "2. Planning", "count": "3 (new)", "notes": "New category." }
  ],

  "closing_line": "End of Codebook V3."
}
```

**Per-entry fields in `categories[].entries`:**
- `action` (required) — Verb+Noun name
- `explanation` (required) — plain English
- `evidence` — string OR array of strings OR `""` (→ em dash)
- `kind` — `"new"` (🆕 orange shading) | `"refined"` (↻ yellow shading) | `null` (unchanged)

**Crosswalk `kind` values:** `"new"`, `"refined"`, omitted (unchanged).

---

## Running the builders

```bash
# Install docx once (if not already)
npm install -g docx

# Then from within the skill's scripts/ directory:
cd /path/to/skill/scripts

node build_f1_extraction_docx.js f1_spec.json /mnt/user-data/outputs/f1_extraction.docx
node build_f2_refinement_docx.js f2_spec.json /mnt/user-data/outputs/f2_refinement.docx
node build_f3_codebook_docx.js   f3_spec.json /mnt/user-data/outputs/codebook_v3.docx

# Validate each
python /mnt/skills/public/docx/scripts/office/validate.py /mnt/user-data/outputs/f1_extraction.docx
python /mnt/skills/public/docx/scripts/office/validate.py /mnt/user-data/outputs/f2_refinement.docx
python /mnt/skills/public/docx/scripts/office/validate.py /mnt/user-data/outputs/codebook_v3.docx
```

If a validation step fails, inspect the spec JSON for:
- empty required fields
- malformed JSON (trailing commas, bad escapes)
- nested arrays where a string is expected

Fix the spec and regenerate — don't edit the .docx directly.
