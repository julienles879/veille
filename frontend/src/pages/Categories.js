import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import Filters from "../components/Filters";

const Categories = () => {
  const [categories, setCategories] = useState([]); // Liste complète des catégories
  const [filteredCategories, setFilteredCategories] = useState([]); // Liste filtrée des catégories
  const [error, setError] = useState(null); // Gestion des erreurs
  const [filters, setFilters] = useState({
    search: "", // Recherche parmi les catégories
    category: "", // Catégorie sélectionnée
  });

  // Fonction pour récupérer toutes les catégories depuis l'API
  const fetchCategories = useCallback(() => {
    let query = `/feeds/categories/`;

    if (filters.search.trim() !== "") {
      query = `/feeds/categories/search/?search=${filters.search}`;
    }

    api
      .get(query)
      .then((response) => {
        setCategories(response.data);
        setFilteredCategories(response.data); // Initialise la liste filtrée
        setError(null);
      })
      .catch(() => setError("Impossible de charger les catégories."));
  }, [filters.search]);

  // Filtrer les catégories lorsqu'une catégorie spécifique est choisie
  const filterByCategory = useCallback(() => {
    if (filters.category) {
      const filtered = categories.filter(
        (category) => category.name === filters.category
      );
      setFilteredCategories(filtered); // Met à jour la liste affichée
    } else {
      setFilteredCategories(categories); // Rétablit la liste complète
    }
  }, [filters.category, categories]);

  // Charger les catégories quand la recherche change
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Appliquer le filtre par catégorie sélectionnée
  useEffect(() => {
    filterByCategory();
  }, [filterByCategory]);

  // Mise à jour des filtres via le composant Filters
  const handleFilterChange = useCallback((newFilters) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...newFilters,
    }));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Catégories et Flux RSS</h1>

      {/* Composant de filtres */}
      <Filters
        onFilterChange={handleFilterChange}
        filters={filters}
        showSort={false} // On masque le tri
      />

      {/* Affichage des erreurs */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Liste des catégories avec leurs flux RSS */}
      <div style={styles.categoryList}>
        {filteredCategories.length > 0 ? (
          filteredCategories.map((category) => (
            <div key={category.id} style={styles.categoryCard}>
              <h3>{category.name}</h3>
              <p>{category.description || "Pas de description disponible."}</p>

              {/* Liste des flux RSS de la catégorie */}
              {category.feeds && category.feeds.length > 0 ? (
                <div>
                  <h4>Flux RSS associés :</h4>
                  <ul style={styles.feedList}>
                    {category.feeds.map((feed) => (
                      <li key={feed.id} style={styles.feedItem}>
                        <strong>{feed.title}</strong>
                        <p>{feed.description || "Pas de description."}</p>
                        <Link
                          to={`/feeds/${feed.id}`}
                          style={styles.viewFeedLink}
                        >
                          Voir le flux
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p style={{ color: "gray" }}>
                  Aucun flux RSS associé à cette catégorie.
                </p>
              )}
            </div>
          ))
        ) : (
          <p style={{ textAlign: "center", color: "gray" }}>
            Aucune catégorie trouvée.
          </p>
        )}
      </div>
    </div>
  );
};

const styles = {
  categoryList: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "20px",
  },
  categoryCard: {
    padding: "15px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    backgroundColor: "#f9f9f9",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
  },
  feedList: {
    listStyleType: "none",
    padding: 0,
  },
  feedItem: {
    marginBottom: "10px",
    padding: "10px",
    border: "1px solid #eee",
    borderRadius: "4px",
    backgroundColor: "#fff",
  },
  viewFeedLink: {
    textDecoration: "none",
    color: "#007BFF",
    fontWeight: "bold",
  },
};

export default Categories;
