import React, { useEffect, useState, useCallback, useRef } from "react";
import api from "../../api";
import Navbar from "../../components/navbar/navbar";
import CardArticle from "../../components/CardArticle/CardArticle";
import styles from "./Home.module.css"; // ✅ Import du CSS

const Home = () => {
  const [articles, setArticles] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const fetchAbortRef = useRef(null);
  const isFetchingRef = useRef(false);

  const handleSearchResults = (results) => {
    console.log("🔍 Recherche effectuée, résultats reçus:", results);
    setIsSearching(true);
    setPage(1);
    setHasMore(false);
    setArticles(Array.isArray(results.results) ? results.results : []);
  };

  const handleCategorySelect = (categoryName) => {
    console.log(`📂 Catégorie sélectionnée (ID): ${categoryName}`);
    setSelectedCategory(categoryName);
    setPage(1);
    setHasMore(true);
    setIsSearching(false);
    setArticles([]);
  };

  const fetchArticles = useCallback(async () => {
    if (isFetchingRef.current || !hasMore || isSearching) return;

    isFetchingRef.current = true;
    setIsLoading(true);
    let query = `/feeds/articles/recent/?limit=30&page=${page}`;
    if (selectedCategory) {
      query += `&category__name=${selectedCategory}`;
      console.log("🔎 Catégorie envoyée au back :", selectedCategory);
    }

    console.log(`📡 Requête API envoyée: ${query}`);

    try {
      if (fetchAbortRef.current) {
        fetchAbortRef.current.abort();
      }
      fetchAbortRef.current = new AbortController();

      const response = await api.get(query, { signal: fetchAbortRef.current.signal });
      console.log("📩 Réponse API reçue:", response.data);

      const articlesData = response.data.results || [];
      console.log("📋 Articles récupérés:", articlesData);

      setArticles((prevArticles) => (page === 1 ? articlesData : [...prevArticles, ...articlesData]));

      if (!response.data.next || articlesData.length < 30) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("❌ Erreur lors de la récupération des articles:", error);
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  }, [page, hasMore, isSearching, selectedCategory]);

  useEffect(() => {
    if (!isSearching) {
      fetchArticles();
    }
  }, [fetchArticles, page, selectedCategory]);

  useEffect(() => {
    let timeout = null;
    const handleScroll = () => {
      if (timeout) return;

      timeout = setTimeout(() => {
        if (
          window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 200 &&
          !isLoading &&
          hasMore &&
          !isFetchingRef.current
        ) {
          console.log("🔄 Chargement de la page suivante...");
          setPage((prevPage) => prevPage + 1);
        }
        timeout = null;
      }, 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (timeout) clearTimeout(timeout);
    };
  }, [isLoading, hasMore]);

  return (
    <div>
      <Navbar onSearchResults={handleSearchResults} onCategorySelect={handleCategorySelect} />
      <div className={styles.homeContainer}>
        <h1 className={styles.pageTitle}>
          Articles {selectedCategory ? `de la catégorie ${selectedCategory}` : "Récents"}
        </h1>
        <div className={styles.articlesGrid}>
          {articles.length > 0 ? (
            articles.map((article) => <CardArticle key={article.id} article={article} />)
          ) : (
            <p className={styles.loadingMessage}>⚠️ Aucun article trouvé.</p>
          )}
        </div>
        {isLoading && <p className={styles.loadingMessage}>⏳ Chargement...</p>}
        {!hasMore && <p className={styles.endMessage}>✅ Pas d'autres articles à charger.</p>}
      </div>
    </div>
  );
};

export default Home;
