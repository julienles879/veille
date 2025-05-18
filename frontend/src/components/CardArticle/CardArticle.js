// src/components/CadArticle/CardArticle.js

import React from "react";
import styles from "./CardArticle.module.css";

const CardArticle = ({ article, isFavorite = false, onToggleFavorite, onArticleSelect }) => {
  const { id, title, published_at, image, category, feed_title, tags } = article;

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    onToggleFavorite?.(id, isFavorite);
  };

  return (
    <div className={styles.card} onClick={() => onArticleSelect?.(article)}>
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
          {tags?.length > 0 ? (
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

      <button className={styles.favoriteButton} onClick={handleFavoriteClick}>
        {isFavorite ? "❤️" : "🤍"}
      </button>
    </div>
  );
};

export default CardArticle;
