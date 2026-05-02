#!/usr/bin/env node
/**
 * build_f2_refinement_docx.js — F2: Codebook Refinement Report
 *
 * Usage: node build_f2_refinement_docx.js <spec.json> <output.docx>
 *
 * Produces a docx with:
 *   Cover (title, pipeline context, proposal count summary)
 *   §1 Mapping Table (every F1 behavior mapped to codebook entries, with outcome)
 *   §2 Codebook-Level Diagnostics (unused, overloaded, adjacent-but-distinct)
 *   §3 Revision Proposals (ordered by type, each with type + evidence + justification)
 *   §4 Clean-Fit Rate and Conclusion
 */

const fs = require('fs');
const U = require('./docx_utils.js');
const {
  HeadingLevel, AlignmentType, Table, TableRow, TableCell, WidthType, Paragraph, TextRun,
  ShadingType, BorderStyle,
  BORDERS, CELL_MARGINS, HEADER_SHADING, PAGE_CONTENT_WIDTH,
  GAP_SHADING, FORCED_SHADING, MULTI_SHADING,
  p, heading, cellText, cellMulti, hcell, bodyCell, quoteCell, buildDoc, writeDoc, hr
} = U;

const [specPath, outputPath] = process.argv.slice(2);
if (!specPath || !outputPath) {
  console.error('Usage: node build_f2_refinement_docx.js <spec.json> <output.docx>');
  process.exit(1);
}
const spec = JSON.parse(fs.readFileSync(specPath, 'utf8'));

const children = [];

