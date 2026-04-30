# Skill

This directory hosts the AgentAction Claude Skill — a prompt-driven implementation of the operational layer that consumes the codebook plus a normalized trajectory and emits an HTML report with quote-grounded action labels.

- [`prompt.md`](prompt.md) — Skill prompt template (input/output contract; full template to be released with the camera-ready paper).
- [`report_template.html`](report_template.html) — HTML output template; placeholder pending camera-ready release.

The Skill is reference implementation of the operational layer. Alternative implementations (other LLMs, other output formats) are compatible with the rest of AgentAction as long as they consume the same `codebook.md` and produce labels drawn from its enumerated categories and sub-actions.
