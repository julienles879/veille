import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import CardArticle from "../components/CardArticle"; // ✅ Import du composant CardArticle

const FeedDetail = () => {
  const { id } = useParams();
  const [articles, setArticles] = useState([]);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);

  // Fonction pour récupérer les articles du flux
  const fetchArticles = (url = `/feeds/feeds/${id}/articles/`) => {
    api
      .get(url)
      .then((response) => {
        setArticles(response.data.results);
        setNextPage(response.data.next);
        setPrevPage(response.data.previous);
      })
      .catch((error) =>
        console.error("Erreur lors du chargement des articles :", error)
      );
  };

  useEffect(() => {
    fetchArticles();
  }, [id]);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Articles du Flux</h1>

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

      {/* Pagination */}
      <div style={styles.pagination}>
        {prevPage && (
          <button onClick={() => fetchArticles(prevPage)}>Précédent</button>
        )}
        {nextPage && (
          <button onClick={() => fetchArticles(nextPage)}>Suivant</button>
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
    marginTop: "20px",
  },
  pagination: {
    marginTop: "20px",
    display: "flex",
    justifyContent: "center",
    gap: "10px",
  },
};

export default FeedDetail;
