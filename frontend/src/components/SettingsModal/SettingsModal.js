// src/components/SettingsModal/SettingsModal.js

import React, { useState } from "react";
import styles from "./SettingsModal.module.css";
import Tabs from "./Tabs";
import FluxManager from "./FluxManager";
import FavorisManager from "./FavorisManager";
import CategoriesManager from "./CategoriesManager";
import ProfilManager from "./ProfilManager";   // ✅ NEW import

const SettingsModal = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState("flux"); // ✅ Par défaut : Flux

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>✖</button>

        {/* 🏷️ Onglets de navigation */}
        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* 🖥️ Affichage dynamique des composants */}
        <div className={styles.content}>
          {activeTab === "flux" && <FluxManager />}
          {activeTab === "favoris" && <FavorisManager />}
          {activeTab === "categories" && <CategoriesManager />}
          {activeTab === "profil" && <ProfilManager />}    {/* ✅ NEW line */}
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
