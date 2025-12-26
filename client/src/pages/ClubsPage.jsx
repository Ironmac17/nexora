import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import {
  getAllClubs,
  joinClub,
  leaveClub,
  createClub,
  deleteClub,
} from "../services/clubService";
import { Loader2, Users, LogIn, LogOut, Plus, Trash2 } from "lucide-react";

export default function ClubsPage() {
  const { user, token } = useAuth();
  const { areaId } = useParams();

  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newClub, setNewClub] = useState({
    name: "",
    description: "",
    category: "General",
    logoUrl: "",
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [clubToDelete, setClubToDelete] = useState(null);

  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [clubToLeave, setClubToLeave] = useState(null);

  /* ---------- FETCH ---------- */
  const fetchClubs = async () => {
    try {
      setLoading(true);
      const data = await getAllClubs(areaId);
      setClubs(data);
    } catch (err) {
      console.error("Error fetching clubs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClubs();
  }, [areaId]);

  /* ---------- ACTIONS ---------- */
  const handleJoin = async (id) => {
    await joinClub(token, id);
    fetchClubs();
  };

  const confirmLeaveClub = async () => {
    if (!clubToLeave) return;
    await leaveClub(token, clubToLeave);
    setShowLeaveModal(false);
    setClubToLeave(null);
    fetchClubs();
  };

  const confirmDeleteClub = async () => {
    if (!clubToDelete) return;
    await deleteClub(token, clubToDelete);
    setShowDeleteModal(false);
    setClubToDelete(null);
    fetchClubs();
  };

  const handleCreateClub = async (e) => {
    e.preventDefault();
    if (!newClub.name.trim() || !newClub.description.trim()) return;

    try {
      setCreating(true);
      await createClub(token, { ...newClub, areaId });
      setShowCreateModal(false);
      setNewClub({
        name: "",
        description: "",
        category: "General",
        logoUrl: "",
      });
      fetchClubs();
    } catch (err) {
      console.error("Error creating club:", err);
    } finally {
      setCreating(false);
    }
  };

  /* ---------- RENDER ---------- */
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin w-10 h-10 text-purple-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 text-white p-8 pt-24">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            🎯 Explore Clubs
          </h1>
          <p className="text-gray-400 mt-2">
            Discover communities that match your interests
          </p>

          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary mt-6 inline-flex items-center gap-2"
          >
            <Plus size={18} /> Create New Club
          </button>
        </motion.div>

        {/* CLUBS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {clubs.map((club) => {
            const isMember = club.members.some(
              (m) => m._id === user?.id || m._id === user?._id
            );
            const isAdmin =
              club.admin?._id === user?.id ||
              club.admin?._id === user?._id;

            return (
              <div key={club._id} className="glass p-6 rounded-xl flex flex-col justify-between">
                <div>
                  <div className="flex justify-between mb-3">
                    <h2 className="text-xl font-semibold">{club.name}</h2>
                    <span className="flex items-center gap-1 text-gray-400">
                      <Users size={14} /> {club.members.length}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300">{club.description}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    Admin: {club.admin?.fullName || "N/A"}
                  </p>
                </div>

                <div className="flex justify-between items-center mt-6">
                  <Link
                    to={`/area/${areaId}/clubs/${club._id}`}
                    className="text-sm text-purple-400"
                  >
                    View →
                  </Link>

                  <div className="flex gap-2">
                    {isAdmin && (
                      <button
                        onClick={() => {
                          setClubToDelete(club._id);
                          setShowDeleteModal(true);
                        }}
                        className="bg-red-600 px-3 py-1.5 rounded-lg text-sm"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}

                    {isMember ? (
                      <button
                        onClick={() => {
                          setClubToLeave(club._id);
                          setShowLeaveModal(true);
                        }}
                        className="bg-red-500 px-3 py-1.5 rounded-lg text-sm"
                      >
                        <LogOut size={14} />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleJoin(club._id)}
                        className="btn-primary px-3 py-1.5 text-sm"
                      >
                        <LogIn size={14} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MODALS */}
      <AnimatePresence>
        {showLeaveModal && (
          <ConfirmModal
            title="Leave Club"
            message="Are you sure you want to leave this club?"
            onCancel={() => setShowLeaveModal(false)}
            onConfirm={confirmLeaveClub}
            color="orange"
          />
        )}

        {showDeleteModal && (
          <ConfirmModal
            title="Delete Club"
            message="This action cannot be undone."
            onCancel={() => setShowDeleteModal(false)}
            onConfirm={confirmDeleteClub}
            color="red"
          />
        )}
      </AnimatePresence>

      {/* CREATE MODAL */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div className="fixed inset-0 bg-black/60 flex items-center justify-center">
            <motion.form
              onSubmit={handleCreateClub}
              className="glass p-6 rounded-xl w-full max-w-md"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
            >
              <h3 className="text-lg mb-4">Create Club</h3>

              <input
                placeholder="Club name"
                value={newClub.name}
                onChange={(e) =>
                  setNewClub({ ...newClub, name: e.target.value })
                }
                className="input-field mb-3"
              />

              <textarea
                placeholder="Description"
                value={newClub.description}
                onChange={(e) =>
                  setNewClub({ ...newClub, description: e.target.value })
                }
                className="input-field mb-4"
              />

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="btn-primary"
                >
                  {creating ? "Creating..." : "Create"}
                </button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------- CONFIRM MODAL ---------- */
function ConfirmModal({ title, message, onCancel, onConfirm, color }) {
  return (
    <motion.div className="fixed inset-0 bg-black/60 flex items-center justify-center">
      <motion.div className="glass p-6 rounded-xl max-w-sm w-full">
        <h3 className={`text-${color}-300 mb-3`}>{title}</h3>
        <p className="text-gray-300 mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button onClick={onCancel} className="btn-secondary">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`bg-${color}-600 px-4 py-2 rounded-md text-white`}
          >
            Confirm
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
