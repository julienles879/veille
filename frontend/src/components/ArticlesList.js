import React, { useEffect, useState } from 'react';
import api from '../api';

const ArticlesList = () => {
    const [articles, setArticles] = useState([]);

    useEffect(() => {
        api.get('/articles/')  // Appel à l'API Django REST
            .then((response) => {
                setArticles(response.data);
            })
            .catch((error) => {
                console.error('Erreur lors de la récupération des articles :', error);
            });
    }, []);

    return (
        <div>
            <h1>Liste des Articles</h1>
            <ul>
                {articles.map((article) => (
                    <li key={article.id}>
                        <h3>{article.title}</h3>
                        <p>{article.content}</p>
                        <a href={article.link} target="_blank" rel="noopener noreferrer">Lire plus</a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ArticlesList;
