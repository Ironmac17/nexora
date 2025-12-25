import { useState } from "react";
import { Palette, Shirt, Sparkles } from "lucide-react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

export default function AvatarCustomizer({ onClose }) {
  const { user, token } = useAuth();
  const [avatar, setAvatar] = useState(user?.avatar || {});
  const [saving, setSaving] = useState(false);
  const outfits = ["default", "hoodie", "jacket", "tshirt"];
  const accessories = ["none", "cap", "glasses", "headphones"];
  const colors = ["#00AEEF", "#FF6B6B", "#FFD93D", "#6BCB77", "#845EC2"];

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put(
        "/user/avatar",
        { ...avatar },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Avatar updated successfully!");
      onClose();
    } catch (err) {
      alert("Error updating avatar");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 bg-surface rounded-xl shadow-md text-center w-[400px] relative">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-textSub hover:text-textMain"
      >
        ✕
      </button>
      <h2 className="text-lg font-semibold text-accent mb-4">
        Customize Your Avatar
      </h2>

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
