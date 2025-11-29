// src/api/authApi.js
import axiosClient from "./axiosClient";

export const registerApi = (payload) =>
    axiosClient.post("/api/auth/register", payload);

export const loginApi = (payload) =>
    axiosClient.post("/api/auth/login", payload);

export const getCurrentUserApi = () =>
    axiosClient.get("/api/auth/me");

export const logoutApi = () =>
    axiosClient.post("/api/auth/logout");
