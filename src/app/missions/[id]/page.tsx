"use client";
import { useEffect, useState } from "react";

export default function MissionDetails({ params }: { params: { id: string } }) {
  const [mission, setMission] = useState(null);

  useEffect(() => {
    const fetchMission = async () => {
      const res = await fetch(`/api/missions/${params.id}`);
      const data = await res.json();
      setMission(data.mission);
    };

    fetchMission();
  }, [params.id]);

  if (!mission) return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-dark text-gray-300 p-6">
      <h1 className="text-4xl font-bold text-neonBlue">{mission.title}</h1>
      <p className="mt-4 text-gray-400">{mission.description}</p>
      <p className="mt-4 text-gray-400">Type: {mission.type}</p>
      <p className="mt-4 text-gray-400">Deadline: {new Date(mission.deadline).toLocaleString()}</p>

      <h2 className="text-2xl font-bold text-neonGreen mt-8">Leaderboard</h2>
      <ul className="mt-4">
        {mission.participants.map((participant, idx) => (
          <li key={participant._id} className="text-lg text-gray-400">
            {idx + 1}. {participant.user.name} - {participant.records.reduce((sum, r) => sum + r.points, 0)} Points
          </li>
        ))}
      </ul>

      {/* Mission joining and recording functionality can go here */}
    </div>
  );
}
