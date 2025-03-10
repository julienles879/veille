//src/pages/ArticleDetail/ArticleDetail.js

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../api";
import styles from "./ArticleDetail.module.css"; 

const ArticleDetail = ({ isModal = false, onClose }) => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/articles/${id}/`)
      .then((response) => {
        setArticle(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erreur lors du chargement de l'article :", error);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Chargement...</p>;
  if (!article) return <p>Article non trouvé.</p>;

  return (
    <div className={isModal ? styles.overlay : ""} onClick={isModal ? onClose : undefined}>
      <div className={`${styles.articleCard} ${isModal ? styles.modal : ""}`} onClick={(e) => e.stopPropagation()}>
        {isModal && (
          <button className={styles.closeButton} onClick={onClose}>✖</button>
        )}

        <div className={styles.imageContainer}>
          {article.image ? (
            <img
              src={article.image}
              alt={article.title}
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

        <div className={styles.articleContent}>
          <h2 className={styles.articleTitle}>{article.title}</h2>
          <p className={styles.articleDate}>
            {new Date(article.published_at).toLocaleDateString("fr-FR")}
          </p>
          <p className={styles.articleCategory}>
            Catégorie : {article.category || "Non spécifiée"}
          </p>
          <p className={styles.articleFeed}>
            Source : {article.feed_title || "Inconnue"}
          </p>

          <div className={styles.articleDescription}>
            <p>{article.content}</p>
          </div>

          <a
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.articleLink}
          >
            Lire l'article original ➔
          </a>

          {!isModal && (
            <div>
              <Link to="/" className={styles.backLink}>
                ⬅ Retour aux articles
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail;
