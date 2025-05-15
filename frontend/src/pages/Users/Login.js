// frontend/src/pages/Users/Login.js
import React, { useState } from 'react';
import axios from '../../api';

const Login = () => {
    const [form, setForm] = useState({ username: '', password: '' });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/users/login/', form);
            setMessage(response.data.success);
            // Tu peux aussi stocker une info "isAuthenticated" en state global (ex: context ou redux)
        } catch (err) {
            setMessage(err.response?.data?.error || 'Erreur serveur.');
        }
    };

    return (
        <div>
            <h2>Connexion</h2>
            <form onSubmit={handleSubmit}>
                <input name="username" placeholder="Username" value={form.username} onChange={handleChange} required />
                <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
                <button type="submit">Se connecter</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default Login;
