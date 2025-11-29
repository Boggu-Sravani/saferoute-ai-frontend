// src/api/axiosClient.js
import axios from "axios";

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const axiosClient = axios.create({
    baseURL: API_BASE_URL,
});

// 🔐 Attach token from localStorage on every request
axiosClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("sr_access"); // 👈 same as AuthContext
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ♻ Auto-refresh expired access token
axiosClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const refreshToken = localStorage.getItem("sr_refresh");
            if (!refreshToken) {
                return Promise.reject(error);
            }

            try {
                const res = await axios.post(
                    `${API_BASE_URL}/auth/refresh`,
                    { refreshToken }
                );

                const newAccessToken = res.data.accessToken;

                // save new accessToken
                localStorage.setItem("sr_access", newAccessToken);

                // update axios header
                axiosClient.defaults.headers.common["Authorization"] =
                    `Bearer ${newAccessToken}`;

                // retry original request
                originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

                return axiosClient(originalRequest);
            } catch (err) {
                console.error("Refresh failed:", err);
            }
        }

        console.error("API error:", error?.response || error);
        return Promise.reject(error);
    }
);

export default axiosClient;
