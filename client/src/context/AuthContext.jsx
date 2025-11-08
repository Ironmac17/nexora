import { createContext, useContext, useState, useEffect } from "react";
import { loginUser, getUserInfo } from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("nexora_user")) || null
  );
  const [token, setToken] = useState(localStorage.getItem("nexora_token") || null);

  // ✅ login(user, token)
  const login = (user, token) => {
    setUser(user);
    setToken(token);
    localStorage.setItem("nexora_user", JSON.stringify(user));
    localStorage.setItem("nexora_token", token);
  };

  const logout = () => {
    localStorage.removeItem("nexora_user");
    localStorage.removeItem("nexora_token");
    setUser(null);
    setToken(null);
  };

  // ✅ Auto-load user on refresh
  useEffect(() => {
    const fetchUser = async () => {
      if (token && !user) {
        try {
          const data = await getUserInfo(token);
          setUser(data);
        } catch (err) {
          console.error("AuthContext: Failed to fetch user", err);
          logout();
        }
      }
    };
    fetchUser();
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, setUser, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
