// src/pages/HomePage.jsx
import React from "react";
import CampusMap from "../components/map/CampusMap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleAreaClick = (areaId) => {
    if (!areaId) return;

    localStorage.setItem("nexora:lastArea", areaId);
    navigate(`/area/${areaId}`);
  };

  const lastArea =
    localStorage.getItem("nexora:lastArea") || "main-entrance";

  return (
    <div className="mx-auto max-w-7xl p-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Campus</h1>
        <div className="text-sm text-gray-600">
          {user?.name ? `Hi, ${user.name}` : "Welcome"}
        </div>
      </div>

      <CampusMap
        onAreaClick={handleAreaClick}
        userAreaId={lastArea}
      />
    </div>
  );
}
