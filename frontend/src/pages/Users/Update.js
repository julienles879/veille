// frontend/src/pages/Users/Update.js
import React, { useState } from 'react';
import axios from '../../api';

const Update = () => {
    const [form, setForm] = useState({ email: '', password: '' });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/users/profile/', form);
            setMessage(response.data.success);
        } catch (err) {
            setMessage(err.response?.data?.error || 'Erreur serveur.');
        }
    };

    return (
        <div>
            <h2>Modifier mon profil</h2>
            <form onSubmit={handleSubmit}>
                <input name="email" type="email" placeholder="Nouveau email" value={form.email} onChange={handleChange} />
                <input name="password" type="password" placeholder="Nouveau mot de passe" value={form.password} onChange={handleChange} />
                <button type="submit">Mettre à jour</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default Update;
