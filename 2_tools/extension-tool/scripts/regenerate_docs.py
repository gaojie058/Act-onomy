#!/usr/bin/env python3
"""
Regenerate Tier 2 derived markdown views from Tier 1 sources.

Inputs:
- act-onomy_codebook.csv  (Class/Action/Subaction/Instance + examples + papers + reviewers)
- act-onomy_taxonomy.csv  (definitions)
- table.tex               (paper-coverage values, parsed positionally)

Outputs:
- 1_data/2_taxonomy/taxonomy.md             (Github canonical)
- data-analysis/reports/codebook/taxonomy.md (data-analysis mirror)
- data-analysis/reports/codebook/codebook_v4.2.md (full leaf-level codebook)

The Github taxonomy.md and the data-analysis taxonomy.md are kept identical.

Run after editing the CSVs. Does NOT touch table.tex (paper coverage is a manual decision).
If a sub-action was added/removed in the CSV but not yet in table.tex, the script will
emit a warning and fall back to "—" coverage for that row.
"""

import csv
import re
import shutil
from collections import OrderedDict
from pathlib import Path

HOME = Path.home()
GH = HOME / 'Documents/Github/Act-onomy'
DA = HOME / 'Desktop/data-analysis'

CB_CSV     = GH / '1_data/2_taxonomy/act-onomy_codebook.csv'
TX_CSV     = GH / '1_data/2_taxonomy/act-onomy_taxonomy.csv'
TX_JSON    = GH / '1_data/2_taxonomy/act-onomy_taxonomy.json'
TEX        = DA / 'reports/codebook/table.tex'
OUT_TX_GH  = GH / '1_data/2_taxonomy/taxonomy.md'
OUT_TX_DA  = DA / 'reports/codebook/taxonomy.md'
OUT_CB_DA  = DA / 'reports/codebook/codebook_v4.2.md'

# Paper-aligned presentation clusters (arXiv:2605.13625v1 Figure 3). Used only for
# display grouping in taxonomy.md / codebook_v4.2.md. NOT a hierarchy level in the CSV.
ACTION_CLUSTER = {
    'Grounding':  ('External Interaction',   '🟦'),
    'Retrieval':  ('External Interaction',   '🟦'),
    'Reasoning':  ('Cognition & Execution',  '🟧'),
    'Planning':   ('Cognition & Execution',  '🟧'),
    'Evaluate':   ('Cognition & Execution',  '🟧'),
    'Deciding':   ('Cognition & Execution',  '🟧'),
    'Executing':  ('Cognition & Execution',  '🟧'),
    'Reflecting': ('Learning & Adaptation',  '🟪'),
    'Reflection': ('Learning & Adaptation',  '🟪'),  # legacy alias
    'Learning':   ('Learning & Adaptation',  '🟪'),
    'Memory':     ('Learning & Adaptation',  '🟪'),
}

# CSV → table.tex category-name overrides (e.g., CSV uses "Evaluate", tex uses "Evaluating")
CSV_TO_TEX_CAT = {'Evaluate': 'Evaluating'}

# ============ Load CSVs ============
codebook = list(csv.DictReader(open(CB_CSV)))
taxonomy = {r['code'].strip(): r for r in csv.DictReader(open(TX_CSV))}

hier = OrderedDict()
for r in codebook:
    act, sub = r['Action'].strip(), r['Subaction'].strip()
    code = r['taxonomy_code'].strip()
    leaf = dict(
        code=code,
        instance=r['Instance'].strip(),
        definition=taxonomy[code]['definition'].strip(),
        examples=r['examples_raw'].strip(),
        papers=r['papers_cited'].strip(),
        reviewers=r['human reviewers'].strip(),
    )
    hier.setdefault(act, OrderedDict()).setdefault(sub, []).append(leaf)

n_actions = len(hier)
n_subs    = sum(len(subs) for subs in hier.values())
n_leaves  = sum(len(l) for subs in hier.values() for l in subs.values())
print(f'CSV: {n_actions} actions / {n_subs} sub-actions / {n_leaves} leaves')

