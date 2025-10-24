// utils/pdfExport.js
const { PDFDocument, StandardFonts, rgb } = require("pdf-lib");

/**
 * Server-side PDF export using pdf-lib.
 * Accepts Paper object and returns a Buffer that can be streamed to client.
 */
const exportPaperToPdfBuffer = async (paper) => {
  const pdfDoc = await PDFDocument.create();
  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const page = pdfDoc.addPage();
  const { width, height } = page.getSize();
  const margin = 50;
  let y = height - margin;

  const fontSizeHeader = 14;
  const fontSizeNormal = 11;

  page.drawText(`Subject: ${paper.subject}`, { x: margin, y, size: fontSizeHeader, font: timesRomanFont });
  y -= 22;
  page.drawText(`Total Marks: ${paper.totalMarks}    Duration: ${paper.duration}`, { x: margin, y, size: fontSizeNormal, font: timesRomanFont });
  y -= 22;

  // Questions
  paper.questions.forEach((q, idx) => {
    const qText = `${idx + 1}. ${q.text} (${q.marks} marks)`;
    const lines = splitTextIntoLines(qText, 80); // approximate
    lines.forEach((line) => {
      if (y < 80) {
        page.addPage();
        y = page.getHeight() - margin;
      }
      page.drawText(line, { x: margin, y, size: fontSizeNormal, font: timesRomanFont });
      y -= 14;
    });
    y -= 6;
  });

  // Answer key page
  page.addPage();
  y = page.getHeight() - margin;
  page.drawText("Answer Key", { x: margin, y, size: 13, font: timesRomanFont });
  y -= 20;
  paper.answerKey.forEach((a) => {
    const text = `${a.questionIndex + 1}. ${a.answer}`;
    const lines = splitTextIntoLines(text, 80);
    lines.forEach((line) => {
      if (y < 80) {
        page.addPage();
        y = page.getHeight() - margin;
      }
      page.drawText(line, { x: margin, y, size: fontSizeNormal, font: timesRomanFont });
      y -= 14;
    });
    y -= 6;
  });

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
