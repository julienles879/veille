import React, { useEffect, useState } from "react";
import api from "../api"; // Axios configuré pour appeler l'API

const Home = () => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    api
      .get("/articles/") // Appelle l'API pour récupérer les articles
      .then((response) => setArticles(response.data))
      .catch((error) => console.error("Erreur lors de la récupération des articles :", error));
  }, []);

  return (
    <div>
      <h1>Articles</h1>
      <div>
        {articles.map((article) => (
          <div key={article.id}>
            <h3>{article.title}</h3>
            <p>{article.content}</p>
            <a href={article.link} target="_blank" rel="noopener noreferrer">
              Lire plus
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