# NOTE: legacy table.tex parser removed — taxonomy.md is now hand-curated with
# paper-aligned frequencies (n=120 sentences from arXiv:2605.13625v1 Figure 2).

# Group actions by paper cluster for presentation
clustered = OrderedDict()  # cluster_name -> [(emoji, action_name, subs_dict)]
for act, subs in hier.items():
    cluster, emoji = ACTION_CLUSTER.get(act, ('(Uncategorised)', '⬜'))
    clustered.setdefault(cluster, {'emoji': emoji, 'actions': []})['actions'].append((act, subs))

# NOTE: taxonomy.md is now hand-curated for paper-aligned frequencies (n=120 sentences
# from arXiv:2605.13625v1 Figure 2). This script no longer regenerates taxonomy.md.
# Edit it manually when the paper's Figure 2 changes.

# ============ Emit codebook_v4.2.md (paper-grouped leaf-level codebook) ============
L = [
    '# Act-onomy Codebook · V4.2',
    '',
    'Full leaf-level codebook joining `act-onomy_codebook.csv` (raw examples + papers cited) and `act-onomy_taxonomy.csv` (definitions).  ',
    f'**{n_actions} actions · {n_subs} sub-actions · {n_leaves} leaf instances** · grouped by paper cluster (arXiv:2605.13625v1 Figure 3).',
    '',
    'Each leaf entry shows:',
    '- **Code** — `Tx.x.x.x` opaque taxonomy ID (stable across versions; the leading prefix is *not* semantic).',
    '- **Definition** — canonical short description (from `act-onomy_taxonomy.csv`)',
    '- **Examples** — raw example phrases recorded during annotation (from `act-onomy_codebook.csv`)',
    '- **Papers cited** — corpus papers in which this leaf was observed; `theory-driven` if no paper cited',
    '- **Reviewers** — annotators who endorsed the leaf',
    '',
    '---',
    '',
]
for cluster, info in clustered.items():
    L += [f'## {info["emoji"]} {cluster}', '']
    for act, subs in info['actions']:
        L += [f'### {act}', '']
        for sub, instances in subs.items():
            L += [f'#### Sub-action: {sub}', '']
            for inst in instances:
                L += [f'**`{inst["code"]}`  ·  {inst["instance"]}**', '']
                if inst['definition']:
                    L.append(f'- *Definition:* {inst["definition"]}')
                if inst['examples']:
                    ex_list = [e.strip().lstrip('"').rstrip('"') for e in inst['examples'].split('\n') if e.strip()]
                    if ex_list:
                        L.append('- *Examples:*')
                        for e in ex_list:
                            L.append(f'  - {e}')
                L.append(f'- *Papers cited:* {inst["papers"] or "—"}')
                if inst['reviewers']:
                    L.append(f'- *Reviewers:* {inst["reviewers"]}')
                L.append('')
        L.append('')
    L += ['---', '']

if OUT_CB_DA.parent.exists():
    OUT_CB_DA.write_text('\n'.join(L))
    print(f'✓ wrote {OUT_CB_DA.relative_to(HOME)}')
else:
    print(f'· skipped {OUT_CB_DA.relative_to(HOME)} (parent dir missing)')

# ============ Sync act-onomy_taxonomy.json summary ============
import json
tj = json.loads(TX_JSON.read_text())
old = {k: tj['summary'].get(k) for k in ('tier_1', 'tier_2', 'tier_3')}
new = {'tier_1': n_actions, 'tier_2': n_subs, 'tier_3': n_leaves}
if old != new:
    tj['summary'].update(new)
    TX_JSON.write_text(json.dumps(tj, indent=2, ensure_ascii=False))
    print(f'✓ updated {TX_JSON.relative_to(HOME)} summary: {old} → {new}')
else:
    print(f'· {TX_JSON.relative_to(HOME)} summary already up-to-date')
