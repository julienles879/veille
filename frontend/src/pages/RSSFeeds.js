//frontend/src/pages/RSSFeeds.js

import React, { useEffect, useState, useCallback } from "react";
import api from "../api";
import Filters from "../components/Filters";

const RSSFeeds = () => {
  const [feeds, setFeeds] = useState([]);
  const [filters, setFilters] = useState({ search: "" });
  const [isLoading, setIsLoading] = useState(false); // ✅ Ajout d'un état pour éviter les re-renders infinis

  // Fonction pour récupérer les flux RSS
  const fetchFeeds = useCallback(async () => {
    setIsLoading(true); // ✅ Évite les requêtes en boucle

    let query = `/feeds/`;
    if (filters.search.trim() !== "") {
      query = `/feeds/?search=${filters.search}`;
    }

    try {
      const response = await api.get(query);
      console.log("🔄 Flux RSS chargés :", response.data);

      if (Array.isArray(response.data)) {
        setFeeds(response.data); // Cas où l'API retourne un tableau direct
      } else if (response.data.results) {
        setFeeds(response.data.results); // ✅ Cas classique de pagination Django Rest Framework
      } else {
        setFeeds([]); // Cas improbable : API sans résultat
      }
    } catch (error) {
      console.error("❌ Erreur lors du chargement des flux RSS :", error);
      setFeeds([]); // ✅ Sécurise l'affichage en cas d'erreur API
    } finally {
      setIsLoading(false);
    }
  }, [filters]); // ✅ Vérification des dépendances pour éviter les re-renders infinis

  // Exécute `fetchFeeds` à chaque changement de `filters`
  useEffect(() => {
    fetchFeeds();
  }, [fetchFeeds]);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Gestion des Flux RSS</h1>
      <Filters filters={filters} onFilterChange={setFilters} showCategory={false} showSort={false} />

      {isLoading && <p>Chargement des flux RSS...</p>} {/* ✅ Affichage d'un état de chargement */}

      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {feeds.length > 0 ? (
          feeds.map((feed) => (
            <div key={feed.id}>
              <h3>{feed.title}</h3>
            </div>
          ))
        ) : (
          <p>Aucun flux RSS trouvé.</p>
        )}
      </div>
    </div>
  );
};

export default RSSFeeds;
