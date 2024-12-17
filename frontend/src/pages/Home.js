import React, { useEffect, useState } from "react";
import api from "../api";

const Home = () => {
  const [articles, setArticles] = useState([]);
  const [limit, setLimit] = useState(30);

  const fetchArticles = (selectedLimit) => {
    api
      .get(`/feeds/articles/recent/?limit=${selectedLimit}`)
      .then((response) => setArticles(response.data))
      .catch((error) => console.error("Erreur lors de la récupération des articles récents :", error));
  };

  useEffect(() => {
    fetchArticles(limit);
  }, [limit]);

  return (
    <div>
      <h1>Articles Récents</h1>
      <div>
        <label>Afficher par :</label>
        <select value={limit} onChange={(e) => setLimit(parseInt(e.target.value, 10))}>
          <option value="30">30 articles</option>
          <option value="40">40 articles</option>
          <option value="50">50 articles</option>
        </select>
      </div>
      <div>
        {articles.map((article) => (
          <div key={article.id} style={{ marginBottom: "20px" }}>
            <h3>{article.title}</h3>
            <p>{article.content}</p>
            <a href={article.link} target="_blank" rel="noopener noreferrer">
              Lire plus
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
