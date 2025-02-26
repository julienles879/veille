import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../api";
import CardArticle from "../../components/CardArticle/CardArticle";

const FeedDetail = () => {
  const { id } = useParams();
  const [feed, setFeed] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeedDetails = async () => {
      try {
        // Utilisation de la route /feeds/<id>/detail/
        const response = await api.get(`/feeds/${id}/detail/`);
        setFeed(response.data);
      } catch (err) {
        console.error("Erreur lors du chargement du flux :", err);
        setError("Erreur lors du chargement du flux.");
      } finally {
        setLoading(false);
      }
    };

    fetchFeedDetails();
  }, [id]);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>{error}</p>;
  if (!feed) return <p>Flux non trouvé.</p>;

  return (
    <div style={{ padding: "20px" }}>
      <div style={styles.feedDetails}>
        <h1>{feed.title}</h1>
        <p>{feed.description || "Aucune description disponible."}</p>
      </div>

      <h2 style={{ marginTop: "30px" }}>Articles du flux</h2>
      <div style={styles.grid}>
        {feed.articles && feed.articles.length > 0 ? (
          feed.articles.map((article) => (
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
