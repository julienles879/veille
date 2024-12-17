import React, { useState } from "react";
import api from "../api";

const SearchBar = ({ onResults }) => {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    if (query) {
      api
        .get(`/feeds/articles/search/?search=${query}`)
        .then((response) => {
          onResults(response.data);
        })
        .catch((error) => {
          console.error("Erreur lors de la recherche :", error);
        });
    }
  };

  return (
    <div style={{ marginBottom: "20px" }}>
      <input
        type="text"
        placeholder="Rechercher des articles..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={handleSearch}>Rechercher</button>
    </div>
  );
};

export default SearchBar;
