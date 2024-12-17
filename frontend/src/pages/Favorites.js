import React, { useEffect, useState, useCallback } from "react";
import api from "../api";
import Filters from "../components/Filters"; // Import du composant de filtres

const Favorites = () => {
  const [favorites, setFavorites] = useState([]); // Liste complète des favoris
  const [filteredFavorites, setFilteredFavorites] = useState([]); // Liste filtrée
  const [error, setError] = useState(null); // Gestion des erreurs
  const [filters, setFilters] = useState({
    search: "", // Mot-clé pour la recherche
    category: "", // Filtre par catégorie
  });

  // Fonction pour récupérer les articles favoris
  const fetchFavorites = useCallback(() => {
    api
      .get("/articles/favorites/")
      .then((response) => {
        setFavorites(response.data);
        setFilteredFavorites(response.data); // Initialise la liste filtrée
        setError(null);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des favoris :", error);
        setError("Impossible de charger les articles favoris.");
      });
  }, []);

  // Fonction pour appliquer les filtres
  const applyFilters = useCallback(() => {
    let filtered = favorites;

    // Filtrer par mot-clé (search)
    if (filters.search.trim() !== "") {
      filtered = filtered.filter((article) =>
        article.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        article.content.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Filtrer par catégorie
    if (filters.category) {
      filtered = filtered.filter(
        (article) => article.category === filters.category
      );
    }

    setFilteredFavorites(filtered);
  }, [favorites, filters.search, filters.category]);

  // Charger les favoris au montage
  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  // Appliquer les filtres quand les valeurs changent
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  // Mise à jour des filtres
  const handleFilterChange = (newFilters) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...newFilters,
    }));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Articles Favoris</h1>

      {/* Composant de filtres */}
      <Filters
        onFilterChange={handleFilterChange}
        filters={filters}
        showSort={false} // Pas besoin du tri ici
      />

      {/* Affichage des erreurs */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Liste des articles favoris filtrés */}
      {filteredFavorites.length > 0 ? (
        filteredFavorites.map((favorite) => (
          <div key={favorite.id} style={{ marginBottom: "20px" }}>
            <h3>{favorite.title}</h3>
            <p>{favorite.content}</p>
            <p>
              <strong>Catégorie :</strong>{" "}
              {favorite.category || "Non catégorisé"}
            </p>
            <a href={favorite.link} target="_blank" rel="noopener noreferrer">
              Lire plus
            </a>
          </div>
        ))
      ) : (
        <p>Aucun article favori trouvé.</p>
      )}
    </div>
  );
};

export default Favorites;
