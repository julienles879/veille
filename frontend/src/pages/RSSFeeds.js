import React, { useEffect, useState, useCallback } from "react";
import api from "../api";
import CardFeed from "../components/CardFeed"; // ✅ Import du composant

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
    <div style={{ padding: "20px" }}>
      <h1>Flux RSS</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div style={styles.grid}>
        {feeds.length > 0 ? (
          feeds.map((feed) => <CardFeed key={feed.id} feed={feed} />)
        ) : (
          <p>Aucun flux trouvé.</p>
        )}
      </div>
    </div>
  );
};

const styles = {
  grid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "20px",
    justifyContent: "center",
  },
};

export default RSSFeeds;