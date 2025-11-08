import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPassword from "./pages/ForgotPassword";
import HomePage from "./pages/HomePage";
import NotesPage from "./pages/NotesPage";
import ClubPage from "./pages/ClubPage";
import EventPage from "./pages/EventPage";

export default function AppRouter() {
  const { user } = useAuth();
  const location = useLocation();

  const Protected = ({ children }) => (user ? children : <Navigate to="/login" replace />);
  const Public = ({ children }) => (!user ? children : <Navigate to="/home" replace />);

  return (
    <Routes location={location} key={location.pathname}>
      <Route path="/" element={<Public><LandingPage /></Public>} />
      <Route path="/login" element={<Public><LoginPage /></Public>} />
      <Route path="/register" element={<Public><RegisterPage /></Public>} />
      <Route path="/forgot-password" element={<Public><ForgotPassword /></Public>} />
      <Route path="/home" element={<Protected><HomePage /></Protected>} />
      <Route path="/notes" element={<Protected><NotesPage /></Protected>} />
      <Route path="/clubs/:id" element={<Protected><ClubPage /></Protected>} />
      <Route path="/events/:id" element={<Protected><EventPage /></Protected>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
