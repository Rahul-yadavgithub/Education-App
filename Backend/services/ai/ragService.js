// services/ai/ragService.js
const fs = require("fs");
const path = require("path");
const { InferenceClient } = require("@huggingface/inference");
const { Chroma } = require("@langchain/community/vectorstores/chroma");
const { RecursiveCharacterTextSplitter } = require("@langchain/textsplitters");
const dotenv = require("dotenv");
const pdf = require("pdf-parse-new");

dotenv.config();

const PERSIST_DIR = process.env.CHROMA_PERSIST_DIR || path.join(__dirname, "../../chroma_data");
const HF_TOKEN = process.env.HF_TOKEN;

// Make sure persistence directory exists
if (!fs.existsSync(PERSIST_DIR)) fs.mkdirSync(PERSIST_DIR, { recursive: true });

const client = new InferenceClient(HF_TOKEN);

/* ----------------------------------------------------------
  HuggingFace Embeddings Wrapper
----------------------------------------------------------- */
class HuggingFaceEmbeddings {
  constructor(model = "sentence-transformers/all-MiniLM-L6-v2") {
    this.model = model;
  }

  async embedDocuments(texts) {
    const vectors = [];
    for (const t of texts) {
      vectors.push(await this._embedSingle(t));
    }
    return vectors;
  }

  async embedQuery(text) {
    return this._embedSingle(text);
  }

  async _embedSingle(text) {
    const result = await client.featureExtraction({
      model: this.model,
      inputs: text,
    });
    // result is nested array [[vector]]
    return Array.isArray(result[0]) ? result[0] : result;
  }
}

const hfEmbeddings = new HuggingFaceEmbeddings();

/* ----------------------------------------------------------
  Ingest PDF → Split → Embed → Save to Chroma
----------------------------------------------------------- */
const ingestPdfToChroma = async ({ refId, buffer, filename }) => {
  console.log("📘 Processing PDF:", filename);

  const data = await pdf(buffer);
  const text = data.text || "";
  if (!text.trim()) throw new Error("PDF is empty or unreadable.");

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  const docs = await splitter.createDocuments([text]);
  console.log(`🧩 Split into ${docs.length} chunks.`);

  // Embed each chunk
  const vectors = await hfEmbeddings.embedDocuments(docs.map((d) => d.pageContent));
  for (let i = 0; i < docs.length; i++) {
    docs[i].metadata.vector = vectors[i];
  }

  // ✅ Correct usage: embedding object is 1st argument
  const vectorstore = await Chroma.fromDocuments(docs, hfEmbeddings, {
    collectionName: `ref_${refId}`,
    persistDirectory: PERSIST_DIR,
    embeddingFunction: (doc) => doc.metadata.vector,
  });

  if (vectorstore.persist) await vectorstore.persist();
  console.log(`✅ Chroma collection saved as ref_${refId}`);

  return { refId, chunksCount: docs.length, collectionName: `ref_${refId}` };
};


/* ----------------------------------------------------------
  Fetch Context from Chroma Collections
----------------------------------------------------------- */
const fetchContextFromRag = async (referenceIds = [], { topK = 5 } = {}) => {
  const results = [];

  for (const refId of referenceIds) {
    const collectionName = `ref_${refId}`;
    console.log(`📂 Loading Chroma collection: ${collectionName}`);

    let vs;
    try {
      vs = await Chroma.fromExistingCollection({
        collectionName,
        persistDirectory: PERSIST_DIR,
        embeddingFunction: async (text) => await hfEmbeddings.embedQuery(text),
      });
    } catch (err) {
      console.warn(`⚠️ Failed to load collection ${collectionName}:`, err.message);
      continue;
    }

    try {
      const docs = await vs.similaritySearch("", topK);
      results.push(...docs.map((d) => d.pageContent));
    } catch (err) {
      console.warn("⚠️ RAG retrieval failed:", err.message);
    }
  }

  return results;
};

module.exports = { ingestPdfToChroma, fetchContextFromRag };
