"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useRecoilValue } from "recoil";
import { userState } from "@/store/userState";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Trophy, Clock, Users, Award } from "lucide-react";


const CustomProgress = ({ value, max }) => {
  const percentage = (value / max) * 100;
  return (
    <div className="w-full bg-red-500 rounded-full h-[7px] dark:bg-red-700">
      <div className="bg-green-500 h-[7px] rounded-full dark:bg-green-500" style={{ width: `${percentage}%` }}></div>
    </div>
  );
};

export default function MissionDetails({ params }: { params: { id: string } }) {
  const { publicKey, connected } = useWallet();
  const [mission, setMission] = useState(null);
  const [isJoining, setIsJoining] = useState(false);
  const [joinError, setJoinError] = useState("");
  const [hasJoined, setHasJoined] = useState(false);
  const [dailySteps, setDailySteps] = useState(0);
  const [dailySleep, setDailySleep] = useState(0);
  const [submissionError, setSubmissionError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const userInfo = useRecoilValue(userState);

  const [timeLeft, setTimeLeft] = useState("");

  // Fetch mission details
  useEffect(() => {
    const fetchMission = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/missions/${params.id}`);
        const data = await res.json();
        setMission(data.mission);
      } catch (error) {
        console.error("Failed to fetch mission:", error);
      } finally {
        setIsLoading(false);
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
  }, [mission, userInfo, publicKey]);

  // Countdown Timer
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

      const formattedDays = days.toString().padStart(2, "0");
      const formattedHours = hours.toString().padStart(2, "0");
      const formattedMinutes = minutes.toString().padStart(2, "0");
      const formattedSeconds = seconds.toString().padStart(2, "0");

      setTimeLeft(`${formattedDays}d : ${formattedHours}h : ${formattedMinutes}m : ${formattedSeconds}s`);
    };

    updateTimer();
    const timerInterval = setInterval(updateTimer, 1000);

    return () => clearInterval(timerInterval);
  }, [mission]);

  const isMissionOver = useMemo(() => {
    if (!mission) return false;
    return new Date() > new Date(mission.deadline);
  }, [mission]);

  const winners = useMemo(() => {
    if (!mission || !isMissionOver) return [];
    const participantPoints = mission.participants.map((p) => ({
      ...p,
      totalPoints: p.records.points,
    }));
    const maxPoints = Math.max(...participantPoints.map((p) => p.totalPoints));
    return participantPoints.filter((p) => p.totalPoints === maxPoints);
  }, [mission, isMissionOver]);

  const handleJoinMission = async () => {
    if (isMissionOver) {
      alert("Mission is already over!");
      return;
    }
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

  const handleRecordSubmission = async () => {
    setSubmissionError("");
    setIsSubmitting(true);
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-200 flex items-center justify-center">
        <div className="text-center">
          <Skeleton className="h-12 w-64 mb-4 bg-gray-800" />
          <Skeleton className="h-4 w-48 mx-auto bg-gray-800" />
        </div>
      </div>
    );
  }

  if (!mission) return <p className="text-center text-xl text-gray-400">Mission not found</p>;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200">
      {mission.image && (
        <div className="w-full h-40 md:h-40 overflow-hidden relative">
          <img src={mission.image} alt={mission.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white text-center">{mission.title}</h1>
          </div>
        </div>
      )}

      <div className="bg-gray-800 py-6 shadow-lg">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-yellow-400 flex items-center justify-center">
            <Clock className="mr-2" /> Time Left: {timeLeft}
          </h2>
        </div>
      </div>

      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 space-y-8">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-2xl text-indigo-400">Mission Details</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-4">{mission.description}</p>
                <div className="grid grid-cols-2 gap-4 text-gray-300">
                  <div>
                    <span className="font-semibold">Type:</span> {mission.type}
                  </div>
                  <div>
                    <span className="font-semibold">Deadline:</span> {new Date(mission.deadline).toLocaleString()}
                  </div>
                  {mission.type === "Walking" && (
                    <div>
                      <span className="font-semibold">Points per 1000 Steps:</span> {mission.pointsPerStep}
                    </div>
                  )}
                  {mission.type === "Sleep" && (
                    <div>
                      <span className="font-semibold">Points per hour Sleep:</span> {mission.pointsPerHour}
                    </div>
                  )}
                </div>
                {connected ? (
                  <Button
                    onClick={handleJoinMission}
                    className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700"
                    disabled={isJoining || hasJoined || isMissionOver}
                  >
                    {isJoining ? "Joining..." : hasJoined ? "Already Joined" : isMissionOver ? "Mission Ended" : "Join Mission"}
                  </Button>
                ) : (
                  <p className="mt-6 text-red-400">Please connect your wallet to join the mission.</p>
                )}
                {joinError && <p className="mt-4 text-red-500">{joinError}</p>}
              </CardContent>
            </Card>

            {hasJoined && !isMissionOver && (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-2xl text-green-400">Submit Daily Record</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {mission.type === "Walking" && (
                      <div>
                        <label className="block mb-2 text-gray-300">Today's Steps (Check on Cudis Ring)</label>
                        <Input
                          type="number"
                          value={dailySteps}
                          onChange={(e) => setDailySteps(Number(e.target.value))}
                          placeholder="Enter today's steps"
                          min="0"
                          className="bg-gray-700 text-gray-200 border-gray-600"
                        />
                      </div>
                    )}
                    {mission.type === "Sleep" && (
                      <div>
                        <label className="block mb-2 text-gray-300">Hours Slept (Check on Cudis Ring)</label>
                        <Input
                          type="number"
                          value={dailySleep}
                          onChange={(e) => setDailySleep(Number(e.target.value))}
                          placeholder="Enter hours slept"
                          min="0"
                          step="0.1"
                          className="bg-gray-700 text-gray-200 border-gray-600"
                        />
                      </div>
                    )}
                  </div>
                  <Button onClick={handleRecordSubmission} className="mt-4 w-full bg-green-600 hover:bg-green-700" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit Record"}
                  </Button>
                  {submissionError && <p className="text-red-500 mt-4">{submissionError}</p>}
                </CardContent>
              </Card>
            )}

            {isMissionOver && (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-2xl text-green-400 flex items-center">
                    <Trophy className="mr-2" /> Mission Winner
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-2 text-gray-300">Winner's Name</label>
                      <p className="p-2 bg-gray-700 text-gray-300 rounded">{winners[0].user.name}</p>
                    </div>
                    <div>
                      <label className="block mb-2 text-gray-300">Winner's Points</label>
                      <p className="p-2 bg-gray-700 text-gray-300 rounded">{winners[0].records.points}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="lg:col-span-1">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-2xl text-purple-400 flex items-center">
                  <Award className="mr-2" /> Leaderboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                {mission.participants && mission.participants.length > 0 ? (
                  <ul className="space-y-4">
                    {mission.participants
                      .sort((a, b) => b.records.points - a.records.points)
                      .map((participant, idx) => (
                        <li key={participant?._id} className="flex items-center text-gray-300">
                          <span className="mr-2 font-bold">{idx + 1}.</span>
                          <div className="flex-grow">
                            <p className="font-semibold">{participant?.user?.name}</p>
                            {/* <Progress
                              value={(participant?.records?.points / Math.max(...mission.participants.map((p) => p.records.points))) * 100}
                              className="h-2 bg-green-500"
                            //   className="h-2 bg-gray-700"
                            /> */}
                            <CustomProgress value={participant?.records.points} max={Math.max(...mission.participants.map((p) => p.records.points))} />
                          </div>
                          <span className="ml-2 font-semibold">{participant?.records.points}</span>
                        </li>
                      ))}
                  </ul>
                ) : (
                  <p className="text-gray-400 flex items-center justify-center">
                    <Users className="mr-2" /> No participants yet.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}



