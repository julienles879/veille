import React from "react";

const CardArticle = ({ article }) => {
  const {
    title,
    published_at,
    image,
    category,
    feed_name,
    detail_link,
  } = article;

  // Formatage de la date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("fr-FR", options);
  };

  return (
    <div style={styles.card}>
      {/* Image ou espace réservé */}
      <div style={styles.imageContainer}>
        {image ? (
          <img
            src={image}
            alt={title}
            style={styles.image}
            referrerPolicy="no-referrer" // ✅ Ajouté pour CORS
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://placehold.co/350x200?text=Image+indisponible";
            }}
          />

        ) : (
          <div style={styles.placeholder}>Pas d'image</div>
        )}
      </div>

      {/* Contenu de la carte */}
      <div style={styles.content}>
        <h2 style={styles.title}>{title}</h2>
        <p style={styles.date}>{formatDate(published_at)}</p>
        <p style={styles.category}>Catégorie : {category || "Non spécifiée"}</p>
        <p style={styles.feed}>Source : {feed_name}</p>
        <a href={detail_link} style={styles.link}>
          Voir les détails ➔
        </a>
      </div>
    </div>
  );
};

const styles = {
  card: {
    display: "flex",
    flexDirection: "column",
    border: "1px solid #ddd",
    borderRadius: "8px",
    overflow: "hidden",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.2s ease",
    maxWidth: "350px",
    cursor: "pointer",
  },
  imageContainer: {
    width: "100%",
    height: "200px",
    backgroundColor: "#f0f0f0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  placeholder: {
    color: "#999",
    fontSize: "14px",
  },
  content: {
    padding: "16px",
  },
  title: {
    fontSize: "18px",
    margin: "0 0 8px 0",
    fontWeight: "bold",
  },
  date: {
    fontSize: "14px",
    color: "#666",
    marginBottom: "8px",
  },
  category: {
    fontSize: "14px",
    color: "#333",
    marginBottom: "4px",
  },
  feed: {
    fontSize: "14px",
    color: "#333",
    marginBottom: "12px",
  },
  link: {
    textDecoration: "none",
    color: "#007bff",
    fontWeight: "bold",
  },
};

export default CardArticle;
