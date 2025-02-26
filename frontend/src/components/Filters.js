import React, { useEffect, useState } from "react";
import api from "../api";

const Filters = ({ onFilterChange, filters, showSort }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api.get("/feeds/categories/")
      .then((response) => {
        if (Array.isArray(response.data)) {
          setCategories(response.data);
        } else if (response.data.results) {
          // Si l'API renvoie un objet paginé
          setCategories(response.data.results);
        } else {
          setCategories([]);  // Par défaut vide
        }
      })
      .catch((error) => console.error("Erreur lors du chargement des catégories :", error));
  }, []);

  return (
    <div>
      <label>Catégorie :</label>
      <select
        value={filters.category}
        onChange={(e) => onFilterChange({ category: e.target.value })}
      >
        <option value="">Toutes catégories</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.name}>{cat.name}</option>
        ))}
      </select>
    </div>
  );
};

export default Filters;
