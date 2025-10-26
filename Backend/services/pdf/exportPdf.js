// utils/pdfExport.js
const { PDFDocument, StandardFonts } = require("pdf-lib");

/**
 * Generate a professional academic-style question paper PDF.
 */
const exportPaperToPdfBuffer = async (paper) => {
  const pdfDoc = await PDFDocument.create();

  // Embed fonts
  const mainFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const boldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

  // Define layout constants
  const margin = 50;
  const pageWidth = 595.28; // A4 width in points
  const pageHeight = 841.89; // A4 height in points
  const contentWidth = pageWidth - 2 * margin;

  const fontSizeHeader = 16;
  const fontSizeSubHeader = 12;
  const fontSizeNormal = 11;
  const lineHeight = 1.3 * fontSizeNormal;

  // Utility: clean text
  const sanitizeText = (text) =>
    (text ? String(text).replace(/[^\x00-\x7F]/g, " ").trim() : "");

  // Initialize first page
  let currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
  let currentY = pageHeight - margin;

  // Helper: Add a new page
  const addNewPage = () => {
    currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
    currentY = pageHeight - margin;
  };

  // Helper: draw wrapped text with page-break support
  const drawTextAndWrap = ({ text, x, y, size, font, indent = 0 }) => {
    const availableWidth = contentWidth - indent;
    const words = sanitizeText(text).split(/\s+/);
    const lines = [];
    let currentLine = "";

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      if (font.widthOfTextAtSize(testLine, size) > availableWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) lines.push(currentLine);

    let yPos = y;
    for (const line of lines) {
      if (yPos < margin + lineHeight) {
        addNewPage();
        yPos = currentY;
      }
      currentPage.drawText(line, { x: x + indent, y: yPos, size, font });
      yPos -= lineHeight;
    }

    currentY = yPos;
    return yPos;
  };

  // ---------- HEADER ----------
  currentPage.drawText(sanitizeText(paper.subject || "Question Paper"), {
    x: margin,
    y: currentY,
    size: fontSizeHeader,
    font: boldFont,
  });
  currentY -= lineHeight * 1.5;

  // Marks and Duration
  const leftText = sanitizeText(`Total Marks: ${paper.totalMarks ?? "N/A"}`);
  const rightText = sanitizeText(`Duration: ${paper.duration ?? "N/A"}`);
  const rightWidth = mainFont.widthOfTextAtSize(rightText, fontSizeSubHeader);

  currentPage.drawText(leftText, {
    x: margin,
    y: currentY,
    size: fontSizeSubHeader,
    font: mainFont,
  });

  currentPage.drawText(rightText, {
    x: pageWidth - margin - rightWidth,
    y: currentY,
    size: fontSizeSubHeader,
    font: mainFont,
  });

  currentY -= lineHeight * 2;

  // ---------- QUESTIONS ----------
  const drawQuestion = (q, prefix, indent = 0) => {
    if (!q) return;

    if (currentY < margin + lineHeight * 3) addNewPage();

    const questionText = `${prefix}. ${sanitizeText(q.text)} (${q.marks ?? 0} marks)`;
    drawTextAndWrap({ text: questionText, x: margin, y: currentY, size: fontSizeNormal, font: mainFont, indent });

    // Options (for MCQs)
    if (Array.isArray(q.options) && q.options.length > 0) {
      const labels = ["A", "B", "C", "D", "E", "F"];
      currentY -= lineHeight * 0.5;
      const columnWidth = contentWidth / 2;

      for (let i = 0; i < q.options.length; i += 2) {
        const left = `${labels[i]}. ${sanitizeText(q.options[i])}`;
        const right = q.options[i + 1]
          ? `${labels[i + 1]}. ${sanitizeText(q.options[i + 1])}`
          : "";

        drawTextAndWrap({
          text: left,
          x: margin,
          y: currentY,
          size: fontSizeNormal,
          font: mainFont,
          indent: indent + 10,
        });

        if (right) {
          currentPage.drawText(right, {
            x: margin + columnWidth,
            y: currentY,
            size: fontSizeNormal,
            font: mainFont,
          });
        }
        currentY -= lineHeight * 1.1;
      }
    }

    // Subparts
    const subLabels = ["a", "b", "c", "d", "e", "f"];
    if (Array.isArray(q.subparts)) {
      q.subparts.forEach((sp, i) => {
        drawQuestion(sp, `${prefix}${subLabels[i]}`, indent + 20);
      });
    }

    currentY -= lineHeight * 0.8;
  };

  (paper.questions || []).forEach((q, i) => drawQuestion(q, `${i + 1}`));

  // ---------- ANSWER KEY ----------
  if (Array.isArray(paper.answerKey) && paper.answerKey.length > 0) {
    addNewPage();
    currentPage.drawText("Answer Key", {
      x: margin,
      y: currentY,
      size: fontSizeHeader,
      font: boldFont,
    });
    currentY -= lineHeight * 2;

    paper.answerKey.forEach((a) => {
      const label =
        a.subpartIndex != null
          ? `${a.questionIndex + 1}${a.subpartIndex}`
          : `${a.questionIndex + 1}`;
      drawTextAndWrap({
        text: `${label}. ${sanitizeText(a.answer)}`,
        x: margin,
        y: currentY,
        size: fontSizeNormal,
        font: mainFont,
      });
      currentY -= lineHeight * 0.5;
    });
  }

  // ---------- FINALIZE ----------
  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
};

module.exports = { exportPaperToPdfBuffer };
