import React, { useEffect, useState, useCallback } from "react";
import api from "../api";
import Filters from "../components/Filters";

const Home = () => {
  const [articles, setArticles] = useState([]); // Articles affichés
  const [filters, setFilters] = useState({
    search: "",
    limit: 30,
    category: "",
  });

  // Récupérer les articles avec gestion des favoris
  const fetchArticles = useCallback(() => {
    let query = `/feeds/articles/recent/?limit=${filters.limit}`;

    if (filters.category && filters.category !== "Toutes catégories") {
      query += `&category=${filters.category}`;
    }
    if (filters.search.trim() !== "") {
      query = `/feeds/articles/search/?search=${filters.search}&limit=${filters.limit}`;
      if (filters.category && filters.category !== "Toutes catégories") {
        query += `&category=${filters.category}`;
      }
    }

    api
      .get(query)
      .then((response) => setArticles(response.data))
      .catch((error) =>
        console.error("Erreur lors de la récupération des articles :", error)
      );
  }, [filters.search, filters.limit, filters.category]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  // Ajouter/Supprimer un favori
  const toggleFavorite = (articleId, isFavorite) => {
    if (isFavorite) {
      // Supprimer des favoris
      api
        .delete(`/articles/favorites/remove/${articleId}/`)
        .then(() => fetchArticles()) // Actualiser les articles
        .catch((error) =>
          console.error("Erreur lors de la suppression des favoris :", error)
        );
    } else {
      // Ajouter aux favoris
      api
        .post(`/articles/favorites/add/`, { article_id: articleId })
        .then(() => fetchArticles()) // Actualiser les articles
        .catch((error) =>
          console.error("Erreur lors de l'ajout aux favoris :", error)
        );
    }
  };

  const handleFilterChange = useCallback((newFilters) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...newFilters,
    }));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Articles Récents</h1>

      {/* Composant de filtres */}
      <Filters
        onFilterChange={handleFilterChange}
        filters={filters}
        showSort={false}
      />

      {/* Sélecteur pour la limite */}
      <div style={{ marginBottom: "20px" }}>
        <label>Afficher par :</label>
        <select
          value={filters.limit}
          onChange={(e) =>
            handleFilterChange({ limit: parseInt(e.target.value, 10) })
          }
          style={{ marginLeft: "10px", padding: "5px" }}
        >
          <option value="30">30 articles</option>
          <option value="40">40 articles</option>
          <option value="50">50 articles</option>
        </select>
      </div>

      {/* Affichage des articles */}
      <div>
        {articles.length > 0 ? (
          articles.map((article) => (
            <div key={article.id} style={styles.articleCard}>
              <h3>{article.title}</h3>
              <p>{article.content}</p>
              <p>
                <strong>Catégorie :</strong>{" "}
                {article.category || "Non catégorisé"}
              </p>
              <p>
                <strong>Publié le :</strong> {article.published_at}
              </p>
              <a href={article.link} target="_blank" rel="noopener noreferrer">
                Lire plus
              </a>
              {/* Icône pour ajouter/supprimer des favoris */}
              <button
                onClick={() => toggleFavorite(article.id, article.is_favorite)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "20px",
                }}
              >
                {article.is_favorite ? "❤️" : "🤍"}
              </button>
            </div>
          ))
        ) : (
          <p>Aucun article trouvé.</p>
        )}
      </div>
    </div>
  );
};

const styles = {
  articleCard: {
    marginBottom: "20px",
    padding: "15px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    position: "relative",
  },
};

export default Home;
