# Act*onomy Taxonomy

**v1.0** · derived from `act-onomy_codebook.csv` (V4.2)
**3 clusters · 10 actions · 46 sub-actions · 120 leaf instances**

Aligned with *How to Interpret Agent Behavior* (arXiv:2605.13625v1, Figures 2–3 and Appendix I).

## How to read this table

- **Freq.** = share of the **n=120 paper-grounded behavior-description sentences** quoted as evidence in V4.2, drawn from the **20 incorporated construction papers** (Table 2 of the paper). Each sentence contributes ≈0.83 percentage points.
- The italic figure under each **cluster** and **category** gives the same metric aggregated to that level.
- Sub-actions are ordered by **descending frequency** within each category.
- *Italicized* sub-actions (Freq. "—") are retained by theoretical motivation but not yet observed in the construction corpus.
- **Bold** marks the unique most-frequent sub-action within a category; ties are left unbolded.
- Representative verb–noun examples are anchored to a corpus paper (P*) where available.

---

## 🟦 External Interaction — *22.1%*

### Grounding — *17.7%*

- **Interact with users** — Accept instructions from humans (P3) — **6.3%**
- Augment with external computation — Invoke specialized computation tool (P16) — 4.4%
- Interact with other agents — Send message to peer agent (P16) — 3.2%
- Interact with physical environments — Perceive physical environment (P34) — 1.9%
- Interact with digital environments — Navigate digital interfaces (P2) — 1.9%

### Retrieval — *4.4%*

- **Retrieve from external knowledge base** — Query BugRAG / recall analogical examples (P28; P29) — **1.9%**
- Retrieve from local corpus — Read 1–15 documents/tables (P2) — 1.3%
- Retrieve from open web — Web search to offload knowledge retrieval (P16) — 0.6%
- Retrieve relevant context — Retrieve HLS-related context (P29) — 0.6%
- *Retrieve from skill library* — Theory-driven (no paper-grounded instance) — —

---

## 🟧 Cognition & Execution — *55.8%*

### Reasoning — *25.9%*

- **Generating** — Generate candidate options (P4) — **6.3%**
- Contextualizing — Configure agent persona or role-conditioning (P22) — 5.7%
- Analysing — Analyse artifact structure and behavior (P28) — 3.8%
- Inferring — Infer structure from indirect evidence (P11) — 3.2%
- Combining & Synthesis — Combine information from multiple sources (P2) — 3.2%
- Comparing & Ranking — Compare values across sources (P2) — 2.5%
- Filtering — Filter information by threshold (P2) — 0.6%
- Explaining — Explain failure from user requirement (P16) — 0.6%
- *Summarizing/Distilling* — Summarize recent observations and trajectories — —

### Planning — *10.8%*

- **Decompose task** — Decompose into subtasks (P34) — **4.4%**
- Formulate a workflow or plan — Formulate a high-level plan (P8) — 3.8%
- Select strategy — Select among candidate strategies (P29) — 1.3%
- Modify plan — Replan dynamically based on feedback (P34) — 1.3%

### Evaluating — *14.6%*

- **Evaluating without ground truth** — Score on quality dimensions (P22) — **8.9%**
- Evaluating with goals/requirements/constraints — Domain-rule / best-practice check (P1) — 3.8%
- Evaluating with gold — Compare against gold reference (P29) — 1.9%

### Deciding — *1.3%*

- Decide accept or not — Decline out-of-scope queries (P22) — 0.6%
- Decide under uncertainty — Fork trajectory at uncertainty (P4) — 0.6%
- *Make a decision* — Make a decision according to memory — —
- *Pick scores* — Select action by score (argmax/softmax/vote) — —

### Executing — *3.2%*

- Executing debug — Adopt debugging instructions (P29) — 1.3%
- Terminating — Provide final answer (P32) — 1.3%
- Executing plan — Execute strategy (P29) — 0.6%

---

## 🟪 Learning & Adaptation — *22.2%*

### Reflecting — *14.6%*

- **Reflect on errors and failures** — Self-correct step implementation (P28) — **7.0%**
- Reflect on self-outcomes — Self-reflect on iterative outcomes (P32) — 5.1%
- Reflect on external feedback — Integrate evaluator feedback (P1) — 2.5%

### Learning — *3.8%*

- **Learning knowledge** — Update semantic memory with knowledge (P29) — **2.5%**
- Learning LLM parameters — Update action parameters based on feedback (P1) — 1.3%
- *Learning reasoning* — Update reasoning via prompt update — —
- *Learning grounding* — Update grounding via code-based skills — —
- *Learning instructions* — Infer instructions from input-output examples — —

### Memory — *3.8%*

- Discard information — Discard information from working memory (P1) — 1.3%
- Consolidate memory — Consolidate working into long-term memory (P1) — 1.3%
- Store information — Store information in long-term memory (P16) — 0.6%
- Read memory — Read from working memory (P12) — 0.6%
- *Update information* — Update memory from new experiences (P17) — —

---
