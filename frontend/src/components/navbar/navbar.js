import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiSettings, FiMoreHorizontal, FiSearch, FiRefreshCw } from "react-icons/fi";
import styles from "./navbar.module.css"; // ✅ Utilisation du module CSS
import api from "../../api";

const Navbar = ({ onSearchResults, onCategorySelect }) => {
  const [categories, setCategories] = useState([]);
  const [visibleCategories, setVisibleCategories] = useState([]);
  const [overflowCategories, setOverflowCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

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

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (!onSearchResults || typeof onSearchResults !== "function") return;
    if (query.trim()) {
      api.get(`/feeds/articles/search/?search=${query}`)
        .then((response) => onSearchResults(response.data))
        .catch((error) => console.error("Erreur lors de la recherche :", error));
    } else {
      api.get(`/feeds/articles/recent/?limit=30`)
        .then((response) => onSearchResults(response.data))
        .catch((error) => console.error("Erreur lors du rechargement des articles :", error));
    }
  };

  const handleCategoryClick = (categoryName) => {
    if (onCategorySelect && typeof onCategorySelect === "function") {
      onCategorySelect(categoryName);
    }
    setShowDropdown(false);
  };

  const handleReload = () => {
    onCategorySelect(null);
    setSearchQuery("");
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        <button className={styles.iconButton} onClick={handleReload}>
          <FiRefreshCw />
        </button>

        <ul className={styles.navList}>
          {visibleCategories.map((cat) => (
            <li key={cat.id} className={styles.navItem}>
              <button className={styles.navLink} onClick={() => handleCategoryClick(cat.name)}>
                {cat.name}
              </button>
            </li>
          ))}

          {overflowCategories.length > 0 && (
            <li className={styles.navItem} onMouseEnter={() => setShowDropdown(true)} onMouseLeave={() => setShowDropdown(false)}>
              <button className={styles.iconButton}><FiMoreHorizontal /></button>
              {showDropdown && (
                <div className={styles.dropdownMenu}>
                  {overflowCategories.map((cat) => (
                    <button key={cat.id} className={styles.dropdownItem} onClick={() => handleCategoryClick(cat.name)}>
                      {cat.name}
                    </button>
                  ))}
                </div>
              )}
            </li>
          )}
        </ul>

        <div className={styles.searchBar}>
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className={styles.searchInput}
          />
          <button className={styles.searchButton}>
            <FiSearch />
          </button>
        </div>

        <div className={styles.rightNav}>
          <button className={styles.iconButton}><FiSettings /></button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
