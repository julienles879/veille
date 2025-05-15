import { Link } from "react-router-dom";
import styles from "./CardFeed.module.css"; // ✅ Import du fichier CSS modulaire

const CardFeed = ({ feed }) => {
  const { id, title, description } = feed;

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description || "Pas de description disponible."}</p>
      <Link to={`/feeds/${id}`} className={styles.link}>
        Voir les articles du flux ➔
      </Link>
    </div>
  );
};

export default CardFeed;
