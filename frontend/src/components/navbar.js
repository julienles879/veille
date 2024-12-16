import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav style={styles.navbar}>
      <ul style={styles.navList}>
        <li style={styles.navItem}>
          <Link to="/" style={styles.navLink}>Accueil</Link>
        </li>
        <li style={styles.navItem}>
          <Link to="/rss-feeds" style={styles.navLink}>Flux RSS</Link>
        </li>
        <li style={styles.navItem}>
          <Link to="/add-rss-feed" style={styles.navLink}>Ajouter un flux</Link>
        </li>
        <li style={styles.navItem}>
          <Link to="/favorites" style={styles.navLink}>Favoris</Link>
        </li>
        <li style={styles.navItem}>
          <Link to="/categories" style={styles.navLink}>Catégories</Link>
        </li>
      </ul>
    </nav>
  );
};

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "center",
    backgroundColor: "#333",
    padding: "1rem",
  },
  navList: {
    display: "flex",
    listStyle: "none",
    margin: 0,
    padding: 0,
  },
  navItem: {
    margin: "0 1rem",
  },
  navLink: {
    color: "white",
    textDecoration: "none",
    fontSize: "1rem",
  },
};

export default Navbar;
