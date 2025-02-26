import React from "react";
import styles from "./ArticleModal.module.css"; 

const ArticleModal = ({ article, onClose }) => {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>✖</button>
        
        <h2 className={styles.title}>{article.title}</h2>
        <p className={styles.date}>📅 {new Date(article.published_at).toLocaleDateString("fr-FR")}</p>
        <p className={styles.category}>📂 Catégorie : {article.category || "Non spécifiée"}</p>
        <p className={styles.feed}>📰 Source : {article.feed_title || "Inconnue"}</p>

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

        <a href={article.link} target="_blank" rel="noopener noreferrer" className={styles.articleLink}>
          Lire l'article original ➔
        </a>
      </div>
    </div>
  );
};

export default ArticleModal;
