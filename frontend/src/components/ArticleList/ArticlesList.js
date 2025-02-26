import React, { useEffect, useState } from "react";
import CardArticle from "../CadArticle/CardArticle";
import styles from "./ArticlesList.module.css"; // ✅ Import du fichier CSS modulaire

const ArticlesList = () => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/articles/")
      .then((res) => res.json())
      .then((data) => setArticles(data))
      .catch((err) => console.error("Erreur lors du chargement des articles :", err));
  }, []);

  return (
    <div className={styles.articlesGrid}>
      {articles.map((article) => (
        <CardArticle key={article.id} article={article} />
      ))}
    </div>
  );
};

export default ArticlesList;
