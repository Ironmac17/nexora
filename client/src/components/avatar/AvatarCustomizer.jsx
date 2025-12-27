import { useState } from "react";
import { Palette, Shirt, Sparkles } from "lucide-react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { useSocketContext } from "../../context/SocketContext";

export default function AvatarCustomizer({ onClose }) {
  const { user, token, refreshUser } = useAuth();
  const { socket } = useSocketContext();
  const [avatar, setAvatar] = useState(user?.avatar || {});
  const [saving, setSaving] = useState(false);
  const outfits = ["default", "hoodie", "jacket", "tshirt", "dress", "suit"];
  const accessories = [
    "none",
    "cap",
    "glasses",
    "headphones",
    "hat",
    "sunglasses",
    "beanie",
  ];
  const colors = [
    "#00AEEF",
    "#FF6B6B",
    "#FFD93D",
    "#6BCB77",
    "#845EC2",
    "#FF8E53",
    "#4ECDC4",
    "#45B7D1",
    "#96CEB4",
    "#FFEAA7",
    "#DDA0DD",
    "#98D8C8",
  ];
  const hairstyles = ["none", "short", "long", "curly", "spiky", "bun"];

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put(
        "/user/avatar",
        { ...avatar },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update avatar in real-time across the app
      socket?.emit("updateAvatar", avatar);

      // Refresh user data to update local state
      await refreshUser();

      onClose();
    } catch (err) {
      alert("Error updating avatar");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-8 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl text-center w-[450px] relative border border-purple-500/20">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors duration-200 text-xl"
      >
        ✕
      </button>
      <h2 className="text-2xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text mb-6">
        🎨 Customize Your Avatar
      </h2>

      {/* Avatar Preview */}
      <div className="mb-8">
        <div className="relative inline-block p-4 bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-2xl border border-purple-500/30">
          <div
            className="w-24 h-24 rounded-full mx-auto border-4 border-purple-400/60 flex items-center justify-center text-xl font-bold shadow-lg"
            style={{ backgroundColor: avatar.color || "#00AEEF" }}
          >
            {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
          </div>

          {/* Hairstyle overlay */}
          {avatar.hairstyle && avatar.hairstyle !== "none" && (
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-lg">
              {avatar.hairstyle === "short" && "💇‍♂️"}
              {avatar.hairstyle === "long" && "👩‍🦰"}
              {avatar.hairstyle === "curly" && "👩‍🦱"}
              {avatar.hairstyle === "spiky" && "👨‍🦲"}
              {avatar.hairstyle === "bun" && "👩‍🦳"}
            </div>
          )}

          {/* Accessory overlay */}
          {avatar.accessory && avatar.accessory !== "none" && (
            <div className="absolute top-2 right-2 text-2xl">
              {avatar.accessory === "cap" && "🧢"}
              {avatar.accessory === "glasses" && "👓"}
              {avatar.accessory === "headphones" && "🎧"}
              {avatar.accessory === "hat" && "🎩"}
              {avatar.accessory === "sunglasses" && "🕶️"}
              {avatar.accessory === "beanie" && "🧢"}
            </div>
          )}
        </div>
        <p className="text-sm text-gray-600 mt-2">
          {avatar.outfit || "default"} • {avatar.accessory || "none"} •{" "}
          {avatar.hairstyle || "none"}
        </p>
      </div>

      {/* Outfit */}
      <div className="mb-4">
        <div className="flex justify-center gap-2 mb-2 items-center">
          <Shirt size={18} className="text-textSub" />
          <span className="text-sm text-textSub">Outfit</span>
        </div>
        <div className="flex justify-center gap-2 flex-wrap">
          {outfits.map((o) => (
            <button
              key={o}
              onClick={() => setAvatar((prev) => ({ ...prev, outfit: o }))}
              className={`px-3 py-1 rounded-md text-sm border ${
                avatar.outfit === o
                  ? "bg-accent text-background"
                  : "bg-background border-surface text-textSub"
              }`}
            >
              {o}
            </button>
          ))}
        </div>
      </div>

      {/* Accessory */}
      <div className="mb-4">
        <div className="flex justify-center gap-2 mb-2 items-center">
          <Sparkles size={18} className="text-textSub" />
          <span className="text-sm text-textSub">Accessory</span>
        </div>
        <div className="flex justify-center gap-2 flex-wrap">
          {accessories.map((a) => (
            <button
              key={a}
              onClick={() => setAvatar((prev) => ({ ...prev, accessory: a }))}
              className={`px-3 py-1 rounded-md text-sm border ${
                avatar.accessory === a
                  ? "bg-accent text-background"
                  : "bg-background border-surface text-textSub"
              }`}
            >
              {a}
            </button>
          ))}
        </div>
      </div>

      {/* Hairstyle */}
      <div className="mb-4">
        <div className="flex justify-center gap-2 mb-2 items-center">
          <span className="text-sm text-textSub">💇 Hairstyle</span>
        </div>
        <div className="flex justify-center gap-2 flex-wrap">
          {hairstyles.map((h) => (
            <button
              key={h}
              onClick={() => setAvatar((prev) => ({ ...prev, hairstyle: h }))}
              className={`px-3 py-1 rounded-md text-sm border ${
                avatar.hairstyle === h
                  ? "bg-accent text-background"
                  : "bg-background border-surface text-textSub"
              }`}
            >
              {h}
            </button>
          ))}
        </div>
      </div>

      {/* Color Picker */}
      <div className="mb-6">
        <div className="flex justify-center gap-2 mb-2 items-center">
          <Palette size={18} className="text-textSub" />
          <span className="text-sm text-textSub">Color</span>
        </div>
        <div className="flex justify-center gap-2">
          {colors.map((c) => (
            <div
              key={c}
              onClick={() => setAvatar((prev) => ({ ...prev, color: c }))}
              className={`w-6 h-6 rounded-full cursor-pointer border-2 ${
                avatar.color === c ? "border-accent" : "border-transparent"
              }`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="px-5 py-2 bg-accent text-background rounded-md hover:opacity-90"
      >
        {saving ? "Saving..." : "Save Avatar"}
      </button>
    </div>
  );
}
