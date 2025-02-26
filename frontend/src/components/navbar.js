import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiSettings, FiMoreHorizontal, FiSearch } from "react-icons/fi";
import "../App.css";
import api from "../api";

const Navbar = ({ onSearchResults }) => {
  const [categories, setCategories] = useState([]);
  const [visibleCategories, setVisibleCategories] = useState([]);
  const [overflowCategories, setOverflowCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    api.get("/feeds/categories/")
      .then((response) => {
        if (!Array.isArray(response.data.results)) {
          console.error("Données de catégories invalides :", response.data);
          return;
        }
        setCategories(response.data.results);
        const maxVisible = 6;
        setVisibleCategories(response.data.results.slice(0, maxVisible));
        setOverflowCategories(response.data.results.slice(maxVisible));
      })
      .catch((error) => console.error("Erreur lors du chargement des catégories :", error));
  }, []);

  // ✅ Recherche en temps réel
  const handleSearch = (query) => {
    setSearchQuery(query);

    if (!onSearchResults || typeof onSearchResults !== "function") {
      console.error("onSearchResults n'est pas défini ou n'est pas une fonction !");
      return;
    }

    if (query.trim()) {
      api.get(`/feeds/articles/search/?search=${query}`)
        .then((response) => {
          onSearchResults(response.data); // ✅ Envoie les résultats à Home
        })
        .catch((error) => console.error("Erreur lors de la recherche :", error));
    } else {
      // Recharge les articles récents si la barre est vide
      api.get(`/feeds/articles/recent/?limit=30`)
        .then((response) => onSearchResults(response.data))
        .catch((error) => console.error("Erreur lors du rechargement des articles :", error));
    }
  };

  return (
    <nav className="navbar">
      <div className="centered-nav">
        <ul className="nav-list">
          <li className="nav-item"><Link to="/" className="nav-link">Accueil</Link></li>

          {visibleCategories.map((cat) => (
            <li key={cat.id} className="nav-item">
              <Link to={`/feeds/categories/${cat.id}`} className="nav-link">
                {cat.name}
              </Link>
            </li>
          ))}

          {overflowCategories.length > 0 && (
            <li className="nav-item dropdown">
              <button className="icon-button"><FiMoreHorizontal /></button>
              <div className="dropdown-content">
                {overflowCategories.map((cat) => (
                  <Link key={cat.id} to={`/feeds/categories/${cat.id}`}>
                    {cat.name}
                  </Link>
                ))}
              </div>
            </li>
          )}
        </ul>

        {/* ✅ Barre de recherche */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="search-input"
          />
          <button className="search-button">
            <FiSearch />
          </button>
        </div>
      </div>

      {/* ✅ Icône de paramètres avec menu de gestion */}
      <div className="right-nav">
        <div className="dropdown">
          <button className="icon-button"><FiSettings /></button>
          <div className="dropdown-content">
            <Link to="/rss-feeds">Gérer les flux</Link>
            <Link to="/favorites">Favoris</Link>
            <Link to="/feeds/categories">Catégories</Link>
            <Link to="/add-rss-feed">Ajouter un flux</Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
