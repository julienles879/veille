import React, { useEffect, useState, useCallback } from "react";
import api from "../api";
import Navbar from "../components/navbar"; // ✅ Import Navbar
import Filters from "../components/Filters";
import CardArticle from "../components/CardArticle";

const Home = () => {
  const [articles, setArticles] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    limit: 30,
    category: "",
  });

  // 🔄 Récupère les articles récents avec les filtres
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
      .catch((error) => console.error("Erreur lors de la récupération des articles :", error));
  }, [filters]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  // 🔍 Fonction appelée depuis Navbar pour mettre à jour les articles
  const handleSearchResults = (results) => {
    setArticles(results);
  };

  return (
    <div>
      {/* ✅ Passe la fonction au composant Navbar */}
      <Navbar onSearchResults={handleSearchResults} />

      <div style={{ padding: "20px" }}>
        <h1>Articles Récents</h1>

        {/* Filtres pour catégorie, tri, etc. */}
        <Filters
          onFilterChange={(newFilters) => setFilters((prev) => ({ ...prev, ...newFilters }))}
          filters={filters}
          showSort={false}
        />

        {/* Sélecteur pour la limite d'articles */}
        <div style={{ marginBottom: "20px" }}>
          <label>Afficher par :</label>
          <select
            value={filters.limit}
            onChange={(e) => setFilters((prev) => ({ ...prev, limit: parseInt(e.target.value, 10) }))}
            style={{ marginLeft: "10px", padding: "5px" }}
          >
            <option value="30">30 articles</option>
            <option value="40">40 articles</option>
            <option value="50">50 articles</option>
          </select>
        </div>

        {/* ✅ Affiche les articles */}
        <div style={styles.grid}>
          {articles.length > 0 ? (
            articles.map((article) => (
              <CardArticle key={article.id} article={article} />
            ))
          ) : (
            <p>Aucun article trouvé.</p>
          )}
        </div>
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

export default Home;
