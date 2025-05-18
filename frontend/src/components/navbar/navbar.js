import React, { useEffect, useState } from "react";
import {
  FiBarChart2,
  FiLogOut,
  FiMoreHorizontal,
  FiRefreshCw,
  FiSearch,
  FiSettings
} from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api";
import SettingsModal from "../SettingsModal/SettingsModal";
import styles from "./navbar.module.css";

const Navbar = ({ onSearchResults }) => {
  const [categories, setCategories] = useState([]);
  const [visibleCategories, setVisibleCategories] = useState([]);
  const [overflowCategories, setOverflowCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState("");

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
      .catch(() => setCurrentUser(""));
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
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleSyncClick = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://127.0.0.1:8000/tasks/update-rss/", {
        method: "POST",
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        console.log("✅ Synchronisation réussie :", data.message);
        alert("Articles synchronisés !");
      } else {
        console.error("❌ Erreur de synchronisation :", data.error || data);
        alert("Erreur lors de la synchronisation.");
      }
    } catch (err) {
      console.error("❌ Erreur réseau :", err);
      alert("Erreur réseau.");
    }
  };

  return (
    <>
      <nav className={styles.navbar}>
        {/* 📂 Catégories à gauche */}
        <ul className={styles.navList}>
          {visibleCategories.map((cat) => (
            <li key={cat.id} className={styles.navItem}>
              <button onClick={() => handleCategoryClick(cat.name)}>{cat.name}</button>
            </li>
          ))}
          {overflowCategories.length > 0 && (
            <li className={styles.dropdownContainer}>
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

        {/* 🔍 Barre de recherche centrée */}
        <div className={styles.searchBar}>
          <input
            type="text"
            placeholder="Rechercher un article..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className={styles.searchInput}
          />
          <button className={styles.searchButton}><FiSearch /></button>
        </div>

        {/* 👤 Utilisateur + actions à droite */}
        <div className={styles.actions}>
          {currentUser && <div className={styles.userInfo}>{currentUser}</div>}

          <button className={styles.iconButton} onClick={handleSyncClick} title="Synchroniser les flux">
            <FiRefreshCw />
          </button>
          <Link to="/stats" className={styles.iconButton} title="Statistiques">
            <FiBarChart2 />
          </Link>
          <button className={styles.iconButton} onClick={() => setIsModalOpen(true)} title="Paramètres">
            <FiSettings />
          </button>
          <button className={styles.iconButton} onClick={handleLogout} title="Déconnexion">
            <FiLogOut />
          </button>
        </div>

        {isModalOpen && <SettingsModal onClose={() => setIsModalOpen(false)} />}
      </nav>

    </>
  );
};

export default Navbar;
