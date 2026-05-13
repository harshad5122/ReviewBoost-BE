const slugify = require("slugify");

const SeoPage = require("../models/SeoPage");

const generateSeoContent = require("../services/seoContentService");

exports.generateSeoPage = async (req, res) => {
  try {
    const { category, city } = req.body;

    const slug = slugify(`best-${category}-in-${city}`, {
      lower: true,
      strict: true,
    });

    // CHECK EXISTING PAGE

    const existingPage = await SeoPage.findOne({
      slug,
    });

    if (existingPage) {
      return res.status(200).json({
        success: true,
        seoPage: existingPage,
      });
    }

    // GENERATE AI CONTENT

    const aiContent = await generateSeoContent({
      category,
      city,
    });

    // SAVE PAGE

    const seoPage = await SeoPage.create({
      slug,

      city,

      category,

      title:
        typeof aiContent.title === "object"
          ? aiContent.title.content || ""
          : aiContent.title || "",

      metaTitle:
        typeof aiContent.metaTitle === "object"
          ? aiContent.metaTitle.content || ""
          : aiContent.metaTitle || "",

      metaDescription:
        typeof aiContent.metaDescription === "object"
          ? aiContent.metaDescription.content || ""
          : aiContent.metaDescription || "",

      heading:
        typeof aiContent.heading === "object"
          ? aiContent.heading.content || ""
          : aiContent.heading || "",

      introContent:
        typeof aiContent.introduction === "object"
          ? aiContent.introduction.content || ""
          : aiContent.introduction || "",

      mainContent:
        typeof aiContent.mainContent === "object"
          ? aiContent.mainContent.content || ""
          : aiContent.mainContent || "",

      faq: Array.isArray(aiContent.faq) ? aiContent.faq : [],

      keywords: Array.isArray(aiContent.keywords) ? aiContent.keywords : [],
    });

    res.status(201).json({
      success: true,

      seoPage,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getSeoPage = async (req, res) => {
  try {
    const page = await SeoPage.findOne({
      slug: req.params.slug,
    });

    if (!page) {
      return res.status(404).json({
        success: false,
        message: "Page not found",
      });
    }

    res.status(200).json({
      success: true,

      page,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
