import React, { useState, useEffect, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api";
import Filters from "../components/Filters";

const FeedDetail = () => {
  const { id } = useParams();
  const [articles, setArticles] = useState([]);
  const [filters, setFilters] = useState({ search: "" });

  const fetchArticles = useCallback(() => {
    let query = `/feeds/feeds/${id}/articles/`;
    if (filters.search.trim() !== "") {
      query += `?search=${filters.search}`;
    }

    api.get(query)
      .then((response) => setArticles(response.data.results || []))
      .catch((error) => console.error("Erreur lors de la récupération des articles :", error));
  }, [id, filters]);
 
  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Articles du Flux</h1>
      <Filters filters={filters} onFilterChange={setFilters} showCategory={false} showSort={false} />

      <div style={styles.articleGrid}>
        {articles.map((article) => (
          <div key={article.id} style={styles.articleCard}>
            <Link to={`/article/${article.id}`} style={styles.articleTitle}>
              {article.title}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

// Styles inchangés
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
  feedName: {
    fontSize: "14px",
    color: "#007BFF",
    marginBottom: "10px",
  },
  feedLink: {
    textDecoration: "none",
    color: "#007BFF",
  },
  categoryLink: {
    textDecoration: "none",
    color: "#28a745",
  },
  select: {
    padding: "8px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    marginLeft: "10px",
  },
  favoriteButton: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "20px",
    position: "absolute",
    top: "10px",
    right: "10px",
  },
  readMore: {
    color: "#007BFF",
    textDecoration: "none",
    fontWeight: "bold",
  },
};

export default FeedDetail;