// --- Cover ---
children.push(new Paragraph({
  spacing: { before: 0, after: 120, line: 300 },
  children: [new TextRun({ text: spec.title || "Codebook Refinement Report", bold: true, size: 40, font: "Calibri" })]
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

// Summary stats
if (spec.stats && spec.stats.length > 0) {
  const perCellWidth = Math.floor(PAGE_CONTENT_WIDTH / spec.stats.length);
  const statCells = spec.stats.map(s => bodyCell(
    [
      new Paragraph({ spacing: { before: 0, after: 60, line: 280 },
        children: [new TextRun({ text: s.label, size: 18, color: "6B7280", font: "Calibri" })] }),
      new Paragraph({ spacing: { before: 0, after: 0, line: 280 },
        children: [new TextRun({ text: s.value, bold: true, size: 30, color: "111827", font: "Calibri" })] })
    ],
    perCellWidth
  ));
  children.push(new Table({
    width: { size: PAGE_CONTENT_WIDTH, type: WidthType.DXA },
    columnWidths: spec.stats.map(() => perCellWidth),
    rows: [new TableRow({ children: statCells })]
  }));
  children.push(p("", { after: 120 }));
}

// --- §1 Mapping Table ---
children.push(heading("§1 Mapping Against Existing Codebook", HeadingLevel.HEADING_1));
children.push(p("Every F1 behavior assigned a mapping outcome against the existing codebook. Row color encodes the outcome: clean (white), forced (amber), no-fit (pink), multi-fit (blue).", { color: "4B4B4B" }));

// Columns: # | F1 Sub-behavior | F1 Source Text | Outcome | Best-fit entry | Notes
const mapWidths = [440, 1500, 2100, 900, 2000, PAGE_CONTENT_WIDTH - 440 - 1500 - 2100 - 900 - 2000];
const mapHeaders = ["#", "F1 Sub-behavior", "Source Text", "Outcome", "Best-fit Entry", "Notes"];

function shadingForOutcome(outcome) {
  const o = (outcome || "").toLowerCase();
  if (o === "clean")     return undefined;
  if (o === "forced")    return FORCED_SHADING;
  if (o === "no-fit" || o === "no_fit" || o === "nofit") return GAP_SHADING;
  if (o === "multi-fit" || o === "multi_fit" || o === "multifit") return MULTI_SHADING;
  return undefined;
}

function outcomeLabel(outcome) {
  const o = (outcome || "").toLowerCase();
  if (o === "clean") return "Clean";
  if (o === "forced") return "Forced";
  if (o === "no-fit" || o === "no_fit" || o === "nofit") return "No fit";
  if (o === "multi-fit" || o === "multi_fit" || o === "multifit") return "Multi-fit";
  return outcome;
}

const mapHeaderRow = new TableRow({
  tableHeader: true,
  children: mapHeaders.map((h, i) => hcell(h, mapWidths[i]))
});

const mapRows = (spec.mappings || []).map((m, i) => {
  const shading = shadingForOutcome(m.outcome);
  return new TableRow({ children: [
    bodyCell(cellText(String(i + 1), { color: "6B7280", size: 18 }), mapWidths[0], shading),
    bodyCell(cellText(m.sub_behavior, { bold: true }), mapWidths[1], shading),
    quoteCell(m.source_text, mapWidths[2], shading),
    bodyCell(cellText(outcomeLabel(m.outcome), { bold: true, size: 19 }), mapWidths[3], shading),
    bodyCell(cellText(m.best_fit_entry || "—"), mapWidths[4], shading),
    bodyCell(cellText(m.notes || "", { color: "4B4B4B" }), mapWidths[5], shading),
  ]});
});

children.push(new Table({
  width: { size: PAGE_CONTENT_WIDTH, type: WidthType.DXA },
  columnWidths: mapWidths,
  rows: [mapHeaderRow, ...mapRows]
}));

// --- §2 Codebook-Level Diagnostics ---
children.push(heading("§2 Codebook-Level Diagnostics", HeadingLevel.HEADING_1));

function renderDiagnosticSection(heading2, intro, items, itemRenderer) {
  children.push(heading(heading2, HeadingLevel.HEADING_2));
  if (intro) children.push(p(intro, { color: "4B4B4B" }));
  if (!items || items.length === 0) {
    children.push(p("None.", { italics: true, color: "6B7280" }));
    return;
  }
  items.forEach(itemRenderer);
}

renderDiagnosticSection(
  "Unused Entries",
  "Entries the F1 extraction didn't hit. One unused entry on a single paper is normal; unused across multiple papers is a removal candidate.",
  spec.unused_entries,
  (item) => {
    children.push(new Paragraph({
      numbering: { reference: "bullets", level: 0 },
      spacing: { before: 40, after: 40, line: 300 },
      children: [
        new TextRun({ text: item.entry, bold: true, size: 22, font: "Calibri" }),
        new TextRun({ text: item.note ? " — " + item.note : "", size: 22, color: "4B4B4B", font: "Calibri" })
      ]
    }));
  }
);

renderDiagnosticSection(
  "Overloaded Entries",
  "Entries that absorbed many heterogeneous F1 behaviors. Split candidates.",
  spec.overloaded_entries,
  (item) => {
    children.push(new Paragraph({
      numbering: { reference: "bullets", level: 0 },
      spacing: { before: 40, after: 40, line: 300 },
      children: [
        new TextRun({ text: item.entry, bold: true, size: 22, font: "Calibri" }),
        new TextRun({ text: ` (${item.hit_count} hits): `, size: 22, color: "6B7280", font: "Calibri" }),
        new TextRun({ text: item.note || "", size: 22, color: "4B4B4B", font: "Calibri" })
      ]
    }));
  }
);

renderDiagnosticSection(
  "Adjacent-but-Distinct Pairs",
  "Pairs of entries that triggered repeated multi-fits. Rename/rescope candidates.",
  spec.adjacent_pairs,
  (item) => {
    children.push(new Paragraph({
      numbering: { reference: "bullets", level: 0 },
      spacing: { before: 40, after: 40, line: 300 },
      children: [
        new TextRun({ text: `${item.entry_a} ↔ ${item.entry_b}`, bold: true, size: 22, font: "Calibri" }),
        new TextRun({ text: item.note ? " — " + item.note : "", size: 22, color: "4B4B4B", font: "Calibri" })
      ]
    }));
  }
);

// --- §3 Revision Proposals ---
children.push(heading("§3 Revision Proposals", HeadingLevel.HEADING_1));
children.push(p("Proposals ordered by type (NEW CATEGORY → SPLIT → ADD → RENAME → MERGE → REMOVE). Each proposal carries at least one verbatim paper quote as evidence.", { color: "4B4B4B" }));

// Type badge colors
const TYPE_COLORS = {
  "NEW CATEGORY": { bg: "FED7AA", fg: "9A3412" },
  "SPLIT":         { bg: "FDE68A", fg: "92400E" },
  "ADD":           { bg: "BBF7D0", fg: "166534" },
  "RENAME":        { bg: "E0E7FF", fg: "3730A3" },
  "RENAME / RESCOPE": { bg: "E0E7FF", fg: "3730A3" },
  "MERGE":         { bg: "FBCFE8", fg: "9D174D" },
  "REMOVE":        { bg: "FECACA", fg: "991B1B" },
};

function renderProposal(prop) {
  // Heading: R<n>. <Type>
  const typeName = (prop.type || "").toUpperCase();
  const colorSet = TYPE_COLORS[typeName] || { bg: "E5E7EB", fg: "374151" };

  children.push(new Paragraph({
    spacing: { before: 240, after: 80, line: 300 },
    children: [
      new TextRun({ text: `R${prop.id}. `, bold: true, size: 26, color: "111827", font: "Calibri" }),
      new TextRun({ text: " " + typeName + " ", bold: true, size: 22, color: colorSet.fg, shading: { type: ShadingType.CLEAR, fill: colorSet.bg, color: "auto" }, font: "Calibri" }),
      ...(prop.target ? [new TextRun({ text: "  " + prop.target, size: 22, color: "4B4B4B", font: "Calibri" })] : [])
    ]
  }));

  // Fields table: 2-col (Field | Value)
  const propCellWidths = [1800, PAGE_CONTENT_WIDTH - 1800];

  const rows = [];
  function fieldRow(label, value, valueIsQuoteList) {
    const valueCell = valueIsQuoteList
      ? quoteCell(value, propCellWidths[1])
      : bodyCell(cellText(value || "—"), propCellWidths[1]);
    rows.push(new TableRow({ children: [
      bodyCell(cellText(label, { bold: true, color: "374151" }), propCellWidths[0], HEADER_SHADING),
      valueCell
    ]}));
  }

  // Common and type-specific fields
  if (prop.type === "ADD") {
    fieldRow("Category", prop.category);
    fieldRow("New entry", prop.new_entry);
    fieldRow("Plain Explanation", prop.explanation);
    fieldRow("Evidence", prop.evidence, true);
    fieldRow("Justification", prop.justification);
  } else if (prop.type === "SPLIT") {
    fieldRow("Current entry", prop.current_entry);
    // Children list as a single cell with multi-line content
    const childrenPara = (prop.children_list || []).map((c, i) => new Paragraph({
      spacing: { before: 0, after: 40, line: 280 },
      children: [
        new TextRun({ text: "• ", bold: true, size: 20, color: "4B4B4B", font: "Calibri" }),
        new TextRun({ text: c.name + " — ", bold: true, size: 20, font: "Calibri" }),
        new TextRun({ text: c.explanation || "", size: 20, font: "Calibri" })
      ]
    }));
    rows.push(new TableRow({ children: [
      bodyCell(cellText("Becomes", { bold: true, color: "374151" }), propCellWidths[0], HEADER_SHADING),
      bodyCell(childrenPara.length ? childrenPara : [cellText("—")], propCellWidths[1])
    ]}));
    fieldRow("Scope rule", prop.scope_rule);
    fieldRow("Evidence", prop.evidence, true);
    fieldRow("Migration note", prop.migration_note);
  } else if (prop.type === "MERGE") {
    fieldRow("Merging", (prop.merging || []).join(" + "));
    fieldRow("Into", prop.into);
    fieldRow("Plain Explanation", prop.explanation);
    fieldRow("Justification", prop.justification);
    fieldRow("Migration note", prop.migration_note);
  } else if (prop.type === "RENAME" || prop.type === "RENAME / RESCOPE") {
    fieldRow("Entry", prop.entry);
    fieldRow("Old explanation", prop.old_explanation);
    fieldRow("New explanation", prop.new_explanation);
    fieldRow("Scope change", prop.scope_change);
    fieldRow("Justification", prop.justification);
  } else if (prop.type === "NEW CATEGORY") {
    fieldRow("New category name", prop.new_category_name);
    fieldRow("Scope", prop.scope);
    const childrenPara = (prop.contains || []).map((c) => new Paragraph({
      spacing: { before: 0, after: 40, line: 280 },
      children: [
        new TextRun({ text: "• ", bold: true, size: 20, color: "4B4B4B", font: "Calibri" }),
        new TextRun({ text: c.name, bold: true, size: 20, font: "Calibri" }),
        new TextRun({ text: c.explanation ? " — " + c.explanation : "", size: 20, font: "Calibri" }),
        new TextRun({ text: c.evidence ? `  [evidence: "${c.evidence}"]` : "", italics: true, size: 18, color: "6B7280", font: "Calibri" }),
      ]
    }));
    rows.push(new TableRow({ children: [
      bodyCell(cellText("Contains initially", { bold: true, color: "374151" }), propCellWidths[0], HEADER_SHADING),
      bodyCell(childrenPara.length ? childrenPara : [cellText("—")], propCellWidths[1])
    ]}));
    fieldRow("Why a new category", prop.why_new);
    fieldRow("Boundary with neighbors", prop.boundary);
  } else if (prop.type === "REMOVE") {
    fieldRow("Removing", prop.removing);
    fieldRow("Reason", prop.reason);
    fieldRow("Migration", prop.migration);
    fieldRow("Risk", prop.risk);
  } else {
    // fallback
    fieldRow("Details", JSON.stringify(prop));
  }

  children.push(new Table({
    width: { size: PAGE_CONTENT_WIDTH, type: WidthType.DXA },
    columnWidths: propCellWidths,
    rows
  }));
}

// Order proposals by type
const TYPE_ORDER = ["NEW CATEGORY", "SPLIT", "ADD", "RENAME / RESCOPE", "RENAME", "MERGE", "REMOVE"];
const proposalsSorted = (spec.proposals || []).slice().sort((a, b) => {
  const ai = TYPE_ORDER.indexOf(a.type);
  const bi = TYPE_ORDER.indexOf(b.type);
  return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
});
proposalsSorted.forEach(prop => renderProposal(prop));

if (proposalsSorted.length === 0) {
  children.push(p("No revisions proposed — the codebook covers the paper's behaviors cleanly.", { italics: true, color: "6B7280" }));
}

// --- §4 Clean-Fit Rate and Conclusion ---
children.push(heading("§4 Clean-Fit Rate and Conclusion", HeadingLevel.HEADING_1));
if (spec.clean_fit_rate) {
  children.push(p(`Clean-fit rate: ${spec.clean_fit_rate}`, { bold: true, size: 24 }));
}
if (spec.clean_fit_interpretation) {
  children.push(p(spec.clean_fit_interpretation));
}
if (spec.conclusion) {
  children.push(p(spec.conclusion));
}
if (spec.single_paper_warning) {
  children.push(p(""));
  children.push(new Paragraph({
    spacing: { before: 120, after: 120, line: 300 },
    shading: { type: ShadingType.CLEAR, fill: "FEF3C7", color: "auto" },
    border: { left: { style: BorderStyle.SINGLE, size: 24, color: "D97706", space: 8 } },
    children: [
      new TextRun({ text: "⚠ Single-paper caveat: ", bold: true, size: 22, color: "92400E", font: "Calibri" }),
      new TextRun({ text: spec.single_paper_warning, size: 22, color: "78350F", font: "Calibri" })
    ]
  }));
}

// Closing
children.push(p("", { after: 240 }));
children.push(p(`End of Codebook Refinement Report.`, { italics: true, size: 20, color: "6B7280" }));

// --- Build & write ---
const doc = buildDoc(spec.title || "Codebook Refinement Report", children);
writeDoc(doc, outputPath);
