const {
  GoogleGenerativeAI,
} = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
);

const generateReview = async (data) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-pro"
    });

    const prompt = `
Generate a natural and human sounding Google review.

Business Name: ${data.businessName}
Category: ${data.category}
City: ${data.city}
Rating: ${data.rating}
Service Used: ${data.service}
Tone: ${data.tone}
Language: ${data.language}

Requirements:
- SEO friendly
- Human sounding
- Professional
- 80-120 words
- Include local keywords naturally
- No fake claims
- No emojis
`;

    const result =
      await model.generateContent(prompt);

    return result.response.text();
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = generateReview;