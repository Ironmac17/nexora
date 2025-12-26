import api from "./api";

export const getAllClubs = async (areaId = null) => {
  const url = areaId ? `/club?areaId=${areaId}` : "/club";
  const { data } = await api.get(url);
  return data;
};

export const getClubById = async (id) => {
  const { data } = await api.get(`/club/${id}`);
  return data;
};

export const createClub = async (token, clubData) => {
  const { data } = await api.post("/club", clubData, {
    headers: { Authorization: `Bearer ${token}` },
  });
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

export const deleteClub = async (token, id) => {
  const { data } = await api.delete(`/club/${id}`, {
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

export const deleteClubPost = async (token, clubId, postId) => {
  const { data } = await api.delete(`/club/${clubId}/post/${postId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const createEvent = async (token, clubId, title, description) => {
  const { data } = await api.post(`/club/${clubId}/event`, { title, description }, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};
