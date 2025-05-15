import React, { useState, useEffect } from "react";
import styles from "./CategoriesManager.module.css";
import api from "../../api";

const CategoriesManager = () => {
  const [categories, setCategories] = useState([]); // 📂 Stocke les catégories
  const [formData, setFormData] = useState({ name: "", description: "" }); // 📝 Formulaire d'ajout
  const [error, setError] = useState(""); // ⚠️ Gestion des erreurs
  const [loading, setLoading] = useState(true); // 🔄 Indique le chargement des catégories

  // 📡 Charger les catégories au chargement du composant
  useEffect(() => {
    api.get("/feeds/categories/")
      .then((response) => {
        setCategories(response.data.results || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("❌ Erreur lors du chargement des catégories :", error);
        setLoading(false);
      });
  }, []);

  // ➕ Ajouter une nouvelle catégorie
  const handleAddCategory = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setError("⚠️ Le nom de la catégorie est requis.");
      return;
    }

    try {
      const response = await api.post("/feeds/categories/", formData);
      setCategories([...categories, response.data]); // Met à jour la liste
      setFormData({ name: "", description: "" }); // Réinitialise le formulaire
      setError("");
    } catch (error) {
      console.error("❌ Erreur lors de l'ajout de la catégorie :", error);
      setError("❌ Impossible d'ajouter la catégorie.");
    }
  };

  // ❌ Supprimer une catégorie
  const handleDeleteCategory = async (categoryId) => {
    try {
      await api.delete(`/feeds/categories/${categoryId}/delete/`);
      setCategories(categories.filter((cat) => cat.id !== categoryId)); // Mise à jour de l'affichage
    } catch (error) {
      console.error("❌ Erreur lors de la suppression :", error);
    }
  };

  return (
    <div className={styles.categoriesContainer}>
      <h3>📂 Gestion des Catégories</h3>

      {/* 📝 Formulaire d'ajout */}
      <form onSubmit={handleAddCategory} className={styles.addCategoryForm}>
        <input
          type="text"
          name="name"
          placeholder="Nom de la catégorie"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className={styles.inputField}
          required
        />
        <input
          type="text"
          name="description"
          placeholder="Description (optionnelle)"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className={styles.inputField}
        />
        <button type="submit" className={styles.addButton}>Ajouter</button>
      </form>
      {error && <p className={styles.errorText}>{error}</p>}

      {/* 📡 Affichage des catégories */}
      {loading ? (
        <p>🔄 Chargement des catégories...</p>
      ) : categories.length > 0 ? (
        <ul className={styles.categoriesList}>
          {categories.map((category) => (
            <li key={category.id} className={styles.categoryItem}>
              <span>{category.name}</span>
              <button className={styles.deleteButton} onClick={() => handleDeleteCategory(category.id)}>❤️</button>
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.noCategories}>⚠️ Aucune catégorie trouvée.</p>
      )}
    </div>
  );
};

export default CategoriesManager;
