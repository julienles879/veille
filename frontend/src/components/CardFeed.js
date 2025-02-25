import { Link } from "react-router-dom";

const CardFeed = ({ feed }) => {
  const { id, title, description } = feed;

  return (
    <div style={styles.card}>
      <h3>{title}</h3>
      <p>{description || "Pas de description disponible."}</p>
      <Link to={`/feeds/${id}`} style={styles.link}>
        Voir les articles du flux ➔
      </Link>
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
