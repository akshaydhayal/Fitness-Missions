"use client";
import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useRecoilValue } from "recoil";
import { userState } from "@/store/userState";

export default function MissionDetails({ params }: { params: { id: string } }) {
  const { publicKey, connected } = useWallet();
  const [mission, setMission] = useState(null);
  const [isJoining, setIsJoining] = useState(false);
  const [joinError, setJoinError] = useState("");
  const [hasJoined, setHasJoined] = useState(false);
  const [dailySteps, setDailySteps] = useState(0);
  const [dailySleep, setDailySleep] = useState(0);
  const [submissionError, setSubmissionError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // New state for submission status
  const userInfo = useRecoilValue(userState);

  const [timeLeft, setTimeLeft] = useState("");

  console.log("userInfo",userInfo);

  // Fetch mission details
  useEffect(() => {
    const fetchMission = async () => {
      try {
        const res = await fetch(`/api/missions/${params.id}`);
        const data = await res.json();
        setMission(data.mission);
      } catch (error) {
        console.error("Failed to fetch mission:", error);
      }
    };

    fetchMission();
  }, [params.id, publicKey, hasJoined]);

  // Check if user has already joined the mission
  useEffect(() => {
    if (mission && userInfo) {
      const alreadyJoined = mission.participants.some((participant) => participant?.user._id === userInfo._id);
      setHasJoined(alreadyJoined);
    }
  }, [mission, userInfo,publicKey]);

  // Countdown Timer
  // Countdown Timer with Seconds
  useEffect(() => {
    if (!mission) return;

    const deadline = new Date(mission.deadline).getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const distance = deadline - now;

      if (distance < 0) {
        setTimeLeft("Mission Ended");
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      // Optional: Add leading zeros for single-digit numbers
      const formattedDays = days.toString().padStart(2, "0");
      const formattedHours = hours.toString().padStart(2, "0");
      const formattedMinutes = minutes.toString().padStart(2, "0");
      const formattedSeconds = seconds.toString().padStart(2, "0");

      setTimeLeft(`${formattedDays}d : ${formattedHours}h : ${formattedMinutes}m : ${formattedSeconds}s`);
    };

    updateTimer();
    const timerInterval = setInterval(updateTimer, 1000); // Update every second

    return () => clearInterval(timerInterval);
  }, [mission]);

  //   useEffect(() => {
  //     if (!mission) return;

  //     const deadline = new Date(mission.deadline).getTime();

  //     const updateTimer = () => {
  //       const now = new Date().getTime();
  //       const distance = deadline - now;

  //       if (distance < 0) {
  //         setTimeLeft("Mission Ended");
  //         return;
  //       }

  //       const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  //       const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  //       const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

  //       setTimeLeft(`${days}d : ${hours}h : ${minutes}m`);
  //     };

  //     updateTimer();
  //     const timerInterval = setInterval(updateTimer, 60000); // Update every minute

  //     return () => clearInterval(timerInterval);
  //   }, [mission]);

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
    setIsSubmitting(true); // Set submitting state
    try {
      const response = await fetch(`/api/missions/records/${params.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userInfo._id,
          steps: mission.type === "Walking" ? dailySteps : undefined,
          hoursSlept: mission.type === "Sleep" ? dailySleep : undefined,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Record submitted successfully!");
        setMission(result.mission);
        // Reset input fields
        setDailySteps(0);
        setDailySleep(0);
      } else {
        setSubmissionError(result.error || "Failed to submit record.");
      }
    } catch (err) {
      setSubmissionError("An error occurred while submitting the record.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mission) return <p className="text-center text-xl text-gray-400">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200">
      {/* Mission image at the top, full width */}
      {mission.image && (
        <div className="w-full h-40 md:h-40 overflow-hidden">
          <img src={mission.image} alt={mission.title} className="w-full h-full object-cover" />
        </div>
      )}

      {/* Countdown Timer */}
      <div className="bg-gray-800 py-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-yellow-400">Time Left: {timeLeft}</h2>
        </div>
      </div>

      {/* Container for mission details and leaderboard */}
      <div className="container mx-auto p-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mission Details and Daily Submission - 80% Width */}
          {/* <div className="lg:w-4/5 flex flex-col gap-6"> */}
          <div className="lg:w-3/4 flex flex-col gap-6">
            {/* Nested Flex for Side by Side Layout */}
            <div className="flex flex-col md:flex-row gap-6">
              {/* Mission details - 60% Width */}
              <div className="md:w-3/5 bg-gray-800 p-6 rounded-lg shadow-lg">
                <h1 className="text-4xl font-bold text-indigo-400 mb-4">{mission.title}</h1>
                <p className="mt-4 text-gray-300">{mission.description}</p>
                <div className="mt-4">
                  <p className="text-gray-300">
                    <span className="font-semibold">Type:</span> {mission.type}
                  </p>
                  <p className="text-gray-300">
                    <span className="font-semibold">Deadline:</span> {new Date(mission.deadline).toLocaleString()}
                  </p>
                  {mission.type === "Walking" && (
                    <p className="text-gray-300">
                      <span className="font-semibold">Points per Step:</span> {mission.pointsPerStep}
                    </p>
                  )}
                  {mission.type === "Sleep" && (
                    <p className="text-gray-300">
                      <span className="font-semibold">Points per Hour:</span> {mission.pointsPerHour}
                    </p>
                  )}
                </div>

                {/* Join Mission button */}
                {connected ? (
                  <button
                    onClick={handleJoinMission}
                    className={`mt-6 py-2 px-4 bg-green-500 text-white rounded hover:bg-green-600 transition ${
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

              {/* Record submission form - 40% Width */}
              {hasJoined && (
                <div className="md:w-2/5 bg-gray-700 p-6 rounded-lg shadow-lg">
                  <h3 className="text-2xl text-green-400 mb-4">Submit Daily Record</h3>
                  <div className="flex flex-col md:flex-row md:space-x-4">
                    {mission.type === "Walking" && (
                      <div className="flex-1 mb-4 md:mb-0">
                        <label className="block mb-2 text-gray-300">Today's Steps</label>
                        <input
                          type="number"
                          value={dailySteps}
                          onChange={(e) => setDailySteps(Number(e.target.value))}
                          placeholder="Enter today's steps"
                          className="w-full p-2 bg-gray-600 text-gray-300 rounded"
                          min="0"
                        />
                      </div>
                    )}
                    {mission.type === "Sleep" && (
                      <div className="flex-1 mb-4 md:mb-0">
                        <label className="block mb-2 text-gray-300">Hours Slept</label>
                        <input
                          type="number"
                          value={dailySleep}
                          onChange={(e) => setDailySleep(Number(e.target.value))}
                          placeholder="Enter hours slept"
                          className="w-full p-2 bg-gray-600 text-gray-300 rounded"
                          min="0"
                          step="0.1"
                        />
                      </div>
                    )}
                  </div>
                  <button
                    onClick={handleRecordSubmission}
                    className="mt-4 w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Record"}
                  </button>
                  {submissionError && <p className="text-red-500 mt-4">{submissionError}</p>}
                </div>
              )}
            </div>
          </div>

          {/* Leaderboard - 20% Width */}
          {/* <div className="lg:w-1/5 bg-gray-800 p-6 rounded-lg shadow-lg"> */}
          <div className="lg:w-1/4 bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-purple-400 mb-4">Leaderboard</h2>
            {mission.participants && mission.participants.length > 0 ? (
              <ul className="mt-4 space-y-2">
                {mission.participants
                //   .sort((a, b) => b.records.reduce((sum, r) => sum + r.points, 0) - a.records.reduce((sum, r) => sum + r.points, 0))
                  .sort((a, b) => b.records.points - a.records.points)
                  .map((participant, idx) => (
                    <li key={participant?._id} className="flex justify-between items-center text-lg text-gray-300">
                      <span>
                        {idx + 1}. {participant?.user?.name}
                      </span>
                      <span className="font-semibold">{participant?.records.points} Points</span>
                    </li>
                  ))}
              </ul>
            ) : (
              <p className="mt-4 text-gray-400">No participants yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
