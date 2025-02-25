import React from "react";

const CardFeed = ({ feed }) => {
  const { title, description, link } = feed;

  return (
    <div style={styles.card}>
      <h3>{title}</h3>
      <p>{description || "Pas de description disponible."}</p>
      <a href={link} target="_blank" rel="noopener noreferrer" style={styles.link}>
        Consulter le flux
      </a>
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

export default CardFeed;
