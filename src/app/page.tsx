// app/page.tsx
"use client";

import { useEffect, useState } from "react";
import MissionModal from "@/components/MissionModal";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation"; // Import the Next.js router

const colors = {
  background: "#121212",
  text: "#E0E0E0",
  cardBackground: "#1E1E1E",
  button: "#4A90E2",
};

export default function Home() {
  const [liveMissions, setLiveMissions] = useState([]);
  const [completedMissions, setCompletedMissions] = useState([]);
  // const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter(); // Initialize the Next.js router

  useEffect(() => {
    const fetchMissions = async () => {
      const res = await fetch("/api/missions");
      const data = await res.json();
      setLiveMissions(data.liveMissions);
      setCompletedMissions(data.completedMissions);
    };

    fetchMissions();
  }, []);

  const handleMissionClick = (missionId) => {
    router.push(`/missions/${missionId}`); // Navigate to the mission page when card is clicked
  };

  return (
    <div style={{ backgroundColor: colors.background }} className="min-h-screen text-lightGray">
      {/* <Navbar onCreateMissionClick={() => setIsModalOpen(true)} />
      <MissionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} /> */}

      <h1 className="text-3xl font-bold mb-8">Live Missions</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {liveMissions.map((mission) => (
          <div
            key={mission._id}
            onClick={() => handleMissionClick(mission._id)} // Make the card clickable
            style={{ backgroundColor: colors.cardBackground, cursor: "pointer" }}
            className="p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105"
          >
            {mission.image && <img src={mission.image} alt={mission.title} className="rounded-lg mb-4 w-full h-32 object-cover" />}
            <h2 className="text-xl font-semibold mt-4">{mission.title}</h2>
            <p className="mt-2">{mission.description}</p>
            <p className="mt-2 text-gray-400">Deadline: {new Date(mission.deadline).toLocaleDateString()}</p> {/* Display deadline */}
          </div>
        ))}
      </div>

      <h1 className="text-3xl font-bold mt-12 mb-8">Completed Missions</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {completedMissions.map((mission) => (
          <div
            key={mission._id}
            onClick={() => handleMissionClick(mission._id)} // Make the card clickable
            style={{ backgroundColor: colors.cardBackground, cursor: "pointer" }}
            className="p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105"
          >
            {mission.image && <img src={mission.image} alt={mission.title} className="rounded-lg mb-4 w-full h-32 object-cover" />}
            <h2 className="text-xl font-semibold mt-4">{mission.title}</h2>
            <p className="mt-2">{mission.description}</p>
            <p className="mt-2 text-gray-400">Deadline: {new Date(mission.deadline).toLocaleDateString()}</p> {/* Display deadline */}
          </div>
        ))}
      </div>
    </div>
  );
}