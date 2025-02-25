import React, { useState, useEffect, useCallback } from "react";
import api from "../api";
import Filters from "../components/Filters";
import CardCategories from "../components/CardCategorie"; // ✅ Import du composant

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    Categories: "",
  });

  const fetchCategories = useCallback(() => {
    let query = `/feeds/categories/`;

    if (filters.search.trim() !== "") {
      query = `/feeds/categories/search/?search=${filters.search}`;
    }

    api
      .get(query)
      .then((response) => {
        setCategories(response.data);
        setFilteredCategories(response.data);
        setError(null);
      })
      .catch(() => setError("Impossible de charger les catégories."));
  }, [filters.search]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...newFilters,
    }));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Liste des Catégories</h1>

      <Filters
        onFilterChange={handleFilterChange}
        filters={filters}
        showSort={false}
      />

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={styles.grid}>
        {filteredCategories.length > 0 ? (
          filteredCategories.map((Categories) => (
            <CardCategories key={Categories.id} Categories={Categories} />
          ))
        ) : (
          <p>Aucune catégorie trouvée.</p>
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

export default Categories;
