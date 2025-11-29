// src/api/adminApi.js
import axiosClient from "./axiosClient";

export const getAdminDashboardStatsApi = () =>
    axiosClient.get("/admin/dashboard");

export const getRiskZonesApi = () =>
    axiosClient.get("/admin/risk-zones");

export const createRiskZoneApi = (payload) =>
    axiosClient.post("/admin/risk-zones", payload);

// NEW:
export const getAdminActivityLogApi = () =>
    axiosClient.get("/admin/activity-log")