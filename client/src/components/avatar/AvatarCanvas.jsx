import { useEffect, useRef, useState } from "react";
import { useSocketContext } from "../../context/SocketContext";
import { useAuth } from "../../context/AuthContext";

export default function AvatarCanvas() {
  const canvasRef = useRef(null);
  const { socket } = useSocketContext();
  const { user } = useAuth();
  const [avatars, setAvatars] = useState({});

  // Listen for avatar updates from server
  useEffect(() => {
    if (!socket) return;
    socket.on("avatarsUpdate", (data) => setAvatars(data));
    return () => socket.off("avatarsUpdate");
  }, [socket]);

  // Handle movement input
  useEffect(() => {
    const handleMove = (e) => {
      if (!socket || !user) return;
      let dx = 0,
        dy = 0;
      if (e.key === "ArrowUp" || e.key === "w") dy = -10;
      if (e.key === "ArrowDown" || e.key === "s") dy = 10;
      if (e.key === "ArrowLeft" || e.key === "a") dx = -10;
      if (e.key === "ArrowRight" || e.key === "d") dx = 10;
      if (dx !== 0 || dy !== 0) {
        socket.emit("moveAvatar", { userId: user._id, dx, dy });
      }
    };
    window.addEventListener("keydown", handleMove);
    return () => window.removeEventListener("keydown", handleMove);
  }, [socket, user]);

  // Draw avatars
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    Object.values(avatars).forEach(({ x, y, color, name, avatar }) => {
      const avatarData = avatar || {};
      const baseColor = color || avatarData.color || "#00AEEF";
      const outfit = avatarData.outfit || "default";
      const accessory = avatarData.accessory || "none";
      const hairstyle = avatarData.hairstyle || "none";

      // Draw avatar body (circle)
      ctx.fillStyle = baseColor;
      ctx.beginPath();
      ctx.arc(x, y, 15, 0, Math.PI * 2);
      ctx.fill();

      // Draw hairstyle
      if (hairstyle !== "none") {
        ctx.fillStyle = "#8B4513"; // Brown hair
        if (hairstyle === "short") {
          ctx.fillRect(x - 12, y - 18, 24, 8);
        } else if (hairstyle === "long") {
          ctx.fillRect(x - 14, y - 20, 28, 12);
        } else if (hairstyle === "curly") {
          ctx.beginPath();
          ctx.arc(x - 8, y - 15, 6, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(x + 8, y - 15, 6, 0, Math.PI * 2);
          ctx.fill();
        } else if (hairstyle === "spiky") {
          ctx.fillRect(x - 10, y - 22, 4, 10);
          ctx.fillRect(x - 2, y - 25, 4, 13);
          ctx.fillRect(x + 6, y - 22, 4, 10);
        } else if (hairstyle === "bun") {
          ctx.beginPath();
          ctx.arc(x, y - 18, 8, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Draw outfit variations
      if (outfit === "hoodie") {
        ctx.fillStyle = "#333";
        ctx.beginPath();
        ctx.arc(x, y, 18, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = baseColor;
        ctx.beginPath();
        ctx.arc(x, y, 15, 0, Math.PI * 2);
        ctx.fill();
      } else if (outfit === "jacket") {
        ctx.strokeStyle = "#666";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(x, y, 17, 0, Math.PI * 2);
        ctx.stroke();
      } else if (outfit === "tshirt") {
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.arc(x, y, 16, Math.PI * 0.3, Math.PI * 0.7);
        ctx.fill();
      } else if (outfit === "dress") {
        ctx.fillStyle = "#FFB6C1";
        ctx.beginPath();
        ctx.arc(x, y + 5, 12, 0, Math.PI);
        ctx.fill();
      } else if (outfit === "suit") {
        ctx.fillStyle = "#000";
        ctx.fillRect(x - 8, y + 8, 16, 12);
        ctx.fillStyle = "#fff";
        ctx.fillRect(x - 6, y + 10, 12, 8);
      }

      // Draw accessories
      if (accessory === "cap") {
        ctx.fillStyle = "#333";
        ctx.fillRect(x - 12, y - 20, 24, 8);
        ctx.fillRect(x - 8, y - 25, 16, 5);
      } else if (accessory === "glasses") {
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x - 8, y - 2, 6, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(x + 8, y - 2, 6, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x - 2, y - 2);
        ctx.lineTo(x + 2, y - 2);
        ctx.stroke();
      } else if (accessory === "headphones") {
        ctx.strokeStyle = "#333";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(x, y, 18, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x - 15, y);
        ctx.lineTo(x - 20, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x + 15, y);
        ctx.lineTo(x + 20, y);
        ctx.stroke();
      } else if (accessory === "hat") {
        ctx.fillStyle = "#8B4513";
        ctx.fillRect(x - 14, y - 22, 28, 6);
        ctx.fillRect(x - 10, y - 28, 20, 6);
      } else if (accessory === "sunglasses") {
        ctx.fillStyle = "#000";
        ctx.fillRect(x - 12, y - 4, 10, 4);
        ctx.fillRect(x + 2, y - 4, 10, 4);
        ctx.fillRect(x - 2, y - 4, 4, 2);
      } else if (accessory === "beanie") {
        ctx.fillStyle = "#FF6B6B";
        ctx.beginPath();
        ctx.arc(x, y - 15, 12, Math.PI, Math.PI * 2);
        ctx.fill();
      }

      ctx.font = "12px sans-serif";
      ctx.fillStyle = "#ccc";
      ctx.fillText(name || "User", x - 20, y + 30);
    });
  }, [avatars]);

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={500}
      className="rounded-2xl bg-surface border border-surface/70 shadow-inner"
    />
  );
}
