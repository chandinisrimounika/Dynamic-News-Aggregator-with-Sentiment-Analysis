const express = require("express");
const router = express.Router();

const {
  fetchAndSaveNews,
  getAllNews,
  toggleBookmark,
} = require("../controllers/newsController");

router.get("/fetch", fetchAndSaveNews);
router.get("/", getAllNews);
router.patch("/bookmark/:id", toggleBookmark);

module.exports = router;
