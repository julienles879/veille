import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const RSSFeeds = () => {
  const [feeds, setFeeds] = useState([]);
  const [categories, setCategories] = useState([]); // Liste des catégories
  const [newFeed, setNewFeed] = useState({
    title: "",
    url: "",
    description: "",
    category: "",
  }); // Formulaire pour ajouter un flux
  const [editingFeedId, setEditingFeedId] = useState(null); // ID du flux en cours de modification
  const [formValues, setFormValues] = useState({
    title: "",
    url: "",
    description: "",
    category: "",
  }); // Données pour modification
  const [search, setSearch] = useState(""); // Recherche dans les flux
  const navigate = useNavigate();

  // Récupérer les flux RSS
  const fetchFeeds = useCallback(() => {
    let query = `/feeds/`;
    if (search.trim() !== "") {
      query = `/feeds/?search=${search}`;
    }

    api
      .get(query)
      .then((response) => setFeeds(response.data))
      .catch((error) => console.error("Erreur lors du chargement des flux :", error));
  }, [search]);

  useEffect(() => {
    fetchFeeds();

    // Charger les catégories
    api
      .get("/feeds/categories/")
      .then((response) => setCategories(response.data))
      .catch((error) => console.error("Erreur lors du chargement des catégories :", error));
  }, [fetchFeeds]);

  // Ajouter un nouveau flux
  const addFeed = () => {
    if (!newFeed.title || !newFeed.url || !newFeed.category) {
      alert("Le titre, l'URL et la catégorie sont requis.");
      return;
    }
    api
      .post("/feeds/", newFeed)
      .then((response) => {
        setFeeds((prevFeeds) => [response.data, ...prevFeeds]);
        setNewFeed({ title: "", url: "", description: "", category: "" }); // Réinitialiser le formulaire
      })
      .catch((error) => console.error("Erreur lors de l'ajout du flux :", error));
  };

  // Déclencher la modification d'un flux
  const startEditing = (feed) => {
    setEditingFeedId(feed.id);
    setFormValues({
      title: feed.title,
      url: feed.url,
      description: feed.description,
      category: feed.category || "",
    });
  };

  // Annuler la modification
  const cancelEditing = () => {
    setEditingFeedId(null);
    setFormValues({ title: "", url: "", description: "", category: "" });
  };

  // Sauvegarder les modifications
  const saveChanges = (id) => {
    api
      .put(`/feeds/${id}/`, formValues)
      .then((response) => {
        setFeeds((prevFeeds) =>
          prevFeeds.map((feed) =>
            feed.id === id ? { ...feed, ...response.data } : feed
          )
        );
        cancelEditing();
      })
      .catch((error) => console.error("Erreur lors de la mise à jour :", error));
  };

  // Supprimer un flux
  const deleteFeed = (id) => {
    api
      .delete(`/feeds/${id}/`)
      .then(() => setFeeds((prevFeeds) => prevFeeds.filter((feed) => feed.id !== id)))
      .catch((error) => console.error("Erreur lors de la suppression :", error));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Gestion des Flux RSS</h1>

      {/* Barre de recherche */}
      <div style={styles.searchBar}>
        <input
          type="text"
          placeholder="Rechercher un flux..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.input}
        />
        <button onClick={fetchFeeds} style={styles.searchButton}>
          🔍
        </button>
      </div>

      {/* Formulaire pour ajouter un nouveau flux */}
      <div style={styles.addForm}>
        <input
          type="text"
          value={newFeed.title}
          onChange={(e) => setNewFeed({ ...newFeed, title: e.target.value })}
          placeholder="Titre"
          style={styles.input}
        />
        <input
          type="text"
          value={newFeed.url}
          onChange={(e) => setNewFeed({ ...newFeed, url: e.target.value })}
          placeholder="URL"
          style={styles.input}
        />
        <input
          type="text"
          value={newFeed.description}
          onChange={(e) => setNewFeed({ ...newFeed, description: e.target.value })}
          placeholder="Description"
          style={styles.input}
        />
        <select
          value={newFeed.category}
          onChange={(e) => setNewFeed({ ...newFeed, category: e.target.value })}
          style={styles.select}
        >
          <option value="">Choisissez une catégorie</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <button onClick={addFeed} style={styles.addButton}>
          Ajouter
        </button>
      </div>

      {/* Liste des flux RSS */}
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {feeds.map((feed) => (
          <div key={feed.id} style={styles.feedCard}>
            {editingFeedId === feed.id ? (
              // Formulaire de modification
              <div>
                <input
                  type="text"
                  value={formValues.title}
                  onChange={(e) =>
                    setFormValues({ ...formValues, title: e.target.value })
                  }
                  placeholder="Titre"
                  style={styles.input}
                />
                <input
                  type="text"
                  value={formValues.url}
                  onChange={(e) => setFormValues({ ...formValues, url: e.target.value })}
                  placeholder="URL"
                  style={styles.input}
                />
                <textarea
                  value={formValues.description}
                  onChange={(e) =>
                    setFormValues({ ...formValues, description: e.target.value })
                  }
                  placeholder="Description"
                  style={styles.textarea}
                />
                <select
                  value={formValues.category}
                  onChange={(e) =>
                    setFormValues({ ...formValues, category: e.target.value })
                  }
                  style={styles.select}
                >
                  <option value="">Choisissez une catégorie</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                  <button onClick={() => saveChanges(feed.id)} style={styles.saveButton}>
                    Sauvegarder
                  </button>
                  <button onClick={cancelEditing} style={styles.cancelButton}>
                    Annuler
                  </button>
                </div>
              </div>
            ) : (
              // Vue normale
              <div>
                <h3>{feed.title}</h3>
                <p>{feed.description || "Aucune description"}</p>
                <p>
                  <strong>Catégorie :</strong>{" "}
                  {feed.category_name || "Non catégorisé"}
                </p>
                <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                  <button
                    onClick={() => navigate(`/feeds/${feed.id}/detail`)}
                    style={styles.iconButton}
                  >
                    📖
                  </button>
                  <button onClick={() => startEditing(feed)} style={styles.iconButton}>
                    🛠️
                  </button>
                  <button onClick={() => deleteFeed(feed.id)} style={styles.iconButton}>
                    ❌
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  searchBar: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
  },
  input: {
    flex: "1",
    padding: "8px",
    border: "1px solid #ccc",
    borderRadius: "4px",
  },
  searchButton: {
    padding: "8px 16px",
    backgroundColor: "#007BFF",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  addForm: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
    alignItems: "center",
  },
  select: {
    padding: "8px",
    border: "1px solid #ccc",
    borderRadius: "4px",
  },
  addButton: {
    padding: "8px 16px",
    backgroundColor: "#4CAF50",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  feedCard: {
    padding: "15px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    backgroundColor: "#f9f9f9",
  },
  textarea: {
    width: "100%",
    padding: "8px",
    height: "80px",
    border: "1px solid #ccc",
    borderRadius: "4px",
  },
  saveButton: {
    padding: "8px 16px",
    backgroundColor: "#4CAF50",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  cancelButton: {
    padding: "8px 16px",
    backgroundColor: "#f44336",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  iconButton: {
    background: "none",
    border: "none",
    fontSize: "20px",
    cursor: "pointer",
  },
};

export default RSSFeeds;
