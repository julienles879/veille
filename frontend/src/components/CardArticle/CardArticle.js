import React, { useState, useEffect } from "react";
import styles from "./CardArticle.module.css";
import api from "../../api";

const CardArticle = ({ article, onArticleSelect }) => {
  const { id, title, published_at, image, category, feed_title, tags } = article;

  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    api
      .get("/articles/favorites/")
      .then((response) => {
        const isAlreadyFavorite = response.data.some((fav) => fav.id === id);
        setIsFavorite(isAlreadyFavorite);
      })
      .catch((error) =>
        console.error("Erreur de récupération des favoris :", error)
      );
  }, [id]);

  const toggleFavorite = async (event) => {
    event.stopPropagation();

    try {
      if (isFavorite) {
        await api.delete(`/articles/favorites/remove/${id}/`);
      } else {
        await api.post(`/articles/favorites/add/`, { article_id: id });
      }

      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error("Erreur lors du changement de favori :", error);
    }
  };

  return (
    <div className={styles.card} onClick={() => onArticleSelect(article)}>
      <div className={styles.imageContainer}>
        {image ? (
          <img
            src={image}
            alt={title}
            className={styles.image}
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://placehold.co/350x200?text=Image+indisponible";
            }}
          />
        ) : (
          <div className={styles.placeholder}>Pas d'image</div>
        )}
      </div>

      <div className={styles.content}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.date}>
          🕒 {new Date(published_at).toLocaleDateString("fr-FR")}
        </p>
        <p className={styles.category}>
          📂 Catégorie : <strong>{category || "Non spécifiée"}</strong>
        </p>
        <p className={styles.feed}>
          📰 Source : <strong>{feed_title}</strong>
        </p>

        <div className={styles.tagsContainer}>
          {tags && tags.length > 0 ? (
            tags.map((tag, index) => (
              <span key={index} className={styles.tag}>
                #{tag}
              </span>
            ))
          ) : (
            <span className={styles.noTags}>Aucun tag</span>
          )}
        </div>
      </div>

      <button className={styles.favoriteButton} onClick={toggleFavorite}>
        {isFavorite ? "❤️" : "🤍"}
      </button>
    </div>
  );
};

export default CardArticle;
