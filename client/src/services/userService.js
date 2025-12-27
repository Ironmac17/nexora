// src/services/userService.js
import api from "./api";

export const updateProfile = async (token, profileData) => {
    try {
        const response = await api.put("/user/profile", profileData, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const getUserProfile = async (token, userId) => {
    try {
        const response = await api.get(`/user/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data.user;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};