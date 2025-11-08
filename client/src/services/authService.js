// src/services/authService.js
import api from "./api";

// Request OTP for registration
export const requestOtp = async (email) => {
  const { data } = await api.post("/auth/request-otp", { email });
  return data;
};

// Verify OTP and register user
export const verifyOtp = async (payload) => {
  const { data } = await api.post("/auth/verify-otp", payload);
  return data;
};

// Login user
export const loginUser = async (email, password) => {
  const { data } = await api.post("/auth/login", { email, password });
  return data;
};

// Forgot password
export const forgotPassword = async (email) => {
  const { data } = await api.post("/auth/forgot-password", { email });
  return data;
};

// Reset password
export const resetPassword = async (email, otp, newPassword) => {
  const { data } = await api.post("/auth/reset-password", { email, otp, newPassword });
  return data;
};

// Resend OTP
export const resendOtp = async (email, type = "verify") => {
  const { data } = await api.post("/auth/resend-otp", { email, type });
  return data;
};

// Get user info (protected)
export const getUserInfo = async (token) => {
  const { data } = await api.get("/auth/getUser", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data.user;
};
