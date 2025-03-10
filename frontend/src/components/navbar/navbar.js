import React, { useState, useEffect } from "react";
import { FiSettings, FiMoreHorizontal, FiSearch, FiRefreshCw } from "react-icons/fi";
import SettingsModal from "../SettingsModal/SettingsModal"; // ✅ Import du modal
import styles from "./navbar.module.css";
import api from "../../api";

const Navbar = ({ onSearchResults, onCategorySelect }) => {
  const [categories, setCategories] = useState([]);
  const [visibleCategories, setVisibleCategories] = useState([]);
  const [overflowCategories, setOverflowCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  return (
    <>
      <nav className={styles.navbar}>
        {/* 🔄 Bouton Recharger */}
        <button className={styles.iconButton} onClick={() => onCategorySelect(null)} title="Recharger">
          <FiRefreshCw />
        </button>

        {/* 📂 Catégories */}
        <ul className={styles.navList}>
          {visibleCategories.map((cat) => (
            <li key={cat.id} className={styles.navItem}>
              <button className={styles.navLink} onClick={() => onCategorySelect(cat.name)}>
                {cat.name}
              </button>
            </li>
          ))}

          {/* 🔽 Menu déroulant pour afficher les catégories supplémentaires */}
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
                    onClick={() => onCategorySelect(cat.name)}
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

        {/* ⚙️ Bouton Paramètres → Ouvre le modal */}
        <button
          className={styles.iconButton}
          title="Paramètres"
          onClick={() => setIsModalOpen(true)}
        >
          <FiSettings />
        </button>
      </nav>

      {/* ✅ Affichage du modal si ouvert */}
      {isModalOpen && <SettingsModal onClose={() => setIsModalOpen(false)} />}
    </>
  );
};

export default Navbar;
