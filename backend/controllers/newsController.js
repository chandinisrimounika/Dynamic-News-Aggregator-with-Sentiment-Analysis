const Article = require("../models/Article");
const scrapeNews = require("../services/scraper");
const analyzeSentiment = require("../services/sentiment");

const fetchAndSaveNews = async (req, res) => {
  try {
    const articles = await scrapeNews();
    let savedCount = 0;

    for (let article of articles) {
      const exists = await Article.findOne({ title: article.title });

      if (!exists) {
        const sentiment = await analyzeSentiment(article.title);
        await Article.create({ ...article, sentiment });
        savedCount++;
      }
    }

    res.json({ message: "Fetched", savedCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAllNews = async (req, res) => {
  const news = await Article.find().sort({ createdAt: -1 });
  res.json(news);
};

const toggleBookmark = async (req, res) => {
  const article = await Article.findById(req.params.id);
  article.bookmarked = !article.bookmarked;
  await article.save();
  res.json(article);
};

module.exports = { fetchAndSaveNews, getAllNews, toggleBookmark };
