// src/api/feedbackApi.js
import axiosClient from "./axiosClient";

// get latest feedback (optionally you can pass ?limit=5 from the caller)
export const getNearbyFeedbackApi = (params = {}) =>
    axiosClient.get("/feedback/nearby", { params });

// later we can add: submitFeedbackApi, etc.

export const submitFeedbackApi = (payload) =>
    axiosClient.post("/feedback", payload);