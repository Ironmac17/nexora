import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getAllClubs, joinClub, leaveClub } from "../services/clubService";
import { Loader2, Users, LogIn, LogOut } from "lucide-react";

export default function ClubsPage() {
  const { user, token } = useAuth();
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchClubs = async () => {
    try {
      const data = await getAllClubs();
      setClubs(data);
    } catch (err) {
      console.error("Error fetching clubs:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async (id) => {
    try {
      await joinClub(token, id);
      fetchClubs();
    } catch (err) {
      console.error(err);
    }
  };

  const handleLeave = async (id) => {
    try {
      await leaveClub(token, id);
      fetchClubs();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchClubs();
  }, []);

  return (
    <motion.div
      className="min-h-screen bg-background text-textMain p-8 pt-24"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h1 className="text-3xl font-bold text-accent mb-6">🎯 Explore Clubs</h1>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin text-accent" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {clubs.map((club) => {
            const isMember = club.members.some((m) => m._id === user?.id);
            return (
              <motion.div
                key={club._id}
                whileHover={{ scale: 1.02 }}
                className="bg-surface/40 border border-surface/70 p-6 rounded-xl shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-xl font-semibold text-accent">{club.name}</h2>
                    <Users className="text-textSub h-5 w-5" />
                  </div>
                  <p className="text-textSub text-sm mb-3">{club.description}</p>
                  <p className="text-xs text-textSub mb-4">
                    Admin: {club.admin?.fullName || "N/A"}
                  </p>
                </div>

                <div className="flex justify-between items-center">
                  <Link
                    to={`/clubs/${club._id}`}
                    className="text-sm text-accent hover:underline"
                  >
                    View Details →
                  </Link>

                  {isMember ? (
                    <button
                      onClick={() => handleLeave(club._id)}
                      className="flex items-center gap-1 text-sm bg-red-500/80 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg"
                    >
                      <LogOut className="h-4 w-4" /> Leave
                    </button>
                  ) : (
                    <button
                      onClick={() => handleJoin(club._id)}
                      className="flex items-center gap-1 text-sm bg-accent hover:opacity-90 text-background px-3 py-1.5 rounded-lg"
                    >
                      <LogIn className="h-4 w-4" /> Join
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
