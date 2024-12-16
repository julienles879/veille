import React, { useState, useEffect } from "react";
import api from "../api";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .get("/feeds/categories/") // Correspond à l'endpoint Django
      .then((response) => {
        setCategories(response.data);
      })
      .catch((err) => {
        console.error("Erreur lors du chargement des catégories :", err);
        setError("Impossible de charger les catégories.");
      });
  }, []);

  return (
    <div>
      <h1>Liste des Catégories</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {categories.map((category) => (
          <li key={category.id}>
            <h2>{category.name}</h2>
            <p>{category.description}</p>
            {category.image && (
              <img
                src={`http://localhost:8000${category.image}`}
                alt={category.name}
                style={{ width: "200px", height: "auto" }}
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Categories;
