#!/usr/bin/env node
/**
 * build_f1_extraction_docx.js — F1: Behavior Extraction Report
 *
 * Usage: node build_f1_extraction_docx.js <spec.json> <output.docx>
 *
 * Produces a docx with:
 *   Cover (paper title, counts)
 *   §1 Behavior Extraction Table (# | Behavior | Sub-behavior | [Agent] | Source Text)
 *   §2 Frequency Distribution (Verb+Noun frequency, then category distribution)
 *   §3 Dominant Behavior Pattern (prose + optional flow diagram)
 *   §4 Notable Observations (bulleted list of patterns / missing behaviors)
 *
 * See spec-schema.md for the JSON input format.
 */

const fs = require('fs');
const U = require('./docx_utils.js');
const {
  HeadingLevel, AlignmentType, Table, TableRow, TableCell, WidthType, Paragraph, TextRun,
  BORDERS, CELL_MARGINS, HEADER_SHADING, PAGE_CONTENT_WIDTH,
  p, heading, cellText, hcell, bodyCell, categoryCell, quoteCell, buildDoc, writeDoc, hr
} = U;

// -------- args --------
const [specPath, outputPath] = process.argv.slice(2);
if (!specPath || !outputPath) {
  console.error('Usage: node build_f1_extraction_docx.js <spec.json> <output.docx>');
  process.exit(1);
}
const spec = JSON.parse(fs.readFileSync(specPath, 'utf8'));

// -------- content --------
const children = [];

// --- Cover ---
children.push(new Paragraph({
  spacing: { before: 0, after: 120, line: 300 },
  children: [new TextRun({ text: spec.title || "Behavior Extraction Report", bold: true, size: 40, font: "Calibri" })]
}));
if (spec.paper_title) {
  children.push(new Paragraph({
    spacing: { before: 0, after: 60 },
    children: [new TextRun({ text: `Paper: ${spec.paper_title}`, italics: true, size: 22, color: "4B4B4B", font: "Calibri" })]
  }));
}
if (spec.analysis_date) {
  children.push(new Paragraph({
    spacing: { before: 0, after: 240 },
    children: [new TextRun({ text: `Analysis date: ${spec.analysis_date}`, size: 20, color: "6B7280", font: "Calibri" })]
  }));
}
children.push(hr());

// Stat grid (simple 4-column table with key counts)
if (spec.stats && spec.stats.length > 0) {
  const statCells = spec.stats.map(s => bodyCell(
    [
      new Paragraph({ spacing: { before: 0, after: 60, line: 280 },
        children: [new TextRun({ text: s.label, size: 18, color: "6B7280", font: "Calibri" })] }),
      new Paragraph({ spacing: { before: 0, after: 0, line: 280 },
        children: [new TextRun({ text: s.value, bold: true, size: 32, color: "111827", font: "Calibri" })] })
    ],
    Math.floor(PAGE_CONTENT_WIDTH / spec.stats.length)
  ));
  children.push(new Table({
    width: { size: PAGE_CONTENT_WIDTH, type: WidthType.DXA },
    columnWidths: spec.stats.map(() => Math.floor(PAGE_CONTENT_WIDTH / spec.stats.length)),
    rows: [new TableRow({ children: statCells })]
  }));
  children.push(p("", { after: 120 }));
}

// --- §1 Behavior Extraction Table ---
children.push(heading("§1 Behavior Extraction", HeadingLevel.HEADING_1));
children.push(p("Each behavior instance identified from the paper. Source Text is a verbatim quote that triggered the identification.", { color: "4B4B4B" }));

const hasAgentColumn = spec.behaviors.some(b => b.agent);

// Column widths depending on whether an Agent column is present
let widths, headers;
if (hasAgentColumn) {
  // # | Category | Sub-behavior | Agent | Source Text
  widths = [440, 1400, 2100, 1000, PAGE_CONTENT_WIDTH - 440 - 1400 - 2100 - 1000];
  headers = ["#", "Behavior", "Sub-behavior (Verb + Noun)", "Agent", "Source Text"];
} else {
  // # | Category | Sub-behavior | Source Text
  widths = [440, 1500, 2400, PAGE_CONTENT_WIDTH - 440 - 1500 - 2400];
  headers = ["#", "Behavior", "Sub-behavior (Verb + Noun)", "Source Text"];
}

