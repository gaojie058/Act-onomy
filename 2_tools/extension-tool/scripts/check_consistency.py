#!/usr/bin/env python3
"""
Read-only consistency check for the Act-onomy codebook and its dependents.

Walks all 8 tiers documented in references/CODEBOOK_DEPENDENCIES.md and reports:
- Numeric mismatches (e.g., '42 sub-actions' vs '46')
- Legacy V1 names left in active artifacts
- Structural disagreement between Tier 1 sources (CSV ↔ JSON)
- Tier 4 skill-mirror divergence

Exit code 0 if clean, 1 if any errors found, 2 if only warnings.
"""

import csv
import json
import re
import sys
from collections import Counter
from pathlib import Path

HOME = Path.home()
GH = HOME / 'Documents/Github/Act-onomy'
DA = HOME / 'Desktop/data-analysis'
SKILL_RT = HOME / '.claude/skills/trace-qualitative-analyst'
SKILL_GH = GH / '2_tools/trace-qualitative-analyst'

CB_CSV    = GH / '1_data/2_taxonomy/act-onomy_codebook.csv'
TX_CSV    = GH / '1_data/2_taxonomy/act-onomy_taxonomy.csv'
TX_JSON   = GH / '1_data/2_taxonomy/act-onomy_taxonomy.json'
CB_JSON   = GH / '1_data/2_taxonomy/taxonomy_development/codebook_v4.2.json'

# Files known to mention the subaction count
COUNT_FILES = [
    GH / 'README.md',
    GH / '1_data/1_corpus/README.md',
    GH / '1_data/2_taxonomy/taxonomy.md',
    DA / 'reports/codebook/taxonomy.md',
    DA / 'reports/codebook/codebook_v4.2.md',
    DA / 'reports/codebook/table.tex',
    SKILL_RT / 'README.md',
    SKILL_RT / 'references/codebook.md',
    SKILL_GH / 'README.md',
    SKILL_GH / 'references/codebook.md',
]

# Legacy V1 retrieval names — flag if found in active artifacts
LEGACY_RETRIEVE_NAMES = [
    'Retrieve documents', 'Retrieve knowledge', 'Retrieve events',
    'Retrieve skills', 'Retrieve errors', 'Retrieve domain context',
    'Retrieve Domain Context',
]

# Files we skip when scanning for legacy names (frozen / out-of-scope)
LEGACY_SCAN_SKIP = [
    '1_data/1_corpus/behavioral_descriptions.csv',  # frozen historical record
    'taxonomy_development/',                         # versioned snapshots
    '.git/',
    '__pycache__/',
    # Frozen per-paper annotation outputs and stats (Tier 7)
    'reports/incorporated/',
    'reports/not_incorporated/',
    'reports/validation/',
    'reports/stats/',
    'trajectories/annotations/',
    # Stale visualizations (Tier 8 — flagged separately)
    'data-analysis/tex/',
    'data-analysis/variants/',
    'data-analysis/scripts/',
    # The dep manifest itself mentions legacy names as examples
    'CODEBOOK_DEPENDENCIES.md',
]

ERRORS, WARNINGS, INFOS = [], [], []
def err(msg):  ERRORS.append(msg);   print(f'  ❌ {msg}')
def warn(msg): WARNINGS.append(msg); print(f'  ⚠️  {msg}')
def info(msg): INFOS.append(msg);    print(f'  ℹ️  {msg}')
def ok(msg):                         print(f'  ✅ {msg}')

# ============ Tier 1: source-of-truth integrity ============
print('\n[Tier 1] Source-of-truth integrity')

cb_rows = list(csv.DictReader(open(CB_CSV)))
tx_rows = list(csv.DictReader(open(TX_CSV)))
tx_json = json.loads(TX_JSON.read_text())
cb_json = json.loads(CB_JSON.read_text())

cb_codes = {r['taxonomy_code'].strip() for r in cb_rows}
tx_codes = {r['code'].strip()          for r in tx_rows}

if cb_codes != tx_codes:
    err(f'codebook.csv and taxonomy.csv code sets disagree: '
        f'only-in-cb={cb_codes - tx_codes}; only-in-tx={tx_codes - cb_codes}')
else:
    ok(f'codebook.csv ↔ taxonomy.csv: {len(cb_codes)} codes match')

n_actions = len({r['Action'].strip() for r in cb_rows})
n_subs    = len({(r['Action'].strip(), r['Subaction'].strip()) for r in cb_rows})
n_leaves  = len(cb_rows)
print(f'     csv counts: {n_actions} actions / {n_subs} sub-actions / {n_leaves} leaves')

if tx_json['summary'].get('tier_2') != n_subs:
    err(f"taxonomy.json summary.tier_2 (sub-actions) = {tx_json['summary'].get('tier_2')}, csv has {n_subs}")
else:
    ok('taxonomy.json summary.tier_2 (sub-actions) matches csv')

