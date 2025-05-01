// components/MissionModal.tsx
"use client";

import { useState } from "react";

interface MissionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MissionModal({ isOpen, onClose }: MissionModalProps) {
  const [missionType, setMissionType] = useState("Walking");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [pointsPerStep, setPointsPerStep] = useState(100);
  const [pointsPerHour, setPointsPerHour] = useState(100);
  const [deadline, setDeadline] = useState("");

  const createMission = async () => {
    const missionData = {
      type: missionType,
      title,
      description,
      deadline,
      pointsPerStep: missionType === "Walking" ? pointsPerStep : undefined,
      pointsPerHour: missionType === "Sleep" ? pointsPerHour : undefined,
    };

    const res = await fetch("/api/missions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(missionData),
    });

    if (res.ok) {
      onClose();
      // Trigger a refresh or notify the user about success
    }
  };

  return (
    isOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-96">
          <h2 className="text-2xl font-bold text-neonGreen mb-4">Create a Mission</h2>
          <div className="mb-4">
            <label className="block mb-2 text-gray-400">Mission Type</label>
            <select className="bg-gray-800 text-gray-300 p-2 rounded w-full" value={missionType} onChange={(e) => setMissionType(e.target.value)}>
              <option value="Walking">Walking</option>
              <option value="Sleep">Sleep</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-gray-400">Title</label>
            <input type="text" className="bg-gray-800 text-gray-300 p-2 rounded w-full" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-gray-400">Description</label>
            <textarea className="bg-gray-800 text-gray-300 p-2 rounded w-full" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-gray-400">Deadline</label>
            <input
              type="datetime-local"
              className="bg-gray-800 text-gray-300 p-2 rounded w-full"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </div>
          {missionType === "Walking" && (
            <div className="mb-4">
              <label className="block mb-2 text-gray-400">Points per 1000 steps</label>
              <input
                type="number"
                className="bg-gray-800 text-gray-300 p-2 rounded w-full"
                value={pointsPerStep}
                onChange={(e) => setPointsPerStep(Number(e.target.value))}
              />
            </div>
          )}
          {missionType === "Sleep" && (
            <div className="mb-4">
              <label className="block mb-2 text-gray-400">Points for 8 hours sleep</label>
              <input
                type="number"
                className="bg-gray-800 text-gray-300 p-2 rounded w-full"
                value={pointsPerHour}
                onChange={(e) => setPointsPerHour(Number(e.target.value))}
              />
            </div>
          )}
          <div className="flex justify-end">
            <button className="bg-red-600 text-gray-200 py-2 px-4 rounded mr-2" onClick={onClose}>
              Cancel
            </button>
            <button className="bg-neonGreen text-dark py-2 px-4 rounded" onClick={createMission}>
              Create
            </button>
          </div>
        </div>
      </div>
    )
  );
}
