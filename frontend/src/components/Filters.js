import React, { useState, useEffect } from "react";

const Filters = ({
  onFilterChange,
  filters,
  showCategory = true, // Nouveau paramètre : contrôler l'affichage des catégories
  showSort = true, // Contrôler l'affichage du tri
}) => {
  const [search, setSearch] = useState(filters.search || "");
  const [selectedCategory, setSelectedCategory] = useState(filters.category || "");
  const [categories, setCategories] = useState([]); // Liste des catégories disponibles
  const [sort, setSort] = useState(filters.sort || ""); // Tri

  // Charger les catégories depuis l'API
  useEffect(() => {
    if (showCategory) {
      fetch("http://127.0.0.1:8000/feeds/categories/")
        .then((res) => res.json())
        .then((data) => setCategories(data))
        .catch((err) =>
          console.error("Erreur lors du chargement des catégories :", err)
        );
    }
  }, [showCategory]);

  // Appeler onFilterChange dès que les filtres changent
  useEffect(() => {
    onFilterChange({
      search,
      ...(showCategory && { category: selectedCategory }),
      ...(showSort && { sort }),
    });
  }, [search, selectedCategory, sort, onFilterChange, showCategory, showSort]);

  return (
    <div style={styles.filtersContainer}>
      {/* Barre de recherche */}
      <input
        type="text"
        placeholder="Rechercher..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={styles.input}
      />

      {/* Filtre par catégorie (affiché uniquement si showCategory est true) */}
      {showCategory && (
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={styles.select}
        >
          <option value="">Toutes catégories</option> {/* Option par défaut */}
          {categories.map((category) => (
            <option key={category.id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
      )}

      {/* Sélecteur de tri (affiché uniquement si showSort est true) */}
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
