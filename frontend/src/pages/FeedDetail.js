import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";

const FeedDetail = () => {
  const { id } = useParams();
  const [feed, setFeed] = useState(null);

  useEffect(() => {
    api
      .get(`/feeds/${id}/`)
      .then((response) => setFeed(response.data))
      .catch((error) => console.error("Erreur lors de la récupération du flux :", error));
  }, [id]);

  return (
    <div>
      {feed && (
        <>
          <h1>{feed.title}</h1>
          <p>{feed.description}</p>
          <h2>Articles</h2>
          {feed.articles.map((article) => (
            <div key={article.id}>
              <h3>{article.title}</h3>
              <p>{article.content}</p>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default FeedDetail;
