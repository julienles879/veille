import React from "react";
import { Link } from "react-router-dom";

const CardCategories = ({ Categories }) => {
  const { id, name, description, feeds } = Categories;

  return (
    <div style={styles.card}>
      <h2>{name}</h2>
      <p>{description || "Aucune description disponible."}</p>

      {feeds && feeds.length > 0 ? (
        <div>
          <h4>Flux RSS :</h4>
          <ul>
            {feeds.map((feed) => (
              <li key={feed.id}>
                <Link to={`/feeds/${feed.id}`} style={styles.link}>
                  {feed.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p style={{ color: "gray" }}>Aucun flux RSS dans cette catégorie.</p>
      )}
    </div>
  );
};

const styles = {
  card: {
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "16px",
    width: "300px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  link: {
    textDecoration: "none",
    color: "#007BFF",
  },
};

export default CardCategories;
