// testLLM.js
const { callLLM } = require("./services/ai//aiClient");

(async () => {
  try {
    const res = await callLLM("Explain the concept of gravitational waves.");
    console.log("AI Response:\n", res.response);
  } catch (err) {
    console.error(err);
  }
})();
