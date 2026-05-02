/**
 * docx_utils.js — shared builders for F1, F2, F3 docx generators.
 *
 * Centralizes styling, cell/row construction, and tables so the three builders
 * stay visually consistent. Each builder imports from here.
 */

const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  HeadingLevel, AlignmentType, BorderStyle, WidthType, ShadingType,
  LevelFormat, PageOrientation
} = require('docx');

// -------- Style constants --------
const BORDER = { style: BorderStyle.SINGLE, size: 4, color: "D0D0D0" };
const BORDERS = { top: BORDER, bottom: BORDER, left: BORDER, right: BORDER };
const HEADER_SHADING  = { fill: "F2F2F2", type: ShadingType.CLEAR, color: "auto" };
const NEW_SHADING     = { fill: "FFF4E6", type: ShadingType.CLEAR, color: "auto" };
const REFINED_SHADING = { fill: "FEFCE8", type: ShadingType.CLEAR, color: "auto" };
const GAP_SHADING     = { fill: "FEF2F2", type: ShadingType.CLEAR, color: "auto" };  // for no-fit rows
const FORCED_SHADING  = { fill: "FFFBEB", type: ShadingType.CLEAR, color: "auto" };  // for forced-fit rows
const MULTI_SHADING   = { fill: "EFF6FF", type: ShadingType.CLEAR, color: "auto" };  // for multi-fit rows
const CELL_MARGINS = { top: 100, bottom: 100, left: 140, right: 140 };

// Category color pills (for F1 behavior category column)
const CATEGORY_COLORS = {
  "Planning":      { bg: "EEEDFE", fg: "3C3489" },
  "Reasoning":     { bg: "FAEEDA", fg: "633806" },
  "Execution":     { bg: "E1F5EE", fg: "085041" },
  "Evaluation":    { bg: "E6F1FB", fg: "0C447C" },
  "Reflection":    { bg: "FAECE7", fg: "712B13" },
  "Communication": { bg: "FBEAF0", fg: "72243E" },
  "Others":        { bg: "F1F5F9", fg: "334155" },
};

// US Letter content width: 12240 DXA page - 2*1440 margins = 9360 DXA
const PAGE_CONTENT_WIDTH = 9360;

// -------- Builders --------

function p(text, opts = {}) {
  return new Paragraph({
    spacing: { before: opts.before ?? 0, after: opts.after ?? 100, line: 300 },
    alignment: opts.align ?? AlignmentType.LEFT,
    children: [new TextRun({
      text, bold: !!opts.bold, italics: !!opts.italics,
      size: opts.size ?? 22, color: opts.color ?? "000000", font: "Calibri"
    })]
  });
}

function heading(text, level) {
  return new Paragraph({
    heading: level,
    spacing: { before: level === HeadingLevel.HEADING_1 ? 360 : 280, after: 180 },
    children: [new TextRun({ text, font: "Calibri" })]
  });
}

function cellText(text, opts = {}) {
  return new Paragraph({
    spacing: { before: 0, after: 0, line: 280 },
    alignment: opts.align ?? AlignmentType.LEFT,
    children: [new TextRun({
      text, bold: !!opts.bold, italics: !!opts.italics,
      size: opts.size ?? 20, color: opts.color ?? "000000", font: "Calibri"
    })]
  });
}

function cellMulti(runs, opts = {}) {
  return new Paragraph({
    spacing: { before: 0, after: 0, line: 280 },
    alignment: opts.align ?? AlignmentType.LEFT,
    children: runs.map(r => new TextRun({
      text: r.text, bold: !!r.bold, italics: !!r.italics,
      color: r.color ?? "000000", size: r.size ?? 20, font: "Calibri"
    }))
  });
}

function hcell(text, width) {
  return new TableCell({
    borders: BORDERS, margins: CELL_MARGINS, shading: HEADER_SHADING,
    width: { size: width, type: WidthType.DXA },
    children: [cellText(text, { bold: true, size: 20 })]
  });
}

