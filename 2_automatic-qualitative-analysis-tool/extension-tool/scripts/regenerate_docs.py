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

CLASS_EMOJI = {'Sense': '🟦', 'Think': '🟧', 'Act': '🟩', 'Adapt': '🟪'}

# CSV → table.tex category-name overrides (e.g., CSV uses "Evaluate", tex uses "Evaluating")
CSV_TO_TEX_CAT = {'Evaluate': 'Evaluating'}

# ============ Load CSVs ============
codebook = list(csv.DictReader(open(CB_CSV)))
taxonomy = {r['code'].strip(): r for r in csv.DictReader(open(TX_CSV))}

hier = OrderedDict()
for r in codebook:
    cls, act, sub = r['Class'].strip(), r['Action'].strip(), r['Subaction'].strip()
    code = r['taxonomy_code'].strip()
    leaf = dict(
        code=code,
        instance=r['Instance'].strip(),
        definition=taxonomy[code]['definition'].strip(),
        examples=r['examples_raw'].strip(),
        papers=r['papers_cited'].strip(),
        reviewers=r['human reviewers'].strip(),
    )
    hier.setdefault(cls, OrderedDict()).setdefault(act, OrderedDict()).setdefault(sub, []).append(leaf)

n_classes = len(hier)
n_cats    = sum(len(v) for v in hier.values())
n_subs    = sum(len(s) for v in hier.values() for s in v.values())
n_leaves  = sum(len(l) for v in hier.values() for s in v.values() for l in s.values())
print(f'CSV: {n_classes} classes / {n_cats} categories / {n_subs} sub-actions / {n_leaves} leaves')

# ============ Parse table.tex for paper-coverage by category ============
tex_text = TEX.read_text()
cat_rows = OrderedDict()  # category_label -> [{name, example, cov, bold}]
cat_cov  = {}
buffer = []
current_cat = None

for raw in tex_text.splitlines():
    line = raw.strip()
    if not line.startswith('&') or '\\\\' not in line:
        continue
    safe = line.replace(r'\&', '\x00')
    cells = [c.replace('\x00', r'\&').strip() for c in safe.split('&')]
    if len(cells) < 5:
        continue
    sub_cell = cells[2]
    ex_cell  = cells[3]
    cov_raw  = cells[4]
    is_bold  = '\\textbf' in cov_raw
    cov = re.sub(r'\\textbf\{([^}]*)\}', r'\1', cov_raw).replace('\\%', '%').replace('\\\\', '').strip()

    cat_match = re.search(r'\\catlabel\{\d+\}\{([^}]+)\}\{([^}]+)\}', cells[1])
    if cat_match:
        current_cat = cat_match.group(1).strip()
        cat_cov[current_cat] = cat_match.group(2).strip().replace('\\%', '%')
        buffer.append(dict(name=sub_cell, example=ex_cell, cov=cov, bold=is_bold))
        cat_rows[current_cat] = buffer
        buffer = []
        current_cat = None
    else:
        buffer.append(dict(name=sub_cell, example=ex_cell, cov=cov, bold=is_bold))

# ============ Emit Tier 2 taxonomy.md ============
L = []
L += [
    '# Act-onomy Taxonomy',
    '',
    f'**v1.0** · derived from `act-onomy_codebook.csv` (V4.2)  ',
    f'**{n_classes} classes · {n_cats} categories · {n_subs} sub-actions · {n_leaves} leaf instances**',
    '',
    '## How to read this table',
    '',
    '- **Coverage (Cov.)** = paper coverage over the **28-paper construction set**. The 7 held-out validation papers (P5, P10, P15, P20, P25, P30, P35) are excluded from the count.',
    '- Each cited paper contributes ≈3.6 percentage points (1/28).',
    '- The italic figure under each category gives the **same metric at the category level** (any sub-action cited counts the paper once).',
    '- "0%" marks sub-actions defined in the codebook but not cited by any construction paper (theory-driven retainers).',
    '- **Bold** marks the unique most-frequent sub-action within a category; ties are left unbolded.',
    '- Representative verb-noun examples are anchored to a corpus paper (P*) where available.',
    '',
    '---',
    '',
]

