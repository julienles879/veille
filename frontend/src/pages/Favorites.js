import React, { useEffect, useState } from "react";
import api from "../api";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    api
      .get("/favorites/")
      .then((response) => setFavorites(response.data))
      .catch((error) => console.error("Erreur lors de la récupération des favoris :", error));
  }, []);

  return (
    <div>
      <h1>Articles Favoris</h1>
      {favorites.length > 0 ? (
        favorites.map((favorite) => (
          <div key={favorite.id} style={{ marginBottom: "20px" }}>
            <h3>{favorite.title}</h3>
            <p>{favorite.content}</p>
            <a href={favorite.link} target="_blank" rel="noopener noreferrer">
              Lire plus
            </a>
          </div>
        ))
      ) : (
        <p>Aucun article en favori.</p>
      )}
    </div>
  );
};

export default Favorites;
