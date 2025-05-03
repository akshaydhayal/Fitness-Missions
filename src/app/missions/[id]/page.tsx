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
  const [dailySteps, setDailySteps] = useState(0); // Daily steps input
  const [dailySleep, setDailySleep] = useState(0); // Daily sleep input
  const [submissionError, setSubmissionError] = useState("");
  const userInfo = useRecoilValue(userState);

  console.log("has joined",hasJoined);

  // Fetch mission details
  useEffect(() => {
    const fetchMission = async () => {
      const res = await fetch(`/api/missions/${params.id}`);
      const data = await res.json();
      setMission(data.mission);
    };

    fetchMission();
  }, [params.id, publicKey,hasJoined]);

  // Check if user has already joined the mission
  useEffect(() => {
    if (mission && userInfo) {
      mission.participants.forEach((participant) => {
        if (participant?.user._id == userInfo._id) {
          setHasJoined(true);
        }
      });
    }
  }, [publicKey, mission, userInfo]);

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

  // Handle daily record submission
  const handleRecordSubmission = async () => {
    setSubmissionError("");
    try {
      const response = await fetch(`/api/missions/records/${params.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userInfo._id,
          steps: dailySteps,
          hoursSlept: dailySleep,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Record submitted successfully!");
        setMission(result.mission);
      } else {
        setSubmissionError(result.error || "Failed to submit record.");
      }
    } catch (err) {
      setSubmissionError("An error occurred while submitting the record.");
    }
  };

  if (!mission) return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-dark text-gray-300">
      {/* Mission image at the top, full width */}
      {mission.image && (
        <div className="w-full h-40 overflow-hidden">
          <img src={mission.image} alt={mission.title} className="w-full h-full object-cover" />
        </div>
      )}

      {/* Container for mission details and leaderboard */}
      <div className="container mx-auto p-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mission details */}
          <div className="lg:w-2/3 bg-gray-800 p-6 rounded-lg shadow-lg">
            <h1 className="text-4xl font-bold text-neonBlue mb-4">{mission.title}</h1>
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

            {/* Record submission form */}
            {hasJoined && (
              <div className="mt-6">
                <h3 className="text-xl text-neonGreen mb-2">Submit Daily Record</h3>
                <input
                  type="number"
                  value={dailySteps}
                  onChange={(e) => setDailySteps(e.target.value)}
                  placeholder="Enter today's steps"
                  className="p-2 bg-gray-900 text-gray-300 mb-2"
                />
                <input
                  type="number"
                  value={dailySleep}
                  onChange={(e) => setDailySleep(e.target.value)}
                  placeholder="Enter hours slept"
                  className="p-2 bg-gray-900 text-gray-300 mb-2"
                />
                <button onClick={handleRecordSubmission} className="py-2 px-4 bg-neonGreen text-dark rounded hover:bg-green-500 transition">
                  Submit Record
                </button>
                {submissionError && <p className="text-red-500 mt-4">{submissionError}</p>}
              </div>
            )}
          </div>

          {/* Leaderboard */}
          <div className="lg:w-1/3 bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-neonGreen mb-4">Leaderboard</h2>
            <ul className="mt-4 space-y-2">
              {mission && mission.participants && mission?.participants?.map((participant, idx) => (
                <li key={participant?._id} className="text-lg text-gray-400">
                  {idx + 1}. {participant?.user?.name} - {participant?.records?.points} Points
                  {/* {idx + 1}. {participant?.user?.name} - {participant?.records?.reduce((sum, r) => sum + r.points, 0)} Points */}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}





// "use client";
// import { useEffect, useState } from "react";
// import { useWallet } from "@solana/wallet-adapter-react";
// import { useRecoilValue } from "recoil";
// import { userState } from "@/store/userState";

// export default function MissionDetails({ params }: { params: { id: string } }) {
//   const { publicKey, connected } = useWallet();
//   const [mission, setMission] = useState(null);
//   const [isJoining, setIsJoining] = useState(false);
//   const [joinError, setJoinError] = useState("");
//   const [hasJoined, setHasJoined] = useState(false);
//   const [dailySteps, setDailySteps] = useState(0); // Daily steps input
//   const [dailySleep, setDailySleep] = useState(0); // Daily sleep input
//   const [submissionError, setSubmissionError] = useState("");
//   const userInfo = useRecoilValue(userState);

//   // Fetch mission details
//   useEffect(() => {
//     const fetchMission = async () => {
//       const res = await fetch(`/api/missions/${params.id}`);
//       const data = await res.json();
//       setMission(data.mission);
//     };

//     fetchMission();
//   }, [params.id]);

//   // Handle daily record submission
//   const handleRecordSubmission = async () => {
//     setSubmissionError("");
//     try {
//       const response = await fetch(`/api/missions/records/${params.id}`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           userId: userInfo._id,
//           steps: dailySteps,
//           hoursSlept: dailySleep,
//         }),
//       });

//       const result = await response.json();

//       if (response.ok) {
//         alert("Record submitted successfully!");
//         setMission(result.mission);
//       } else {
//         setSubmissionError(result.error || "Failed to submit record.");
//       }
//     } catch (err) {
//       setSubmissionError("An error occurred while submitting the record.");
//     }
//   };

//   if (!mission) return <p>Loading...</p>;

//   return (
//     <div className="min-h-screen bg-dark text-gray-300">
//       {/* Mission image at the top, full width */}
//       {mission.image && (
//         <div className="w-full h-40 overflow-hidden">
//           <img src={mission.image} alt={mission.title} className="w-full h-full object-cover" />
//         </div>
//       )}

//       {/* Container for mission details and leaderboard */}
//       <div className="container mx-auto p-6">
//         <div className="flex flex-col lg:flex-row gap-8">
//           <div className="lg:w-2/3 bg-gray-800 p-6 rounded-lg shadow-lg">
//             <h1 className="text-4xl font-bold text-neonBlue mb-4">{mission.title}</h1>
//             <p className="mt-4 text-gray-400">{mission.description}</p>
//             <p className="mt-4 text-gray-400">Type: {mission.type}</p>
//             <p className="mt-4 text-gray-400">Deadline: {new Date(mission.deadline).toLocaleString()}</p>

//             {connected && hasJoined ? (
//               <div className="mt-6">
//                 <h3 className="text-xl text-neonGreen mb-2">Submit Daily Record</h3>
//                 <input
//                   type="number"
//                   value={dailySteps}
//                   onChange={(e) => setDailySteps(e.target.value)}
//                   placeholder="Enter today's steps"
//                   className="p-2 bg-gray-900 text-gray-300 mb-2"
//                 />
//                 <input
//                   type="number"
//                   value={dailySleep}
//                   onChange={(e) => setDailySleep(e.target.value)}
//                   placeholder="Enter hours slept"
//                   className="p-2 bg-gray-900 text-gray-300 mb-2"
//                 />
//                 <button onClick={handleRecordSubmission} className="py-2 px-4 bg-neonGreen text-dark rounded hover:bg-green-500 transition">
//                   Submit Record
//                 </button>
//                 {submissionError && <p className="text-red-500 mt-4">{submissionError}</p>}
//               </div>
//             ) : (
//               <p className="mt-6 text-red-400">Please join the mission to submit records.</p>
//             )}
//           </div>

//           <div className="lg:w-1/3 bg-gray-800 p-6 rounded-lg shadow-lg">
//             <h2 className="text-2xl font-bold text-neonGreen mb-4">Leaderboard</h2>
//             <ul className="mt-4 space-y-2">
//               {mission.participants.map((participant, idx) => (
//                 <li key={participant._id} className="text-lg text-gray-400">
//                   {idx + 1}. {participant.user.name} - {participant.records.reduce((sum, r) => sum + r.points, 0)} Points
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// "use client";
// import { useEffect, useState } from "react";
// import { useWallet } from "@solana/wallet-adapter-react";
// import { useRecoilValue } from "recoil";
// import { userState } from "@/store/userState";

// export default function MissionDetails({ params }: { params: { id: string } }) {
//   const { publicKey, connected } = useWallet();
//   const [mission, setMission] = useState(null);
//   const [isJoining, setIsJoining] = useState(false); // State to handle join button status
//   const [joinError, setJoinError] = useState("");
//   const [hasJoined, setHasJoined] = useState(false); // State to check if user already joined
//   const userInfo = useRecoilValue(userState);

//   // Fetch mission details
//   useEffect(() => {
//     const fetchMission = async () => {
//       const res = await fetch(`/api/missions/${params.id}`);
//       const data = await res.json();
//       setMission(data.mission);
//     };

//     fetchMission();
//   }, [params.id, publicKey]);

//   // Check if user has already joined the mission
//   useEffect(() => {
//     if (mission && userInfo) {
//       mission.participants.forEach((participant) => {
//         if (participant.user._id == userInfo._id) {
//           setHasJoined(true);
//         }
//       });
//     }
//   }, [publicKey, mission, userInfo]);

//   // Handle the "Join Mission" functionality
//   const handleJoinMission = async () => {
//     if (!publicKey) {
//       alert("Please connect your wallet to join the mission.");
//       return;
//     }

//     setIsJoining(true);
//     setJoinError("");

//     try {
//       const response = await fetch(`/api/missions/${params.id}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           walletAddress: publicKey.toString(),
//         }),
//       });

//       const result = await response.json();

//       if (response.ok) {
//         alert("You have successfully joined the mission!");
//         setMission((prev) => ({
//           ...prev,
//           participants: [...prev.participants, result.participant],
//         }));
//         setHasJoined(true);
//       } else {
//         setJoinError(result.error || "Failed to join the mission.");
//       }
//     } catch (err) {
//       setJoinError("An error occurred while joining the mission.");
//     } finally {
//       setIsJoining(false);
//     }
//   };

//   if (!mission) return <p>Loading...</p>;

//   return (
//     <div className="min-h-screen bg-dark text-gray-300">
//       {/* Mission image at the top, full width */}
//       {mission.image && (
//         <div className="w-full h-40 overflow-hidden">
//           <img src={mission.image} alt={mission.title} className="w-full h-full object-cover" />
//         </div>
//       )}

//       {/* Container for mission details and leaderboard */}
//       <div className="container mx-auto p-6">
//         <div className="flex flex-col lg:flex-row gap-8">
//           {/* Mission details */}
//           <div className="lg:w-2/3 bg-gray-800 p-6 rounded-lg shadow-lg">
//             <h1 className="text-4xl font-bold text-neonBlue mb-4">{mission.title}</h1>
//             <p className="mt-4 text-gray-400">{mission.description}</p>
//             <p className="mt-4 text-gray-400">Type: {mission.type}</p>
//             <p className="mt-4 text-gray-400">Deadline: {new Date(mission.deadline).toLocaleString()}</p>

//             {/* Join Mission button */}
//             {connected ? (
//               <button
//                 onClick={handleJoinMission}
//                 className={`mt-6 py-2 px-4 bg-neonGreen text-dark rounded hover:bg-green-500 transition ${
//                   isJoining || hasJoined ? "opacity-50 cursor-not-allowed" : ""
//                 }`}
//                 disabled={isJoining || hasJoined}
//               >
//                 {isJoining ? "Joining..." : hasJoined ? "Already Joined" : "Join Mission"}
//               </button>
//             ) : (
//               <p className="mt-6 text-red-400">Please connect your wallet to join the mission.</p>
//             )}

//             {/* Display error if joining fails */}
//             {joinError && <p className="mt-4 text-red-500">{joinError}</p>}
//           </div>

//           {/* Leaderboard */}
//           <div className="lg:w-1/3 bg-gray-800 p-6 rounded-lg shadow-lg">
//             <h2 className="text-2xl font-bold text-neonGreen mb-4">Leaderboard</h2>
//             <ul className="mt-4 space-y-2">
//               {mission.participants.map((participant, idx) => (
//                 <li key={participant._id} className="text-lg text-gray-400">
//                   {idx + 1}. {participant.user.name} - {participant.records.reduce((sum, r) => sum + r.points, 0)} Points
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
