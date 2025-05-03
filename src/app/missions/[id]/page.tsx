"use client";
import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useRecoilValue } from "recoil";
import { userState } from "@/store/userState";


export default function MissionDetails({ params }: { params: { id: string } }) {
  const { publicKey, connected } = useWallet();
  const [mission, setMission] = useState(null);
  const [isJoining, setIsJoining] = useState(false); // State to handle join button status
  const [joinError, setJoinError] = useState("");
  const [hasJoined, setHasJoined] = useState(false); // State to check if user already joined
  const userInfo=useRecoilValue(userState);
  console.log("has joined : ",hasJoined);
  console.log("use info from recoil : ",userInfo);

  // Fetch mission details
  useEffect(() => {
    const fetchMission = async () => {
      const res = await fetch(`/api/missions/${params.id}`);
      const data = await res.json();
      setMission(data.mission);

      // Check if the connected wallet address is already in participants
    //   if (publicKey) {
    //       // const userAlreadyJoined = data.mission.participants.some((participant) => participant.user.walletAddress === publicKey.toString());
    //       const userAlreadyJoined = data.mission.participants.some((participant) => participant.user.walletAddress === publicKey.toString());
    //       setHasJoined(userAlreadyJoined);
    //     }
    };
    
    fetchMission();
}, [params.id, publicKey]); // <-- Properly closing useEffect dependencies


useEffect(()=>{
    if(mission && userInfo){
      console.log("inside the public key");
      console.log(mission);
      mission.participants.forEach((participant)=>{
        if(participant.user._id==userInfo._id){
            setHasJoined(true);
        }
      })
    }

  },[publicKey,mission,userInfo])

  // Handle the "Join Mission" functionality
  const handleJoinMission = async () => {
    if (!publicKey) {
      alert("Please connect your wallet to join the mission.");
      return;
    }

    setIsJoining(true);
    setJoinError("");

    try {
      const response = await fetch(`/api/missions/${params.id}`, {
        method: "PUT",
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
        setMission((prev) => ({
          ...prev,
          participants: [...prev.participants, result.participant],
        }));
        setHasJoined(true);
      } else {
        setJoinError(result.error || "Failed to join the mission.");
      }
    } catch (err) {
      setJoinError("An error occurred while joining the mission.");
    } finally {
      setIsJoining(false);
    }
  };

  if (!mission) return <p>Loading...</p>; // <-- Correctly placed return for loading state

  return (
    <div className="min-h-screen bg-dark text-gray-300 p-6">
      {/* Container for mission details and leaderboard */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Mission details */}
        <div className="lg:w-2/3">
          {/* Display mission image */}
          {mission.image && <img src={mission.image} alt={mission.title} className="w-full h-64 object-cover mb-6 rounded" />}

          <h1 className="text-4xl font-bold text-neonBlue">{mission.title}</h1>
          <p className="mt-4 text-gray-400">{mission.description}</p>
          <p className="mt-4 text-gray-400">Type: {mission.type}</p>
          <p className="mt-4 text-gray-400">Deadline: {new Date(mission.deadline).toLocaleString()}</p>

          {/* Join Mission button */}
          {connected ? (
            <button
              onClick={handleJoinMission}
              className={`mt-6 py-2 px-4 bg-neonGreen text-dark rounded hover:bg-green-500 transition ${
                isJoining || hasJoined ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isJoining || hasJoined}
            >
              {isJoining ? "Joining..." : hasJoined ? "Already Joined" : "Join Mission"}
            </button>
          ) : (
            <p className="mt-6 text-red-400">Please connect your wallet to join the mission.</p>
          )}

          {/* Display error if joining fails */}
          {joinError && <p className="mt-4 text-red-500">{joinError}</p>}
        </div>

        {/* Leaderboard */}
        <div className="lg:w-1/3">
          <h2 className="text-2xl font-bold text-neonGreen">Leaderboard</h2>
          <ul className="mt-4 space-y-2">
            {mission.participants.map((participant, idx) => (
              <li key={participant._id} className="text-lg text-gray-400">
                {idx + 1}. {participant.user.name} - {participant.records.reduce((sum, r) => sum + r.points, 0)} Points
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
