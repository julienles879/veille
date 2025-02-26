import React, { useEffect, useState, useCallback, useRef } from "react";
import api from "../api";
import Navbar from "../components/navbar";
import Filters from "../components/Filters";
import CardArticle from "../components/CardArticle";

const Home = () => {
  const [articles, setArticles] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    limit: 30,
    category: "",
  });

  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [isSearching, setIsSearching] = useState(false);
  
  const fetchAbortRef = useRef(null);
  const isFetchingRef = useRef(false); // ✅ Empêche plusieurs requêtes simultanées

  // ✅ Met à jour les articles après une recherche depuis la Navbar
  const handleSearchResults = (results) => {
    setIsSearching(true);
    setPage(1);
    setHasMore(false); // Désactive la pagination lors d'une recherche
    setArticles(Array.isArray(results.results) ? results.results : []);
  };

  // 🔄 Récupère les articles selon les filtres ou la pagination
  const fetchArticles = useCallback(async () => {
    if (isFetchingRef.current || (!hasMore && !isSearching)) return; // ✅ Bloque les appels multiples

    isFetchingRef.current = true; // ✅ Marque l'appel comme en cours
    setIsLoading(true);
    console.log("Fetching articles for page:", page);

    let query = `/feeds/articles/recent/?limit=${filters.limit}&page=${page}`;
    if (filters.category && filters.category !== "Toutes catégories") {
      query += `&category=${filters.category}`;
    }

    if (filters.search.trim() !== "") {
      query = `/feeds/articles/search/?search=${filters.search}&limit=${filters.limit}&page=${page}`;
      if (filters.category && filters.category !== "Toutes catégories") {
        query += `&category=${filters.category}`;
      }
    }

    try {
      if (fetchAbortRef.current) {
        fetchAbortRef.current.abort();
      }
      fetchAbortRef.current = new AbortController();

      const response = await api.get(query, { signal: fetchAbortRef.current.signal });
      console.log("Réponse API :", response.data);

      const articlesData = response.data.results || (Array.isArray(response.data) ? response.data : []);

      setArticles((prevArticles) => {
        if (page === 1 || isSearching) {
          return articlesData;
        }
        const newArticles = [...prevArticles, ...articlesData];
        return newArticles.filter(
          (article, index, self) => index === self.findIndex((a) => a.id === article.id)
        );
      });

      if (!response.data.next || articlesData.length < filters.limit) {
        setHasMore(false);
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Erreur lors de la récupération des articles :", error);
      }
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false; // ✅ Libère l'appel API
    }
  }, [filters, page, hasMore, isSearching]);

  // ✅ Charge les articles uniquement si ce n'est pas une recherche
  useEffect(() => {
    if (!isSearching) {
      fetchArticles();
    }
  }, [fetchArticles, page]);

  // ✅ Réinitialise la liste des articles et la pagination après une recherche vide
  useEffect(() => {
    if (!filters.search.trim()) {
      setPage(1);
      setHasMore(true);
      setIsSearching(false);
    }
  }, [filters.search]);

  // 🔄 Gère le scroll infini avec un **setTimeout** (empêche trop de requêtes)
  useEffect(() => {
    let timeout = null;

    const handleScroll = () => {
      if (timeout) return; // ✅ Empêche plusieurs déclenchements en même temps

      timeout = setTimeout(() => {
        if (
          window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 200 &&
          !isLoading &&
          hasMore &&
          !isSearching &&
          !isFetchingRef.current // ✅ Empêche les doubles appels
        ) {
          console.log("Loading next page...");
          setPage((prevPage) => prevPage + 1);
        }
        timeout = null;
      }, 300); // ✅ Ajoute un délai pour limiter les requêtes
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (timeout) clearTimeout(timeout);
    };
  }, [isLoading, hasMore, isSearching]);

  return (
    <div>
      <Navbar onSearchResults={handleSearchResults} />

      <div style={{ padding: "20px" }}>
        <h1>Articles Récents</h1>

        <Filters
          onFilterChange={(newFilters) => {
            setArticles([]);
            setPage(1);
            setHasMore(true);
            setIsSearching(false);
            setFilters((prev) => ({ ...prev, ...newFilters }));
          }}
          filters={filters}
          showSort={false}
        />

        <div style={{ marginBottom: "20px" }}>
          <label>Afficher par :</label>
          <select
            value={filters.limit}
            onChange={(e) => {
              setArticles([]);
              setPage(1);
              setHasMore(true);
              setIsSearching(false);
              setFilters((prev) => ({ ...prev, limit: parseInt(e.target.value, 10) }));
            }}
            style={{ marginLeft: "10px", padding: "5px" }}
          >
            <option value="30">30 articles</option>
            <option value="40">40 articles</option>
            <option value="50">50 articles</option>
          </select>
        </div>

        <div style={styles.grid}>
          {articles.length > 0 ? (
            articles.map((article) => <CardArticle key={article.id} article={article} />)
          ) : (
            <p>Aucun article trouvé.</p>
          )}
        </div>

        {isLoading && <p>Chargement...</p>}
        {!hasMore && !isSearching && <p>Pas d'autres articles à charger.</p>}
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