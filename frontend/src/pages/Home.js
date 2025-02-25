import React, { useEffect, useState, useCallback } from "react";
import api from "../api";
import Filters from "../components/Filters";
import CardArticle from "../components/CardArticle"; // ✅ Import du composant CardArticle

const Home = () => {
  const [articles, setArticles] = useState([]); // Articles affichés
  const [filters, setFilters] = useState({
    search: "",
    limit: 30, // Par défaut, 30 articles
    category: "", // Catégorie sélectionnée
  });

  // Fonction pour récupérer les articles récents avec gestion des filtres
  const fetchArticles = useCallback(() => {
    let query = `/feeds/articles/recent/?limit=${filters.limit}`;

    // Filtrer par catégorie
    if (filters.category && filters.category !== "Toutes catégories") {
      query += `&category=${filters.category}`;
    }

    // Si une recherche est effectuée
    if (filters.search.trim() !== "") {
      query = `/feeds/articles/search/?search=${filters.search}&limit=${filters.limit}`;
      if (filters.category && filters.category !== "Toutes catégories") {
        query += `&category=${filters.category}`;
      }
    }

    // Appel API pour récupérer les articles
    api
      .get(query)
      .then((response) => {
        setArticles(response.data);
      })
      .catch((error) =>
        console.error("Erreur lors de la récupération des articles :", error)
      );
  }, [filters.search, filters.limit, filters.category]);

  // Fonction pour mettre à jour les filtres
  const handleFilterChange = useCallback((newFilters) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...newFilters,
    }));
  }, []);

  // Appel initial et lorsqu'un filtre change
  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Articles Récents</h1>

      {/* Composant de filtres */}
      <Filters
        onFilterChange={handleFilterChange}
        filters={filters}
        showSort={false} // On masque le tri ici
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

      {/* Affichage des articles avec CardArticle */}
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
