import React, { useState, useEffect } from "react";

const Filters = ({ onFilterChange, filters, showSort = true }) => {
  const [search, setSearch] = useState(filters.search || "");
  const [sort, setSort] = useState(filters.sort || ""); // Tri par défaut
  const [categories, setCategories] = useState([]); // Catégories disponibles
  const [selectedCategory, setSelectedCategory] = useState(filters.category || "");

  // Charger les catégories depuis l'API
  useEffect(() => {
    fetch("http://127.0.0.1:8000/feeds/categories/")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Erreur lors du chargement des catégories :", err));
  }, []);

  // Appeler onFilterChange dès que les filtres changent
  useEffect(() => {
    onFilterChange({ search, sort, category: selectedCategory });
  }, [search, sort, selectedCategory, onFilterChange]); // Ajout de onFilterChange
  

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

      {/* Sélecteur de tri - affiché uniquement si showSort est true */}
      {showSort && (
        <select value={sort} onChange={(e) => setSort(e.target.value)} style={styles.select}>
          <option value="">Trier par</option>
          <option value="title">Titre (A-Z)</option>
          <option value="-created_at">Date (récent)</option>
          <option value="created_at">Date (ancien)</option>
        </select>
      )}

      {/* Filtre par catégorie */}
      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        style={styles.select}
      >
        <option value="">Toutes les catégories</option>
        {categories.map((category) => (
          <option key={category.id} value={category.name}>
            {category.name}
          </option>
        ))}
      </select>
    </div>
  );
};

const styles = {
  filtersContainer: { display: "flex", gap: "10px", marginBottom: "20px" },
  input: { padding: "8px", width: "200px" },
  select: { padding: "8px" },
};

export default Filters;
