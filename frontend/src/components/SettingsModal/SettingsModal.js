import React, { useState, useEffect } from "react";
import styles from "./SettingsModal.module.css";
import api from "../../api";

const SettingsModal = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState("flux"); // ✅ Onglet par défaut : "Flux"
  const [fluxList, setFluxList] = useState([]); // ✅ Liste des flux RSS
  const [categories, setCategories] = useState([]); // ✅ Liste des catégories
  const [formData, setFormData] = useState({ title: "", url: "", description: "", category: "" }); // ✅ Formulaire d'ajout
  const [error, setError] = useState(""); // ✅ Gestion des erreurs

  // 📡 Charger les flux et catégories RSS
  useEffect(() => {
    if (activeTab === "flux") {
      api.get("/feeds/")
        .then((response) => setFluxList(response.data))
        .catch((error) => console.error("Erreur lors du chargement des flux :", error));

      api.get("/feeds/categories/")
        .then((response) => {
          console.log("Réponse API catégories :", response.data); // ✅ Vérifie la structure de la réponse
          setCategories(Array.isArray(response.data) ? response.data : []); // ✅ S'assure que c'est un tableau
        })
        .catch((error) => {
          console.error("Erreur lors du chargement des catégories :", error);
          setCategories([]); // ✅ Évite une erreur si l'API ne renvoie rien
        });
    }
  }, [activeTab]);

  // ➕ Ajouter un flux RSS
  const handleAddFlux = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.url.trim()) {
      setError("Le titre et l'URL sont obligatoires.");
      return;
    }

    api.post("/feeds/", formData)
      .then((response) => {
        setFluxList([...fluxList, response.data]); // ✅ Ajouter le flux à la liste
        setFormData({ title: "", url: "", description: "", category: "" }); // ✅ Réinitialiser le formulaire
        setError(""); // ✅ Effacer l'erreur
      })
      .catch(() => setError("Erreur lors de l'ajout du flux."));
  };

  // ❌ Supprimer un flux RSS
  const handleDeleteFlux = (fluxId) => {
    api.delete(`/feeds/remove/${fluxId}/`)
      .then(() => {
        setFluxList(fluxList.filter(flux => flux.id !== fluxId)); // ✅ Mettre à jour la liste
      })
      .catch((error) => console.error("Erreur lors de la suppression :", error));
  };

  // 🖊️ Gérer les changements dans le formulaire
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>✖</button>

        {/* 🏷️ Onglets de navigation */}
        <div className={styles.navTabs}>
          <button className={activeTab === "flux" ? styles.activeTab : ""} onClick={() => setActiveTab("flux")}>
            Flux
          </button>
          <button className={activeTab === "favoris" ? styles.activeTab : ""} onClick={() => setActiveTab("favoris")}>
            Favoris
          </button>
          <button className={activeTab === "categories" ? styles.activeTab : ""} onClick={() => setActiveTab("categories")}>
            Catégories
          </button>
        </div>

        {/* 🖥️ Contenu dynamique */}
        <div className={styles.content}>
          {activeTab === "flux" && (
            <div>
              <h3>📡 Gestion des Flux RSS</h3>

              {/* ➕ Formulaire d'ajout de flux */}
              <form onSubmit={handleAddFlux} className={styles.addFluxForm}>
                <input
                  type="text"
                  name="title"
                  placeholder="Titre du flux"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className={styles.inputField}
                />
                <input
                  type="url"
                  name="url"
                  placeholder="URL du flux RSS"
                  value={formData.url}
                  onChange={handleChange}
                  required
                  className={styles.inputField}
                />
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className={styles.inputField}
                >
                  <option value="">-- Sélectionner une catégorie --</option>
                  {(Array.isArray(categories) ? categories : []).map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                <textarea
                  name="description"
                  placeholder="Description (optionnel)"
                  value={formData.description}
                  onChange={handleChange}
                  className={styles.inputField}
                />
                <button type="submit" className={styles.addButton}>Ajouter</button>
              </form>
              {error && <p className={styles.errorText}>{error}</p>}

              {/* 📜 Liste des flux */}
              <ul className={styles.fluxList}>
                {fluxList.length > 0 ? fluxList.map((flux) => (
                  <li key={flux.id} className={styles.fluxItem}>
                    <span>{flux.title || flux.url}</span>
                    <button className={styles.deleteButton} onClick={() => handleDeleteFlux(flux.id)}>❌</button>
                  </li>
                )) : <p>Aucun flux RSS trouvé.</p>}
              </ul>
            </div>
          )}

          {activeTab === "favoris" && <p>❤️ Gestion des Favoris...</p>}
          {activeTab === "categories" && <p>📂 Gestion des Catégories...</p>}
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
