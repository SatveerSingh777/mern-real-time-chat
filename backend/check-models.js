const { GoogleGenerativeAI } = require("@google/generative-ai");

const API_KEY = "AIzaSyAxP49UbAv253bx4TFMYxfaIOTOsI3lAow";  // ← put your real key
const genAI = new GoogleGenerativeAI(API_KEY);

async function listModels() {
  try {
    const models = await genAI.listModels();
    console.log("Available models for your API key:");
    models.models.forEach(model => {
      console.log("- " + model.name);
      console.log("  Supported methods: " + (model.supportedGenerationMethods || "Not listed"));
      console.log("---");
    });
  } catch (error) {
    console.error("Error:", error.message);
  }
}

listModels();