const mongoose =
  require("mongoose");

const faqSchema =
  new mongoose.Schema({
    question: String,

    answer: String,
  });

const seoPageSchema =
  new mongoose.Schema(
    {
      slug: {
        type: String,
        unique: true,
      },

      city: String,

      category: String,

      title: String,

      metaTitle: String,

      metaDescription:
        String,

      heading: String,

      introContent:
        String,

      mainContent:
        String,

      faq: [faqSchema],

      keywords: [String],

      generatedByAI: {
        type: Boolean,
        default: true,
      },

      published: {
        type: Boolean,
        default: true,
      },

      createdAt: {
        type: Date,
        default:
          Date.now,
      },
    }
  );

module.exports =
  mongoose.model(
    "SeoPage",
    seoPageSchema
  );