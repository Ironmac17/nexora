import { createContext, useContext, useEffect, useState } from "react";
import { getUserInfo } from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("nexoraToken"));

  useEffect(() => {
    if (token && !user) {
      (async () => {
        try {
          const data = await getUserInfo(token);
          setUser(data);
        } catch (err) {
          console.error("Auth load failed", err);
        }
      })();
    }
  }, [token]);

  const login = (token, userData) => {
    localStorage.setItem("nexoraToken", token);
    setToken(token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("nexoraToken");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
