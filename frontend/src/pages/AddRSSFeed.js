import React, { useState, useEffect } from "react";
import api from "../api";

const AddRSSFeed = () => {
  const [formData, setFormData] = useState({
    title: "",
    url: "",
    description: "",
    category: "",
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Charger les catégories au montage du composant
  useEffect(() => {
    api
      .get("/feeds/categories/") // Endpoint pour récupérer les catégories
      .then((response) => {
        setCategories(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur lors du chargement des catégories :", err);
        setError("Impossible de charger les catégories.");
        setLoading(false);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    api
      .post("/feeds/", formData)
      .then(() => alert("Flux RSS ajouté avec succès"))
      .catch((error) => console.error("Erreur lors de l'ajout du flux :", error));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <h1>Ajouter un flux RSS</h1>
      {loading ? (
        <p>Chargement des catégories...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Titre :</label>
            <input
              type="text"
              name="title"
              placeholder="Titre"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>URL :</label>
            <input
              type="url"
              name="url"
              placeholder="URL"
              value={formData.url}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>Catégorie :</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">-- Sélectionner une catégorie --</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Description :</label>
            <textarea
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <button type="submit">Ajouter le flux</button>
        </form>
      )}
    </div>
  );
};

export default AddRSSFeed;
