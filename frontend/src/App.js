import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import RSSFeeds from "./pages/RSSFeeds/RSSFeeds";
import AddRSSFeed from "./pages/AddRSSFeed/AddRSSFeed";
import Favorites from "./pages/Favorites/Favorites";
import FeedDetail from "./pages/FeedDetail/FeedDetail";
import Categories from "./pages/Categories/Categories";
// import Navbar from "./components/navbar/navbar";
import Stats from "./pages/Stats/Stats";
import Login from "./pages/Users/Login";
import Register from "./pages/Users/Register";
import Update from "./pages/Users/Update";

const App = () => {
  return (
    <Router>
      {/* <Navbar
        onCategorySelect={(cat) => {
          // Tu peux gérer une redirection ou mettre à jour un state global ici
          // Pour l'instant, on peut ne rien faire ou naviguer vers la home :
          if (cat) {
            window.location.href = `/?category=${encodeURIComponent(cat)}`;
          } else {
            window.location.href = "/";
          }
        }}
        onSearchResults={null} // Ou à gérer globalement si tu as un système centralisé
      /> */}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/rss-feeds" element={<RSSFeeds />} />
        <Route path="/add-rss-feed" element={<AddRSSFeed />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/feeds/categories" element={<Categories />} />
        <Route path="/feeds/:id" element={<FeedDetail />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Update />} />
      </Routes>
    </Router>

  );
};

export default App;