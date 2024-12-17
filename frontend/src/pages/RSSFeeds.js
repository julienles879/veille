import React, { useEffect, useState } from "react";
import api from "../api";
import Filters from "../components/Filters";

const RSSFeeds = () => {
  const [feeds, setFeeds] = useState([]); // Liste des flux RSS
  const [filters, setFilters] = useState({
    search: "",
    sort: "",
    category: "",
  });

  // Fonction pour récupérer les flux RSS avec filtres
  const fetchFeeds = () => {
    let query = `/feeds/?`;

    if (filters.search) query += `search=${filters.search}&`;
    if (filters.sort) query += `ordering=${filters.sort}&`;
    if (filters.category) query += `category__name=${filters.category}&`; // Paramètre pour filtrer par catégorie

    api
      .get(query)
      .then((response) => setFeeds(response.data))
      .catch((error) => console.error("Erreur lors de la récupération des flux :", error));
  };

  // Mettre à jour les filtres
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  // Recharger les données dès que les filtres changent
  useEffect(() => {
    fetchFeeds();
  }, [filters]);

  return (
    <div>
      <h1>Flux RSS</h1>

      {/* Composant de filtres */}
      <Filters onFilterChange={handleFilterChange} filters={filters} />

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
