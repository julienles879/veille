import React, { useEffect, useState } from "react";
import styles from "./WeatherCard.module.css";
import api from "../../api"; // ✅ Import de l'instance Axios

function getWeatherIcon(code) {
    const icons = {
        0: "☀️",   // Soleil
        1: "🌤️",   // Peu nuageux
        2: "⛅",    // Ciel voilé
        3: "☁️",   // Nuageux
        4: "🌥️",   // Très nuageux
        5: "🌫️",   // Brouillard
        6: "🌫️",   // Brouillard dense
        7: "🌫️",   // Brouillard givrant

        10: "🌦️",  // Pluie faible
        11: "🌧️",  // Pluie modérée
        12: "🌧️",  // Pluie forte
        13: "⛈️",  // Pluie très forte
        14: "⛈️",  // Pluie violente

        20: "❄️",  // Neige faible
        21: "🌨️",  // Neige modérée
        22: "🌨️",  // Neige forte

        30: "🌫️",  // Brouillard givrant

        40: "🌦️",  // Averse faible
        41: "🌧️",  // Averse modérée
        42: "⛈️",  // Averse forte

        60: "🌨️",  // Averse de neige
        70: "🌩️",  // Orage faible
        71: "⛈️",  // Orage modéré
        72: "⛈️",  // Orage fort

        100: "❓", // Indéterminé ou inconnu
    };
    return icons[code] || "❓";
    }

    function WeatherCard() {
    const [weather, setWeather] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
            const { latitude, longitude } = position.coords;
            try {
                // Étape 1 : récupérer la ville avec Nominatim
                const locationRes = await fetch(
                `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
                );
                const locationData = await locationRes.json();
                const city =
                locationData.address.city ||
                locationData.address.town ||
                locationData.address.village ||
                locationData.address.county;

                if (!city) {
                setError("Ville non reconnue");
                return;
                }

                // Étape 2 : requête météo via l'instance Axios
                const weatherRes = await api.get(`/tasks/meteo/?city=${city}`);
                const weatherData = weatherRes.data;

                if (weatherData.error) {
                setError(weatherData.error);
                } else {
                setWeather(weatherData);
                }
            } catch (err) {
                console.error("Erreur lors de la géolocalisation météo :", err);
                setError("Erreur météo");
            }
            },
            (err) => {
            console.error("Refus de géolocalisation :", err);
            setError("Localisation refusée");
            }
        );
        } else {
        setError("Géolocalisation non supportée");
        }
    }, []);

    if (error) return <div className="weatherCard error">🌧️ {error}</div>;
    if (!weather) return <div className="weatherCard loading">Chargement météo...</div>;

    return (
        <div className={styles.weatherCard}>
        <div className={styles.icon}>{getWeatherIcon(weather.weather)}</div>
        <div className={styles.city}>📍 {weather.city}</div>
        <div className={styles.temperature}>
            <span>Min : {weather.tmin}°C</span> | <span>Max : {weather.tmax}°C</span>
        </div>
        <div className={styles.date}>
            Prévision du {new Date(weather.datetime).toLocaleDateString()}
        </div>
        </div>
    );
}

export default WeatherCard;
