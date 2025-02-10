import React, { useEffect, useState, useMemo, useCallback } from "react";
import api from "../api";
import Filters from "../components/Filters";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]); // Liste complète des favoris
  const [error, setError] = useState(null); // Gestion des erreurs
  const [filters, setFilters] = useState({
    search: "",
    category: "",
  });

  // Fonction stable pour récupérer les favoris
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

  // Charger les favoris une seule fois
  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  // Ajouter/Supprimer un favori
  const toggleFavorite = (articleId, isFavorite) => {
    if (isFavorite) {
      // Supprimer des favoris
      api
        .delete(`/articles/favorites/remove/${articleId}/`)
        .then(() => fetchFavorites()) // Actualiser les favoris
        .catch((error) =>
          console.error("Erreur lors de la suppression des favoris :", error)
        );
    } else {
      // Ajouter aux favoris
      api
        .post(`/articles/favorites/add/`, { article_id: articleId })
        .then(() => fetchFavorites()) // Actualiser les favoris
        .catch((error) =>
          console.error("Erreur lors de l'ajout aux favoris :", error)
        );
    }
  };

  // Application des filtres en mémoire
  const filteredFavorites = useMemo(() => {
    let filtered = favorites;

    if (filters.search.trim() !== "") {
      filtered = filtered.filter((article) =>
        article.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        article.content.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.category) {
      filtered = filtered.filter(
        (article) =>
          article.category &&
          article.category.toLowerCase() === filters.category.toLowerCase()
      );
    }

    return filtered;
  }, [favorites, filters.search, filters.category]);

  // Mise à jour des filtres
  const handleFilterChange = useCallback((newFilters) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...newFilters,
    }));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Articles Favoris</h1>

      {/* Composant de filtres */}
      <Filters
        onFilterChange={handleFilterChange}
        filters={filters}
        showSort={false}
      />

      {/* Affichage des erreurs */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Liste des articles favoris filtrés */}
      {filteredFavorites.length > 0 ? (
        filteredFavorites.map((favorite) => (
          <div key={favorite.id} style={styles.articleCard}>
            <h3>{favorite.title}</h3>
            <p>{favorite.content}</p>
            <p>
              <strong>Catégorie :</strong>{" "}
              {favorite.category || "Non catégorisé"}
            </p>
            <a href={favorite.link} target="_blank" rel="noopener noreferrer">
              Lire plus
            </a>
            {/* Icône pour ajouter/supprimer des favoris */}
            <button
              onClick={() =>
                toggleFavorite(favorite.id, favorite.is_favorite)
              }
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "24px",
              }}
            >
              {favorite.is_favorite ? "❤️" : "🤍"}
            </button>
          </div>
        ))
      ) : (
        <p>Aucun article favori trouvé.</p>
      )}
    </div>
  );
};

// Styles
const styles = {
  articleCard: {
    marginBottom: "20px",
    padding: "15px",
    border: "1px solid #ddd",
    borderRadius: "4px",
  },
};

export default Favorites;
