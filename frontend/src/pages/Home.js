import React, { useEffect, useState, useCallback } from "react";
import api from "../api";
import Filters from "../components/Filters";

const Home = () => {
  const [articles, setArticles] = useState([]); // Articles affichés
  const [search, setSearch] = useState(""); // Recherche
  const [limit, setLimit] = useState(30); // Limite d'articles

  // Fonction pour récupérer les articles récents
  const fetchArticles = useCallback(() => {
    let query = `/feeds/articles/recent/?limit=${limit}`;

    if (search.trim() !== "") {
      query = `/feeds/articles/search/?search=${search}&limit=${limit}`;
    }

    api
      .get(query)
      .then((response) => {
        setArticles(response.data); // Mettre à jour les articles
      })
      .catch((error) =>
        console.error("Erreur lors de la récupération des articles :", error)
      );
  }, [search, limit]); // Utilisation de search et limit comme dépendances

  // Appel initial et lorsqu'un filtre change
  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  // Mise à jour des filtres
  const handleFilterChange = (newFilters) => {
    if (newFilters.search !== undefined) {
      setSearch(newFilters.search);
    }
    if (newFilters.limit !== undefined) {
      setLimit(newFilters.limit);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Articles Récents</h1>

      {/* Composant de filtres */}
      <Filters
        onFilterChange={handleFilterChange}
        filters={{ search, limit }}
      />

      {/* Sélecteur pour la limite */}
      <div style={{ marginBottom: "20px" }}>
        <label>Afficher par :</label>
        <select
          value={limit}
          onChange={(e) => setLimit(parseInt(e.target.value, 10))}
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
              <a href={article.link} target="_blank" rel="noopener noreferrer">
                Lire plus
              </a>
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
  },
};

export default Home;