function bodyCell(children, width, shading) {
  if (typeof children === 'string') children = [cellText(children)];
  if (!Array.isArray(children)) children = [children];
  return new TableCell({
    borders: BORDERS, margins: CELL_MARGINS, shading: shading || undefined,
    width: { size: width, type: WidthType.DXA },
    children
  });
}

// Render a "pill-styled" cell for behavior categories.
// Uses a small background color as shading (no tight pill outline, but color-coded).
function categoryCell(categoryName, width) {
  const color = CATEGORY_COLORS[categoryName] || CATEGORY_COLORS.Others;
  return new TableCell({
    borders: BORDERS, margins: CELL_MARGINS,
    shading: { fill: color.bg, type: ShadingType.CLEAR, color: "auto" },
    width: { size: width, type: WidthType.DXA },
    children: [cellText(categoryName, { bold: true, color: color.fg, size: 19 })]
  });
}

// Render a "quote cell" with one or more italicized verbatim quotes.
function quoteCell(evidence, width, shading) {
  const quotes = Array.isArray(evidence) ? evidence
                 : (evidence && evidence.length > 0 ? [evidence] : null);
  const children = quotes
    ? quotes.map((q, i) => new Paragraph({
        spacing: { before: 0, after: i === quotes.length - 1 ? 0 : 40, line: 260 },
        children: [new TextRun({ text: `"${q}"`, italics: true, size: 18, color: "4B4B4B", font: "Calibri" })]
      }))
    : [new Paragraph({
        spacing: { before: 0, after: 0, line: 260 },
        children: [new TextRun({ text: "—", size: 18, color: "999999", font: "Calibri" })]
      })];
  return new TableCell({
    borders: BORDERS, margins: CELL_MARGINS, shading: shading || undefined,
    width: { size: width, type: WidthType.DXA },
    children
  });
}

// -------- Document wrapper --------

function buildDoc(title, children) {
  return new Document({
    creator: "Codebook Iterator",
    title,
    styles: {
      default: { document: { run: { font: "Calibri", size: 22 } } },
      paragraphStyles: [
        { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
          run: { size: 32, bold: true, font: "Calibri", color: "1F2937" },
          paragraph: { spacing: { before: 360, after: 180 }, outlineLevel: 0 } },
        { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
          run: { size: 26, bold: true, font: "Calibri", color: "1F2937" },
          paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 1 } },
        { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
          run: { size: 22, bold: true, font: "Calibri", color: "374151" },
          paragraph: { spacing: { before: 180, after: 100 }, outlineLevel: 2 } },
      ]
    },
    numbering: {
      config: [
        { reference: "bullets",
          levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 360, hanging: 240 } } } }] },
      ]
    },
    sections: [{
      properties: {
        page: {
          size: { width: 12240, height: 15840 },
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
        }
      },
      children
    }]
  });
}

async function writeDoc(doc, outputPath) {
  const buf = await Packer.toBuffer(doc);
  require('fs').writeFileSync(outputPath, buf);
  console.log(`Wrote ${outputPath} (${buf.length} bytes)`);
}

// A horizontal-rule-style separator paragraph
function hr(color = "2E75B6") {
  return new Paragraph({
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color, space: 1 } },
    spacing: { before: 0, after: 240 },
    children: [new TextRun({ text: "" })]
  });
}

module.exports = {
  // docx types re-exported for convenience
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  HeadingLevel, AlignmentType, BorderStyle, WidthType, ShadingType,
  LevelFormat,
  // constants
  BORDERS, HEADER_SHADING, NEW_SHADING, REFINED_SHADING,
  GAP_SHADING, FORCED_SHADING, MULTI_SHADING,
  CELL_MARGINS, PAGE_CONTENT_WIDTH, CATEGORY_COLORS,
  // builders
  p, heading, cellText, cellMulti, hcell, bodyCell, categoryCell, quoteCell,
  buildDoc, writeDoc, hr,
};
