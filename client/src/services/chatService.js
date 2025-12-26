import api from "./api";

// ✅ Get all messages from a room
export const getMessagesByRoom = async (token, room) => {
  const { data } = await api.get(`/chat/room/${room}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

// ✅ Send a message to a room (fixed endpoint)
export const sendRoomMessage = async (token, room, text) => {
  const { data } = await api.post(
    `/chat/room/${room}`, // ✅ changed from /send/:room to /room/:room
    { text },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return data;
};

// ✅ Get private chat messages between two users
export const getPrivateMessages = async (token, userId) => {
  const { data } = await api.get(`/chat/private/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

// ✅ Delete a message
export const deleteMessage = async (token, messageId) => {
  const { data } = await api.delete(`/chat/${messageId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};
