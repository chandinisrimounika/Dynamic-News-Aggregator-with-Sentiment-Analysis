const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const analyzeSentiment = async (text) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "models/gemini-1.5-flash",
    });

    const prompt = `
Classify the sentiment of the following news headline.
Respond with ONLY one word:
Positive, Neutral, or Negative.

Headline: "${text}"
`;

    const result = await model.generateContent(prompt);
    const output = result.response.text().trim().toLowerCase();

    if (output.includes("positive")) return "Positive";
    if (output.includes("negative")) return "Negative";
    return "Neutral";
  } catch (err) {
    // Silently fallback to Neutral (production-safe)
    return "Neutral";
  }
};

module.exports = analyzeSentiment;
