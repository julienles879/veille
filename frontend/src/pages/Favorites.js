import React, { useEffect, useState } from "react";
import api from "../api";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    api
      .get("/articles/favorites/")
      .then((response) => setFavorites(response.data))
      .catch((error) => console.error("Erreur lors de la récupération des favoris :", error));
  }, []);

  return (
    <div>
      <h1>Favoris</h1>
      <div>
        {favorites.map((article) => (
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

export default Favorites;
