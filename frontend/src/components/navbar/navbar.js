import React, { useState, useEffect } from "react";
import {
  FiSettings,
  FiMoreHorizontal,
  FiSearch,
  FiRefreshCw,
  FiBarChart2,
  FiLogOut
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
  const [currentUser, setCurrentUser] = useState("");    // ✅ ajout

  const navigate = useNavigate();

  useEffect(() => {
    // 🔄 Charger les catégories
    api.get("/feeds/categories/")
      .then((response) => {
        if (!Array.isArray(response.data.results)) return;
        setCategories(response.data.results);
        const maxVisible = 6;
        setVisibleCategories(response.data.results.slice(0, maxVisible));
        setOverflowCategories(response.data.results.slice(maxVisible));
      })
      .catch(() => {});

    // ✅ Charger le nom d'utilisateur
    api.get("/users/profile/")
      .then((response) => setCurrentUser(response.data.username))
      .catch(() => setCurrentUser(""));  // si pas connecté → vide
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (!onSearchResults) return;

    if (query.trim()) {
      api.get(`/feeds/articles/search/?search=${query}`)
        .then((res) => onSearchResults(res.data))
        .catch(() => {});
    } else {
      api.get(`/feeds/articles/recent/?limit=30`)
        .then((res) => onSearchResults(res.data))
        .catch(() => {});
    }
  };

  const handleCategoryClick = (categoryName) => {
    navigate(`/?category=${encodeURIComponent(categoryName)}`);
  };

  const handleReloadClick = () => {
    navigate("/");
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    navigate("/login");
  };

  return (
    <>
      <nav className={styles.navbar}>
        {/* 🔄 Recharger */}
        <button className={styles.iconButton} onClick={handleReloadClick} title="Recharger">
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
          {overflowCategories.length > 0 && (
            <li className={`${styles.navItem} ${styles.dropdownContainer}`}>
              <button className={styles.iconButton}><FiMoreHorizontal /></button>
              <div className={styles.dropdownMenu}>
                {overflowCategories.map((cat) => (
                  <button key={cat.id} className={styles.dropdownItem} onClick={() => handleCategoryClick(cat.name)}>
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
          <button className={styles.searchButton} title="Rechercher"><FiSearch /></button>
        </div>

        {/* ✅ 👤 Affichage utilisateur connecté */}
        {currentUser && (
          <div className={styles.userInfo}>
            Connecté en tant que <strong>{currentUser}</strong>
          </div>
        )}

        {/* 📊 Statistiques */}
        <Link to="/stats" className={styles.iconButton} title="Statistiques">
          <FiBarChart2 />
        </Link>

        {/* 🚪 Déconnexion */}
        <button className={styles.iconButton} title="Se déconnecter" onClick={handleLogout}>
          <FiLogOut />
        </button>

        {/* ⚙️ Paramètres */}
        <button className={styles.iconButton} title="Paramètres" onClick={() => setIsModalOpen(true)}>
          <FiSettings />
        </button>
      </nav>

      {isModalOpen && <SettingsModal onClose={() => setIsModalOpen(false)} />}
    </>
  );
};

export default Navbar;
