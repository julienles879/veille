// frontend/src/pages/Users/Login.js
import React, { useState } from 'react';
import axios from '../../api';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Auth.module.css';

const Login = () => {
    const [form, setForm] = useState({ username: '', password: '' });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/users/login/', form);
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("isAuthenticated", "true");
            setMessage(response.data.success);
            navigate('/');
        } catch (err) {
            setMessage(err.response?.data?.error || 'Erreur serveur.');
        }
    };

    return (
        <div className={styles.loginContainer}>
            <h2 className={styles.title}>Connexion</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
                <input
                    className={styles.input}
                    name="username"
                    placeholder="Nom d'utilisateur"
                    value={form.username}
                    onChange={handleChange}
                    required
                />
                <input
                    className={styles.input}
                    name="password"
                    type="password"
                    placeholder="Mot de passe"
                    value={form.password}
                    onChange={handleChange}
                    required
                />
                <button type="submit" className={styles.button}>Se connecter</button>
            </form>

            {message && <p className={styles.message}>{message}</p>}
            <p className={styles.link}>
                Pas encore de compte ? <Link to="/register">Inscris-toi ici</Link>
            </p>
        </div>
    );
};

export default Login;
