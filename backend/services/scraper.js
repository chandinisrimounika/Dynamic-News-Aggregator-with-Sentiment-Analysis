const axios = require("axios");
const cheerio = require("cheerio");

const scrapeNews = async () => {
  const url = "https://news.ycombinator.com/";

  const response = await axios.get(url);
  const html = response.data;

  const $ = cheerio.load(html);
  const articles = [];

  $(".athing").each((index, element) => {
    const title = $(element).find(".titleline a").text();
    const link = $(element).find(".titleline a").attr("href");

    if (title && link) {
      articles.push({
        title,
        url: link,
        source: "Hacker News",
        category: "Technology",
      });
    }
  });

  return articles;
};

module.exports = scrapeNews;
