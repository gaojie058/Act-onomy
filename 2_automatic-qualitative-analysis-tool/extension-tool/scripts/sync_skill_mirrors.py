#!/usr/bin/env python3
"""
Mirror the trace-analysis-judge skill between the Claude Code runtime location
and the Github source-of-truth copy.

Direction: runtime (`.claude/skills/`) → github copy.
Reason: edits land in the runtime first (because that's what the user reaches via
their IDE / Skill commands); the Github copy is for version control and review.

If you intend the Github copy to be authoritative for a given edit, swap SRC/DST
manually before running, or pass --reverse.
"""

import argparse
import shutil
import subprocess
import sys
from pathlib import Path

HOME = Path.home()
RT  = HOME / '.claude/skills/trace-analysis-judge'
GH  = HOME / 'Documents/Github/Act-onomy/2_automatic-qualitative-analysis-tool/trace-analysis-judge'

# Files that get mirrored. (Other files like __pycache__, .DS_Store are skipped.)
MIRROR_FILES = [
    'SKILL.md',
    'README.md',
    'references/codebook.md',
    'assets/example_pylint_5859.json',
    'assets/template.html',
    'scripts/parse_trajectory.py',
    'scripts/render_artifact.py',
]

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--reverse', action='store_true',
                    help='Mirror github → runtime instead (default: runtime → github)')
    ap.add_argument('--dry-run', action='store_true', help='Print actions without writing')
    args = ap.parse_args()

    src, dst = (GH, RT) if args.reverse else (RT, GH)
    print(f'mirroring {src} → {dst}\n')

    if not src.exists():
        print(f'❌ source missing: {src}')
        sys.exit(1)
    if not dst.exists():
        print(f'❌ destination missing: {dst}')
        sys.exit(1)

    copied = []
    for rel in MIRROR_FILES:
        s = src / rel
        d = dst / rel
        if not s.exists():
            print(f'  ⚠️  skip (source missing): {rel}')
            continue
        if d.exists():
            try:
                if s.read_bytes() == d.read_bytes():
                    print(f'  · in-sync: {rel}')
                    continue
            except Exception:
                pass
        if args.dry_run:
            print(f'  [dry-run] would copy: {rel}')
            continue
        d.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy(s, d)
        copied.append(rel)
        print(f'  ✓ copied: {rel}')

    if not copied and not args.dry_run:
        print('\nnothing to do — already in sync')

    # Final diff -r for full verification
    print('\nverifying full directory parity (diff -r)…')
    diff = subprocess.run(['diff', '-r', str(src), str(dst)], capture_output=True, text=True)
    if diff.returncode == 0:
        print('  ✅ runtime ↔ github fully in sync')
        sys.exit(0)
    else:
        print('  ⚠️  diff -r reports differences (may be untracked files; review manually):')
        for line in diff.stdout.strip().splitlines()[:20]:
            print(f'      {line}')
        sys.exit(2)

if __name__ == '__main__':
    main()
