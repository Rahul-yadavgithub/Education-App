const fs = require("fs");
const path = require("path");
const Reference = require("../model/Genration/Reference.js");
const { ingestPdfToChroma } = require("../services/ai/ragService.js");
const pdf = require("pdf-parse-new");

const handleUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: "No file uploaded" });
    }

    const { filename, path: filepath, originalname, size } = req.file;

    // 1️⃣ Save file metadata
    const ref = await Reference.create({
      originalName: originalname,
      filename,
      path: filepath,
      size,
      uploadedBy: req.user._id,
    });

    // 2️⃣ Read buffer
    const dataBuffer = fs.readFileSync(filepath);

    // 3️⃣ Ingest into Chroma via RAG (HF embeddings handled internally)
    console.log("Ingesting text into ChromaDB...");
    const ingestResult = await ingestPdfToChroma({
      refId: ref._id.toString(),
      buffer: dataBuffer,
      filename: originalname,
    });

    // 4️⃣ Update reference document
    ref.chunksCount = ingestResult?.chunksCount || 0;
    ref.metadata = { ingestResult };
    await ref.save();

    console.log("Upload and ingestion complete.");
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
