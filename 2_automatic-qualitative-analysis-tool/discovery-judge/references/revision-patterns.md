# Revision Patterns Reference

Read this during F2's revision proposal phase.

This file defines templates for each of the six revision types. Every proposal written into F2 §3 must use one of these templates. Don't invent other types.

## The six revision types

### 1. ADD — new entry to existing category

**When**: An F1 behavior has no fit in the current codebook, and it belongs thematically to an existing category.

**Template**:
```
R<n>. ADD
Category: [existing category name]
New entry: [Verb + Noun]
Plain Explanation: [one short sentence in the codebook's existing prose style]
Evidence:
  - "[verbatim paper quote, ≤15 words]"
  - (additional quotes if from multiple papers or multiple instances)
Justification: This action appeared in F1 as [sub-behavior label] with no fit in
  the current codebook. It belongs to [category] because [short thematic reason].
```

**Worked example**:
```
R1. ADD
Category: Memory Actions
New entry: Discard information from working memory
Plain Explanation: Explicitly clear short-term state at a defined boundary
  (e.g. subtask completion), preventing stale context from polluting the next step.
Evidence:
  - "the local memory is discarded upon successful completion of the subtask"
Justification: V2 had only store-style memory actions. F1 flagged this as no-fit.
  Deliberate forgetting is a distinct architectural choice the existing entries can't express.
```

### 2. SPLIT — one entry becomes two or more

**When**: An existing entry absorbed multiple F1 behaviors that are fundamentally different, and the difference matters for cross-agent comparison (is observable).

**Template**:
```
R<n>. SPLIT
Current entry: [old Verb + Noun]
Becomes:
  - [child 1 Verb + Noun] — [explanation + scope rule]
  - [child 2 Verb + Noun] — [explanation + scope rule]
  - [child 3 if applicable]
Scope rule for choosing: [how to decide which child an F1 behavior goes under]
Evidence for each child:
  - Child 1: "[verbatim quote]"
  - Child 2: "[verbatim quote]"
  - Child 3: "[verbatim quote]" or "—" if not instantiated but kept for comparability
Migration note: annotations previously coded under [old entry] should be recoded as
  [most common child]; exceptional cases [describe].
```

**Worked example**:
```
R2. SPLIT
Current entry: Evaluate actions via heuristics, LLM, or learned values
Becomes:
  - Evaluate actions via LLM-as-judge — Use an LLM to score candidates qualitatively.
  - Evaluate actions via quantitative metrics — Apply a numeric metric to each candidate.
  - Evaluate actions via learned value function — Use a trained scorer (Q-function, reward model).
Scope rule for choosing: LLM prompted with a rubric → LLM-judge. Formula/metric → quantitative.
  Trained scoring model → learned value.
Evidence:
  - LLM-judge: "the Evaluator agent assesses the outcome"
  - Quantitative: "quantitatively assesses batch effect removal using batch correction metrics"
  - Learned value: "—" (not instantiated in this paper; retained for cross-agent comparability)
Migration note: prior annotations should be re-examined and assigned to the appropriate child.
```

**Important**: Splits with no observable inter-agent difference are cosmetic. Only split when the children would produce different coding on different agents.

### 3. MERGE — two or more entries become one

**When**: Entries are persistently multi-fit, share scope in practice, and can't be rescoped to be distinct.

**Merges are rare.** Most adjacent-entry problems are better solved by RENAME than MERGE. Propose a merge only when you've tried to write tight rescopes and failed.

**Template**:
```
R<n>. MERGE
Merging: [entry A] + [entry B] (and more if applicable)
Into: [new unified Verb + Noun]
Plain Explanation: [explanation covering both]
Justification: [why they can't be held distinct; reference multi-fit evidence from F2 §1]
Migration note: annotations under any merged entry move to the merged entry with no loss of information.
```

### 4. RENAME / RESCOPE — tighten the definition

**When**: An entry's plain explanation is causing forced fits or multi-fits because its scope is unclear. The entry stays; the wording changes.