const headerRow = new TableRow({
  tableHeader: true,
  children: headers.map((h, i) => hcell(h, widths[i]))
});

const bodyRows = spec.behaviors.map((b, i) => {
  const cells = [
    bodyCell(cellText(String(i + 1), { color: "6B7280", size: 18 }), widths[0]),
    categoryCell(b.behavior, widths[1]),
    bodyCell(cellText(b["sub-behavior"] || b.sub_behavior, { bold: true }), widths[2]),
  ];
  if (hasAgentColumn) {
    cells.push(bodyCell(cellText(b.agent || "—", { size: 18, color: "6B7280" }), widths[3]));
    cells.push(quoteCell(b.source_text, widths[4]));
  } else {
    cells.push(quoteCell(b.source_text, widths[3]));
  }
  return new TableRow({ children: cells });
});

children.push(new Table({
  width: { size: PAGE_CONTENT_WIDTH, type: WidthType.DXA },
  columnWidths: widths,
  rows: [headerRow, ...bodyRows]
}));

// --- §2 Frequency Distribution ---
children.push(heading("§2 Frequency Distribution", HeadingLevel.HEADING_1));

// Helper: compute frequencies from behaviors array if not explicitly provided in spec.
function computeFreqs(behaviors, keyFn) {
  const counts = new Map();
  behaviors.forEach(b => {
    const k = keyFn(b);
    if (!k) return;
    counts.set(k, (counts.get(k) || 0) + 1);
  });
  return Array.from(counts.entries()).map(([k, v]) => ({ key: k, count: v }));
}

// §2a: Verb+Noun frequency table
children.push(heading("Sub-behavior Frequencies", HeadingLevel.HEADING_2));
const freqWidths2a = [4800, PAGE_CONTENT_WIDTH - 4800 - 1200, 1200];
const freq2aHeader = new TableRow({
  tableHeader: true,
  children: [
    hcell("Sub-behavior (Verb + Noun)", freqWidths2a[0]),
    hcell("Visual", freqWidths2a[1]),
    hcell("Count", freqWidths2a[2]),
  ]
});

// Auto-compute if spec.sub_behavior_frequencies is missing or empty
let subFreqs = spec.sub_behavior_frequencies;
if (!subFreqs || subFreqs.length === 0) {
  subFreqs = computeFreqs(spec.behaviors, b => b["sub-behavior"] || b.sub_behavior)
    .map(({ key, count }) => ({ sub_behavior: key, count }));
}
const sortedFreqs = subFreqs.slice().sort((a, b) => b.count - a.count);
const maxCount = sortedFreqs.length > 0 ? Math.max(...sortedFreqs.map(f => f.count)) : 1;
const freq2aRows = sortedFreqs.map(f => {
  const barWidth = Math.max(3, Math.round((f.count / maxCount) * 100));
  const barFillChars = "█".repeat(Math.ceil(barWidth / 5));
  return new TableRow({ children: [
    bodyCell(cellText(f.sub_behavior, { bold: true }), freqWidths2a[0]),
    bodyCell(cellText(barFillChars, { color: "2563EB" }), freqWidths2a[1]),
    bodyCell(cellText(String(f.count), { bold: true, align: AlignmentType.RIGHT }), freqWidths2a[2]),
  ]});
});
children.push(new Table({
  width: { size: PAGE_CONTENT_WIDTH, type: WidthType.DXA },
  columnWidths: freqWidths2a,
  rows: [freq2aHeader, ...freq2aRows]
}));

