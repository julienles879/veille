import React, { useEffect, useState } from "react";
import CardArticle from "../CadArticle/CardArticle";
import styles from "./ArticlesList.module.css";
import api from "../../api"; // ✅ Import de l'instance axios

const ArticlesList = () => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    api
      .get("/articles/")
      .then((res) => setArticles(res.data))
      .catch((err) =>
        console.error("Erreur lors du chargement des articles :", err)
      );
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
