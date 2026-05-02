# Diagnostics Reference

Read this during F2's mapping phase.

This file contains worked examples of the mapping outcomes and the codebook-level diagnostic patterns to look for. Examples are drawn from a real iteration session on an agent-behavior taxonomy.

## Mapping outcomes (per F1 behavior)

Each F1 behavior falls into exactly one of four buckets. The distribution across buckets tells you where the codebook's problems are.

### Clean fit

The F1 behavior maps unambiguously to exactly one codebook entry. The verb-noun pair is essentially equivalent; the paper's action and the codebook's plain explanation align.

**Example.** F1 sub-behavior: `Summarize Dataset`. Paper quote: "the Planner first inspects a summary of the dataset, ψ(D), to ground its strategy." Codebook entry: `Summarize recent observations, trajectories — Condense a flood of recent information into a few key takeaways.` Clean fit.

### Forced fit

No entry fits naturally, but one is closest. Record which entry, and one sentence on why the fit isn't clean. Forced fits are the strongest signal for ADD or SPLIT revisions.

**Example.** F1 sub-behavior: `Select Tool`. Paper quote: "Tool Selector queries the available toolset to identify the most appropriate tools." Closest codebook entry: `Propose action candidates`. Why not clean: proposing candidates usually means brainstorming N options; tool selection from a registry is a different act. If several forced fits land on the same entry, that's a split signal.

### No fit

Genuinely absent. No codebook entry is even close. These are ADD or NEW CATEGORY candidates.

**Example.** F1 sub-behavior: `Discard Memory`. Paper quote: "the local memory is discarded upon successful completion of the subtask." A codebook with only store-style memory actions has no entry for deliberate forgetting. No fit.

**Example.** F1 sub-behavior: `Anonymize Input`. Paper quote: "all algorithm identifiers are masked before evaluation." A codebook focused on propose/evaluate/select has no entry for anti-bias preprocessing. No fit.

### Multi-fit

The F1 behavior could reasonably map to two or more entries. This is a signal of an unclear **boundary** between those entries, not (usually) a signal that the F1 behavior itself should be split.

**Example.** F1 sub-behavior: `Apply Constraint`. Paper quote: "codified best-practices, such as the standard order of operations (e.g., QC must precede normalization)." Could map to `Retrieve knowledge from semantic memory` OR `Apply constraint / domain rule`. If the codebook has both entries, multi-fit is fine — pick the one that matches the usage in the paper. If the codebook has only retrieval, the action is a forced fit and signals a missing "apply" entry.

The fix for chronic multi-fit across many behaviors: rename adjacent entries to tighten boundaries, or split an overloaded entry.

## Codebook-level diagnostics

After tabulating per-behavior mappings, step back and look at the codebook as a whole.

### Unused entries

Codebook entries that no F1 behavior hit.

- **One unused entry, single paper**: normal. Codebooks should generalize beyond any single paper. Leave it alone — do NOT propose removal.
- **Unused across multiple tested papers of different agent types**: REMOVE candidate. But first check whether the entry captures something theoretically important but rare (e.g., `Build semantic map via VLM` is rare outside embodied agents). If so, keep it.
- **Unused AND semantically redundant with another entry**: MERGE candidate.

### Overloaded entries

Entries that F1 behaviors mapped to many times, and the hits are heterogeneous.

For example, if `Evaluate actions via heuristics, LLM, or learned values` absorbs behaviors like LLM-as-judge scoring, quantitative metric application, and majority voting all at once, it's doing too many jobs. SPLIT candidate.

**Good split criterion**: the child entries should make an observable difference between agents. If `Evaluate via LLM-judge` vs `Evaluate via quantitative metric` lets you say "Agent A uses the first, Agent B uses both", the split carries information. If the split doesn't produce differentiable coding across agents, it's cosmetic — don't propose it.

### Adjacent-but-distinct

Two entries conceptually close enough to generate repeated multi-fits. RENAME/RESCOPE candidate — tighten the plain-English explanations so boundaries are clear.

**Example.** `Retrieve knowledge from semantic memory` and `Apply constraint` are adjacent (both involve domain rules) but distinct (retrieval vs application). If the codebook only has the first, rule-application behaviors get forced into retrieval. Fix: add the second entry with an explicit note that retrieval and application are different acts.

## Clean-fit rate: what it tells you

After the full mapping, compute: `clean_fits / total_F1_behaviors`.

- **>95%** — either codebook is well-calibrated for this paper type, or you're being too charitable with "clean fit". Spot-check a few to make sure they're really clean.
- **75–95%** — healthy iteration zone. A handful of genuine gaps. Typical range.
- **50–75%** — substantial coverage issues. Expect multiple ADDs and likely one SPLIT or NEW CATEGORY.
- **<50%** — either the codebook is wrong for this class of paper, or the paper is from a substantially different agent regime than the codebook was designed for. Flag to the user: the right move may be a forked codebook rather than a revised one.

Single-paper rates are noisy. Multi-paper iteration averages this out. Always report the rate in F2's conclusion.

## What F2 §1 (Mapping Table) must contain

One row per F1 behavior, with columns:

- `#` — F1 behavior index
- `F1 Sub-behavior` — Verb + Noun label from F1
- `F1 Source Text` — verbatim quote from the paper
- `Mapping Outcome` — one of {clean, forced, no-fit, multi-fit}
- `Best-fit codebook entry` — closest match, or "—" if no-fit
- `Notes` — for forced/multi fits, one sentence on why it doesn't fit cleanly

This table is long but essential — it is the evidence base for every F2 §3 proposal.
