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
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Back to Dashboard Button */}
          <div className="flex justify-start mb-4">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 px-4 py-2 glass rounded-lg hover:bg-white/10 transition-all duration-300 text-gray-300 hover:text-white"
            >
              <ArrowLeft size={18} />
              Back to Dashboard
            </button>
          </div>

          <h1 className="text-4xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text mb-2">
            My Profile
          </h1>
          <p className="text-gray-400">Manage your account and preferences</p>
        </motion.div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="glass p-1 rounded-xl flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-purple-600 text-white shadow-lg"
                    : "text-gray-300 hover:text-white hover:bg-white/5"
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
          className="glass p-8 rounded-2xl"
        >
          {activeTab === "profile" && (
            <div className="space-y-8">
              {/* Avatar Section */}
              <div className="text-center">
                <div className="relative inline-block">
                  <div
                    className="w-32 h-32 rounded-full border-4 border-purple-400/30 flex items-center justify-center text-4xl font-bold relative"
                    style={{ backgroundColor: user.avatar?.color || "#00AEEF" }}
                  >
                    {user.fullName?.charAt(0)?.toUpperCase() || "U"}

                    {/* Hairstyle overlay */}
                    {user.avatar?.hairstyle &&
                      user.avatar.hairstyle !== "none" && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-2xl">
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
                      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 text-2xl">
                        {user.avatar.accessory === "cap" && "🧢"}
                        {user.avatar.accessory === "glasses" && "👓"}
                        {user.avatar.accessory === "headphones" && "🎧"}
                        {user.avatar.accessory === "hat" && "🎩"}
                        {user.avatar.accessory === "sunglasses" && "🕶️"}
                        {user.avatar.accessory === "beanie" && "🧢"}
                      </div>
                    )}
                </div>
                <button
                  onClick={() => setShowAvatarModal(true)}
                  className="btn-primary"
                >
                  Customize Avatar
                </button>
              </div>

              {/* Profile Info */}
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-purple-300">
                    Personal Information
                  </h3>
                  <button
                    onClick={() => setEditing(!editing)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                      editing
                        ? "bg-red-600 hover:bg-red-700"
                        : "bg-purple-600 hover:bg-purple-700"
                    }`}
                  >
                    {editing ? (
                      <>
                        <X size={16} />
                        Cancel
                      </>
                    ) : (
                      <>
                        <Edit size={16} />
                        Edit
                      </>
                    )}
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Full Name
                    </label>
                    {editing ? (
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) =>
                          setFormData({ ...formData, fullName: e.target.value })
                        }
                        className="input-field w-full"
                      />
                    ) : (
                      <p className="text-white">{user?.fullName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Email
                    </label>
                    {editing ? (
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="input-field w-full"
                      />
                    ) : (
                      <p className="text-white">{user?.email}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Bio
                  </label>
                  {editing ? (
                    <textarea
                      rows={4}
                      value={formData.bio}
                      onChange={(e) =>
                        setFormData({ ...formData, bio: e.target.value })
                      }
                      className="input-field w-full resize-none"
                      placeholder="Tell us about yourself..."
                    />
                  ) : (
                    <p className="text-white">
                      {user?.bio || "No bio added yet."}
                    </p>
                  )}
                </div>

                {editing && (
                  <div className="flex justify-end">
                    <button onClick={handleSave} className="btn-primary">
                      <Save size={16} className="inline mr-2" />
                      Save Changes
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="space-y-8">
              <h3 className="text-xl font-semibold text-purple-300 mb-6">
                Account Settings
              </h3>

              {/* Notification Settings */}
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-white">
                  Notifications
                </h4>
                <div className="space-y-3">
                  <label className="flex items-center gap-3">
                    <input type="checkbox" className="rounded" defaultChecked />
                    <span className="text-gray-300">Email notifications</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input type="checkbox" className="rounded" defaultChecked />
                    <span className="text-gray-300">Push notifications</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input type="checkbox" className="rounded" />
                    <span className="text-gray-300">Club activity updates</span>
                  </label>
                </div>
              </div>

              {/* Privacy Settings */}
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-white">Privacy</h4>
                <div className="space-y-3">
                  <label className="flex items-center gap-3">
                    <input type="checkbox" className="rounded" defaultChecked />
                    <span className="text-gray-300">Show online status</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input type="checkbox" className="rounded" />
                    <span className="text-gray-300">
                      Allow profile visibility
                    </span>
                  </label>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="border-t border-red-500/20 pt-6">
                <h4 className="text-lg font-medium text-red-300 mb-4">
                  Danger Zone
                </h4>
                <div className="flex gap-4">
                  <button
                    onClick={handleLogout}
                    className="bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded-lg text-white transition-colors flex items-center gap-2"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                  <button className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-white transition-colors">
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowAvatarModal(false)}
        >
          <motion.div
            className="glass p-6 rounded-xl max-w-md w-full mx-4"
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
