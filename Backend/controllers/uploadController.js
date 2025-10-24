const fs = require("fs");
const path = require("path");
const Reference = require("../model/Genration/Reference.js");
const { ingestPdfToChroma } = require("../services/ai/ragService.js");

// Use the new package 'pdf-parse-new'
const pdf = require("pdf-parse-new");

const handleUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: "No file uploaded" });
    }

    const { filename, path: filepath, originalname, size } = req.file;

    // 1️⃣ Save file metadata in Reference collection
    const ref = await Reference.create({
      originalName: originalname,
      filename,
      path: filepath,
      size,
      uploadedBy: req.user._id,
    });

    // 2️⃣ Read file buffer
    const dataBuffer = fs.readFileSync(filepath);

    // 3️⃣ Parse PDF text (using the new 'pdf' variable)
    console.log("Parsing PDF buffer...");
    const parsed = await pdf(dataBuffer);
    const text = parsed?.text || "";
    console.log(`Parsed ${text.length} characters from PDF.`);

    // 4️⃣ Ingest into Chroma via RAG service
    console.log("Ingesting text into ChromaDB...");
    const ingestResult = await ingestPdfToChroma({
      refId: ref._id.toString(),
      buffer: dataBuffer, // Passing buffer, as your service might need it
      text: text, // Also passing the extracted text
      filename: originalname,
    });

    // 5️⃣ Update reference document with ingestion info
    ref.chunksCount = ingestResult?.chunksCount || 0;
    ref.metadata = { ingestResult };
    await ref.save();

    console.log("Upload and ingestion complete.");
    // 6️⃣ Respond
    res.status(200).json({
      msg: "File uploaded and ingested successfully",
      reference: ref,
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({
      msg: "Upload failed",
      error: err.message,
    });
  }
};

module.exports = { handleUpload };