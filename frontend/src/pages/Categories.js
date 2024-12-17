import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .get("/feeds/categories/")
      .then((response) => setCategories(response.data))
      .catch(() => setError("Impossible de charger les catégories."));
  }, []);

  return (
    <div>
      <h1>Liste des Catégories</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {categories.map((category) => (
          <li key={category.id} style={{ marginBottom: "20px" }}>
            <h2>{category.name}</h2>
            <p>{category.description}</p>
            <h4>Flux RSS :</h4>
            {category.feeds.length > 0 ? (
              <ul>
                {category.feeds.map((feed) => (
                  <li key={feed.id}>
                    <Link to={`/feeds/${feed.id}`}>{feed.title}</Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ color: "gray" }}>Aucun flux RSS dans cette catégorie.</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Categories;
