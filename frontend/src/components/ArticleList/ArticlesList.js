// src/components/ArticlesList.js

import React, { useEffect, useState } from "react";
import CardArticle from "../CadArticle/CardArticle";
import styles from "./ArticlesList.module.css";

const ArticlesList = () => {
  const [articles, setArticles] = useState([]);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    // 🔄 Charger les articles
    fetch("http://127.0.0.1:8000/articles/")
      .then((res) => res.json())
      .then((data) => setArticles(data))
      .catch((err) =>
        console.error("Erreur lors du chargement des articles :", err)
      );

    // 🔐 Charger les favoris
    const token = localStorage.getItem("token");
    if (token) {
      fetch("http://127.0.0.1:8000/articles/favorites/", {
        headers: {
          Authorization: `Token ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => setFavorites(data.map((fav) => fav.id)))
        .catch((err) =>
          console.error("Erreur lors du chargement des favoris :", err)
        );
    }
  }, []);

  const toggleFavorite = async (articleId, isCurrentlyFavorite) => {
    const token = localStorage.getItem("token");
    const url = isCurrentlyFavorite
      ? `http://127.0.0.1:8000/articles/favorites/remove/${articleId}/`
      : `http://127.0.0.1:8000/articles/favorites/add/`;

    const method = isCurrentlyFavorite ? "DELETE" : "POST";
    const body = isCurrentlyFavorite ? null : JSON.stringify({ article_id: articleId });

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body,
      });

      if (response.ok) {
        setFavorites((prev) =>
          isCurrentlyFavorite
            ? prev.filter((id) => id !== articleId)
            : [...prev, articleId]
        );
      }
    } catch (err) {
      console.error("Erreur lors du changement de favori :", err);
    }
  };

  return (
    <div className={styles.articlesGrid}>
      {articles.map((article) => (
        <CardArticle
          key={article.id}
          article={article}
          isFavorite={favorites.includes(article.id)}
          onToggleFavorite={toggleFavorite}
        />
      ))}
    </div>
  );
};

export default ArticlesList;
