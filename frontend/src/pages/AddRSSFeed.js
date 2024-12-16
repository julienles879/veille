import React, { useState } from "react";
import api from "../api";

const AddRSSFeed = () => {
  const [formData, setFormData] = useState({ title: "", url: "", description: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    api
      .post("/feeds/", formData)
      .then(() => alert("Flux RSS ajouté avec succès"))
      .catch((error) => console.error("Erreur lors de l'ajout du flux :", error));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="title"
        placeholder="Titre"
        value={formData.title}
        onChange={handleChange}
        required
      />
      <input
        type="url"
        name="url"
        placeholder="URL"
        value={formData.url}
        onChange={handleChange}
        required
      />
      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
      />
      <button type="submit">Ajouter le flux</button>
    </form>
  );
};

export default AddRSSFeed;
