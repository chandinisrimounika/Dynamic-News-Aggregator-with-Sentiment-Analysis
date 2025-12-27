import "./App.css";
import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const API_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api/news";

function App() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [sentimentFilter, setSentimentFilter] = useState("All");

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        setNews(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching news:", err);
        setLoading(false);
      });
  }, []);

  // 📊 Sentiment counts
  const positiveCount = news.filter(n => n.sentiment === "Positive").length;
  const neutralCount  = news.filter(n => n.sentiment === "Neutral").length;
  const negativeCount = news.filter(n => n.sentiment === "Negative").length;

  // 🔍 Filtered news
  const filteredNews = news.filter(article => {
    const matchesSearch = article.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesSentiment =
      sentimentFilter === "All" ||
      article.sentiment === sentimentFilter;

    return matchesSearch && matchesSentiment;
  });

  // 🥧 Pie chart data
  const pieData = {
    labels: ["Positive", "Neutral", "Negative"],
    datasets: [
      {
        data: [positiveCount, neutralCount, negativeCount],
        backgroundColor: ["#2ecc71", "#95a5a6", "#e74c3c"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="app-container">
      {/* HEADER */}
      <div className="header">
        <h1>📰 Dynamic News Aggregator</h1>
      </div>

      {/* SEARCH */}
      <input
        className="search-bar"
        placeholder="Search news..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* FILTERS */}
      <div className="filters">
        {["All", "Positive", "Neutral", "Negative"].map(type => (
          <button
            key={type}
            className={sentimentFilter === type ? "active" : ""}
            onClick={() => setSentimentFilter(type)}
          >
            {type}
          </button>
        ))}
      </div>

      {/* MAIN LAYOUT */}
      <div className="main-layout">

        {/* LEFT: NEWS LIST */}
        <div className="news-section">
          {loading && <p className="center-text">Loading news...</p>}

          {!loading && filteredNews.length === 0 && (
            <p className="center-text">No news found.</p>
          )}

          {!loading &&
            filteredNews.map(article => (
              <div className="news-card" key={article._id}>
                <div className="news-title">{article.title}</div>

                <div className="meta">
                  Source: {article.source} | Category: {article.category}
                </div>

                <span className={`sentiment ${article.sentiment.toLowerCase()}`}>
                  {article.sentiment}
                </span>

                <br />

                <a
                  className="read-link"
                  href={article.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  Read full article →
                </a>
              </div>
            ))}
        </div>

        {/* RIGHT: FIXED PIE CHART */}
        <div className="chart-section">
          <h3>📊 Sentiment Overview</h3>
          <Pie data={pieData} />
        </div>

      </div>
    </div>
  );
}

export default App;
