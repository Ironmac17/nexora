import { createContext, useContext, useState } from "react";
import { loginUser, getUserInfo, verifyOtp, requestOtp } from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("nexoraToken") || null);

const login = (user, token) => {
  setUser(user);
  setToken(token);
  localStorage.setItem("nexora_user", JSON.stringify(user));
  localStorage.setItem("nexora_token", token);
};


  const loadUser = async () => {
    if (!token) return;
    const userData = await getUserInfo(token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("nexoraToken");
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, setUser, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
