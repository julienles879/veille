import React, { useEffect, useState } from "react";
import styles from "./CardArticle.module.css";

const CardArticle = ({ article, onArticleSelect }) => {
  const { id, title, published_at, image, category, feed_title, tags } = article;

  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`http://127.0.0.1:8000/articles/favorites/`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Unauthorized");
        }
        return response.json();
      })
      .then((favorites) => {
        const isAlreadyFavorite = favorites.some((fav) => fav.id === id);
        setIsFavorite(isAlreadyFavorite);
      })
      .catch((error) =>
        console.error("Erreur de récupération des favoris :", error)
      );
  }, [id]);

  const toggleFavorite = async (event) => {
    event.stopPropagation();

    const token = localStorage.getItem("token");

    const apiUrl = isFavorite
      ? `http://127.0.0.1:8000/articles/favorites/remove/${id}/`
      : `http://127.0.0.1:8000/articles/favorites/add/`;

    const method = isFavorite ? "DELETE" : "POST";
    const body = isFavorite ? null : JSON.stringify({ article_id: id });

    try {
      const response = await fetch(apiUrl, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: body,
      });

      if (response.ok) {
        setIsFavorite(!isFavorite);
      }
    } catch (error) {
      console.error("Erreur réseau :", error);
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
              e.target.src =
                "https://placehold.co/350x200?text=Image+indisponible";
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
