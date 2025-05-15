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

import PrivateRoute from "./components/PrivateRoute";

const App = () => {
  return (
    <Router>
      {/* <Navbar /> */}

      <Routes>
        {/* pages publiques */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* pages protégées */}
        <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="/rss-feeds" element={<PrivateRoute><RSSFeeds /></PrivateRoute>} />
        <Route path="/add-rss-feed" element={<PrivateRoute><AddRSSFeed /></PrivateRoute>} />
        <Route path="/favorites" element={<PrivateRoute><Favorites /></PrivateRoute>} />
        <Route path="/feeds/categories" element={<PrivateRoute><Categories /></PrivateRoute>} />
        <Route path="/feeds/:id" element={<PrivateRoute><FeedDetail /></PrivateRoute>} />
        <Route path="/stats" element={<PrivateRoute><Stats /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Update /></PrivateRoute>} />
      </Routes>
    </Router>
  );
};

export default App;
