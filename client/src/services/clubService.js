// src/services/clubService.js
import api from "./api";

// Get all clubs on campus
export const getAllClubs = async () => {
  const { data } = await api.get("/club/all");
  return data;
};

// Get a single club with details
export const getClubById = async (clubId) => {
  const { data } = await api.get(`/club/${clubId}`);
  return data;
};

// Join a club
export const joinClub = async (clubId) => {
  const { data } = await api.post(`/club/join/${clubId}`);
  return data;
};

// Leave a club
export const leaveClub = async (clubId) => {
  const { data } = await api.post(`/club/leave/${clubId}`);
  return data;
};

// Create a new club (for admins)
export const createClub = async (payload) => {
  const { data } = await api.post("/club/create", payload);
  return data;
};

// Post a club announcement or Q&A
export const postClubMessage = async (clubId, payload) => {
  const { data } = await api.post(`/club/${clubId}/message`, payload);
  return data;
};
