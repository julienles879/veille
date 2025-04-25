    import React from "react";
    import styles from "./FloatingGoogleSearch.module.css";

    function FloatingGoogleSearch() {
    return (
        <div className={styles.container}>
        <form
            action="https://www.google.com/search"
            method="GET"
            target="_blank"
            className={styles.form}
        >
            <input
            type="text"
            name="q"
            placeholder="Rechercher sur Google..."
            className={styles.input}
            />
            <button type="submit" className={styles.button}>
            Go
            </button>
        </form>
        </div>
    );
    }

    export default FloatingGoogleSearch;
