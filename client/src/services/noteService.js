// src/services/noteService.js
import api from "./api";

// Get all notes of logged-in user
export const getUserNotes = async () => {
  const { data } = await api.get("/note/all");
  return data;
};

// Create new note
export const createNote = async (payload) => {
  const { data } = await api.post("/note/create", payload);
  return data;
};

// Edit a note
export const updateNote = async (id, payload) => {
  const { data } = await api.put(`/note/update/${id}`, payload);
  return data;
};

// Delete a note
export const deleteNote = async (id) => {
  const { data } = await api.delete(`/note/delete/${id}`);
  return data;
};
