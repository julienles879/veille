import React, { useEffect, useState, useCallback } from "react";
import api from "../api";
import Filters from "../components/Filters";

const RSSFeeds = () => {
  const [feeds, setFeeds] = useState([]); // Liste des flux RSS
  const [search, setSearch] = useState(""); // Recherche
  const [sort, setSort] = useState(""); // Tri
  const [category, setCategory] = useState(""); // Filtre par catégorie

  // Fonction pour récupérer les flux RSS avec filtres
  const fetchFeeds = useCallback(() => {
    let query = `/feeds/?`;

    if (search) query += `search=${search}&`;
    if (sort) query += `ordering=${sort}&`;
    if (category) query += `category__name=${category}&`;

    api
      .get(query)
      .then((response) => setFeeds(response.data))
      .catch((error) =>
        console.error("Erreur lors de la récupération des flux :", error)
      );
  }, [search, sort, category]); // Dépendances stabilisées

  // Recharger les données dès que les filtres changent
  useEffect(() => {
    fetchFeeds();
  }, [fetchFeeds]);

  // Gestion des filtres
  const handleFilterChange = (newFilters) => {
    if (newFilters.search !== undefined) setSearch(newFilters.search);
    if (newFilters.sort !== undefined) setSort(newFilters.sort);
    if (newFilters.category !== undefined) setCategory(newFilters.category);
  };

  return (
    <div>
      <h1>Flux RSS</h1>

      {/* Composant de filtres */}
      <Filters
        onFilterChange={handleFilterChange}
        filters={{ search, sort, category }}
      />

      {/* Liste des flux RSS */}
      <ul>
        {feeds.length > 0 ? (
          feeds.map((feed) => (
            <li key={feed.id} style={{ marginBottom: "20px" }}>
              <h3>{feed.title}</h3>
              <p>{feed.description}</p>
            </li>
          ))
        ) : (
          <p>Aucun flux trouvé.</p>
        )}
      </ul>
    </div>
  );
};

export default RSSFeeds;
