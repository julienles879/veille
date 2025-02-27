import React, { useState, useEffect } from "react";
import { FiSettings, FiMoreHorizontal, FiSearch, FiRefreshCw } from "react-icons/fi";
import styles from "./navbar.module.css"; // ✅ Utilisation du module CSS
import api from "../../api";

const Navbar = ({ onSearchResults, onCategorySelect }) => {
  const [categories, setCategories] = useState([]);
  const [visibleCategories, setVisibleCategories] = useState([]);
  const [overflowCategories, setOverflowCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // 🔄 Charger les catégories au montage
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

  // 🔍 Gérer la recherche
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (!onSearchResults) return;

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

  // 📂 Gérer le clic sur une catégorie
  const handleCategoryClick = (categoryName) => {
    onCategorySelect(categoryName);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        
        {/* 🔄 Bouton Recharger */}
        <button className={styles.iconButton} onClick={() => onCategorySelect(null)} title="Recharger">
          <FiRefreshCw />
        </button>

        {/* 📂 Catégories */}
        <ul className={styles.navList}>
          {visibleCategories.map((cat) => (
            <li key={cat.id} className={styles.navItem}>
              <button className={styles.navLink} onClick={() => handleCategoryClick(cat.name)}>
                {cat.name}
              </button>
            </li>
          ))}

          {/* 🔽 Menu déroulant Catégories supplémentaires au survol */}
          {overflowCategories.length > 0 && (
            <li className={`${styles.navItem} ${styles.dropdownContainer}`}>
              <button className={styles.iconButton}>
                <FiMoreHorizontal />
              </button>
              <div className={styles.dropdownMenu}>
                {overflowCategories.map((cat) => (
                  <button 
                    key={cat.id} 
                    className={styles.dropdownItem} 
                    onClick={() => handleCategoryClick(cat.name)}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </li>
          )}
        </ul>

        {/* 🔍 Barre de recherche */}
        <div className={styles.searchBar}>
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className={styles.searchInput}
          />
          <button className={styles.searchButton} title="Rechercher">
            <FiSearch />
          </button>
        </div>

        {/* ⚙️ Paramètres (menu en hover) */}
        <div className={`${styles.rightNav} ${styles.dropdownContainer}`}>
          <button className={styles.iconButton}>
            <FiSettings />
          </button>
          <div className={styles.dropdownMenu}>
            <button className={styles.dropdownItem}>Option 1</button>
            <button className={styles.dropdownItem}>Option 2</button>
          </div>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
