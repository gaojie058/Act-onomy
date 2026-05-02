# Contributing to Act-onomy

Act-onomy is intended to be a living artifact: as new agent designs appear, the codebook should grow rather than fork. This document specifies how to propose an extension.

> **Note.** During NeurIPS 2026 double-blind review, this repository is private and contributions are paused. The protocol below describes how the open release will accept contributions.

## When to add a sub-action vs. a new top-level category

Following the deductive coding procedure described in the paper:

- **Add a new sub-action** when the observed behavior is functionally an instance of an existing top-level category but its surface form is not yet covered (e.g., `Annotate UI components` was added under **Grounding** after encountering P28).
- **Add a new top-level category** only when the behavior fails the boundary tests in §3.1 of the paper against *all* existing categories. This is a much higher bar that, in our 30-paper corpus, was met during construction but not during validation. Top-level categories define the analytic vocabulary, so churning them weakens cross-paper comparability.

## Proposal template

Open an issue (or a pull request against `codebook.md`) including:

1. **Behavior sentence.** A verbatim quote from the source paper or trajectory that exhibits the behavior.
2. **Source.** Paper citation, agent name, or trajectory file (with line/turn reference).
3. **Target placement.** One of:
   - existing sub-action (specify which);
   - new sub-action under an existing category (specify which);
   - new top-level category (rare; see above).
4. **Boundary argument.** Why does the behavior not fit the closest existing code? Reference the boundary tests in §3.1 of the paper.
5. **(Optional) Example labeling.** A short trajectory turn or sentence labeled with the proposed code, plus a 1-sentence justification.

## Versioning

Approved extensions are merged into a versioned codebook `vX.Y`:

- **`X` (major)** is incremented for any change at the **top-level category** layer (add / rename / merge / split).
- **`Y` (minor)** is incremented for any change at the **sub-action** or **specialization** layer.

The latest version always lives at `codebook.md`. Frozen snapshots are kept at `codebook.vX.Y.md` so analyses remain reproducible against a fixed version. The changelog ([`CHANGELOG.md`](CHANGELOG.md)) records every release with its diff against the previous version.

## Review

Each proposal is reviewed against:

- **Faithfulness.** The quoted sentence appears verbatim in the cited source.
- **Boundary clarity.** The proposed code does not collapse a distinction maintained elsewhere in the codebook.
- **Generality.** The code captures a recurring pattern, not a one-off domain detail (domain-specific specializations are welcome under existing sub-actions, but a new sub-action requires evidence from at least two independent sources).

Reviews are conducted publicly in the issue / PR thread. Approved changes are merged by a maintainer and reflected in `CHANGELOG.md` and the next versioned snapshot.
