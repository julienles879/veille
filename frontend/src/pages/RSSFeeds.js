import React, { useEffect, useState, useCallback } from "react";
import api from "../api";
import Filters from "../components/Filters";
import CardFeed from "../components/CardFeed"; // ✅ Import du composant

const RSSFeeds = () => {
  const [feeds, setFeeds] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [category, setCategory] = useState("");

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
  }, [search, sort, category]);

  useEffect(() => {
    fetchFeeds();
  }, [fetchFeeds]);

  const handleFilterChange = (newFilters) => {
    if (newFilters.search !== undefined) setSearch(newFilters.search);
    if (newFilters.sort !== undefined) setSort(newFilters.sort);
    if (newFilters.category !== undefined) setCategory(newFilters.category);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Flux RSS</h1>

      <Filters
        onFilterChange={handleFilterChange}
        filters={{ search, sort, category }}
      />

      <div style={styles.grid}>
        {feeds.length > 0 ? (
          feeds.map((feed) => <CardFeed key={feed.id} feed={feed} />)
        ) : (
          <p>Aucun flux trouvé.</p>
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
  },
};

export default RSSFeeds;
