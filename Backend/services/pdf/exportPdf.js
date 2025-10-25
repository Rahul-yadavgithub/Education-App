// utils/pdfExport.js
const { PDFDocument, StandardFonts } = require("pdf-lib");

/**
 * Server-side PDF export using pdf-lib.
 * Accepts Paper object and returns a Buffer that can be streamed to client.
 */
const exportPaperToPdfBuffer = async (paper) => {
  const pdfDoc = await PDFDocument.create();
  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const margin = 50;
  const fontSizeHeader = 14;
  const fontSizeNormal = 11;

  // Sanitize all text for WinAnsi encoding
  const sanitizeText = (text) => {
    if (!text) return "";
    return text
      .replace(/[‐-‒–—―]/g, "-")
      .replace(/[“”«»„]/g, '"')
      .replace(/[‘’‚‛]/g, "'")
      .replace(/\u00A0/g, " ")
      .trim();
  };

  // Helper to create new page with initial Y position
  const addNewPage = () => {
    const page = pdfDoc.addPage();
    const { height } = page.getSize();
    return { page, y: height - margin };
  };

  // Start first page
  let { page, y: currentY } = addNewPage();

  // Draw paper info
  page.drawText(sanitizeText(`Subject: ${paper.subject}`), { x: margin, y: currentY, size: fontSizeHeader, font: timesRomanFont });
  currentY -= 22;
  page.drawText(
    sanitizeText(`Total Marks: ${paper.totalMarks}    Duration: ${paper.duration}`),
    { x: margin, y: currentY, size: fontSizeNormal, font: timesRomanFont }
  );
  currentY -= 22;

  // Questions
  for (let idx = 0; idx < paper.questions.length; idx++) {
    const q = paper.questions[idx];
    const qText = sanitizeText(`${idx + 1}. ${q.text} (${q.marks} marks)`);
    const lines = splitTextIntoLines(qText, 80);

    for (const line of lines) {
      if (currentY < 80) {
        ({ page, y: currentY } = addNewPage());
      }
      page.drawText(sanitizeText(line), { x: margin, y: currentY, size: fontSizeNormal, font: timesRomanFont });
      currentY -= 14;
    }
    currentY -= 6;
  }

  // Answer key page
  ({ page, y: currentY } = addNewPage());
  page.drawText(sanitizeText("Answer Key"), { x: margin, y: currentY, size: 13, font: timesRomanFont });
  currentY -= 20;

  for (const a of paper.answerKey) {
    const text = sanitizeText(`${a.questionIndex + 1}. ${a.answer}`);
    const lines = splitTextIntoLines(text, 80);
    for (const line of lines) {
      if (currentY < 80) {
        ({ page, y: currentY } = addNewPage());
      }
      page.drawText(sanitizeText(line), { x: margin, y: currentY, size: fontSizeNormal, font: timesRomanFont });
      currentY -= 14;
    }
    currentY -= 6;
  }

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
};

const splitTextIntoLines = (text, maxChars) => {
  const words = text.split(" ");
  const lines = [];
  let line = "";
  for (const w of words) {
    if ((line + " " + w).trim().length > maxChars) {
      lines.push(line.trim());
      line = w;
    } else {
      line += " " + w;
    }
  }
  if (line.trim()) lines.push(line.trim());
  return lines;
};

module.exports = { exportPaperToPdfBuffer };
