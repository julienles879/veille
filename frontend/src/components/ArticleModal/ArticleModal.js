import React, { useState, useEffect } from "react";
import styles from "./ArticleModal.module.css";
import api from "../../api";

const ArticleModal = ({ article, onClose }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    api
      .get("/articles/favorites/")
      .then((response) => {
        const isAlreadyFavorite = response.data.some((fav) => fav.id === article.id);
        setIsFavorite(isAlreadyFavorite);
      })
      .catch((error) =>
        console.error("Erreur de récupération des favoris :", error)
      );
  }, [article.id]);

  const toggleFavorite = async () => {
    try {
      if (isFavorite) {
        await api.delete(`/articles/favorites/remove/${article.id}/`);
      } else {
        await api.post(`/articles/favorites/add/`, {
          article_id: article.id,
        });
      }

      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error("Erreur réseau :", error);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>✖</button>

        <h2 className={styles.title}>{article.title}</h2>
        <p className={styles.date}>📅 {new Date(article.published_at).toLocaleDateString("fr-FR")}</p>
        <p className={styles.category}>📂 Catégorie : {article.category || "Non spécifiée"}</p>
        <p className={styles.feed}>📰 Source : {article.feed_title || "Inconnue"}</p>

        <div className={styles.tagsContainer}>
          {article.tags && article.tags.length > 0 ? (
            article.tags.map((tag, index) => (
              <span key={index} className={styles.tag}>
                #{tag}
              </span>
            ))
          ) : (
            <span className={styles.noTags}>Aucun tag</span>
          )}
        </div>

        <div className={styles.imageContainer}>
          {article.image ? (
            <img
              src={article.image}
              alt={article.title}
              className={styles.image}
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://placehold.co/600x300?text=Image+indisponible";
              }}
            />
          ) : (
            <div className={styles.placeholder}>Pas d'image</div>
          )}
        </div>

        <p className={styles.description}>{article.content}</p>

        <button className={styles.favoriteButton} onClick={toggleFavorite}>
          {isFavorite ? "❤️ Retirer des favoris" : "🤍 Ajouter aux favoris"}
        </button>

        <a
          href={article.link}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.articleLink}
        >
          Lire l'article original ➔
        </a>
      </div>
    </div>
  );
};

export default ArticleModal;
