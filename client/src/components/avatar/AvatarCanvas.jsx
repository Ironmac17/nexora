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
      let dx = 0, dy = 0;
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

    Object.values(avatars).forEach(({ x, y, color, name }) => {
      ctx.fillStyle = color || "#00AEEF";
      ctx.beginPath();
      ctx.arc(x, y, 15, 0, Math.PI * 2);
      ctx.fill();

      ctx.font = "12px sans-serif";
      ctx.fillStyle = "#ccc";
      ctx.fillText(name || "User", x - 20, y + 25);
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
