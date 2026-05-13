const generateReview = async (data) => {
  try {

    const prompt = `
Generate a professional and human sounding Google review.

Business Name: ${data.businessName}
Category: ${data.category}
City: ${data.city}
Rating: ${data.rating}
Service Used: ${data.service}
Tone: ${data.tone}
Language: ${data.language}

Requirements:
- SEO friendly
- Natural human tone
- 80-120 words
- No emojis
- Include local keywords naturally
- Sound authentic
`;

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",

          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },

        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",

          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],

          temperature: 0.7,

          max_tokens: 300,
        }),
      }
    );

    const dataResponse = await response.json();

    if (dataResponse.error) {
      throw new Error(dataResponse.error.message);
    }

    return dataResponse.choices[0].message.content;

  } catch (error) {

    console.log("AI Service Error:", error.message);

    throw new Error(error.message);
  }
};

module.exports = generateReview;