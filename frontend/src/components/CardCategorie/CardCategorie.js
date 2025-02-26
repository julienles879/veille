import React from "react";
import { Link } from "react-router-dom";
import styles from "./CardCategorie.module.css"; // ✅ Import du fichier CSS modulaire

const CardCategories = ({ Categories }) => {
  const { id, name, description, feeds } = Categories;

  return (
    <div className={styles.card}>
      <h2 className={styles.title}>{name}</h2>
      <p className={styles.description}>{description || "Aucune description disponible."}</p>

      {feeds && feeds.length > 0 ? (
        <div className={styles.feedContainer}>
          <h4 className={styles.feedTitle}>Flux RSS :</h4>
          <ul className={styles.feedList}>
            {feeds.map((feed) => (
              <li key={feed.id} className={styles.feedItem}>
                <Link to={`/feeds/${feed.id}`} className={styles.feedLink}>
                  {feed.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className={styles.description} style={{ color: "gray" }}>Aucun flux RSS dans cette catégorie.</p>
      )}
    </div>
  );
};

export default CardCategories;
