import axios from "axios";

const BASE_URL =
  import.meta.env.MODE === "development"
    ? import.meta.env.VITE_BASE_URL
    : "/api";

const privateApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // send cookies with requests
});

// Interceptor Setup
export const setupInterceptors = (store) => {
  privateApi.interceptors.request.use(
    (config) => {
      const token = store.accessToken;
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    },
    (error) => Promise.reject(error)
  );

  privateApi.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // If token expired → refresh once
      if (
        error.response?.status === 401 ||
        (error.response?.status === 401 && !originalRequest._retry)
      ) {
        originalRequest._retry = true;
        try {
          const res = await privateApi.post(
            "/auth/refreshToken",
            {},
            { withCredentials: true }
          );
          store.setAccessToken(res.data.accessToken);
          originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;
          return privateApi(originalRequest);
        } catch (error) {
          console.log("Token refresh failed:", error);
          store.logout();
        }
      }
      return Promise.reject(error);
    }
  );
};

export default privateApi;
