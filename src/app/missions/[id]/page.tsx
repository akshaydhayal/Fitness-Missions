"use client";
import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";

export default function MissionDetails({ params }: { params: { id: string } }) {
  const { publicKey, connected } = useWallet();
  const [mission, setMission] = useState(null);
  const [isJoining, setIsJoining] = useState(false); // State to handle join button status
  const [joinError, setJoinError] = useState("");

  // Fetch mission details
  useEffect(() => {
    const fetchMission = async () => {
      const res = await fetch(`/api/missions/${params.id}`);
      const data = await res.json();
      setMission(data.mission);
    };

    fetchMission();
  }, [params.id]);

  // Handle the "Join Mission" functionality
  const handleJoinMission = async () => {
    if (!publicKey) {
      alert("Please connect your wallet to join the mission.");
      return;
    }

    setIsJoining(true);
    setJoinError("");

    try {
      const response = await fetch(`/api/missions/${params.id}/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          walletAddress: publicKey.toString(),
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert("You have successfully joined the mission!");
        // Optionally update mission state to reflect the new participant
        setMission((prev) => ({
          ...prev,
          participants: [...prev.participants, result.participant],
        }));
      } else {
        setJoinError(result.error || "Failed to join the mission.");
      }
    } catch (err) {
      setJoinError("An error occurred while joining the mission.");
    } finally {
      setIsJoining(false);
    }
  };

  if (!mission) return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-dark text-gray-300 p-6">
      {/* Display mission image */}
      {mission.image && <img src={mission.image} alt={mission.title} className="w-full h-64 object-cover mb-6 rounded" />}

      {/* Mission details */}
      <h1 className="text-4xl font-bold text-neonBlue">{mission.title}</h1>
      <p className="mt-4 text-gray-400">{mission.description}</p>
      <p className="mt-4 text-gray-400">Type: {mission.type}</p>
      <p className="mt-4 text-gray-400">Deadline: {new Date(mission.deadline).toLocaleString()}</p>

      {/* Join Mission button */}
      {connected ? (
        <button
          onClick={handleJoinMission}
          className={`mt-6 py-2 px-4 bg-neonGreen text-dark rounded hover:bg-green-500 transition ${isJoining ? "opacity-50 cursor-not-allowed" : ""}`}
          disabled={isJoining}
        >
          {isJoining ? "Joining..." : "Join Mission"}
        </button>
      ) : (
        <p className="mt-6 text-red-400">Please connect your wallet to join the mission.</p>
      )}

      {/* Display error if joining fails */}
      {joinError && <p className="mt-4 text-red-500">{joinError}</p>}

      {/* Leaderboard */}
      <h2 className="text-2xl font-bold text-neonGreen mt-8">Leaderboard</h2>
      <ul className="mt-4">
        {mission.participants.map((participant, idx) => (
          <li key={participant._id} className="text-lg text-gray-400">
            {idx + 1}. {participant.user.name} - {participant.records.reduce((sum, r) => sum + r.points, 0)} Points
          </li>
        ))}
      </ul>
    </div>
  );
}
