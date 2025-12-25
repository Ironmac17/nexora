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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 text-white p-8 pt-24">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text mb-2">
            🎯 Explore Clubs
          </h1>
          <p className="text-gray-400">Discover communities that match your interests</p>
        </motion.div>

        {loading ? (
          <motion.div
            className="flex justify-center items-center h-64"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Loader2 className="animate-spin w-10 h-10 text-purple-400" />
          </motion.div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {clubs.map((club, index) => {
              const isMember = club.members.some((m) => m._id === user?.id);
              return (
                <motion.div
                  key={club._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="glass p-6 rounded-2xl border border-white/10 shadow-lg flex flex-col justify-between hover:shadow-purple-500/10 transition-all duration-300 group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-semibold text-white group-hover:text-purple-300 transition-colors">
                        {club.name}
                      </h2>
                      <div className="flex items-center space-x-1 text-gray-400">
                        <Users className="h-4 w-4" />
                        <span className="text-sm">{club.members.length}</span>
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm mb-4 leading-relaxed">{club.description}</p>
                    <p className="text-xs text-gray-500 mb-4">
                      Admin: {club.admin?.fullName || "N/A"}
                    </p>
                  </div>

                  <div className="flex justify-between items-center">
                    <Link
                      to={`/clubs/${club._id}`}
                      className="text-sm text-purple-400 hover:text-purple-300 transition-colors font-medium"
                    >
                      View Details →
                    </Link>

                    {isMember ? (
                      <motion.button
                        onClick={() => handleLeave(club._id)}
                        className="flex items-center gap-2 text-sm bg-red-500/80 hover:bg-red-600 text-white px-4 py-2 rounded-xl transition-all duration-200"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <LogOut className="h-4 w-4" /> Leave
                      </motion.button>
                    ) : (
                      <motion.button
                        onClick={() => handleJoin(club._id)}
                        className="btn-primary flex items-center gap-2 text-sm px-4 py-2"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <LogIn className="h-4 w-4" /> Join
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
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
