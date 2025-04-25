import axios from 'axios';

const username = process.env.REACT_APP_BASIC_USER;
const password = process.env.REACT_APP_BASIC_PASS;

const api = axios.create({
  baseURL: window.location.origin,
  withCredentials: true,
  headers: {
    Authorization: `Basic ${btoa(`${username}:${password}`)}`,
  },
});

export default api;
