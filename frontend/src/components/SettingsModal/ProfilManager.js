// frontend/src/components/SettingsModal/ProfilManager.js
import React, { useState, useEffect } from 'react';
import styles from './ProfilManager.module.css';
import api from '../../api';

const ProfilManager = () => {
    const [userData, setUserData] = useState({ username: '', email: '' });
    const [form, setForm] = useState({ email: '', password: '' });
    const [editMode, setEditMode] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        api.get('/users/profile/')
            .then(response => setUserData(response.data))
            .catch(() => {});
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!form.email && !form.password) {
            setMessage("Veuillez remplir au moins un champ.");
            return;
        }

        try {
            await api.post('/users/profile/update/', form);
            const updated = await api.get('/users/profile/');
            setUserData(updated.data);
            setMessage('Profil mis à jour.');
            setForm({ email: '', password: '' });
            setEditMode(false);
        } catch (error) {
            setMessage(error.response?.data?.error || 'Erreur serveur.');
        }
    };

    return (
        <div className={styles.profileContainer}>
            <h3>👤 Mon Profil</h3>

            {!editMode ? (
                <>
                    <div className={styles.profileInfo}>
                        <p><strong>Nom d'utilisateur :</strong> {userData.username}</p>
                        <p><strong>Email :</strong> {userData.email}</p>
                    </div>

                    <button onClick={() => setEditMode(true)} className={styles.editButton}>
                        ✏️ Modifier mon profil
                    </button>
                </>
            ) : (
                <form onSubmit={handleUpdate} className={styles.profileForm}>
                    <input
                        type="email"
                        name="email"
                        placeholder="Nouveau email"
                        value={form.email}
                        onChange={handleChange}
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Nouveau mot de passe"
                        value={form.password}
                        onChange={handleChange}
                    />
                    <div className={styles.buttonGroup}>
                        <button type="submit">💾 Enregistrer</button>
                        <button type="button" onClick={() => setEditMode(false)}>❌ Annuler</button>
                    </div>
                </form>
            )}

            {message && <p className={styles.message}>{message}</p>}
        </div>
    );
};

export default ProfilManager;
