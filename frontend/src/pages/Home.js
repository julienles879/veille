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
  const fetchAbortRef = useRef(null);
  const isFetchingRef = useRef(false);

  // ✅ Met à jour les articles après une recherche depuis la Navbar
  const handleSearchResults = (results) => {
    setIsSearching(true);
    setPage(1);
    setHasMore(false);
    setArticles(Array.isArray(results.results) ? results.results : []);
  };

  // 🔄 Récupère les articles avec pagination
  const fetchArticles = useCallback(async () => {
    if (isFetchingRef.current || !hasMore || isSearching) return;

    isFetchingRef.current = true;
    setIsLoading(true);
    console.log("Fetching articles for page:", page);

    let query = `/feeds/articles/recent/?limit=30&page=${page}`;

    try {
      if (fetchAbortRef.current) {
        fetchAbortRef.current.abort();
      }
      fetchAbortRef.current = new AbortController();

      const response = await api.get(query, { signal: fetchAbortRef.current.signal });
      console.log("Réponse API :", response.data);

      const articlesData = response.data.results || (Array.isArray(response.data) ? response.data : []);

      setArticles((prevArticles) => {
        if (page === 1) {
          return articlesData;
        }
        const newArticles = [...prevArticles, ...articlesData];
        return newArticles.filter(
          (article, index, self) => index === self.findIndex((a) => a.id === article.id)
        );
      });

      if (!response.data.next || articlesData.length < 30) {
        setHasMore(false);
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Erreur lors de la récupération des articles :", error);
      }
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  }, [page, hasMore, isSearching]);

  useEffect(() => {
    if (!isSearching) {
      fetchArticles();
    }
  }, [fetchArticles, page]);

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
          console.log("Loading next page...");
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
      <Navbar onSearchResults={handleSearchResults} />
      <div style={{ padding: "20px" }}>
        <h1>Articles Récents</h1>
        <div style={styles.grid}>
          {articles.length > 0 ? (
            articles.map((article) => <CardArticle key={article.id} article={article} />)
          ) : (
            <p>Aucun article trouvé.</p>
          )}
        </div>
        {isLoading && <p>Chargement...</p>}
        {!hasMore && <p>Pas d'autres articles à charger.</p>}
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
