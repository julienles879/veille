import React, { useState, useEffect, useCallback } from "react";
import api from "../api";
import CardCategories from "../components/CardCategorie"; // ✅ Import du composant

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);

  const fetchCategories = useCallback(() => {
    api
      .get("/feeds/categories/")
      .then((response) => {
        setCategories(response.data);
        setError(null);
      })
      .catch(() => setError("Impossible de charger les catégories."));
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Liste des Catégories</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div style={styles.grid}>
        {categories.length > 0 ? (
          categories.map((category) => (
            <CardCategories key={category.id} Categories={category} />
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