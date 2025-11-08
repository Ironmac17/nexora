import api from "./api";

// Create a new note
export const createNote = async (token, noteData) => {
  const { data } = await api.post("/note", noteData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};

// Fetch notes for a specific room (e.g., "canteen", "library")
export const getNotesByRoom = async (token, room) => {
  const { data } = await api.get(`/note/room/${room}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};

// Fetch notes created by a specific user
export const getNotesByUser = async (token, userId) => {
  if (!userId) throw new Error("User ID is required");
  const { data } = await api.get(`/note/user/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};

// Delete a note by ID
export const deleteNote = async (token, noteId) => {
  const { data } = await api.delete(`/note/${noteId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};