for cls, cats in hier.items():
    L += [f'## {CLASS_EMOJI[cls]} {cls}', '']
    for cat, subs in cats.items():
        tex_cat = CSV_TO_TEX_CAT.get(cat, cat)
        cov = cat_cov.get(tex_cat, '?')
        L += [f'### {tex_cat} — *Cov. {cov}*', '']
        tex_rs = cat_rows.get(tex_cat, [])
        if len(tex_rs) != len(subs):
            print(f'  ⚠️  table.tex mismatch in {cat}: csv has {len(subs)} subs, tex has {len(tex_rs)}')
        for csv_sub, tex_row in zip(subs.keys(), tex_rs):
            label = csv_sub
            if tex_row['bold']:
                L.append(f'- **{label}** — {tex_row["example"]} — **{tex_row["cov"]}**')
            else:
                L.append(f'- {label} — {tex_row["example"]} — {tex_row["cov"]}')
        # Pad with em-dash rows if csv has more subs than tex (new sub-action not yet in paper)
        for csv_sub in list(subs.keys())[len(tex_rs):]:
            L.append(f'- {csv_sub} — *(coverage pending — add row to table.tex)* — —')
        L.append('')
    L += ['---', '']

OUT_TX_GH.write_text('\n'.join(L))
shutil.copy(OUT_TX_GH, OUT_TX_DA)
print(f'✓ wrote {OUT_TX_GH.relative_to(HOME)}')
print(f'✓ wrote {OUT_TX_DA.relative_to(HOME)} (copy)')

# ============ Emit codebook_v4.2.md ============
L = [
    '# Act-onomy Codebook · V4.2',
    '',
    'Full leaf-level codebook joining `act-onomy_codebook.csv` (raw examples + papers cited) and `act-onomy_taxonomy.csv` (definitions).  ',
    f'**{n_classes} classes · {n_cats} categories · {n_subs} sub-actions · {n_leaves} leaf instances**',
    '',
    'Each leaf entry shows:',
    '- **Code** — `Tx.x.x.x` taxonomy address (Class.Category.Subaction.Instance)',
    '- **Definition** — canonical short description (from `act-onomy_taxonomy.csv`)',
    '- **Examples** — raw example phrases recorded during annotation (from `act-onomy_codebook.csv`)',
    '- **Papers cited** — corpus papers in which this leaf was observed; `theory-driven` if no paper cited',
    '- **Reviewers** — annotators who endorsed the leaf',
    '',
    '---',
    '',
]
for cls, cats in hier.items():
    L += [f'## {CLASS_EMOJI[cls]} {cls}', '']
    for cat, subs in cats.items():
        tex_cat = CSV_TO_TEX_CAT.get(cat, cat)
        L += [f'### {tex_cat}', '']
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

OUT_CB_DA.write_text('\n'.join(L))
print(f'✓ wrote {OUT_CB_DA.relative_to(HOME)}')

# ============ Sync act-onomy_taxonomy.json summary ============
import json
tj = json.loads(TX_JSON.read_text())
old = {k: tj['summary'][k] for k in ('tier_1', 'tier_2', 'tier_3', 'tier_4')}
new = {'tier_1': n_classes, 'tier_2': n_cats, 'tier_3': n_subs, 'tier_4': n_leaves}
if old != new:
    tj['summary'].update(new)
    TX_JSON.write_text(json.dumps(tj, indent=2, ensure_ascii=False))
    print(f'✓ updated {TX_JSON.relative_to(HOME)} summary: {old} → {new}')
else:
    print(f'· {TX_JSON.relative_to(HOME)} summary already up-to-date')
