// src/api/axiosClient.js
import axios from "axios";

// 👇 Backend base URL INCLUDING "/api"
const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

console.log("API Base URL:", API_BASE_URL);

const axiosClient = axios.create({
    baseURL: API_BASE_URL,
});

// 🔐 Attach token from localStorage on every request
axiosClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("sr_access");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ♻ Auto-refresh expired token
axiosClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const refreshToken = localStorage.getItem("sr_refresh");
            if (!refreshToken) return Promise.reject(error);

            try {
                const res = await axios.post(
                    `${API_BASE_URL}/auth/refresh`,
                    { refreshToken }
                );

                const newAccessToken = res.data.accessToken;

                localStorage.setItem("sr_access", newAccessToken);

                axiosClient.defaults.headers.common["Authorization"] =
                    `Bearer ${newAccessToken}`;

                originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

                return axiosClient(originalRequest);
            } catch (err) {
                console.error("Refresh failed:", err);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosClient;
