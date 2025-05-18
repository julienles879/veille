import React, { useEffect, useState } from "react";
import styles from "./ArticleModal.module.css";

const ArticleModal = ({ article, onClose }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`http://127.0.0.1:8000/articles/favorites/`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    })
      .then((response) => response.json())
      .then((favorites) => {
        const isAlreadyFavorite = favorites.some((fav) => fav.id === article.id);
        setIsFavorite(isAlreadyFavorite);
      })
      .catch((error) => console.error("Erreur de récupération des favoris :", error));
  }, [article.id]);

  const toggleFavorite = async () => {
    const token = localStorage.getItem("token");
    const apiUrl = isFavorite
      ? `http://127.0.0.1:8000/articles/favorites/remove/${article.id}/`
      : `http://127.0.0.1:8000/articles/favorites/add/`;

    const method = isFavorite ? "DELETE" : "POST";
    const body = isFavorite ? null : JSON.stringify({ article_id: article.id });

    try {
      const response = await fetch(apiUrl, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body,
      });
      if (response.ok) setIsFavorite(!isFavorite);
    } catch (error) {
      console.error("Erreur réseau :", error);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>✖</button>

        <div className={styles.header}>
          <h2 className={styles.title}>{article.title}</h2>
          <p className={styles.date}>📅 {new Date(article.published_at).toLocaleDateString("fr-FR")}</p>
        </div>

        <div className={styles.meta}>
          <p className={styles.category}>📂 {article.category || "Non spécifiée"}</p>
          <p className={styles.feed}>📰 {article.feed_title || "Inconnue"}</p>
        </div>

        <div className={styles.tagsContainer}>
          {article.tags?.length ? (
            article.tags.map((tag, i) => <span key={i} className={styles.tag}>#{tag}</span>)
          ) : <span className={styles.noTags}>Aucun tag</span>}
        </div>

        <div className={styles.imageContainer}>
          {article.image ? (
            <img
              src={article.image}
              alt={article.title}
              className={styles.image}
              referrerPolicy="no-referrer"
              onError={(e) => { e.target.src = "https://placehold.co/600x300?text=Image+indisponible"; }}
            />
          ) : <div className={styles.placeholder}>Pas d'image</div>}
        </div>

        <div className={styles.description}>{article.content}</div>

        <div className={styles.actions}>
          <button className={styles.favoriteButton} onClick={toggleFavorite}>
            {isFavorite ? "❤️ Retirer des favoris" : "🤍 Ajouter aux favoris"}
          </button>
          <a href={article.link} target="_blank" rel="noopener noreferrer" className={styles.articleLink}>
            🔗 Lire l'article original
          </a>
        </div>
      </div>
    </div>
  );
};

export default ArticleModal;
