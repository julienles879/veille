import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api";
import CardArticle from "../components/CardArticle";

const FeedDetail = () => {
  const { id } = useParams();
  const [feed, setFeed] = useState(null);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Récupérer les détails du flux
    api.get(`/feeds/${id}/`)
      .then((response) => setFeed(response.data))
      .catch((error) => console.error("Erreur lors du chargement du flux :", error));

    // Récupérer les articles liés à ce flux
    api.get(`/feeds/${id}/articles/`)
      .then((response) => setArticles(response.data))
      .catch((error) => console.error("Erreur lors du chargement des articles :", error))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Chargement...</p>;
  if (!feed) return <p>Flux non trouvé.</p>;

  return (
    <div style={{ padding: "20px" }}>
      <div style={styles.feedDetails}>
        <h1>{feed.title}</h1>
        <p>{feed.description || "Aucune description disponible."}</p>
        <a href={feed.link} target="_blank" rel="noopener noreferrer" style={styles.link}>
          Consulter le flux original ➔
        </a>
      </div>

      <h2 style={{ marginTop: "30px" }}>Articles du flux</h2>
      <div style={styles.grid}>
        {articles.length > 0 ? (
          articles.map((article) => (
            <CardArticle key={article.id} article={article} />
          ))
        ) : (
          <p>Aucun article trouvé pour ce flux.</p>
        )}
      </div>

      <div style={{ marginTop: "20px" }}>
        <Link to="/rss-feeds" style={styles.link}>
          ⬅ Retour aux flux
        </Link>
      </div>
    </div>
  );
};

const styles = {
  feedDetails: {
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "16px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    marginBottom: "20px",
  },
  grid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "20px",
    justifyContent: "center",
  },
  link: {
    textDecoration: "none",
    color: "#007BFF",
    fontWeight: "bold",
  },
};

export default FeedDetail;