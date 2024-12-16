import React, { useEffect, useState } from "react";
import api from "../api";

const RSSFeeds = () => {
  const [feeds, setFeeds] = useState([]);

  useEffect(() => {
    api
      .get("/feeds/")
      .then((response) => setFeeds(response.data))
      .catch((error) => console.error("Erreur lors de la récupération des flux :", error));
  }, []);

  return (
    <div>
      <h1>Flux RSS</h1>
      <ul>
        {feeds.map((feed) => (
          <li key={feed.id}>
            <h3>{feed.title}</h3>
            <p>{feed.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RSSFeeds;
