# Taxonomy

**4 classes · 10 categories · 66 sub-actions (subset shown) · 135 leaf specializations**

- **Coverage** = number of corpus papers (out of 20) containing at least one description of the category.
- **Freq.** = share of all 565 behavior descriptions assigned to that sub-action.
- **Bold** marks the most frequent sub-action within each category.
- `--` = pending Q6 LLM-judge run.

---

## 🟦 Sense

### Retrieval — *Coverage 8/20*
- **Retrieve documents** — Extract data from structured documents (P2) — **8.2%**
- Retrieve knowledge — Retrieve knowledge from semantic memory (P25) — 3.1%
- Retrieve domain context — Retrieve HLS-related context (P29) — 1.8%
- Retrieve events — Retrieve events from episodic memory (P25) — --
- Retrieve skills — Load skills from the skill library — --
- Retrieve errors — Query error repository (P29) — --

### Memory — *Coverage 5/20*
- **Store information** — Store experiences in episodic memory (P25) — **2.6%**
- Convert memory — Consolidate working into long-term memory (P1) — 1.8%
- Read memory — Read from working memory — --
- Discard information — Discard information from working memory (P1) — --

---

## 🟧 Think

### Planning — *Coverage 18/20*
- **Decompose task** — Decompose task into subproblems (P28) — **5.4%**
- Formulate workflow — Comprehensive analysis workflow (P1) — 3.0%
- Select directive strategy — HLS directive combinations (P29) — 0.9%

### Reasoning — *Coverage 20/20*
- **Analysing** — Analyze codebase structure and behavior (P28) — **5.6%**
- Generating — Propose action candidates (P28) — 5.0%
- Inferring — Infer hidden state from evidence (P25) — 2.4%
- Distilling — Distill insights from retrieved info (P3) — 2.2%
- Synthesizing — Combine info into coherent solution (P2) — 1.7%
- Diagnosing — Diagnose error cause (P29) — 1.5%
- Comparing — Compare QoR before/after directive (P29) — --
- Ranking — Rank items by criteria (P2) — --
- Contextualizing — Provide context for subsequent LLM calls — --
- Filtering — Filter information by threshold (P2) — --
- Aggregating — Aggregate multiple candidate outputs (P1) — --

### Evaluating — *Coverage 20/20*
- **Evaluating with heuristics** — Verify intermediate results (P28) — **3.5%**
- Evaluating with gold — Review code against golden standard (P29) — 2.6%
- Evaluating with metrics — Score repair candidates (P29) — 2.1%
- Evaluating with goals — Independent goal-completion check (P25) — --
- Evaluating query — Acknowledge false information (P22) — --

### Deciding — *Coverage 4/20*
- **Generate candidates** — Multifaceted debugging instruction generation (P29) — **2.4%**
- Pick scores — argmax / softmax / majority vote — 1.8%
- Decide accept/reject — Decline out-of-scope queries (P22) — 1.4%
- Make a decision — Make a decision according to memory — --
- Decide multiple states — Fork generative state at uncertainty point (P4) — --

---

## 🟩 Act

### Grounding — *Coverage 18/20*
- **Interact with users** — Accept instructions from humans (P3) — **4.8%**
- Interact with digital environments — Invoke structured API endpoint (P25) — 3.7%
- Interact with other agents — Communicate via structured dialogue (P28) — 3.5%
- Interact with physical environments — Affect environments via robotic planners — 1.5%
- Augmenting — Augment external computation (P28) — 1.5%

### Executing — *Coverage 20/20*
- **Executing strategy** — Insertion agent executes HLS-C optimization (P29) — **5.2%**
- Terminating — Terminate rollout with answer tags (P4) — 1.9%
- Execute debugging — Strict-instruction debugging implementation (P29) — 1.4%
- Generate refusal — Character-consistent refusal with explanation (P22) — 1.1%
- Executing with anonymity — Mask algorithm IDs with generic labels (P1) — --

---

## 🟪 Adapt

### Reflecting — *Coverage 18/20*
- **Reflect from in-episode error** — Executor self-corrects on error (P1) — **3.4%**
- Reflect with feedback — Revise output based on evaluator feedback (P27) — 2.7%
- Reflect on failures (goal) — Analyze stuck state vs. ground truth (P25) — 2.6%
- Reflect through iteration — Refine outcome over multiple rounds (P1) — 2.5%
- Reflect from memory — Learn from mistakes in working memory (P1) — 1.0%
- Self-monitoring — Engage in self-monitoring before commands (P1) — 0.8%

### Learning — *Coverage 1/20*
- **Learning LLM parameters** — Update LLM parameters via SL/RL/RLHF — **1.0%**
- Learning reasoning — Update reasoning via prompt update — 0.6%
- Learning knowledge — Update semantic memory with knowledge (P29) — 0.5%
- Learning decision-making — From random pick to scored selection — --
- Learning grounding — Update grounding via code-based skills — --
- Learning retrieval skills — Update retrieval procedures — --
- Learning instructions — Infer instructions from input-output examples — --
- Self-improving — Generate-then-train on best outputs — --
