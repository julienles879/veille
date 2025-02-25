import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/layout";
import Home from "./pages/Home";
import RSSFeeds from "./pages/RSSFeeds";
import AddRSSFeed from "./pages/AddRSSFeed";
import Favorites from "./pages/Favorites";
import FeedDetail from "./pages/FeedDetail";
import Categories from "./pages/Categories";
import ArticleDetail from "./pages/ArticleDetail";



const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rss-feeds" element={<RSSFeeds />} />
          <Route path="/add-rss-feed" element={<AddRSSFeed />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/rss-feeds/:id" element={<FeedDetail />} />
          <Route path="/articles/:id" element={<ArticleDetail />} />
          <Route path="/feeds/categories" element={<Categories />} />
          <Route path="/feeds/:id" element={<FeedDetail />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;