#!/usr/bin/env node
/**
 * build_f3_codebook_docx.js — F3: Refined Codebook (V+1)
 *
 * Usage: node build_f3_codebook_docx.js <spec.json> <output.docx>
 *
 * Produces the next-version codebook as a docx:
 *   Cover (title with V+1, subtitle, anchor)
 *   Changelog (bulleted revisions summary)
 *   Legend (🆕 / ↻ / unchanged markers)
 *   Categories (one section each, 3-column table Action | Explanation | Evidence)
 *   Appendix A · Crosswalk (previous-version entry → V+1 treatment)
 *   Appendix B · Category Summary (action counts per category)
 */

const fs = require('fs');
const U = require('./docx_utils.js');
const {
  HeadingLevel, AlignmentType, Table, TableRow, TableCell, WidthType, Paragraph, TextRun,
  ShadingType,
  BORDERS, CELL_MARGINS, HEADER_SHADING, NEW_SHADING, REFINED_SHADING, PAGE_CONTENT_WIDTH,
  p, heading, cellText, cellMulti, hcell, bodyCell, quoteCell, buildDoc, writeDoc, hr
} = U;

const [specPath, outputPath] = process.argv.slice(2);
if (!specPath || !outputPath) {
  console.error('Usage: node build_f3_codebook_docx.js <spec.json> <output.docx>');
  process.exit(1);
}
const spec = JSON.parse(fs.readFileSync(specPath, 'utf8'));

// Column widths for the main 3-column tables (Action | Explanation | Evidence)
const COL_ACTION   = 3000;
const COL_EXPLAIN  = 3900;
const COL_EVIDENCE = PAGE_CONTENT_WIDTH - COL_ACTION - COL_EXPLAIN;

function makeRow(entry) {
  const kind = entry.kind; // "new" | "refined" | null/undefined
  const shading = kind === "new" ? NEW_SHADING : kind === "refined" ? REFINED_SHADING : undefined;
  const prefixRun = kind === "new"     ? [{ text: "🆕 ", bold: true, color: "C2410C" }] :
                    kind === "refined" ? [{ text: "↻ ",  bold: true, color: "B45309" }] :
                                         [];
  const actionRuns = [...prefixRun, { text: entry.action, bold: true }];

  return new TableRow({ children: [
    bodyCell(cellMulti(actionRuns), COL_ACTION, shading),
    bodyCell(cellText(entry.explanation), COL_EXPLAIN, shading),
    quoteCell(entry.evidence, COL_EVIDENCE, shading),
  ]});
}

function makeActionTable(entries, columnNames) {
  const header = new TableRow({
    tableHeader: true,
    children: [
      hcell(columnNames[0], COL_ACTION),
      hcell(columnNames[1], COL_EXPLAIN),
      hcell(columnNames[2], COL_EVIDENCE),
    ]
  });
  return new Table({
    width: { size: PAGE_CONTENT_WIDTH, type: WidthType.DXA },
    columnWidths: [COL_ACTION, COL_EXPLAIN, COL_EVIDENCE],
    rows: [header, ...entries.map(makeRow)]
  });
}

// -------- assemble --------
const children = [];

// --- Cover ---
children.push(new Paragraph({
  spacing: { before: 0, after: 120, line: 300 },
  children: [new TextRun({ text: spec.title, bold: true, size: 40, font: "Calibri" })]
}));
if (spec.subtitle) {
  children.push(new Paragraph({
    spacing: { before: 0, after: 60 },
    children: [new TextRun({ text: spec.subtitle, italics: true, size: 22, color: "4B4B4B", font: "Calibri" })]
  }));
}
if (spec.anchor) {
  children.push(new Paragraph({
    spacing: { before: 0, after: 240 },
    children: [new TextRun({ text: spec.anchor, size: 20, color: "6B7280", font: "Calibri" })]
  }));
}
children.push(hr());

// --- Changelog ---
if (spec.changelog && spec.changelog.length) {
  children.push(heading(spec.changelog_heading || "Changelog", HeadingLevel.HEADING_1));
  if (spec.changelog_intro) children.push(p(spec.changelog_intro));
  spec.changelog.forEach(entry => {
    children.push(new Paragraph({
      numbering: { reference: "bullets", level: 0 },
      spacing: { before: 40, after: 40, line: 300 },
      children: [
        new TextRun({ text: entry.title, bold: true, size: 22, font: "Calibri" }),
        new TextRun({ text: " " + (entry.body || ""), size: 22, font: "Calibri" })
      ]
    }));
  });
}

