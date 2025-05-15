import React, { useState, useEffect } from "react";
import styles from "./FavorisManager.module.css";
import api from "../../api";

const FavorisManager = () => {
  const [favorites, setFavorites] = useState([]);

  // 📡 Charger les favoris au montage
  useEffect(() => {
    api.get("/articles/favorites/")
      .then((response) => {
        console.log("💾 Favoris récupérés :", response.data);
        setFavorites(response.data);
      })
      .catch((error) => console.error("❌ Erreur lors de la récupération des favoris :", error));
  }, []);

  // ❌ Supprimer un favori
  const handleRemoveFavorite = async (articleId) => {
    try {
      const response = await api.delete(`/articles/favorites/remove/${articleId}/`);
      if (response.status === 200) {
        setFavorites(favorites.filter((fav) => fav.id !== articleId));
      }
    } catch (error) {
      console.error("❌ Erreur lors de la suppression du favori :", error);
    }
  };

  return (
    <div className={styles.favorisContainer}>
      <h3>⭐ Vos Articles Favoris</h3>

      {favorites.length === 0 ? (
        <p className={styles.noFavorites}>Aucun favori enregistré.</p>
      ) : (
        <div className={styles.favoritesGrid}>
          {favorites.map((article) => (
            <div key={article.id} className={styles.card}>
              <div className={styles.imageContainer}>
                {article.image ? (
                  <img
                    src={article.image}
                    alt={article.title}
                    className={styles.image}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://placehold.co/250x150?text=Image+indisponible";
                    }}
                  />
                ) : (
                  <div className={styles.placeholder}>Pas d'image</div>
                )}
              </div>

              <div className={styles.content}>
                <h2 className={styles.title}>{article.title}</h2>
                <p className={styles.date}>🕒 {new Date(article.published_at).toLocaleDateString("fr-FR")}</p>
                <p className={styles.category}>📂 {article.category || "Non spécifiée"}</p>
                <p className={styles.feed}>📰 {article.feed_title}</p>
              </div>

              {/* ❤️ Bouton de suppression (cœur rouge) */}
              <button className={styles.favoriteButton} onClick={() => handleRemoveFavorite(article.id)}>
                ❤️
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavorisManager;
