import React, { useEffect, useState } from "react";
import CardArticle from "./CardArticle"; // Ajuste le chemin si besoin

const ArticlesList = () => {
  const [articles, setArticles] = useState([]);

  // Charger les articles depuis l'API
  useEffect(() => {
    fetch("http://127.0.0.1:8000/articles/")
      .then((res) => res.json())
      .then((data) => setArticles(data))
      .catch((err) => console.error("Erreur lors du chargement des articles :", err));
  }, []);

  return (
    <div style={styles.grid}>
      {articles.map((article) => (
        <CardArticle key={article.id} article={article} />
      ))}
    </div>
  );
};

const styles = {
  grid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "20px",
    justifyContent: "center",
  },
};

export default ArticlesList;
