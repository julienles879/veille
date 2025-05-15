import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../api";
import CardArticle from "../../components/CardArticle/CardArticle"; // ✅ Import du composant
import styles from "./FeedDetail.module.css"; // ✅ Import du CSS

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
    <div className={styles.feedContainer}>
      <div className={styles.feedDetails}>
        <h1 className={styles.feedTitle}>{feed.title}</h1>
        <p className={styles.feedDescription}>{feed.description || "Aucune description disponible."}</p>
      </div>

      <h2 className={styles.articlesTitle}>Articles du flux</h2>
      <div className={styles.articlesGrid}>
        {feed.articles && feed.articles.length > 0 ? (
          feed.articles.map((article) => (
            <CardArticle key={article.id} article={article} />
          ))
        ) : (
          <p>Aucun article trouvé pour ce flux.</p>
        )}
      </div>

      <div>
        <Link to="/rss-feeds" className={styles.backLink}>
          ⬅ Retour aux flux
        </Link>
      </div>
    </div>
  );
};

export default FeedDetail;
