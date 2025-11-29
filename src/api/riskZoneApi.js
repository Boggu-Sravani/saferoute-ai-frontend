// src/api/riskZoneApi.js
import axiosClient from "./axiosClient";

export const getPublicRiskZonesApi = () =>
    axiosClient.get("/risk-zones");
