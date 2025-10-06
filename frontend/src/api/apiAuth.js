import axios from "axios";
import apiPublic from "./apiPublic";

const BASE_URL =
  import.meta.env.MODE === "development"
    ? import.meta.env.VITE_BASE_URL
    : "/api";

const apiAuth = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // send cookies with requests
});

// Add a request interceptor
export const authInterceptors = (store) => {
  apiAuth.interceptors.request.use(
    (config) => {
      const token = store?.accessToken;
      if (token && !config._retry)
        config.headers.Authorization = `Bearer ${token}`;
      return config;
    },
    (error) => Promise.reject(error)
  );
};

export const refreshInterceptors = (store) => {
  apiAuth.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      //if token expired, try to refresh once
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const res = await apiPublic.post(
            "/auth/refreshToken",
            {},
            { withCredentials: true }
          );
          const { accessToken, user } = res.data;
          store.setAccessToken(accessToken);
          store.setUser(user);
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return apiAuth(originalRequest);
        } catch (error) {
          console.log("Token refresh failed:", error);
          store.logout();
          return Promise.reject(error);
        }
      }
      return Promise.reject(error);
    }
  );
};

export default apiAuth;