// --- Legend ---
if (spec.legend) {
  children.push(heading("Legend", HeadingLevel.HEADING_2));
  const legendRows = [
    ["🆕 New", NEW_SHADING, spec.legend.new || "New entry added in this version."],
    ["↻ Refined", REFINED_SHADING, spec.legend.refined || "Entry refined (split, renamed, or rescoped) in this version."],
    ["(no marker)", null, spec.legend.unchanged || "Entry unchanged from the previous version."],
  ];
  children.push(new Table({
    width: { size: PAGE_CONTENT_WIDTH, type: WidthType.DXA },
    columnWidths: [1400, PAGE_CONTENT_WIDTH - 1400],
    rows: legendRows.map(([label, shading, text]) => new TableRow({ children: [
      bodyCell(cellText(label, { bold: true }), 1400, shading),
      bodyCell(cellText(text), PAGE_CONTENT_WIDTH - 1400),
    ]}))
  }));
  children.push(p("", { after: 120 }));
  if (spec.evidence_note) {
    children.push(p(spec.evidence_note, { italics: true, size: 20, color: "6B7280" }));
  }
}

// --- Categories ---
const columnNames = spec.column_names || ["Action (Verb + Noun)", "Plain Explanation", "Evidence"];
(spec.categories || []).forEach((cat, i) => {
  const idx = i + 1;
  const title = cat.is_new ? `${idx}. ${cat.name}  🆕 (new category)` : `${idx}. ${cat.name}`;
  children.push(heading(title, HeadingLevel.HEADING_1));
  if (cat.intro) children.push(p(cat.intro));
  children.push(makeActionTable(cat.entries || [], columnNames));
});

// --- Appendix A · Crosswalk ---
if (spec.crosswalk && spec.crosswalk.length) {
  children.push(heading("Appendix A · Version Crosswalk", HeadingLevel.HEADING_1));
  if (spec.crosswalk_intro) children.push(p(spec.crosswalk_intro));
  const cwWidths = [3600, PAGE_CONTENT_WIDTH - 3600 - 760, 760];
  const cwRows = [
    new TableRow({
      tableHeader: true,
      children: [hcell("Previous entry", cwWidths[0]), hcell("Treatment in this version", cwWidths[1]), hcell("Kind", cwWidths[2])]
    }),
    ...spec.crosswalk.map(row => {
      const shading = row.kind === "new" ? NEW_SHADING : row.kind === "refined" ? REFINED_SHADING : undefined;
      const marker = row.kind === "new" ? "🆕" : row.kind === "refined" ? "↻" : "—";
      return new TableRow({ children: [
        bodyCell(cellText(row.previous, { bold: true }), cwWidths[0], shading),
        bodyCell(cellText(row.treatment), cwWidths[1], shading),
        bodyCell(cellText(marker, { bold: true, align: AlignmentType.CENTER }), cwWidths[2], shading),
      ]});
    })
  ];
  children.push(new Table({
    width: { size: PAGE_CONTENT_WIDTH, type: WidthType.DXA },
    columnWidths: cwWidths,
    rows: cwRows
  }));
}

// --- Appendix B · Category Summary ---
if (spec.summary && spec.summary.length) {
  children.push(heading("Appendix B · Category Summary", HeadingLevel.HEADING_1));
  if (spec.summary_intro) children.push(p(spec.summary_intro));
  const sWidths = [2400, 1800, PAGE_CONTENT_WIDTH - 2400 - 1800];
  const sRows = [
    new TableRow({
      tableHeader: true,
      children: [hcell("Category", sWidths[0]), hcell("Action count", sWidths[1]), hcell("Notes", sWidths[2])]
    }),
    ...spec.summary.map(row => new TableRow({ children: [
      bodyCell(cellText(row.category, { bold: true }), sWidths[0]),
      bodyCell(cellText(row.count), sWidths[1]),
      bodyCell(cellText(row.notes), sWidths[2]),
    ]}))
  ];
  children.push(new Table({
    width: { size: PAGE_CONTENT_WIDTH, type: WidthType.DXA },
    columnWidths: sWidths,
    rows: sRows
  }));
}

children.push(p("", { after: 240 }));
children.push(p(spec.closing_line || `End of ${spec.title}.`, { italics: true, size: 20, color: "6B7280" }));

// --- Build & write ---
const doc = buildDoc(spec.title, children);
writeDoc(doc, outputPath);
