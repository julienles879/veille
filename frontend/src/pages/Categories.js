//src/pages/Categories.js

import React, { useState, useEffect, useCallback } from "react";
import api from "../api";
import Filters from "../components/Filters";

const Categories = () => {
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [filters, setFilters] = useState({ search: "" });

  // Fonction pour récupérer les catégories avec gestion de l'API
  const fetchCategories = useCallback(async () => {
    let query = `/feeds/categories/`;
    if (filters.search.trim() !== "") {
      query = `/feeds/categories/search/?search=${filters.search}`;
    }

    try {
      const response = await api.get(query);
      console.log("🔄 Catégories chargées :", response.data);

      if (Array.isArray(response.data)) {
        setFilteredCategories(response.data); // Cas où l'API retourne un tableau direct
      } else if (response.data.results) {
        setFilteredCategories(response.data.results); // ✅ Cas Django Rest Framework (pagination)
      } else {
        setFilteredCategories([]); // Cas improbable : API sans résultat
      }
    } catch (error) {
      console.error("❌ Erreur lors du chargement des catégories :", error);
      setFilteredCategories([]);
    }
  }, [filters]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Catégories et Flux RSS</h1>
      <Filters filters={filters} onFilterChange={setFilters} showCategory={false} showSort={false} />

      {filteredCategories.length === 0 ? (
        <p>Aucune catégorie trouvée.</p>
      ) : (
        <div style={styles.categoryList}>
          {filteredCategories.map((category) => (
            <div key={category.id} style={styles.categoryCard}>
              <h3>{category.name}</h3>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Styles inchangés
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
};

export default Categories;
