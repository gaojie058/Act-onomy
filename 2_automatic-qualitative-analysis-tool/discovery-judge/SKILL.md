---
name: discovery-judge
description: "Run a three-stage agent-behavior analysis pipeline — (1) extract behaviors from a paper with no codebook constraint, (2) compare the extraction against an existing codebook and propose revisions, (3) generate a refined next-version codebook. Use this skill whenever the user uploads an agent/AI/LLM paper together with an existing codebook (action space, behavior taxonomy, coding scheme) and wants to improve the codebook based on the paper. Also trigger for phrases like 'analyze this paper with my codebook', 'what should I add to my codebook based on this paper', 'run behavior extraction and compare to my taxonomy', 'iterate my codebook using this paper', 'stress-test my codebook'. Produces three .docx deliverables in one automated run — the extraction report, the refinement report, and the new codebook version."
---

# Codebook Iterator

A three-stage pipeline for iterating a qualitative-coding codebook against a new agent paper. Produces three Word documents in a single automated run:

1. **F1: Behavior Extraction Report** — open-coded analysis of the paper, no codebook constraints
2. **F2: Codebook Refinement Report** — mapping of F1 findings to the existing codebook, with ADD/SPLIT/MERGE/RENAME/NEW CATEGORY/REMOVE proposals, each evidenced by paper quotes
3. **F3: Refined Codebook (V+1)** — the next-version codebook as a validated .docx with changelog and crosswalk appendix

## When to use this skill

Trigger when the user has uploaded **both** a codebook (any format: .docx, .pdf, .md, pasted text) **and** at least one agent paper, and the user wants iteration — not just annotation.

Common phrasings: "improve my codebook using this paper", "what's missing from my taxonomy", "analyze this paper and update my codebook", "run my three-stage pipeline", "iterate V2 using paper X".

Also trigger proactively when the user uploads a codebook and a paper in the same turn without explicit iteration language — the implicit ask is usually this pipeline.

**Do NOT trigger for:**
- Building a codebook from scratch with no prior version (pure open coding, not iteration)
- Coding a single paper against a frozen codebook with no intent to revise (annotation, not iteration)
- Editing codebook wording without paper-based evidence (proofreading, not iteration)

## Execution model

The pipeline runs **automatically, end-to-end**, without between-stage checkpoints. The user gets all three documents at the end. This is intentional: the user chose batch delivery over interactive iteration. Do not insert confirmation prompts between stages.

Only interrupt if:
- A required input is missing (no codebook, no paper, or the paper is unreadable)
- The paper is obviously wrong for the task (not about an agent/AI system)
- An extracted behavior count is pathologically low (<10) and the paper appears substantive — in that case re-read before producing F1

## Inputs

1. **One or more agent papers** — .pdf, .html, .md, .txt, or pasted text. Multiple papers are allowed; if provided, F1 is generated per paper and F2 aggregates across all papers.
2. **One existing codebook** — any format. Read it in full before starting. Note its structure (top-level categories, entry format, column names). F3 must preserve this structure.
3. **Current version label** — infer from the codebook filename or content if possible ("V2" → next is "V3"). If not inferable, ask once at the start.

## Stage F1 — Behavior Extraction Report

This stage uses a fixed extraction protocol. Do not deviate from it.

### Extraction protocol

For each paper, extract agent behaviors as follows:

1. **Behavior Extraction.** Identify all agent behaviors from the paper. A "behavior" is a meaningful action or cognitive operation the agent performs. Focus on detecting behaviors through verb forms — action verbs like "plans", "reasons", "retrieves", "generates", "evaluates", "reflects", "decides", "decomposes", "summarizes", "validates".
2. **Verb + Noun.** Represent each identified behavior in a standardized "Verb + Noun" format. Examples: "Plan Task", "Reason About Constraint", "Retrieve Information", "Generate Response", "Decompose Problem", "Evaluate Result", "Revise Plan", "Select Tool", "Validate Output", "Reflect On Error".
3. **Output format per behavior instance.** For each behavior, record:
    - `behavior`: one of `[Planning, Reasoning, Execution, Evaluation, Reflection, Communication, Others]`
    - `sub-behavior`: the Verb + Noun label
    - `source_text`: the exact span from the paper that triggered this identification

Use these seven top-level behavior categories exactly. Do not rename them, do not add new ones, do not reuse the existing codebook's categories. F1 is deliberately blind to the user's codebook — that's what makes F2's comparison meaningful.

### Target granularity

Expect 20–40 behavior instances for a substantive agent paper. If fewer than 15 emerge, re-read — likely undercoding. If more than 50, consider whether entries are being double-counted.

Read architecture sections, method sections, ablation studies, and figure captions carefully — they contain the highest density of behavior descriptions.

### F1 document structure

After extraction, use `scripts/build_f1_extraction_docx.js` with a JSON spec to produce the extraction report. The spec includes:

- **Cover** — paper title, analysis date, summary counts (total behaviors, behavior categories hit, agent roles identified if applicable)
- **§1 Behavior Extraction Table** — one row per behavior instance with columns: `#`, `Behavior`, `Sub-behavior (Verb + Noun)`, `Source Text (verbatim quote)`. If the paper has distinct agent roles (Planner/Executor/etc.), include an `Agent` column.
- **§2 Frequency Distribution** — count of each Verb+Noun, ordered by frequency. Also a top-level category distribution.
- **§3 Dominant Behavior Pattern** — a short prose description plus (if applicable) a single-line flow diagram rendered as text (e.g., "Plan → Execute → Evaluate → Refine"). If the paper describes loops, note them explicitly ("inner loop: Execute ↔ Correct Error").
- **§4 Notable Observations** — bulleted list of behavior transitions, missing behaviors (behaviors conspicuously absent given the paper's domain), and any other patterns worth flagging.

See `scripts/spec-schema.md` for the exact JSON spec format.

## Stage F2 — Codebook Refinement Report

F2 takes F1's output and compares it against the user's existing codebook. It produces revision proposals, each grounded in specific quoted evidence.

### Mapping phase

For each behavior extracted in F1, assign one mapping outcome against the existing codebook:

- **Clean fit** — maps cleanly to exactly one codebook entry
- **Forced fit** — no entry fits naturally; closest one is [X], but [reason it doesn't fit]
- **No fit** — genuinely absent from the codebook
- **Multi-fit** — could map to two or more entries (signal of unclear boundary)

Then examine the codebook from the reverse direction:

- **Unused entries** — codebook entries that no extracted behavior hit
- **Overloaded entries** — codebook entries that many different behaviors mapped to (split signal)
- **Adjacent-but-distinct** — pairs of entries that trigger multi-fits (rescope signal)

See `references/diagnostics.md` for worked examples of each pattern.

### Revision proposal phase

For each diagnostic finding, generate a concrete revision proposal. Every proposal must be **exactly one** of six types:

- **ADD** — new entry to an existing category
- **SPLIT** — one existing entry becomes two or more
- **MERGE** — two or more existing entries become one (rare)
- **RENAME / RESCOPE** — same entry, tighter or clearer definition
- **NEW CATEGORY** — new top-level category (requires at least 2–3 supporting actions with shared theme)
- **REMOVE** — delete an entry (requires both unused AND redundant)

Every proposal must cite specific verbatim evidence (≤15 words per quote) from the paper(s). Proposals without evidence are dropped, not weakened — no "this seems useful" entries.

See `references/revision-patterns.md` for phrasing templates per revision type.

### F2 document structure

Use `scripts/build_f2_refinement_docx.js` with a JSON spec. Includes:

- **Cover** — title, pipeline context, summary counts (mapping distribution, proposal counts by type)
- **§1 Mapping Table** — every F1 behavior with columns: `#`, `F1 Sub-behavior`, `F1 Source Text`, `Mapping Outcome`, `Best-fit codebook entry (if any)`, `Notes`. This is the longest section and the core evidence base.
- **§2 Codebook-Level Diagnostics** — unused entries list, overloaded entries list, adjacent-but-distinct pairs. Each with the count/reason.
- **§3 Revision Proposals** — organized by revision type, numbered `R1`, `R2`, …. Each proposal includes:
    - Type (ADD / SPLIT / etc.)
    - Target category/entry
    - Proposed change (new name, new explanation, split children, etc.)
    - **Evidence** — one or more verbatim paper quotes, each ≤15 words
    - Justification — why this change, referencing specific F1 findings
- **§4 Clean-Fit Rate and Conclusion** — overall coverage percentage, assessment ("healthy / substantial gaps / mismatch"), and whether multi-paper validation is recommended before freezing V+1

### Ordering of revision proposals in §3

Within §3, order proposals by type in this sequence: NEW CATEGORY → SPLIT → ADD → RENAME → MERGE → REMOVE. Within each type, order by evidence strength (most strongly supported first).

## Stage F3 — Refined Codebook (V+1)

F3 takes all revision proposals from F2 and assembles the next-version codebook. **In automated mode, all F2 proposals are applied** — this is the trade-off of skipping between-stage checkpoints. If the user wants selective acceptance, they can do a follow-up pass by saying "actually drop R3 and R7" after seeing the output.

### F3 document structure

Use `scripts/build_f3_codebook_docx.js` with a JSON spec. Structure:

- **Cover** — title (with new version label), subtitle, anchor ("Evidence drawn from: [paper titles]")
- **Changelog** — bulleted summary of revisions, organized by type
- **Legend** — 🆕 new, ↻ refined, no marker = unchanged
- **Categories** — one section per category, each with:
    - Short intro paragraph describing category scope
    - Three-column table: `Action (Verb + Noun)` | `Plain Explanation` | `Evidence`
    - New entries prefixed 🆕 with light-orange row shading
    - Refined entries prefixed ↻ with light-yellow row shading
- **Appendix A · Crosswalk** — two-column table mapping each V (previous) entry to its treatment in V+1 (kept / split / merged / removed / renamed)
- **Appendix B · Category Summary** — action counts and brief notes per category

### Format preservation

F3 must preserve the user's existing codebook format:
- If original used "Verb + Noun" naming, V+1 uses it too
- If original column names differ ("Behavior" instead of "Action"), match them (set `column_names` in the spec)
- If original had no Evidence column, use a two-column variant (edit the spec accordingly)
- If original used different category names, those stay; revisions add/modify but don't rename existing categories unless a RENAME revision was proposed

## Workflow

Execute in this sequence. Do not skip steps.

### Step 1 — Read all inputs

1. Read the existing codebook in full. Note: structure, number of categories, number of entries, column format, naming convention.
2. Read each paper in full. For PDFs, use the pdf-reading skill if contents aren't already in context. Take notes on architecture sections and agent roles.
3. If the version label isn't obvious from the codebook filename/content, briefly ask the user ("Should the output be labeled V3? Or do you use a different scheme?"). This is the only allowed user interaction before final delivery.

### Step 2 — Run F1 per paper

For each paper:
1. Apply the extraction protocol (Behavior Extraction → Verb+Noun → 7-category assignment + source_text).
2. Build the F1 spec JSON (see `scripts/spec-schema.md`).
3. Call `node scripts/build_f1_extraction_docx.js f1_spec.json /mnt/user-data/outputs/f1_extraction_<paper-slug>.docx`.
4. Validate with `python /mnt/skills/public/docx/scripts/office/validate.py <path>`. If validation fails, inspect the spec JSON for empty-string fields or malformed structures, fix, regenerate.

If multiple papers, generate one F1 docx per paper with distinct slugs.

### Step 3 — Run F2

1. Build the mapping table by walking through every F1 behavior against the existing codebook. Assign one of {clean, forced, no-fit, multi-fit} per behavior.
2. Compute codebook-level diagnostics (unused / overloaded / adjacent).
3. Generate revision proposals (ADD/SPLIT/…/REMOVE), each with verbatim evidence.
4. Build the F2 spec JSON.
5. Call `node scripts/build_f2_refinement_docx.js f2_spec.json /mnt/user-data/outputs/f2_refinement.docx`.
6. Validate.

### Step 4 — Run F3

1. Apply every F2 proposal to produce the new codebook structure.
2. Build the F3 spec JSON.
3. Call `node scripts/build_f3_codebook_docx.js f3_spec.json /mnt/user-data/outputs/codebook_v<N+1>.docx`.
4. Validate.

### Step 5 — Present all three files

Use `present_files` with all three (or more, if multi-paper) .docx files. Lead with F3 (the primary deliverable), followed by F2 (the justification), then F1 (the underlying data).

Write a short summary (3–6 sentences) of what changed: how many behaviors extracted, clean-fit rate, how many proposals of each type, what the biggest structural change to the codebook was. Do NOT write a long narrative — the user has three docs to read; keep chat brief.

## Important principles

**F1 is codebook-blind.** This is structurally essential. If F1 uses the codebook's categories, F2's comparison reveals nothing. Use only the seven fixed categories `[Planning, Reasoning, Execution, Evaluation, Reflection, Communication, Others]` in F1, regardless of what the user's codebook has.

**Evidence > intuition.** Every F2 proposal needs a verbatim quote. If you find yourself writing a proposal whose justification is "it would be nice to have", delete it. The pipeline is a discovery tool, not a generation tool.

**Single-paper iteration overfits.** When only one paper is provided, F2's conclusion section should note this and suggest at least one more paper before freezing V+1. When multiple papers are provided, F2 aggregates across them and flags proposals supported by only one paper as weaker.

**Don't inflate.** A good iteration produces 3–8 proposals. Twenty proposals usually means double-counting or freelancing. Each proposal is a theoretical claim the user has to live with.

**Preserve the user's codebook format.** Match column names, naming convention, category names exactly. V+1 should feel like a continuation of V, not a redesign.

## Edge cases

**Codebook is a PDF.** Extract text first (pdf-reading skill). If the extraction is poor (scanned or complex layout), ask the user to paste the codebook content.

**Codebook is pasted text with no clear structure.** Parse into (category, entry, explanation) triples before starting F2. If parsing is ambiguous, show the user your parse and get one confirmation before proceeding.

**Paper is very short (workshop paper, extended abstract).** F1 may produce <15 behaviors legitimately. In that case, note in F2 that coverage is limited by source material, not by over-extraction.

**Paper is not an agent paper.** If the paper is about (say) a dataset release or a theoretical result with no agent described, stop and tell the user — this skill requires an agent paper.

**Multiple papers, one with very different agent paradigm.** F2 may find a proposal supported only by the outlier paper. Flag such proposals as "single-source" and let the user decide whether to accept.

**User explicitly says "don't apply every proposal to V+1".** Override the auto-apply rule — ask them which to include before running F3.

## Reference files

- `references/diagnostics.md` — worked examples of the four mapping outcomes and three codebook-level diagnostics. Read during F2 mapping phase.
- `references/revision-patterns.md` — standard templates for the six revision types. Read during F2 proposal phase.
- `scripts/spec-schema.md` — JSON spec formats for all three docx builders. Read before calling any builder.
- `scripts/build_f1_extraction_docx.js` — F1 builder.
- `scripts/build_f2_refinement_docx.js` — F2 builder.
- `scripts/build_f3_codebook_docx.js` — F3 builder.
