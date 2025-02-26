import React, { useEffect, useState, useCallback } from "react";
import api from "../../api";
import CardFeed from "../../components/CardFeed/CardFeed"; // ✅ Import du composant
import styles from "./RSSFeeds.module.css"; // ✅ Import du CSS

const RSSFeeds = () => {
  const [feeds, setFeeds] = useState([]);
  const [error, setError] = useState(null);

  const fetchFeeds = useCallback(() => {
    api
      .get("/feeds/")
      .then((response) => {
        setFeeds(response.data);
        setError(null);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des flux :", error);
        setError("Impossible de charger les flux RSS.");
      });
  }, []);

  useEffect(() => {
    fetchFeeds();
  }, [fetchFeeds]);

  return (
    <div className={styles.rssContainer}>
      <h1 className={styles.pageTitle}>Flux RSS</h1>

      {/* Gestion des erreurs */}
      {error && <p className={styles.errorMessage}>{error}</p>}

      {/* Affichage des flux sous forme de cartes */}
      <div className={styles.feedsGrid}>
        {feeds.length > 0 ? (
          feeds.map((feed) => <CardFeed key={feed.id} feed={feed} />)
        ) : (
          <p className={styles.loadingMessage}>Aucun flux trouvé.</p>
        )}
      </div>
    </div>
  );
};

export default RSSFeeds;
