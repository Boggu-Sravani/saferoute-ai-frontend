// src/api/routesApi.js
import axiosClient from "./axiosClient";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

// Get safe routes between source & destination
export const getSafeRoutesApi = async (payload) => {
    console.log("📡 Sending ROUTE request to backend with:", payload);

    const res = await axiosClient.post("/routes/safe", payload);

    console.log("🛰 REAL RESPONSE FROM BACKEND:", res.data);
    return res;
};
