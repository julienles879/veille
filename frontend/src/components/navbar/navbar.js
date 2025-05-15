// src/components/navbar/navbar.js
import React, { useState, useEffect } from "react";
import {
  FiSettings,
  FiMoreHorizontal,
  FiSearch,
  FiRefreshCw,
  FiBarChart2,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import SettingsModal from "../SettingsModal/SettingsModal";
import styles from "./navbar.module.css";
import api from "../../api";
import { Link } from "react-router-dom";

const Navbar = ({ onSearchResults }) => {
  const [categories, setCategories] = useState([]);
  const [visibleCategories, setVisibleCategories] = useState([]);
  const [overflowCategories, setOverflowCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();

  // 🔄 Charger les catégories au montage
  useEffect(() => {
    api
      .get("/feeds/categories/")
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
      .catch((error) =>
        console.error("Erreur lors du chargement des catégories :", error)
      );
  }, []);

  // 🔍 Gérer la recherche
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (!onSearchResults) return;

    if (query.trim()) {
      api
        .get(`/feeds/articles/search/?search=${query}`)
        .then((response) => onSearchResults(response.data))
        .catch((error) =>
          console.error("Erreur lors de la recherche :", error)
        );
    } else {
      api
        .get(`/feeds/articles/recent/?limit=30`)
        .then((response) => onSearchResults(response.data))
        .catch((error) =>
          console.error("Erreur lors du rechargement des articles :", error)
        );
    }
  };

  // 📂 Gestion du clic sur une catégorie
  const handleCategoryClick = (categoryName) => {
    navigate(`/?category=${encodeURIComponent(categoryName)}`);
  };

  // 🔄 Bouton "recharger"
  const handleReloadClick = () => {
    navigate("/");
  };

  return (
    <>
      <nav className={styles.navbar}>
        {/* 🔄 Recharger */}
        <button
          className={styles.iconButton}
          onClick={handleReloadClick}
          title="Recharger"
        >
          <FiRefreshCw />
        </button>

        {/* 📂 Catégories visibles */}
        <ul className={styles.navList}>
          {visibleCategories.map((cat) => (
            <li key={cat.id} className={styles.navItem}>
              <button
                className={styles.navLink}
                onClick={() => handleCategoryClick(cat.name)}
              >
                {cat.name}
              </button>
            </li>
          ))}

          {/* 🔽 Catégories overflow */}
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

        {/* 📊 Statistiques */}
        <Link to="/stats" className={styles.iconButton} title="Statistiques">
          <FiBarChart2 />
        </Link>

        {/* ⚙️ Paramètres */}
        <button
          className={styles.iconButton}
          title="Paramètres"
          onClick={() => setIsModalOpen(true)}
        >
          <FiSettings />
        </button>
      </nav>

      {/* ⚙️ Modal de paramètres */}
      {isModalOpen && <SettingsModal onClose={() => setIsModalOpen(false)} />}
    </>
  );
};

export default Navbar;
