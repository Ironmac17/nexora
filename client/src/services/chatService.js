// src/services/chatService.js
import api from "./api";

// Get chat history between two users
export const getMessages = async (receiverId) => {
  const { data } = await api.get(`/chat/messages/${receiverId}`);
  return data;
};

// Send a message (also emits via socket on frontend)
export const sendMessage = async (payload) => {
  const { data } = await api.post("/chat/send", payload);
  return data;
};

// Fetch all recent conversations
export const getRecentChats = async () => {
  const { data } = await api.get("/chat/recent");
  return data;
};
