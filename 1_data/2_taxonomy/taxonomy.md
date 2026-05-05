# Act-onomy Taxonomy

**v1.0** · derived from `act-onomy_codebook.csv` (V4.2)  
**4 classes · 10 categories · 46 sub-actions · 120 leaf instances**

## How to read this table

- **Coverage (Cov.)** = paper coverage over the **28-paper construction set**. The 7 held-out validation papers (P5, P10, P15, P20, P25, P30, P35) are excluded from the count.
- Each cited paper contributes ≈3.6 percentage points (1/28).
- The italic figure under each category gives the **same metric at the category level** (any sub-action cited counts the paper once).
- "0%" marks sub-actions defined in the codebook but not cited by any construction paper (theory-driven retainers).
- **Bold** marks the unique most-frequent sub-action within a category; ties are left unbolded.
- Representative verb-noun examples are anchored to a corpus paper (P*) where available.

---

## 🟦 Sense

### Retrieval — *Cov. 17.9%*

- Retrieve from skill library — Theory-driven (no paper-grounded instance) — 0%
- Retrieve from local corpus — Read 1-15 documents/tables (P2) — 7.1%
- Retrieve from external knowledge base — Query BugRAG / recall analogical examples (P28; P29) — 7.1%
- Retrieve from open web — Web search to offload knowledge retrieval (P16) — 3.6%
- Retrieve relevant context — Retrieve HLS-related context (P29) — 3.6%

### Memory — *Cov. 10.7%*

- Store Information — Store information in long-term memory (P16) — 3.6%
- Update Information — Update memory from new experiences (P17) — 3.6%
- Discard information — Discard information from working memory (P1) — 3.6%
- Consolidate memory — Consolidate working into long-term memory (P1) — 3.6%
- Read memory — Read from working memory (P12) — 3.6%

---

## 🟧 Think

### Planning — *Cov. 35.7%*

- Decompose task — Decompose into subtasks (P34) — 17.9%
- **Formulate a workflow or plan** — Formulate a high-level plan (P8) — **21.4%**
- Select Strategy — Select among candidate strategies (P29) — 7.1%
- Modify Plan — Replan dynamically based on feedback (P34) — 7.1%

### Reasoning — *Cov. 50.0%*

- **Generating** — Generate candidate options (P4) — **28.6%**
- Analysing — Analyse artifact structure and behavior (P28) — 14.3%
- Explaining — Explain failure from user requirement (P16) — 3.6%
- Summarizing/Distilling — Summarize recent observations and trajectories — 0%
- Inferring — Infer structure from indirect evidence (P11) — 14.3%
- Comparing & Ranking — Compare values across sources (P2) — 3.6%
- Contextualizing — Configure agent persona or role-conditioning (P22) — 17.9%
- Combining — Combine information from multiple sources (P2) — 10.7%
- Filtering — Filter information by threshold (P2) — 3.6%

### Evaluating — *Cov. 28.6%*

- Evaluating with gold — Compare against gold reference (P29) — 7.1%
- Evaluating with goals/requirements/constraints — Domain-rule / best-practice check (P1) — 14.3%
- **Evaluating without ground truth** — Score on quality dimensions (P22) — **28.6%**

### Deciding — *Cov. 7.1%*

- Make a decision — Make a decision according to memory — 0%
- Pick scores — Select action by score (argmax/softmax/vote) — 0%
- Decide accept or not — Decline out-of-scope queries (P22) — 3.6%
- Decide under uncertainty — Fork trajectory at uncertainty (P4) — 3.6%

---

## 🟩 Act

### Grounding — *Cov. 35.7%*

- **Interact with users** — Accept instructions from humans (P3) — **21.4%**
- Interact with physical environments — Perceive physical environment (P34) — 7.1%
- Interact with digital environments — Navigate digital interfaces (P2) — 7.1%
- Interact with other agents — Send message to peer agent (P16) — 10.7%
- Augment with external computation — Invoke specialized computation tool (P16) — 10.7%

### Executing — *Cov. 17.9%*

- Executing plan — Execute strategy (P29) — 3.6%
- Executing debug — Adopt debugging instructions (P29) — 7.1%
- **Terminating** — Provide final answer (P32) — **10.7%**

---

## 🟪 Adapt

### Learning — *Cov. 14.3%*

- Learning reasoning — Update reasoning via prompt update — 0%
- Learning grounding — Update grounding via code-based skills — 0%
- **Learning knowledge** — Update semantic memory with knowledge (P29) — **10.7%**
- Learning LLM parameters — Update action parameters based on feedback (P1) — 3.6%
- Learning instructions — Infer instructions from input-output examples — 0%

### Reflection — *Cov. 28.6%*

- **Reflect on errors and failures** — Self-correct step implementation (P28) — **21.4%**
- Reflect on self-outcomes — Self-reflect on iterative outcomes (P32) — 10.7%
- Reflect on external feedback — Integrate evaluator feedback (P1) — 10.7%

---
