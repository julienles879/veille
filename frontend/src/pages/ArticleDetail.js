import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api";

const ArticleDetail = () => {
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
    <div style={styles.card}>
      <div style={styles.imageContainer}>
        {article.image ? (
          <img
            src={article.image}
            alt={article.title}
            style={styles.image}
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://placehold.co/350x200?text=Image+indisponible";
            }}
          />
        ) : (
          <div style={styles.placeholder}>Pas d'image</div>
        )}
      </div>

      <div style={styles.content}>
        <h2 style={styles.title}>{article.title}</h2>
        <p style={styles.date}>{new Date(article.published_at).toLocaleDateString("fr-FR")}</p>
        <p style={styles.category}>Catégorie : {article.category || "Non spécifiée"}</p>
        <p style={styles.feed}>Source : {article.feed_title || "Inconnue"}</p>

        <div style={styles.description}>
          <p>{article.content}</p>
        </div>

        <a href={article.link} target="_blank" rel="noopener noreferrer" style={styles.link}>
          Lire l'article original ➔
        </a>

        <div style={styles.backLink}>
          <Link to="/" style={styles.link}>
            ⬅ Retour aux articles
          </Link>
        </div>
      </div>
    </div>
  );
};

const styles = {
  card: {
    display: "flex",
    flexDirection: "column",
    border: "1px solid #ddd",
    borderRadius: "8px",
    overflow: "hidden",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    maxWidth: "500px",
    margin: "20px auto",
    cursor: "default",
  },
  imageContainer: {
    width: "100%",
    height: "250px",
    backgroundColor: "#f0f0f0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  placeholder: {
    color: "#999",
    fontSize: "14px",
  },
  content: {
    padding: "16px",
  },
  title: {
    fontSize: "22px",
    margin: "0 0 12px 0",
    fontWeight: "bold",
  },
  date: {
    fontSize: "14px",
    color: "#666",
    marginBottom: "8px",
  },
  category: {
    fontSize: "14px",
    color: "#333",
    marginBottom: "4px",
  },
  feed: {
    fontSize: "14px",
    color: "#333",
    marginBottom: "12px",
  },
  description: {
    fontSize: "15px",
    color: "#444",
    marginBottom: "16px",
  },
  link: {
    textDecoration: "none",
    color: "#007bff",
    fontWeight: "bold",
  },
  backLink: {
    marginTop: "12px",
  },
};

export default ArticleDetail;
