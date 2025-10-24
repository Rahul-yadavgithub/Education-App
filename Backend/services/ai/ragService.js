// services/ragService.js

const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();

const { RecursiveCharacterTextSplitter } = require("@langchain/textsplitters");
const { PDFLoader } = require("@langchain/community/document_loaders/fs/pdf");
const { Chroma } = require("@langchain/community/vectorstores/chroma");
const { OpenAIEmbeddings } = require("@langchain/openai");
const Reference = require("../../model/Genration/Reference.js");

const PERSIST_DIR = process.env.CHROMA_PERSIST_DIR || "./chroma_data";

const pdf = require("pdf-parse-new");

/**
 * Ingest PDF buffer into Chroma vectorstore
 * @param {Object} param0
 * @param {string} param0.refId - reference id for collection
 * @param {Buffer} param0.buffer - PDF file buffer
 * @param {string} param0.filename - PDF file name
 */
const ingestPdfToChroma = async ({ refId, buffer, filename }) => {
  if (!pdf) throw new Error("pdf-parse not loaded");

  const data = await pdf(buffer);
  const text = data.text || "";

  const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000, chunkOverlap: 200 });
  const docs = await splitter.createDocuments([text]);

  const embeddings = new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_API_KEY });

  const vectorstore = await Chroma.fromDocuments(docs, embeddings, {
    collectionName: `ref_${refId}`,
    persistDirectory: PERSIST_DIR
  });

  if (typeof vectorstore.persist === "function") {
    await vectorstore.persist();
  }

  return { refId, chunksCount: docs.length, collectionName: `ref_${refId}` };
};

/**
 * Fetch top-K context chunks from RAG vectorstore
 * @param {string[]} referenceIds
 * @param {Object} options
 * @param {number} options.topK
 * @returns {string[]} Array of text chunks
 */
const fetchContextFromRag = async (referenceIds = [], { topK = 5 } = {}) => {
  const embeddings = new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_API_KEY });
  const results = [];

  for (const refId of referenceIds) {
    const collectionName = `ref_${refId}`;
    const vs = await Chroma.fromExistingCollection(embeddings, { collectionName, persistDirectory: PERSIST_DIR }).catch(() => null);
    if (!vs) continue;

    try {
      const docs = await vs.similaritySearch("", topK);
      docs.forEach((d) => results.push(d.pageContent));
    } catch (err) {
      console.warn("RAG retrieval warning:", err?.message || err);
    }
  }

  return results;
};

module.exports = { ingestPdfToChroma, fetchContextFromRag };
