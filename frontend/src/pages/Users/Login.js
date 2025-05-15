// frontend/src/pages/Users/Login.js
import React, { useState } from 'react';
import axios from '../../api';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
    const [form, setForm] = useState({ username: '', password: '' });
    const [message, setMessage] = useState('');
    const navigate = useNavigate(); // pour rediriger après connexion

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/users/login/', form);
            setMessage(response.data.success);

            // ✅ Indique que l'utilisateur est connecté
            localStorage.setItem("isAuthenticated", "true");

            // ✅ Redirige vers la page d'accueil ou autre
            navigate('/');
        } catch (err) {
            setMessage(err.response?.data?.error || 'Erreur serveur.');
        }
    };

    return (
        <div>
            <h2>Connexion</h2>
            <form onSubmit={handleSubmit}>
                <input
                    name="username"
                    placeholder="Nom d'utilisateur"
                    value={form.username}
                    onChange={handleChange}
                    required
                />
                <input
                    name="password"
                    type="password"
                    placeholder="Mot de passe"
                    value={form.password}
                    onChange={handleChange}
                    required
                />
                <button type="submit">Se connecter</button>
            </form>

            {message && <p>{message}</p>}

            {/* ✅ Lien vers la page d'inscription */}
            <p>Pas encore de compte ? <Link to="/register">Inscris-toi ici</Link></p>
        </div>
    );
};

export default Login;