// §2b: Category distribution
children.push(heading("Top-Level Category Distribution", HeadingLevel.HEADING_2));
let catFreqsRaw = spec.category_frequencies;
if (!catFreqsRaw || catFreqsRaw.length === 0) {
  catFreqsRaw = computeFreqs(spec.behaviors, b => b.behavior)
    .map(({ key, count }) => ({ category: key, count }));
}
const catFreqs = catFreqsRaw.slice().sort((a, b) => b.count - a.count);
const maxCatCount = catFreqs.length > 0 ? Math.max(...catFreqs.map(f => f.count)) : 1;
const freqWidths2b = [2400, PAGE_CONTENT_WIDTH - 2400 - 1200, 1200];
const freq2bHeader = new TableRow({
  tableHeader: true,
  children: [
    hcell("Category", freqWidths2b[0]),
    hcell("Visual", freqWidths2b[1]),
    hcell("Count", freqWidths2b[2]),
  ]
});
const freq2bRows = catFreqs.map(f => {
  const barWidth = Math.max(3, Math.round((f.count / maxCatCount) * 100));
  const barFillChars = "█".repeat(Math.ceil(barWidth / 5));
  return new TableRow({ children: [
    categoryCell(f.category, freqWidths2b[0]),
    bodyCell(cellText(barFillChars, { color: "2563EB" }), freqWidths2b[1]),
    bodyCell(cellText(String(f.count), { bold: true, align: AlignmentType.RIGHT }), freqWidths2b[2]),
  ]});
});
children.push(new Table({
  width: { size: PAGE_CONTENT_WIDTH, type: WidthType.DXA },
  columnWidths: freqWidths2b,
  rows: [freq2bHeader, ...freq2bRows]
}));

// --- §3 Dominant Behavior Pattern ---
children.push(heading("§3 Dominant Behavior Pattern", HeadingLevel.HEADING_1));
if (spec.dominant_pattern_prose) {
  children.push(p(spec.dominant_pattern_prose));
}
if (spec.dominant_pattern_flow) {
  // Render flow as a single monospaced line with shading (no border — avoids schema ordering issues)
  children.push(new Paragraph({
    spacing: { before: 120, after: 120, line: 280 },
    shading: { fill: "F3F4F6", type: U.ShadingType.CLEAR, color: "auto" },
    children: [new TextRun({ text: "  " + spec.dominant_pattern_flow + "  ", font: "Consolas", size: 20, color: "1F2937" })]
  }));
}
if (spec.loops && spec.loops.length > 0) {
  children.push(heading("Loops and Nested Structures", HeadingLevel.HEADING_2));
  spec.loops.forEach(loop => {
    children.push(new Paragraph({
      numbering: { reference: "bullets", level: 0 },
      spacing: { before: 40, after: 40, line: 300 },
      children: [
        new TextRun({ text: loop.name + ": ", bold: true, size: 22, font: "Calibri" }),
        new TextRun({ text: loop.description, size: 22, font: "Calibri" }),
      ]
    }));
  });
}

// --- §4 Notable Observations ---
children.push(heading("§4 Notable Observations", HeadingLevel.HEADING_1));
if (spec.observations && spec.observations.length > 0) {
  spec.observations.forEach(obs => {
    children.push(new Paragraph({
      numbering: { reference: "bullets", level: 0 },
      spacing: { before: 40, after: 40, line: 300 },
      children: [
        new TextRun({ text: obs.title + ": ", bold: true, size: 22, font: "Calibri" }),
        new TextRun({ text: obs.body, size: 22, font: "Calibri" }),
      ]
    }));
  });
}

if (spec.missing_behaviors && spec.missing_behaviors.length > 0) {
  children.push(heading("Conspicuously Absent Behaviors", HeadingLevel.HEADING_2));
  children.push(p("Behaviors one might expect in this domain but that the paper does not exhibit.", { color: "4B4B4B" }));
  spec.missing_behaviors.forEach(m => {
    children.push(new Paragraph({
      numbering: { reference: "bullets", level: 0 },
      spacing: { before: 40, after: 40, line: 300 },
      children: [
        new TextRun({ text: m.label + ": ", bold: true, size: 22, font: "Calibri" }),
        new TextRun({ text: m.explanation, size: 22, font: "Calibri" }),
      ]
    }));
  });
}

// Closing
children.push(p("", { after: 240 }));
children.push(p(`End of Behavior Extraction Report.`, { italics: true, size: 20, color: "6B7280" }));

// --- Build & write ---
const doc = buildDoc(spec.title || "Behavior Extraction Report", children);
writeDoc(doc, outputPath);
