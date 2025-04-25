import React, { useEffect, useState } from "react";
import { Bar, Pie, Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Tooltip, Legend } from "chart.js";
import api from "../../api"; // ✅ import d'axios instance
import styles from "./Stats.module.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Tooltip, Legend);

const Stats = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/articles/stats/")
      .then(res => setData(res.data))
      .catch(err => {
        console.error("Erreur de récupération des statistiques :", err);
      });
  }, []);

  if (!data) return (
    <div className={styles.container}>
      <p>Chargement des statistiques...</p>
    </div>
  );

  const dailyData = {
    labels: data.articles_par_jour.map(entry => entry.day),
    datasets: [
      {
        label: "Articles ajoutés",
        data: data.articles_par_jour.map(entry => entry.total),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      }
    ]
  };

  const categoryData = {
    labels: data.articles_par_categorie.map(entry => entry.name),
    datasets: [
      {
        label: "Par catégorie",
        data: data.articles_par_categorie.map(entry => entry.total),
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      }
    ]
  };

  const fluxData = {
    labels: data.articles_par_flux.map(entry => entry["feed__title"]),
    datasets: [
      {
        label: "Par flux RSS",
        data: data.articles_par_flux.map(entry => entry.total),
        backgroundColor: "rgba(153, 102, 255, 0.6)",
      }
    ]
  };

  return (
    <div className={styles.container}>
      <h1>Statistiques</h1>

      <section className={styles.chartSection}>
        <h2>Articles ajoutés par jour</h2>
        <Line data={dailyData} />
      </section>

      <section className={styles.chartSection}>
        <h2>Articles par catégorie</h2>
        <Bar data={categoryData} />
      </section>

      <section className={styles.chartSection}>
        <h2>Articles par flux RSS</h2>
        <Pie data={fluxData} />
      </section>
    </div>
  );
};

export default Stats;
