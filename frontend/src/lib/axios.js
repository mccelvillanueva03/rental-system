import axios from 'axios';

const BASE_URL = import.meta.env.MODE === 'development' ? import.meta.env.VITE_BASE_URL : "/api";

const api = axios.create({
    baseURL: BASE_URL,
});
export default api;