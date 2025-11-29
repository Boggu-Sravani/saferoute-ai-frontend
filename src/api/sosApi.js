import axiosClient from "./axiosClient";

export const triggerSosApi = (payload) =>
    axiosClient.post("/sos", payload);
// payload: { lat, lng, locationName }

// admin: list SOS alerts
export const getSosAlertsApi = () => axiosClient.get("/sos");



export const updateSosStatusApi = (id, status) =>
    axiosClient.patch(`/sos/${id}/status`, { status });
