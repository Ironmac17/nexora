import api from "./api";

export const getAllClubs = async () => {
  const { data } = await api.get("/club");
  return data;
};

export const getClubById = async (id) => {
  const { data } = await api.get(`/club/${id}`);
  return data;
};

export const joinClub = async (token, id) => {
  const { data } = await api.post(`/club/join/${id}`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const leaveClub = async (token, id) => {
  const { data } = await api.post(`/club/leave/${id}`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const createClubPost = async (token, id, title, content) => {
  const { data } = await api.post(`/club/${id}/post`, { title, content }, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};
