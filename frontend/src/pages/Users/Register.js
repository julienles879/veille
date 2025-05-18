import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../api';
import styles from './Auth.module.css';

const Register = () => {
    const [form, setForm] = useState({ username: '', email: '', password: '' });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/users/register/', form);
            setMessage(response.data.success);
        } catch (err) {
            setMessage(err.response?.data?.error || 'Erreur serveur.');
        }
    };

    return (
        <div className={styles.registerContainer}>
            <h2 className={styles.title}>Inscription</h2>
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
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
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
                <button type="submit" className={styles.button}>S'inscrire</button>
            </form>

            {message && <p className={styles.message}>{message}</p>}

            <p className={styles.link}>
                Déjà un compte ? <Link to="/login">Connecte-toi ici</Link>
            </p>
        </div>
    );
};

export default Register;
