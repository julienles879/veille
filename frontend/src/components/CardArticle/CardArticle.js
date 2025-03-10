//src/components/CardArticle/CardArticle.js

import React, { useState, useEffect } from "react";
import styles from "./CardArticle.module.css"; // ✅ Import du CSS

const CardArticle = ({ article, onArticleSelect }) => {
  const { id, title, published_at, image, category, feed_title } = article;

  // État pour savoir si l'article est favori
  const [isFavorite, setIsFavorite] = useState(false);

  // Vérifier si l'article est déjà un favori au chargement
  useEffect(() => {
    fetch(`http://127.0.0.1:8000/articles/favorites/`)
      .then((response) => response.json())
      .then((favorites) => {
        const isAlreadyFavorite = favorites.some((fav) => fav.id === id);
        setIsFavorite(isAlreadyFavorite);
      })
      .catch((error) => console.error("Erreur de récupération des favoris :", error));
  }, [id]);

  // Fonction pour ajouter/supprimer un article des favoris
  const toggleFavorite = async (event) => {
    event.stopPropagation(); // Empêche l'ouverture de l'article au clic

    const apiUrl = isFavorite
      ? `http://127.0.0.1:8000/articles/favorites/remove/${id}/` // Suppression du favori
      : `http://127.0.0.1:8000/articles/favorites/add/`; // Ajout du favori

    const method = isFavorite ? "DELETE" : "POST";
    const body = isFavorite ? null : JSON.stringify({ article_id: id });

    try {
      const response = await fetch(apiUrl, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: body,
      });

      if (response.ok) {
        setIsFavorite(!isFavorite);
        console.log(isFavorite ? "❌ Favori supprimé" : "✅ Favori ajouté !");
      } else {
        const errorResponse = await response.json();
        console.error("Erreur lors de la mise à jour du favori :", errorResponse);
      }
    } catch (error) {
      console.error("Erreur réseau :", error);
    }
  };

  return (
    <div className={styles.card} onClick={() => onArticleSelect(article)}>
      <div className={styles.imageContainer}>
        {image ? (
          <img
            src={image}
            alt={title}
            className={styles.image}
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://placehold.co/350x200?text=Image+indisponible";
            }}
          />
        ) : (
          <div className={styles.placeholder}>Pas d'image</div>
        )}
      </div>
  
      <div className={styles.content}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.date}>🕒 {new Date(published_at).toLocaleDateString("fr-FR")}</p>
        <p className={styles.category}>📂 Catégorie : <strong>{category || "Non spécifiée"}</strong></p>
        <p className={styles.feed}>📰 Source : <strong>{feed_title}</strong></p>
      </div>
  
      {/* Icône de favoris positionnée en bas à droite */}
      <button className={styles.favoriteButton} onClick={toggleFavorite}>
        {isFavorite ? "❤️" : "🤍"}
      </button>
    </div>
  );
}  

export default CardArticle;
