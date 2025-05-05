"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useRecoilState } from "recoil";
import { missionCount } from "@/store/userState";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Check } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const HomePage = () => {
  const [liveMissions, setLiveMissions] = useState([]);
  const [completedMissions, setCompletedMissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const [totalMissionCount, setTotalMissionCount] = useRecoilState(missionCount);

  useEffect(() => {
    const fetchMissions = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/missions");
        const data = await res.json();
        setLiveMissions(data.liveMissions);
        setCompletedMissions(data.completedMissions);
        setTotalMissionCount(data.liveMissions.length + data.completedMissions.length);
      } catch (error) {
        console.error("Failed to fetch missions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMissions();
  }, [totalMissionCount]);

  const handleMissionClick = (missionId:string) => {
    router.push(`/missions/${missionId}`);
  };

  //@ts-expect-error tyes ignore
  const getTimeRemaining = (deadline:Date, isCompleted) => {
    if (isCompleted) {
      return `Completed on ${new Date(deadline).toLocaleDateString()}`;
    }

    const now = new Date();
    //@ts-expect-error tyes ignore
    const timeRemaining = new Date(deadline) - now;
    const daysRemaining = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    const hoursRemaining = Math.floor(timeRemaining / (1000 * 60 * 60));

    if (daysRemaining > 0) {
      return `${daysRemaining} day${daysRemaining > 1 ? "s" : ""} remaining`;
    } else if (hoursRemaining > 0) {
      return `${hoursRemaining} hour${hoursRemaining > 1 ? "s" : ""} remaining`;
    } else {
      return "Deadline passed";
    }
  };
  
  //@ts-expect-error tyes ignore
  const MissionCard = ({ mission, isCompleted }) => (
    <Card
      className="bg-gray-800 text-gray-100 hover:bg-gray-700 transition-all duration-300 cursor-pointer border-gray-700"
      onClick={() => handleMissionClick(mission._id)}
    >
      <CardHeader className="p-0">
        {mission.image ? (
          <img src={mission.image} alt={mission.title} className="w-full h-40 object-cover rounded-t-lg" />
        ) : (
          <div className="w-full h-40 bg-gray-700 rounded-t-lg" />
        )}
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="text-xl font-bold mb-2 text-gray-100">{mission.title}</CardTitle>
        <p className="text-gray-300 mb-4 line-clamp-2">{mission.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center text-gray-300">
            <Calendar className="w-4 h-4 mr-1" />
            <span className="text-sm">{getTimeRemaining(mission.deadline, isCompleted)}</span>
          </div>
          {/* @ts-expect-error tyes ignore */}
          <Badge variant={isCompleted ? "success" : "secondary"} className="bg-blue-600 text-gray-100">
            {isCompleted ? (
              <>
                <Check className="w-4 h-4 mr-1" />
                Completed
              </>
            ) : (
              <>
                <Clock className="w-4 h-4 mr-1" />
                Active
              </>
            )}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );

  const SkeletonCard = () => (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader className="p-0">
        <Skeleton className="w-full h-40 bg-gray-700" />
      </CardHeader>
      <CardContent className="p-4">
        <Skeleton className="h-6 w-3/4 bg-gray-700 mb-2" />
        <Skeleton className="h-4 w-full bg-gray-700 mb-2" />
        <Skeleton className="h-4 w-full bg-gray-700 mb-4" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-1/3 bg-gray-700" />
          <Skeleton className="h-6 w-1/4 bg-gray-700" />
        </div>
      </CardContent>
    </Card>
  );

  //@ts-expect-error tyes ignore
  const renderMissionCards = (missions, isCompleted) => {
    if (isLoading) {
      return Array(3)
      .fill(0)
      .map((_, index) => <SkeletonCard key={index} />);
    }
    //@ts-expect-error tyes ignore
    return missions.map((mission) => <MissionCard key={mission._id} mission={mission} isCompleted={isCompleted} />);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      {/* <h1 className="text-4xl font-extrabold mb-8 text-center text-blue-400">Mission Dashboard</h1> */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-4 text-gray-300">Live Missions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{renderMissionCards(liveMissions, false)}</div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4 text-gray-300">Completed Missions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{renderMissionCards(completedMissions, true)}</div>
      </div>
    </div>
  );
};

export default HomePage;




// // app/page.tsx
// "use client";

// import { useEffect, useState } from "react";
// import MissionModal from "@/components/MissionModal";
// import Navbar from "@/components/Navbar";
// import { useRouter } from "next/navigation"; // Import the Next.js router
// import { useRecoilState } from "recoil";
// import { missionCount } from "@/store/userState";

// const colors = {
//   background: "linear-gradient(135deg, #1F1C2C, #928DAB)", // Gradient background
//   text: "#E0E0E0",
//   cardBackground: "#1E1E1E",
//   button: "#4A90E2",
// };

// export default function Home() {
//   const [liveMissions, setLiveMissions] = useState([]);
//   const [completedMissions, setCompletedMissions] = useState([]);
//   const router = useRouter();
//   const [totalMissionCount, setTotalMissionCount] = useRecoilState(missionCount);

//   useEffect(() => {
//     const fetchMissions = async () => {
//       const res = await fetch("/api/missions");
//       const data = await res.json();
//       setLiveMissions(data.liveMissions);
//       setCompletedMissions(data.completedMissions);
//       setTotalMissionCount(data.liveMissions.length + data.completedMissions.length);
//     };

//     fetchMissions();
//   }, [totalMissionCount]);

//   const handleMissionClick = (missionId) => {
//     router.push(`/missions/${missionId}`);
//   };

//   return (
//     <div style={{ background: colors.background }} className="min-h-screen text-lightGray px-6 py-8">
//       {/* <Navbar /> */}
//       <h1 className="text-4xl font-bold text-center text-white mb-12 tracking-wide">Mission Dashboard</h1>

//       <section>
//         <h2 className="text-3xl font-bold mb-6 text-white">Live Missions</h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//           {liveMissions.map((mission) => (
//             <div
//               key={mission._id}
//               onClick={() => handleMissionClick(mission._id)}
//               className="bg-gray-800 hover:bg-gray-700 p-6 rounded-lg shadow-lg cursor-pointer transition-transform transform hover:scale-105 hover:shadow-xl"
//             >
//               {mission.image && <img src={mission.image} alt={mission.title} className="rounded-lg mb-4 w-full h-40 object-cover" />}
//               <h3 className="text-xl font-semibold text-white">{mission.title}</h3>
//               <p className="text-gray-400 mt-2">{mission.description}</p>
//               <p className="mt-4 text-sm text-gray-500">Deadline: {new Date(mission.deadline).toLocaleDateString()}</p>
//             </div>
//           ))}
//         </div>
//       </section>

//       <section className="mt-16">
//         <h2 className="text-3xl font-bold mb-6 text-white">Completed Missions</h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//           {completedMissions.map((mission) => (
//             <div
//               key={mission._id}
//               onClick={() => handleMissionClick(mission._id)}
//               className="bg-gray-800 hover:bg-gray-700 p-6 rounded-lg shadow-lg cursor-pointer transition-transform transform hover:scale-105 hover:shadow-xl"
//             >
//               {mission.image && <img src={mission.image} alt={mission.title} className="rounded-lg mb-4 w-full h-40 object-cover" />}
//               <h3 className="text-xl font-semibold text-white">{mission.title}</h3>
//               <p className="text-gray-400 mt-2">{mission.description}</p>
//               <p className="mt-4 text-sm text-gray-500">Deadline: {new Date(mission.deadline).toLocaleDateString()}</p>
//             </div>
//           ))}
//         </div>
//       </section>
//     </div>
//   );
// }
