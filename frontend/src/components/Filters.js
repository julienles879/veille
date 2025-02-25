import React, { useState, useEffect } from "react";
import api from "../api";

const Filters = ({
  filters,
  onFilterChange,
  showCategory = true,
  showFeed = false,
  showSort = true,
}) => {
  const [search, setSearch] = useState(filters.search || "");
  const [selectedCategory, setSelectedCategory] = useState(filters.category || "");
  const [selectedFeed, setSelectedFeed] = useState(filters.feed || "");
  const [sort, setSort] = useState(filters.sort || "");
  const [categories, setCategories] = useState([]);
  const [feeds, setFeeds] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Charger les catégories et flux depuis l'API
  useEffect(() => {
    if (showCategory) {
      setIsLoading(true);
      api
        .get("/feeds/categories/")
        .then((response) => {
          console.log("📌 Réponse API catégories :", response.data);

          // Vérification pour éviter l'erreur .map()
          const categoriesData = Array.isArray(response.data.results) ? response.data.results : [];
          setCategories(categoriesData);
        })
        .catch((err) => {
          console.error("❌ Erreur chargement catégories :", err);
          setCategories([]);
        })
        .finally(() => setIsLoading(false));
    }

    if (showFeed) {
      api
        .get("/feeds/")
        .then((response) => {
          console.log("📌 Réponse API flux RSS :", response.data);

          const feedsData = Array.isArray(response.data.results) ? response.data.results : [];
          setFeeds(feedsData);
        })
        .catch((err) => {
          console.error("❌ Erreur chargement flux RSS :", err);
          setFeeds([]);
        });
    }
  }, [showCategory, showFeed]);

  // Mettre à jour les filtres à chaque changement
  useEffect(() => {
    // Utilise setTimeout pour éviter les boucles infinies
    const timer = setTimeout(() => {
      onFilterChange({
        search,
        category: selectedCategory,
        ...(showSort && { sort }),
      });
    }, 0);

    return () => clearTimeout(timer); // Nettoie le timer lors du démontage
  }, [search, selectedCategory, sort, showSort]);

  return (
    <div style={styles.filtersContainer}>
      {/* Champ de recherche */}
      <input
        type="text"
        placeholder="Rechercher..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={styles.input}
      />

      {/* Sélection de catégorie */}
      {showCategory && (
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={styles.select}
        >
          <option value="">Toutes catégories</option>
          {isLoading ? (
            <option disabled>Chargement...</option>
          ) : categories.length > 0 ? (
            categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))
          ) : (
            <option disabled>Aucune catégorie</option>
          )}
        </select>
      )}

      {/* Sélection de flux (optionnel) */}
      {showFeed && (
        <select
          value={selectedFeed}
          onChange={(e) => setSelectedFeed(e.target.value)}
          style={styles.select}
        >
          <option value="">Tous les flux</option>
          {feeds.length > 0 ? (
            feeds.map((feed) => (
              <option key={feed.id} value={feed.id}>
                {feed.title}
              </option>
            ))
          ) : (
            <option disabled>Aucun flux RSS</option>
          )}
        </select>
      )}

      {/* Sélection du tri */}
      {showSort && (
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          style={styles.select}
        >
          <option value="">Trier par</option>
          <option value="title">Titre (A-Z)</option>
          <option value="-published_at">Date (récent)</option>
          <option value="published_at">Date (ancien)</option>
        </select>
      )}
    </div>
  );
};

const styles = {
  filtersContainer: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
    alignItems: "center",
  },
  input: {
    padding: "8px",
    width: "200px",
    border: "1px solid #ccc",
    borderRadius: "4px",
  },
  select: {
    padding: "8px",
    border: "1px solid #ccc",
    borderRadius: "4px",
  },
};

export default Filters;
