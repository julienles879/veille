//frontend/src/pages/Home.js

import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import Filters from "../components/Filters";
import CardArticle from "../components/CardArticle"; // ✅ Import du composant CardArticle

const Home = () => {
  const [articles, setArticles] = useState([]);
  const [nextPage, setNextPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const [filters, setFilters] = useState({
    search: "",
    category: "",
  });

  // Fonction pour récupérer les articles avec pagination
  const fetchArticles = useCallback(
    async (page = 1) => {
      if (!hasMore || isLoading) return; // Stop si pas plus d'articles ou si en chargement
      
      setIsLoading(true);
      
      let query = `/feeds/articles/recent/?page=${page}`;

      if (filters.category) {
        query += `&category=${filters.category}`;
      }
      if (filters.search.trim() !== "") {
        query = `/feeds/articles/search/?search=${filters.search}&page=${page}`;
        if (filters.category) {
          query += `&category=${filters.category}`;
        }
      }

      try {
        const response = await api.get(query);
        console.log("🔄 Articles chargés :", response.data);

        if (response.data.results.length > 0) {
          setArticles((prevArticles) => [...prevArticles, ...response.data.results]);
          setNextPage(page + 1);
        } else {
          setHasMore(false);
        }
      } catch (error) {
        console.error("❌ Erreur lors de la récupération des articles :", error);
      } finally {
        setIsLoading(false);
      }
    },
    [filters, hasMore, isLoading]
  );

  // Charger les articles initiaux lorsqu'on change de filtre
  useEffect(() => {
    setArticles([]);
    setNextPage(1);
    setHasMore(true);
    fetchArticles(1);
  }, [filters, fetchArticles]);

  // Gestion du scroll infini
  useEffect(() => {
    if (!hasMore) return; // Si plus d'articles, ne pas écouter l'événement

    let isThrottled = false;

    const handleScroll = () => {
      if (isThrottled) return;
      
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 200
      ) {
        fetchArticles(nextPage);
      }

      isThrottled = true;
      setTimeout(() => {
        isThrottled = false;
      }, 500);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [fetchArticles, nextPage, hasMore]);

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

      {/* Loader de chargement */}
      {isLoading && <p style={styles.loadingText}>Chargement...</p>}
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
