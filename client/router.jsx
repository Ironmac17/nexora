import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./src/context/AuthContext";

import LandingPage from "./src/pages/LandingPage";
import LoginPage from "./src/pages/LoginPage";
import RegisterPage from "./src/pages/RegisterPage";
import ForgotPassword from "./src/pages/ForgotPassword";
import HomePage from "./src/pages/HomePage";
import NotesPage from "./src/pages/NotesPage";
import ClubPage from "./src/pages/ClubPage";
import EventPage from "./src/pages/EventPage";
import ChatPage from "./src/pages/ChatPage";
import ClubsPage from "./src/pages/ClubsPage";
import AreaDashboard from "./src/pages/AreaDashboard";


export default function AppRouter() {
  const { user } = useAuth();
  const location = useLocation();

  const Protected = ({ children }) =>
    user ? children : <Navigate to="/login" replace />;
  const Public = ({ children }) =>
    !user ? children : <Navigate to="/home" replace />;

  return (
    <Routes location={location} key={location.pathname}>
      <Route
        path="/"
        element={
          <Public>
            <LandingPage />
          </Public>
        }
      />
      <Route
        path="/login"
        element={
          <Public>
            <LoginPage />
          </Public>
        }
      />
      <Route
        path="/register"
        element={
          <Public>
            <RegisterPage />
          </Public>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <Public>
            <ForgotPassword />
          </Public>
        }
      />
      <Route
        path="/home"
        element={
          <Protected>
            <HomePage />
          </Protected>
        }
      />
      <Route
        path="/notes"
        element={
          <Protected>
            <NotesPage />
          </Protected>
        }
      />
      <Route
        path="/chat"
        element={
          <Protected>
            <ChatPage />
          </Protected>
        }
      />
      <Route
        path="/clubs/:id"
        element={
          <Protected>
            <ClubPage />
          </Protected>
        }
      />
      <Route
        path="/clubs"
        element={
          <Protected>
            <ClubsPage />
          </Protected>
        }
      />
      <Route
        path="/events/:id"
        element={
          <Protected>
            <EventPage />
          </Protected>
        }
      />
      <Route path="/area/:id" element={<AreaDashboard />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
