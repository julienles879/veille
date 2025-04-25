import axios from 'axios';

const username = process.env.REACT_APP_BASIC_USER;
const password = process.env.REACT_APP_BASIC_PASS;

const authHeader = username && password
  ? `Basic ${btoa(`${username}:${password}`)}`
  : null;

const api = axios.create({
  baseURL: window.location.origin,
  withCredentials: true,
  headers: authHeader ? { Authorization: authHeader } : {},
});

export default api;
