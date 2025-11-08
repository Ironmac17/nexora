import { useEffect } from "react";
import { useAuth } from "./context/AuthContext";
import { useSocket } from "./context/SocketContext";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import AppRouter from "./router";
import { AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";

export default function App() {
  const { user } = useAuth();
  const { socket } = useSocket();
  const location = useLocation(); // track current route

  useEffect(() => {
    if (socket) console.log("🔌 Socket connected:", socket.id);
  }, [socket]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-textMain">
      {user && <Navbar />}

      <main className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <AppRouter key={location.pathname} />
        </AnimatePresence>
      </main>

      {!user && <Footer />}
    </div>
  );
}
