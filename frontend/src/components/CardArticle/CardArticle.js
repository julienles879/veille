import React from "react";
import api from "../../api";
import styles from "./CardArticle.module.css"; // ✅ Import du CSS

const CardArticle = ({ article, onArticleSelect }) => {
  const { id, title, published_at, image, category, feed_title } = article;

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" };
    return new Date(dateString).toLocaleDateString("fr-FR", options);
  };

  const handleArticleClick = async () => {
    console.log(`👀 Consultation de l'article : ${title}`);

    try {
      await api.post(`/articles/${id}/update_last_viewed/`, { article_id: id });
      console.log("✅ Dernière consultation mise à jour !");
    } catch (error) {
      console.error("❌ Erreur lors de la mise à jour de la consultation :", error);
    }

    // 🚀 Afficher la modale avec l'article sélectionné
    if (onArticleSelect) {
      onArticleSelect(article);
    }
  };

  return (
    <div className={styles.card} onClick={handleArticleClick}>
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
        <p className={styles.date}>🕒 {formatDate(published_at)}</p>
        <p className={styles.category}>📂 Catégorie : <strong>{category || "Non spécifiée"}</strong></p>
        <p className={styles.feed}>📰 Source : <strong>{feed_title}</strong></p>
      </div>
    </div>
  );
};

export default CardArticle;
