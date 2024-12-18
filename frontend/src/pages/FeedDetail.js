import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import Filters from "../components/Filters";

const FeedDetail = () => {
  const { id } = useParams(); // ID du flux
  const [articles, setArticles] = useState([]); // Liste des articles
  const [filters, setFilters] = useState({
    search: "",
    limit: 30,
  }); // Filtres pour la recherche et la pagination

  // Fonction pour récupérer les articles avec les filtres
  const fetchArticles = useCallback(() => {
    let query = `/feeds/feeds/${id}/articles/?limit=${filters.limit}`;

    if (filters.search.trim() !== "") {
      query += `&search=${filters.search}`;
    }

    console.log("Requête API générée :", query); // Log de la requête API

    api
      .get(query)
      .then((response) => {
        console.log("Réponse API reçue :", response.data.results || []); // Log des articles reçus
        setArticles(response.data.results || []); // Mettre à jour les articles
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des articles :", error);
      });
  }, [id, filters.limit, filters.search]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]); // Appeler fetchArticles à chaque mise à jour des filtres

  const handleFilterChange = useCallback((newFilters) => {
    console.log("Nouveaux filtres appliqués :", newFilters); // Log des nouveaux filtres
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...newFilters,
    }));
  }, []);

  useEffect(() => {
    console.log("Articles affichés après recherche :", articles); // Log des articles actuellement affichés
  }, [articles]);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Articles du Flux</h1>

      {/* Composant de filtres */}
      <Filters
        onFilterChange={handleFilterChange}
        filters={filters}
        showSort={false} // Désactiver le tri si non nécessaire
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
                <strong>Publié le :</strong> {article.published_at || "N/A"}
              </p>
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
    position: "relative",
  },
};

export default FeedDetail;
