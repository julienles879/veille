//frontend/src/pages/Home.js

import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import Filters from "../components/Filters";

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
      <Filters filters={filters} onFilterChange={setFilters} showCategory={true} showSort={false} />

      <div style={styles.articleList}>
        {articles.map((article) => (
          <div key={article.id} style={styles.articleCard}>
            <Link to={`/article/${article.id}`} style={styles.articleTitle}>
              {article.title}
            </Link>
            <p style={styles.feedName}>
              <strong>Source :</strong>{" "}
              <Link to={`/feeds/${article.feed_id}`} style={styles.feedLink}>
                {article.feed_title || "Inconnu"}
              </Link>
            </p>
            <div dangerouslySetInnerHTML={{ __html: article.content }} style={styles.articleContent} />
            <p>
              <strong>Catégorie :</strong>{" "}
              <Link to={`/categories/${article.category}`} style={styles.categoryLink}>
                {article.category || "Non catégorisé"}
              </Link>
            </p>
            <p>
              <strong>Publié le :</strong> {article.published_at}
            </p>
            <a href={article.link} target="_blank" rel="noopener noreferrer" style={styles.readMore}>
              Lire plus
            </a>
          </div>
        ))}
      </div>

      {/* Loader de chargement */}
      {isLoading && <p style={styles.loadingText}>Chargement...</p>}
    </div>
  );
};

const styles = {
  articleList: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "20px",
  },
  articleCard: {
    padding: "15px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    backgroundColor: "#f9f9f9",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
    position: "relative",
  },
  articleTitle: {
    fontSize: "18px",
    fontWeight: "bold",
    textDecoration: "none",
    color: "#000",
    display: "block",
    marginBottom: "10px",
  },
  loadingText: {
    textAlign: "center",
    margin: "20px 0",
    fontSize: "16px",
    color: "#555",
  },
};

export default Home;
