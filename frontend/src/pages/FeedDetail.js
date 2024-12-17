import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../api";

const FeedDetail = () => {
  const { id } = useParams();
  const [articles, setArticles] = useState([]);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);

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
    <div>
      <h1>Articles du Flux</h1>
      <ul>
        {articles.map((article) => (
          <li key={article.id}>
            <h3>{article.title}</h3>
            <p>{article.content}</p>
            <a href={article.link} target="_blank" rel="noopener noreferrer">
              Lire l'article
            </a>
          </li>
        ))}
      </ul>
      <div>
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

export default FeedDetail;
