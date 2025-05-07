"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useRecoilValue } from "recoil";
import { userState } from "@/store/userState";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Trophy, Clock, Users, Award, MessageSquare, ThumbsUp, ThumbsDown,Mail } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

//@ts-expect-error types
function generateAvatar(name) {
  // Encode the name to make it URL-safe
  const encodedName = encodeURIComponent(name);
  
  // Use DiceBear Avatars API to generate an avatar
  // We're using the 'identicon' style, but you can change this to other styles like 'bottts', 'avataaars', etc.
  return `https://api.dicebear.com/6.x/identicon/svg?seed=${encodedName}`;
}

//@ts-expect-error types
const CustomProgress = ({ value, max }) => {
  const percentage = (value / max) * 100;
  return (
    <div className="w-full bg-red-500 rounded-full h-[7px] dark:bg-red-700">
      <div className="bg-green-500 h-[7px] rounded-full dark:bg-green-500" style={{ width: `${percentage}%` }}></div>
    </div>
  );
};

//@ts-expect-error types
const Post = ({ post, onLike, onDislike }) => (
  <Card className="mb-4 bg-gray-800 border-gray-500 ">
    <CardContent className="pt-4">
      <div className="flex gap-2 mb-0">
        <img src={post.authorAvatar || generateAvatar(post.authorName)} alt={post.authorName} className="w-10 h-10 rounded-full mr-2" />
        <div className="w-full flex flex-col gap-1">
          <div className="flex items-center gap-10">
            <p className="font-semibold text-gray-200">{post.authorName}</p>
            <p className="text-sm text-gray-400">{new Date(post.timestamp).toLocaleString()}</p>
          </div>
          <p className="text-gray-300">{post.content}</p>    
          {post.image && (
            <div className="flex justify-center">
              <img src={post.image} alt="Post image" className="object-cover w-3/4  h-60 rounded-lg mb-2" />
            </div>
          )}
        <div className=" flex justify-between text-gray-400 px-8">
          <Button onClick={() => onLike(post._id)} variant="ghost" className="text-gray-400 hover:text-blue-400">
            <ThumbsUp className="mr-2" /> {post.likes}
          </Button>
          <Button onClick={() => onDislike(post._id)} variant="ghost" className="text-gray-400 hover:text-red-400">
            <ThumbsDown className="mr-2" /> {post.dislikes}
          </Button>
        </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

//@ts-expect-error types
export default function MissionDetails({ params }) {
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
  const [timeLeft, setTimeLeft] = useState("");
  const [activeTab, setActiveTab] = useState("details");
  const [newPost, setNewPost] = useState("");
  const [newPostImage, setNewPostImage] = useState("");
  const userInfo = useRecoilValue(userState);

  const [inviteEmail, setInviteEmail] = useState("");
  const [isSendingInvite, setIsSendingInvite] = useState(false);
  const [inviteError, setInviteError] = useState("");

  console.log("mission : ", mission);

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
      //@ts-expect-error types ignore
      const alreadyJoined = mission.participants.some((participant) => participant?.user._id === userInfo._id);
      setHasJoined(alreadyJoined);
    }
  }, [mission, userInfo, publicKey]);

  // Countdown Timer
  useEffect(() => {
    if (!mission) return;
    
    //@ts-expect-error types
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
    //@ts-expect-error types
    return new Date() > new Date(mission.deadline);
  }, [mission]);

  const winners = useMemo(() => {
    if (!mission || !isMissionOver) return [];
    //@ts-expect-error types ignore
    const participantPoints = mission.participants.map((p) => ({
      ...p,
      totalPoints: p.records.points,
    }));
    //@ts-expect-error types ignore
    const maxPoints = Math.max(...participantPoints.map((p) => p.totalPoints));
    //@ts-expect-error types ignore
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
        //@ts-expect-error types ignore
        setMission((prev) => ({ ...prev, participants: [...prev.participants, result.participant] }));
        setHasJoined(true);
      } else {
        setJoinError(result.error || "Failed to join the mission.");
      }
    } catch (err) {
      setJoinError("An error occurred while joining the mission.: ");
      console.log(err);
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
          //@ts-expect-error types
          userId: userInfo._id,
          //@ts-expect-error ignore
          steps: mission?.type === "Walking" ? dailySteps : undefined,
          //@ts-expect-error ignore
          hoursSlept: mission?.type === "Sleep" ? dailySleep : undefined,
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
      console.log(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreatePost = async () => {
    if (!newPost.trim()) return;

    try {
      const response = await fetch(`/api/missions/posts/${params.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: newPost,
          image: newPostImage,
          //@ts-expect-error ignore
          authorId: userInfo._id,
        }),
      });

      if (response.ok) {
        const { post } = await response.json();
        //@ts-expect-error ignore
        setMission((prev) => ({...prev,posts: [...prev.posts, post],
        }));
        setNewPost("");
        setNewPostImage("");
      } else {
        console.error("Failed to create post");
      }
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };
  
  //@ts-expect-error ignore
  const handleLike = async (postId) => {
    try {
      // const response = await fetch(`/api/missions/posts/${params.id}/like`, {
        const response = await fetch(`/api/missions/posts/${params.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "postLikeFlag":"like"
          },
          //@ts-expect-error ignore
          body: JSON.stringify({ postId, userId: userInfo._id }),
        });
        
        if (response.ok) {
          const { updatedPost } = await response.json();
          setMission((prev) => ({
            //@ts-expect-error ignore
            ...prev, posts: prev.posts.map((post) => (post._id === postId ? updatedPost : post)),
          }));
        } else {
          console.error("Failed to like post");
        }
      } catch (error) {
        console.error("Error liking post:", error);
      }
    };
    
    //@ts-expect-error ignore
    const handleDislike = async (postId) => {
      try {
        // const response = await fetch(`/api/missions/posts/${params.id}/dislike`, {
          const response = await fetch(`/api/missions/posts/${params.id}`, {
            method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "postLikeFlag":"dislike"
        },
        //@ts-expect-error ignore
        body: JSON.stringify({ postId, userId: userInfo._id }),
      });
      
      if (response.ok) {
        const { updatedPost } = await response.json();
        console.log("updated post : ",updatedPost);
        //@ts-expect-error ignore
        setMission((prev) => ({...prev, posts: prev.posts.map((post) => (post._id === postId ? updatedPost : post)),
        }));
      } else {
        console.error("Failed to dislike post");
      }
    } catch (error) {
      console.error("Error disliking post:", error);
    }
  };

  const handleSendInvite = async () => {
    if (!inviteEmail.trim()) return;
    
    setIsSendingInvite(true);
    setInviteError("");
    
    try {
      const response = await fetch(`/api/missions/email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          //@ts-expect-error ignore
          email: inviteEmail,inviterName:userInfo.name,title:mission.title,description:mission.description,type:mission.type,deadline:mission.deadline,missionId: params.id,
        }),
      });
      
      if (response.ok) {
        alert("Invitation sent successfully!");
        setInviteEmail("");
      } else {
        const error = await response.json();
        setInviteError(error.message || "Failed to send invitation.");
      }
    } catch (err) {
      setInviteError("An error occurred while sending the invitation.");
      console.error(err);
    } finally {
      setIsSendingInvite(false);
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
  console.log('userInfo : ',userInfo);
  return (
    <div className="min-h-screen bg-gray-900 text-gray-200">
      {/* @ts-expect-error ignore */}
      {mission.image && (
        <div className="w-full h-40 md:h-40 overflow-hidden relative">
          {/* @ts-expect-error ignore */}
          <img src={mission.image} alt={mission.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
            {/* @ts-expect-error ignore */}
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
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          {/* <TabsList className="grid grid-cols-2"> */}
          <TabsList className="grid w-full grid-cols-2 bg-gray-800 rounded-lg p-1 mb-8">
            <TabsTrigger
              value="details"
              className="py-2 text-base font-medium transition-all 
              data-[state=active]:bg-gray-600 data-[state=active]:text-white 
              data-[state=inactive]:bg-gray-700 data-[state=inactive]:text-gray-400
              rounded-md"
            >
              Mission Details
            </TabsTrigger>
            <TabsTrigger
              value="posts"
              className="py-2 text-base font-medium transition-all 
              data-[state=active]:bg-gray-600 data-[state=active]:text-white 
              data-[state=inactive]:bg-gray-800 data-[state=inactive]:text-gray-400
              rounded-md"
            >
              Mission Posts
            </TabsTrigger>
          </TabsList>
          <TabsContent value="details" className="">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-3 space-y-8">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-2xl text-indigo-400">Mission Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* @ts-expect-error types */}
                    <p className="text-gray-300 mb-4">{mission.description}</p>
                    <div className="grid grid-cols-2 gap-4 text-gray-300 ">
                      <div>
                        {/* @ts-expect-error types */}
                        <span className="font-semibold">Type:</span> {mission.type}
                      </div>
                      <div>
                        {/* @ts-expect-error types */}
                        <span className="font-semibold">Deadline:</span> {new Date(mission.deadline).toLocaleString()}
                      </div>
                      {/* @ts-expect-error types */}
                      {mission.type === "Walking" && (
                        <div>
                          {/* @ts-expect-error types */}
                          <span className="font-semibold">Points per 1000 Steps(on Cudis Ring):</span> {mission.pointsPerStep}
                        </div>
                      )}
                      {/* @ts-expect-error types */}
                      {mission.type === "Sleep" && (
                        <div>
                          {/* @ts-expect-error types */}
                          <span className="font-semibold">Points p/h Sleep(upto 8 hours),then -10% p/h :</span> {mission.pointsPerHour}
                        </div>
                      )}
                      {/* <div className="col-span-2"> */}
                      <div className="">
                        {/* @ts-expect-error types */}
                        <span className="font-semibold">Mission created by:</span> {mission.creator?.name || "Unknown"}
                      </div>
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

                    {/* {hasJoined && !isMissionOver && (
                      <div className="mt-6 border-t border-gray-700 pt-6">
                        <h3 className="text-xl text-indigo-400 mb-4 flex items-center">
                          <Mail className="mr-2" /> Invite Others
                        </h3>
                        <div className="flex items-center space-x-2">
                          <Input
                            type="email"
                            value={inviteEmail}
                            onChange={(e) => setInviteEmail(e.target.value)}
                            placeholder="Enter email to invite"
                            className="bg-gray-700 text-gray-200 border-gray-600 flex-grow"
                          />
                          <Button  className="bg-indigo-600 hover:bg-indigo-700" disabled={isSendingInvite}>
                            {isSendingInvite ? "Sending..." : "Send Invite"}
                          </Button>
                        </div>
                        {inviteError && <p className="text-red-500 mt-2">{inviteError}</p>}
                      </div>
                    )} */}
                  </CardContent>
                </Card>

                {/* {hasJoined && !isMissionOver && (
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-2xl text-green-400">Submit Daily Record</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {mission.type === "Walking" && (
                          <div>
                            <label className="block mb-2 text-gray-300">Today&#39;s Steps (Check on Cudis Ring)</label>
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
                )} */}

                {hasJoined && !isMissionOver && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="bg-gray-800 border-gray-700">
                      <CardHeader>
                        <CardTitle className="text-2xl text-green-400">Submit Daily Record</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {/* @ts-expect-error ignore */}
                          {mission.type === "Walking" && (
                            <div>
                              <label className="block mb-2 text-gray-300">Today&#39;s Steps (Check on Cudis Ring)</label>
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
                          {/* @ts-expect-error ignore */}
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
                          <Button onClick={handleRecordSubmission} className="w-full bg-green-600 hover:bg-green-700" disabled={isSubmitting}>
                            {isSubmitting ? "Submitting..." : "Submit Record"}
                          </Button>
                          {submissionError && <p className="text-red-500 mt-4">{submissionError}</p>}
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gray-800 border-gray-700">
                      <CardHeader>
                        <CardTitle className="text-2xl text-indigo-400 flex items-center">
                          <Mail className="mr-2" /> Invite Others
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <Input
                            type="email"
                            value={inviteEmail}
                            onChange={(e) => setInviteEmail(e.target.value)}
                            placeholder="Enter email to invite"
                            className="bg-gray-700 text-gray-200 border-gray-600"
                          />
                          <Button onClick={handleSendInvite} className="w-full bg-indigo-600 hover:bg-indigo-700" disabled={isSendingInvite}>
                            {isSendingInvite ? "Sending..." : "Send Invite"}
                          </Button>
                          {inviteError && <p className="text-red-500 mt-2">{inviteError}</p>}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
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
                          <label className="block mb-2 text-gray-300">Winner&#39;s Name</label>
                          <p className="p-2 bg-gray-700 text-gray-300 rounded">{winners[0]?.user?.name}</p>
                        </div>
                        <div>
                          <label className="block mb-2 text-gray-300">Winner&#39;s Points</label>
                          <p className="p-2 bg-gray-700 text-gray-300 rounded">{winners[0]?.records?.points}</p>
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
                    {/* @ts-expect-error types ignore */}
                    {mission.participants && mission.participants.length > 0 ? (
                      <ul className="space-y-4">
                        {/* @ts-expect-error types ignore */}
                        {mission.participants.sort((a, b) => b.records.points - a.records.points).map((participant, idx) => (
                            <li key={participant?._id} className="flex items-center text-gray-300">
                              <span className="mr-2 font-bold">{idx + 1}.</span>
                              <div className="flex-grow">
                                <p className="font-semibold">{participant?.user?.name}</p>

                                {/* @ts-expect-error types ignore */}
                                <CustomProgress value={participant?.records.points} max={Math.max(...mission.participants.map((p) => p?.records?.points))} />
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
          </TabsContent>

          <TabsContent value="posts" className="flex justify-center">
            <Card className="w-2/3 px-8 bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-2xl text-indigo-400 flex items-center">
                  <MessageSquare className="mr-2" /> Mission Feeds
                </CardTitle>
              </CardHeader>
              <CardContent>
                {hasJoined && (
                  <div className="mb-10">
                    {/* <img src={userInfo?.name || generateAvatar(userInfo?.name)} alt={userInfo.name} className="w-10 h-10 rounded-full mr-2" /> */}
                    <Input
                      value={newPost}
                      onChange={(e) => setNewPost(e.target.value)}
                      placeholder="Write a new post..."
                      className="bg-gray-700 placeholder:text-slate-400 text-gray-200 border-gray-600 mb-2"
                    />
                    <Input
                      value={newPostImage}
                      onChange={(e) => setNewPostImage(e.target.value)}
                      placeholder="Enter image URL (optional)"
                      className="bg-gray-700 placeholder:text-slate-400 text-gray-200 border-gray-600 mb-2"
                    />
                    <Button onClick={handleCreatePost} className="w-full bg-indigo-600 hover:bg-indigo-700">
                      Post
                    </Button>
                  </div>
                )}
                {/* @ts-expect-error ignore */}
                {mission.posts && mission.posts.length > 0 ? (mission.posts.map((post) => <Post key={post._id} post={post} onLike={handleLike} onDislike={handleDislike} />)
                ) : (
                  <p className="text-gray-400">No posts yet. Be the first to post!</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
