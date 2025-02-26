import React, { useEffect, useState, useCallback, useRef } from "react";
import api from "../api";
import Navbar from "../components/navbar";
import CardArticle from "../components/CardArticle";

const Home = () => {
  const [articles, setArticles] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const fetchAbortRef = useRef(null);
  const isFetchingRef = useRef(false);

  // ✅ Met à jour les articles après une recherche depuis la Navbar
  const handleSearchResults = (results) => {
    console.log("🔍 Recherche effectuée, résultats reçus:", results);
    setIsSearching(true);
    setPage(1);
    setHasMore(false);
    setArticles(Array.isArray(results.results) ? results.results : []);
  };

  // ✅ Met à jour les articles après la sélection d'une catégorie
  const handleCategorySelect = (categoryName) => {
    console.log(`📂 Catégorie sélectionnée (ID): ${categoryName}`);
    setSelectedCategory(categoryName);
    setPage(1);
    setHasMore(true);
    setIsSearching(false);
    setArticles([]);
  };

  // 🔄 Récupère les articles avec pagination ou par catégorie
  const fetchArticles = useCallback(async () => {
    if (isFetchingRef.current || !hasMore || isSearching) return;

    isFetchingRef.current = true;
    setIsLoading(true);
    let query = `/feeds/articles/recent/?limit=30&page=${page}`;
    if (selectedCategory) {
      query += `&category__name=${selectedCategory}`; // 🔥 Utiliser category__name et pas category=id
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

  // 🔄 Gère le scroll infini
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
      <div style={{ padding: "20px" }}>
        <h1>Articles {selectedCategory ? `de la catégorie ${selectedCategory}` : "Récents"}</h1>
        <div style={styles.grid}>
          {articles.length > 0 ? (
            articles.map((article) => <CardArticle key={article.id} article={article} />)
          ) : (
            <p>⚠️ Aucun article trouvé.</p>
          )}
        </div>
        {isLoading && <p>⏳ Chargement...</p>}
        {!hasMore && <p>✅ Pas d'autres articles à charger.</p>}
      </div>
    </div>
  );
};

const styles = {
  grid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "20px",
    justifyContent: "center",
  },
};

export default Home;