cbj_summary = cb_json['summary']
if cbj_summary['n_sub_categories'] != n_subs:
    err(f"codebook_v4.2.json n_sub_categories = {cbj_summary['n_sub_categories']}, csv has {n_subs}")
elif cbj_summary['n_leaves'] != n_leaves:
    err(f"codebook_v4.2.json n_leaves = {cbj_summary['n_leaves']}, csv has {n_leaves}")
else:
    ok('codebook_v4.2.json summary matches csv')

CANONICAL_SUBS = n_subs   # the number every dependent should agree on

# ============ Tier 5 + everywhere: numeric count consistency ============
print(f'\n[Tier 2-5] Subaction-count consistency (canonical = {CANONICAL_SUBS})')

# Match patterns like "46 sub-actions", "× 46 Subactions", "→ 46 Subactions",
# "and 46 sub-actions", "(N=46)" in count contexts.
COUNT_PAT = re.compile(r'\b(\d{2,3})\s+(?:[Ss]ub-?actions?|Subactions)\b')

for f in COUNT_FILES:
    if not f.exists():
        warn(f'{f}: file missing (skipping count check)')
        continue
    text = f.read_text()
    found = COUNT_PAT.findall(text)
    if not found:
        info(f'{f.relative_to(HOME)}: no count phrase found')
        continue
    counts = Counter(found)
    bad = [c for c in counts if int(c) != CANONICAL_SUBS]
    if bad:
        for line_no, line in enumerate(text.splitlines(), 1):
            for c in bad:
                if re.search(rf'\b{c}\s+(?:[Ss]ub-?actions?|Subactions)\b', line):
                    err(f'{f.relative_to(HOME)}:{line_no}: stale count "{c}" (expected {CANONICAL_SUBS})')
    else:
        ok(f'{f.relative_to(HOME)}: count = {CANONICAL_SUBS}')

# ============ Tier 4: skill mirror sync ============
print('\n[Tier 4] trace-qualitative-analyst mirror sync')

if not SKILL_RT.exists() or not SKILL_GH.exists():
    err('one or both skill copies missing')
else:
    import subprocess
    diff_proc = subprocess.run(['diff', '-r', str(SKILL_RT), str(SKILL_GH)],
                               capture_output=True, text=True)
    if diff_proc.returncode == 0:
        ok('runtime ↔ github copies in sync')
    else:
        err('runtime ↔ github copies diverged:')
        for line in diff_proc.stdout.strip().splitlines()[:10]:
            print(f'      {line}')

# ============ Tier 4: example JSON subgroup validity ============
print('\n[Tier 4] example_pylint_5859.json subgroup validity')

example_json = SKILL_RT / 'assets/example_pylint_5859.json'
if example_json.exists():
    ex = json.loads(example_json.read_text())
    canonical_subs = {(r['Action'].strip(), r['Subaction'].strip()) for r in cb_rows}
    bad_pairs = []
    for t in ex.get('turns', []):
        for q in t.get('quotes', []):
            grp, sub = q.get('grp'), q.get('sub')
            if (grp, sub) not in canonical_subs:
                bad_pairs.append((t['n'], grp, sub))
    if bad_pairs:
        for tn, g, s in bad_pairs:
            err(f'example T{tn:02d}: ({g}, {s}) not in V4.2 canonical subactions')
    else:
        n = sum(len(t.get('quotes', [])) for t in ex.get('turns', []))
        ok(f'example: {n} quotes — all (grp, sub) pairs valid')

# ============ Tier 6 + 8: legacy V1 names in active artifacts ============
print('\n[Tier 6-8] Legacy V1 names in active artifacts (info only)')

import os
hits = []
for root in (GH, DA):
    for dirpath, dirnames, filenames in os.walk(root):
        # prune skipped dirs
        rel = str(Path(dirpath).relative_to(root))
        if any(skip in dirpath + '/' for skip in LEGACY_SCAN_SKIP):
            continue
        dirnames[:] = [d for d in dirnames if not any(s in d for s in LEGACY_SCAN_SKIP)]
        for fn in filenames:
            if not fn.endswith(('.md', '.tex', '.json', '.py')):
                continue
            p = Path(dirpath) / fn
            try:
                text = p.read_text()
            except Exception:
                continue
            for name in LEGACY_RETRIEVE_NAMES:
                if name in text:
                    hits.append((p.relative_to(HOME), name))

if hits:
    by_file = {}
    for p, n in hits:
        by_file.setdefault(str(p), []).append(n)
    for f, names in sorted(by_file.items()):
        info(f'{f}: legacy name(s) {sorted(set(names))}')
else:
    ok('no legacy V1 retrieval names in active artifacts')

# ============ Summary ============
print('\n' + '='*60)
print(f'  errors:   {len(ERRORS)}')
print(f'  warnings: {len(WARNINGS)}')
print(f'  info:     {len(INFOS)}')
print('='*60)

if ERRORS:
    sys.exit(1)
if WARNINGS:
    sys.exit(2)
sys.exit(0)
