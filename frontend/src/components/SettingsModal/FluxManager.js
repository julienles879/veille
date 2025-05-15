import React, { useState, useEffect } from "react";
import styles from "./SettingsModal.module.css";
import api from "../../api";

const FluxManager = () => {
  const [fluxList, setFluxList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({ title: "", url: "", description: "", category: "" });
  const [error, setError] = useState("");

  // 📡 Charger les flux et catégories RSS au chargement
  useEffect(() => {
    api.get("/feeds/")
      .then((response) => {
        console.log("📡 Flux récupérés :", response.data);
        setFluxList(Array.isArray(response.data.results) ? response.data.results : []);
      })
      .catch((error) => console.error("❌ Erreur lors du chargement des flux :", error));

    api.get("/feeds/categories/")
      .then((response) => {
        console.log("📂 Catégories récupérées :", response.data);
        setCategories(Array.isArray(response.data.results) ? response.data.results : []);
      })
      .catch((error) => {
        console.error("❌ Erreur lors du chargement des catégories :", error);
        setCategories([]);
      });
  }, []);

  // ➕ Ajouter un flux RSS
  const handleAddFlux = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.url.trim() || !formData.category) {
      setError("⚠️ Tous les champs sont obligatoires.");
      return;
    }

    try {
      const response = await api.post("/feeds/", formData);
      setFluxList([...fluxList, response.data]);
      setFormData({ title: "", url: "", description: "", category: "" });
      setError("");
    } catch (error) {
      console.error("❌ Erreur lors de l'ajout du flux :", error);
      setError("❌ Impossible d'ajouter le flux. Vérifiez les informations.");
    }
  };

  // ❌ Supprimer un flux RSS
  const handleDeleteFlux = async (fluxId) => {
    try {
      await api.delete(`/feeds/${fluxId}/`);
      setFluxList(fluxList.filter(flux => flux.id !== fluxId));
    } catch (error) {
      console.error("❌ Erreur lors de la suppression :", error);
    }
  };

  return (
    <div className={styles.fluxContainer}>
      <h3 className={styles.title}>📡 Gestion des Flux RSS</h3>

      {/* ➕ Formulaire d'ajout avec une meilleure disposition */}
      <form onSubmit={handleAddFlux} className={styles.addFluxForm}>
        <div className={styles.formRow}>
          <input
            type="text"
            name="title"
            placeholder="Titre du flux"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className={styles.inputField}
            required
          />
          <input
            type="url"
            name="url"
            placeholder="URL du flux RSS"
            value={formData.url}
            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            className={styles.inputField}
            required
          />
        </div>

        <div className={styles.formRow}>
          <select
            name="category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className={styles.inputField}
            required
          >
            <option value="">-- Sélectionner une catégorie --</option>
            {categories.length > 0 ? (
              categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))
            ) : (
              <option disabled>⚠️ Aucune catégorie trouvée</option>
            )}
          </select>
          <textarea
            name="description"
            placeholder="Description (optionnel)"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className={styles.inputField}
          />
        </div>

        <button type="submit" className={styles.addButton}>Ajouter</button>
      </form>

      {error && <p className={styles.errorText}>{error}</p>}

      {/* 📜 Liste des flux */}
      <h3 className={styles.listTitle}>📃 Vos Flux RSS</h3>
      <ul className={styles.fluxList}>
        {fluxList.length > 0 ? fluxList.map((flux) => (
          <li key={flux.id} className={styles.fluxItem}>
            <span className={styles.feedTitle}><strong>{flux.title}</strong> <span className={styles.feedCategory}>📂 {flux.category_name}</span></span>
            <button className={styles.deleteButton} onClick={() => handleDeleteFlux(flux.id)}></button>
          </li>
        )) : <p className={styles.noFlux}>⚠️ Aucun flux RSS trouvé.</p>}
      </ul>
    </div>
  );
};

export default FluxManager;
