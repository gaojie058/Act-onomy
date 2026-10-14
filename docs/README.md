# Act-onomy project website

GitHub Pages publishes this directory from the repository's `main` branch:
https://gaojie058.github.io/Act-onomy/

## Edit or preview

The site is static HTML, CSS, and JavaScript; no build step is required.

- `index.html`: paper introduction, resources, and citation.
- `browse.html`: taxonomy and three annotated trajectory examples.
- `academic.css`: page theme and responsive layouts.
- `styles.css`: shared interactive component layouts.
- `app.js`: taxonomy search and trace/annotation interactions.
- `data.js`: embedded taxonomy, codebook, and trace data.
- `downloads/` and `reports/`: original research artifacts and supplied reports.

From the repository root:

```sh
python3 -m http.server 4173 --bind 127.0.0.1 --directory docs
```

Open http://127.0.0.1:4173/. Directly opening `index.html` also works.
After pushing changes to `main`, GitHub Pages republishes `docs/` automatically.
Keep `.nojekyll` so the static files are served without Jekyll processing.

## Sources

The released taxonomy contains 10 actions, 46 subactions, and 120 leaf categories.
The two SWE-agent reports come from `3_case_studies/case2_swe_agent_two_traces/`.
The SWE-chat example `c621c551` is a supplied Claude Code report with 43 agent
turns, 6 human inputs, and 113 quote annotations. It retains the supplied
annotations, outcome, and original report. The explorer separates human inputs
from agent labels and highlights the source field specified by each quote.
The report is an additional example, not a new controlled experiment.
Source hashes are recorded in `downloads/source-manifest.json`.

The original NeurIPS logo is from https://neurips.cc/public/MediaKit
(asset: https://neurips.cc/media/Press/NeurIPS_logo.svg).
Codebook and code licenses are included under `downloads/`; third-party assets
and the supplied report retain their original attribution.
