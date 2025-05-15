//src/pages/Favorites/Favorites.js

import React, { useState, useEffect, useCallback } from "react";
import api from "../../api";
import CardArticle from "../../components/CardArticle/CardArticle"; // ✅ Import du composant CardArticle
import styles from "./Favorites.module.css"; // ✅ Import du CSS

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
    <div className={styles.favoritesContainer}>
      <h1 className={styles.favoritesTitle}>Articles Favoris</h1>

      {/* Affichage des erreurs */}
      {error && <p className={styles.errorMessage}>{error}</p>}

      {/* Liste des articles favoris sous forme de cartes */}
      <div className={styles.favoritesGrid}>
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

export default Favorites;
