import axios from 'axios';

const api = axios.create({
    baseURL: window.location.origin,  // dynamique
});

export default api;
