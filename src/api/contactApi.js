// src/api/contactsApi.js
import axiosClient from "./axiosClient";

// GET /api/contacts
export const getContactsApi = () => axiosClient.get("/contacts");

// POST /api/contacts
export const createContactApi = (payload) =>
    axiosClient.post("/contacts", payload);

// PUT /api/contacts/:id
export const updateContactApi = (id, payload) =>
    axiosClient.put(`/contacts/${id}`, payload);

// DELETE /api/contacts/:id
export const deleteContactApi = (id) =>
    axiosClient.delete(`/contacts/${id}`);
