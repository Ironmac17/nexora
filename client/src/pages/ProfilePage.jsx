import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { User, Settings, Edit, Save, X, LogOut, ArrowLeft } from "lucide-react";
import AvatarCustomizer from "../components/avatar/AvatarCustomizer";
import { updateProfile } from "../services/userService";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const { user, token, refreshUser, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    bio: user?.bio || "",
  });

  const handleSave = async () => {
    try {
      await updateProfile(token, {
        fullName: formData.fullName,
        bio: formData.bio,
      });
      await refreshUser();
      setEditing(false);
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: <User size={18} /> },
    { id: "settings", label: "Settings", icon: <Settings size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 text-white pt-24 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Back to Dashboard Button */}
          <div className="flex justify-start mb-6">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 px-5 py-3 glass rounded-xl hover:bg-white/10 transition-all duration-300 text-gray-300 hover:text-white hover:scale-105 shadow-lg hover:shadow-purple-500/25"
            >
              <ArrowLeft size={18} />
              Back to Dashboard
            </button>
          </div>

          <h1 className="text-5xl font-bold text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text mb-3">
            My Profile
          </h1>
          <p className="text-gray-400 text-lg">
            Manage your account and preferences
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex justify-center mb-10">
          <div className="glass p-2 rounded-2xl flex gap-2 shadow-2xl">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg scale-105 glow-purple"
                    : "text-gray-300 hover:text-white hover:bg-white/10 hover:scale-105"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="glass p-10 rounded-3xl shadow-2xl border border-white/10"
        >
          {activeTab === "profile" && (
            <div className="space-y-10">
              {/* Avatar Section */}
              <div className="text-center">
                <div className="relative inline-block mb-6">
                  <div
                    className="w-40 h-40 rounded-full border-4 border-gradient-to-r from-purple-400 to-blue-400 flex items-center justify-center text-5xl font-bold relative shadow-2xl transform hover:scale-110 transition-all duration-500"
                    style={{ backgroundColor: user.avatar?.color || "#00AEEF" }}
                  >
                    {user.fullName?.charAt(0)?.toUpperCase() || "U"}

                    {/* Hairstyle overlay */}
                    {user.avatar?.hairstyle &&
                      user.avatar.hairstyle !== "none" && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-3xl">
                            {user.avatar.hairstyle === "short" && "💇‍♂️"}
                            {user.avatar.hairstyle === "long" && "👩‍🦰"}
                            {user.avatar.hairstyle === "curly" && "👩‍🦱"}
                            {user.avatar.hairstyle === "spiky" && "👨‍🦲"}
                            {user.avatar.hairstyle === "bun" && "👩‍🦳"}
                          </div>
                        </div>
                      )}
                  </div>

                  {/* Accessory overlay */}
                  {user.avatar?.accessory &&
                    user.avatar.accessory !== "none" && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-3xl animate-bounce">
                        {user.avatar.accessory === "cap" && "🧢"}
                        {user.avatar.accessory === "glasses" && "👓"}
                        {user.avatar.accessory === "headphones" && "🎧"}
                        {user.avatar.accessory === "hat" && "🎩"}
                        {user.avatar.accessory === "sunglasses" && "🕶️"}
                        {user.avatar.accessory === "beanie" && "🧢"}
                      </div>
                    )}

                  {/* Glow effect */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400/20 to-blue-400/20 blur-xl -z-10"></div>
                </div>
                <button
                  onClick={() => setShowAvatarModal(true)}
                  className="btn-primary px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-purple-500/50 transform hover:scale-105 transition-all duration-300"
                >
                  Customize Avatar
                </button>
              </div>

              {/* Profile Info */}
              <div className="space-y-8">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-bold text-transparent bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text">
                    Personal Information
                  </h3>
                  <button
                    onClick={() => setEditing(!editing)}
                    className={`flex items-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                      editing
                        ? "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 shadow-lg"
                        : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg"
                    }`}
                  >
                    {editing ? (
                      <>
                        <X size={18} />
                        Cancel
                      </>
                    ) : (
                      <>
                        <Edit size={18} />
                        Edit
                      </>
                    )}
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      Full Name
                    </label>
                    {editing ? (
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) =>
                          setFormData({ ...formData, fullName: e.target.value })
                        }
                        className="input-field w-full text-lg py-4 px-5 rounded-xl border-2 border-transparent focus:border-purple-400/50 shadow-lg"
                      />
                    ) : (
                      <p className="text-white text-lg py-4 px-5 bg-white/5 rounded-xl border border-white/10">
                        {user?.fullName}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      Email
                    </label>
                    {editing ? (
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="input-field w-full text-lg py-4 px-5 rounded-xl border-2 border-transparent focus:border-purple-400/50 shadow-lg"
                      />
                    ) : (
                      <p className="text-white text-lg py-4 px-5 bg-white/5 rounded-xl border border-white/10">
                        {user?.email}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Bio
                  </label>
                  {editing ? (
                    <textarea
                      rows={5}
                      value={formData.bio}
                      onChange={(e) =>
                        setFormData({ ...formData, bio: e.target.value })
                      }
                      className="input-field w-full resize-none text-lg py-4 px-5 rounded-xl border-2 border-transparent focus:border-purple-400/50 shadow-lg"
                      placeholder="Tell us about yourself..."
                    />
                  ) : (
                    <p className="text-white text-lg py-4 px-5 bg-white/5 rounded-xl border border-white/10 min-h-[120px] leading-relaxed">
                      {user?.bio || "No bio added yet."}
                    </p>
                  )}
                </div>

                {editing && (
                  <div className="flex justify-end pt-4">
                    <button
                      onClick={handleSave}
                      className="btn-primary px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-purple-500/50 transform hover:scale-105 transition-all duration-300"
                    >
                      <Save size={18} className="inline mr-3" />
                      Save Changes
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="space-y-10">
              <h3 className="text-2xl font-bold text-transparent bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text mb-8">
                Account Settings
              </h3>

              {/* Notification Settings */}
              <div className="space-y-6">
                <h4 className="text-xl font-semibold text-white mb-6">
                  Notifications
                </h4>
                <div className="space-y-4">
                  <label className="flex items-center gap-4 p-4 glass rounded-xl hover:bg-white/5 transition-all duration-300 cursor-pointer">
                    <input
                      type="checkbox"
                      className="rounded w-5 h-5 accent-purple-500"
                      defaultChecked
                    />
                    <span className="text-gray-300 text-lg">
                      Email notifications
                    </span>
                  </label>
                  <label className="flex items-center gap-4 p-4 glass rounded-xl hover:bg-white/5 transition-all duration-300 cursor-pointer">
                    <input
                      type="checkbox"
                      className="rounded w-5 h-5 accent-purple-500"
                      defaultChecked
                    />
                    <span className="text-gray-300 text-lg">
                      Push notifications
                    </span>
                  </label>
                  <label className="flex items-center gap-4 p-4 glass rounded-xl hover:bg-white/5 transition-all duration-300 cursor-pointer">
                    <input
                      type="checkbox"
                      className="rounded w-5 h-5 accent-purple-500"
                    />
                    <span className="text-gray-300 text-lg">
                      Club activity updates
                    </span>
                  </label>
                </div>
              </div>

              {/* Privacy Settings */}
              <div className="space-y-6">
                <h4 className="text-xl font-semibold text-white mb-6">
                  Privacy
                </h4>
                <div className="space-y-4">
                  <label className="flex items-center gap-4 p-4 glass rounded-xl hover:bg-white/5 transition-all duration-300 cursor-pointer">
                    <input
                      type="checkbox"
                      className="rounded w-5 h-5 accent-purple-500"
                      defaultChecked
                    />
                    <span className="text-gray-300 text-lg">
                      Show online status
                    </span>
                  </label>
                  <label className="flex items-center gap-4 p-4 glass rounded-xl hover:bg-white/5 transition-all duration-300 cursor-pointer">
                    <input
                      type="checkbox"
                      className="rounded w-5 h-5 accent-purple-500"
                    />
                    <span className="text-gray-300 text-lg">
                      Allow profile visibility
                    </span>
                  </label>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="border-t border-red-500/30 pt-8">
                <h4 className="text-xl font-semibold text-red-300 mb-6">
                  Danger Zone
                </h4>
                <div className="flex gap-6">
                  <button
                    onClick={handleLogout}
                    className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 px-6 py-4 rounded-xl text-white font-semibold transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-orange-500/50 transform hover:scale-105"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                  <button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 px-6 py-4 rounded-xl text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-red-500/50 transform hover:scale-105">
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Avatar Customizer Modal */}
      {showAvatarModal && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowAvatarModal(false)}
        >
          <motion.div
            className="glass p-8 rounded-3xl max-w-lg w-full mx-4 shadow-2xl border border-white/20"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <AvatarCustomizer onClose={() => setShowAvatarModal(false)} />
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
