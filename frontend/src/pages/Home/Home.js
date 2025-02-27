import React, { useEffect, useState, useCallback, useRef } from "react";
import api from "../../api";
import Navbar from "../../components/navbar/navbar";
import CardArticle from "../../components/CardArticle/CardArticle";
import ArticleModal from "../../components/ArticleModal/ArticleModal";
import styles from "./Home.module.css";

const Home = () => {
  const [articles, setArticles] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const fetchAbortRef = useRef(null);
  const isFetchingRef = useRef(false);

  // 🔍 Gestion de la recherche
  const handleSearchResults = (results) => {
    console.log("🔍 Résultats de recherche reçus :", results);
    setIsSearching(true);
    setPage(1);
    setHasMore(false);
    setArticles(Array.isArray(results.results) ? results.results : []);
  };

  // 📂 Gestion de la sélection de catégorie
  const handleCategorySelect = (categoryName) => {
    console.log("📂 Catégorie sélectionnée :", categoryName);
    setSelectedCategory(categoryName);
    setPage(1);
    setHasMore(true);
    setIsSearching(false);
    setArticles([]);
  };

  // 📡 Récupération des articles avec pagination
  const fetchArticles = useCallback(async () => {
    console.log("🔄 fetchArticles appelé avec page:", page, "et catégorie:", selectedCategory);

    if (isFetchingRef.current || !hasMore || isSearching) {
      console.log("⏳ Annulation du fetch : Déjà en cours ou plus d'articles.");
      return;
    }

    isFetchingRef.current = true;
    setIsLoading(true);
    let query = `/feeds/articles/recent/?limit=30&page=${page}`;
    if (selectedCategory) {
      query += `&category__name=${selectedCategory}`;
    }

    try {
      if (fetchAbortRef.current) {
        fetchAbortRef.current.abort();
      }
      fetchAbortRef.current = new AbortController();

      const response = await api.get(query, { signal: fetchAbortRef.current.signal });
      console.log("📩 Réponse API reçue :", response.data);

      const articlesData = response.data.results || [];
      console.log("📋 Articles récupérés :", articlesData.length);

      setArticles((prevArticles) => (page === 1 ? articlesData : [...prevArticles, ...articlesData]));

      if (!response.data.next || articlesData.length < 30) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("❌ Erreur lors de la récupération des articles :", error);
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  }, [page, hasMore, isSearching, selectedCategory]);

  // 🚀 Chargement initial des articles
  useEffect(() => {
    console.log("📌 useEffect déclenché, appel à fetchArticles");
    if (!isSearching) {
      fetchArticles();
    }
  }, [fetchArticles, page, selectedCategory]);

  // 📜 Gestion du scroll infini
  useEffect(() => {
    const handleScroll = () => {
      console.log(
        "📜 Scroll détecté :", 
        window.innerHeight + document.documentElement.scrollTop, 
        "/", 
        document.documentElement.offsetHeight
      );

      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 200 &&
        !isLoading &&
        hasMore &&
        !isFetchingRef.current
      ) {
        console.log("🔄 Déclenchement du chargement des articles (page suivante)");
        setPage((prevPage) => prevPage + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isLoading, hasMore]);

  // ✅ Ouvrir la modale d'article
  const handleArticleSelect = (article) => {
    setSelectedArticle(article);
  };

  // ❌ Fermer la modale d'article
  const handleCloseModal = () => {
    setSelectedArticle(null);
  };

  return (
    <div>
      <Navbar onSearchResults={handleSearchResults} onCategorySelect={handleCategorySelect} />

      <div className={styles.homeContainer}>
        <h1 className={styles.pageTitle}>
          Articles {selectedCategory ? `de la catégorie ${selectedCategory}` : "Récents"}
        </h1>

        <div className={styles.articlesGrid}>
          {articles.length > 0 ? (
            articles.map((article) => (
              <CardArticle key={article.id} article={article} onArticleSelect={handleArticleSelect} />
            ))
          ) : (
            <p className={styles.loadingMessage}>⚠️ Aucun article trouvé.</p>
          )}
        </div>

        {isLoading && <p className={styles.loadingMessage}>⏳ Chargement...</p>}
        {!hasMore && <p className={styles.endMessage}>✅ Pas d'autres articles à charger.</p>}
      </div>

      {/* ✅ Affichage de la modale si un article est sélectionné */}
      {selectedArticle && <ArticleModal article={selectedArticle} onClose={handleCloseModal} />}
    </div>
  );
};

export default Home;