**Template**:
```
R<n>. RENAME / RESCOPE
Entry: [Verb + Noun — usually unchanged, but may be renamed]
Old explanation: [current text]
New explanation: [tightened text, often specifying what's in-scope AND what's out-of-scope]
Scope change: [one sentence describing the delta]
Justification: [which F1 behaviors were causing the confusion]
Evidence: (optional — reference F2 §1 findings)
```

**Worked example**:
```
R3. RENAME / RESCOPE
Entry: Reflect on failed episodes
Old explanation: Do a post-mortem on what went wrong, store the lessons, avoid
  repeating the mistake.
New explanation: Do a post-mortem on what went wrong AND persist the lesson for
  future tasks. Scope-tightened: if the lesson dies with the episode, use
  [Reflection category → Correct errors within an episode] instead.
Scope change: Now explicitly cross-task. In-episode correction moved to Reflection.
Justification: Under the old wording, F1 behaviors like "Correct Error" and
  "Adjust Parameters" (both in-episode) were forced into this entry, collapsing the
  distinction between agents that truly learn vs. ones that only self-correct.
```

### 5. NEW CATEGORY — new top-level category

**When**: At least **two or three** F1 behaviors don't fit any existing category and share a coherent theme.

**Do not propose singleton categories.** If only one F1 behavior motivates a new category, either find a home in an existing category or note the issue for future iterations.

**Template**:
```
R<n>. NEW CATEGORY
New category name: [name]
Scope: [what actions live here, what's out of scope]
Contains initially:
  - [Verb + Noun 1] — [explanation] — evidence: "[quote]"
  - [Verb + Noun 2] — [explanation] — evidence: "[quote]"
  - [Verb + Noun 3 if applicable]
Why a new category rather than extending existing ones: [name each existing category
  considered and explain why each didn't fit]
Boundary with adjacent categories: [one sentence per nearest neighbor]
```

**Worked example**:
```
R4. NEW CATEGORY
New category name: Planning
Scope: Actions that produce or modify a multi-step structured plan. Not reasoning
  (single-step) and not decision-making (single-choice) — outputs a sequence.
Contains initially:
  - Decompose a task into subtasks — evidence: "decomposes complex user requests into manageable subtasks"
  - Formulate a workflow from task structure — evidence: "formulates a comprehensive analysis workflow"
  - Revise plan based on feedback — "—" (not instantiated)
Why a new category rather than extending existing ones:
  Considered Reasoning (wrong: Reasoning is single-step, plans are multi-step) and
  Decision-Making (wrong: Decision-Making picks among candidates, planning generates
  the structure of future actions). No existing category fits.
Boundary with adjacent categories: Reasoning transforms current information; Planning
  structures future actions; Decision-Making selects among candidates at each plan step.
```

### 6. REMOVE — delete an entry

**When**: An entry is unused across all tested papers AND is redundant with another entry. One of these two conditions alone is NOT enough.

**Template**:
```
R<n>. REMOVE
Removing: [Verb + Noun]
Reason: [unused across N papers + redundant with which other entry]
Migration: any previous annotations under this entry move to [target entry].
Risk: [what's lost if removed, e.g. "would lose the ability to express [scenario]"]
```

Removals are controversial. Prefer a RENAME that annotates the entry as "rare" or "embodied-specific" over removal.

## Ordering proposals in F2 §3

Order by type in this sequence:

1. NEW CATEGORY (most consequential)
2. SPLIT (structural)
3. ADD (additive, least disruptive)
4. RENAME / RESCOPE (textual)
5. MERGE
6. REMOVE (most disruptive to backward compatibility)

Within each type, order by evidence strength — strongest first.

Number each proposal `R1, R2, …` globally (not per-type), so the user can reference them by single identifier.

## What makes a good revision vs. a bad one

**Good**:
- Grounded in specific quoted paper evidence
- Produces a codeable change (two agents would be coded differently afterward)
- Preserves backward compatibility via the F3 crosswalk
- Has a clear scope rule

**Bad**:
- "Seems like a useful category to have" (no paper evidence)
- Refines beyond any observable inter-agent difference (cosmetic)
- Renames for style reasons only
- Creates singleton categories

When in doubt, drop the proposal. F2 is a discovery tool, and false positives there become theoretical debt in the codebook.
