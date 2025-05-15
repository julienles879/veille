//src/pages/Categories/Categories.js

import React, { useState, useEffect, useCallback } from "react";
import api from "../../api";
import CardCategories from "../../components/CardCategorie/CardCategorie"; // ✅ Import du composant
import styles from "./Categories.module.css"; // ✅ Import du CSS

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
    <div className={styles.categoriesContainer}>
      <h1 className={styles.categoriesTitle}>Liste des Catégories</h1>
      {error && <p className={styles.errorMessage}>{error}</p>}
      <div className={styles.categoriesGrid}>
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

export default Categories;
