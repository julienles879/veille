import React, { useState, useEffect, useCallback } from "react";
import api from "../../api";
import CardArticle from "../../components/CardArticle/CardArticle"; // ✅ Import du composant CardArticle

const Favorites = () => {
  const [favorites, setFavorites] = useState([]); // Liste des favoris
  const [error, setError] = useState(null); // Gestion des erreurs

  // Fonction pour récupérer les articles favoris
  const fetchFavorites = useCallback(() => {
    api
      .get("/articles/favorites/")
      .then((response) => {
        setFavorites(response.data);
        setError(null);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des favoris :", error);
        setError("Impossible de charger les articles favoris.");
      });
  }, []);

  // Charger les favoris au montage
  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Articles Favoris</h1>

      {/* Affichage des erreurs */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Liste des articles favoris sous forme de cartes */}
      <div style={styles.grid}>
        {favorites.length > 0 ? (
          favorites.map((favorite) => (
            <CardArticle key={favorite.id} article={favorite} />
          ))
        ) : (
          <p>Aucun article favori trouvé.</p>
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

export default Favorites;
