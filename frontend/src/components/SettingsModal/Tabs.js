// frontend/src/components/SettingsModal/Tabs.js
import React from "react";
import styles from "./SettingsModal.module.css";

const Tabs = ({ activeTab, setActiveTab }) => {
  return (
    <div className={styles.navTabs}>
      <button className={activeTab === "flux" ? styles.activeTab : ""} onClick={() => setActiveTab("flux")}>
        Flux
      </button>
      <button className={activeTab === "favoris" ? styles.activeTab : ""} onClick={() => setActiveTab("favoris")}>
        Favoris
      </button>
      <button className={activeTab === "categories" ? styles.activeTab : ""} onClick={() => setActiveTab("categories")}>
        Catégories
      </button>
      {/* ✅ Ajout Profil */}
      <button className={activeTab === "profil" ? styles.activeTab : ""} onClick={() => setActiveTab("profil")}>
        Profil
      </button>
    </div>
  );
};

export default Tabs;
