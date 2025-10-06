import axios from "axios";

const BASE_URL =
  import.meta.env.MODE === "development"
    ? import.meta.env.VITE_BASE_URL
    : "/api";

const apiPublic = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // send cookies with requests
});
export default apiPublic;
