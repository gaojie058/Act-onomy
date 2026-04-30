# Changelog

All notable changes to the AgentAction codebook are recorded here. Versioning follows `vX.Y`:

- `X` (major) — top-level category change (add / rename / merge / split)
- `Y` (minor) — sub-action or specialization change

The latest codebook always lives at [`codebook.md`](codebook.md). Frozen snapshots are kept at `codebook.vX.Y.md`.

## v1.0 — initial release

Initial codebook accompanying the NeurIPS 2026 submission.

**Top-level categories (11):**
Grounding, Planning, Reasoning, Retrieval, Memory, Generating, Evaluating, Deciding, Executing, Reflecting, Learning.

**Construction.** Phase 1 deductive coding against CoALA on a corpus of 30 peer-reviewed agent papers (NeurIPS / ICML / ICLR / ACL Anthology, 2024–2026), with LLM-assisted candidate generation under five-author human verification. See the paper's Section 2 for the full method.

**Validation.** Human–human Cohen's κ on author-written behavior sentences: 0.53 (top-level), 0.48 (sub-action). Human–LLM-judge κ on held-out trajectories falls in the same range.

**Snapshot.** Frozen at [`codebook.v1.0.md`](codebook.v1.0.md).

**Skill alignment (post-initial-release).** The Skill's reference codebook at [`skill/references/codebook.md`](skill/references/codebook.md) and the rendering pipeline (template, palette, example trajectory) were updated in-tree to match the v1.0 vocabulary:

- added `Generating` (amber `#c08030`) and `Learning` (wine `#8a3a4a`) as new top-level groups;
- renamed `Reflection` → `Reflecting` and `DecisionMaking` → `Deciding` across the Skill prompt, render script, HTML template, CSS, and worked example;
- moved the previously-misclassified `Generating` subgroup out from under `Reasoning` and into the new top-level `Generating` group, with subgroup `Generate` (matching the paper).
