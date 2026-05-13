const generateSeoContent =
  async ({
    category,
    city,
  }) => {

    try {

      const prompt = `
Generate SEO optimized content.

Category:
${category}

City:
${city}

Generate:

1. SEO Title
2. Meta Description
3. Introduction
4. Main Content
5. 5 FAQs

Requirements:
- Human sounding
- SEO optimized
- Local keywords
- Professional
- 800-1200 words
- Easy readability
- No keyword stuffing

Return JSON format.
`;

      const response =
        await fetch(
          "https://api.groq.com/openai/v1/chat/completions",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${process.env.GROQ_API_KEY}`,
            },

            body: JSON.stringify(
              {
                model:
                  "llama-3.3-70b-versatile",

                messages: [
                  {
                    role:
                      "user",

                    content:
                      prompt,
                  },
                ],

                temperature:
                  0.7,

                max_tokens:
                  2000,

                response_format:
                  {
                    type:
                      "json_object",
                  },
              }
            ),
          }
        );

      const data =
        await response.json();

      if (data.error) {

        throw new Error(
          data.error.message
        );

      }

      return JSON.parse(
        data.choices[0]
          .message.content
      );

    } catch (error) {

      throw new Error(
        error.message
      );

    }
  };

module.exports =
  generateSeoContent;