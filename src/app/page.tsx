// app/page.tsx
"use client";

import { useEffect, useState } from "react";
import MissionModal from "@/components/MissionModal";

export default function Home() {
  const [liveMissions, setLiveMissions] = useState([]);
  const [completedMissions, setCompletedMissions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchMissions = async () => {
      const res = await fetch("/api/missions");
      const data = await res.json();
      setLiveMissions(data.liveMissions);
      setCompletedMissions(data.completedMissions);
    };

    fetchMissions();
  }, []);

  return (
    <div className="min-h-screen bg-dark text-gray-300">
      <MissionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <h1 className="text-3xl font-bold text-neonGreen mb-8">Live Missions</h1>
      <button className="mb-6 bg-neonGreen text-dark py-2 px-4 rounded" onClick={() => setIsModalOpen(true)}>
        Create Mission
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {liveMissions.map((mission) => (
          <div key={mission._id} className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-neonBlue mt-4">{mission.title}</h2>
            <p className="mt-2 text-gray-400">{mission.description}</p>
            <button className="mt-4 bg-neonGreen text-dark py-2 px-4 rounded">
              <a href={`/missions/${mission._id}`}>Join Mission</a>
            </button>
          </div>
        ))}
      </div>

      <h1 className="text-3xl font-bold text-neonGreen mt-12 mb-8">Completed Missions</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {completedMissions.map((mission) => (
          <div key={mission._id} className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-neonBlue mt-4">{mission.title}</h2>
            <p className="mt-2 text-gray-400">{mission.description}</p>
            <p className="mt-4 text-gray-500">Completed on: {new Date(mission.deadline).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}



// "use client";
// import { useEffect, useState } from "react";

// export default function Home() {
//   const [liveMissions, setLiveMissions] = useState([]);
//   const [completedMissions, setCompletedMissions] = useState([]);

//   useEffect(() => {
//     const fetchMissions = async () => {
//       const res = await fetch("/api/missions");
//       const data = await res.json();
//       setLiveMissions(data.liveMissions);
//       setCompletedMissions(data.completedMissions);
//     };

//     fetchMissions();
//   }, []);

//   return (
//     <div className="min-h-screen bg-dark text-gray-300">
//       <h1 className="text-3xl font-bold text-neonGreen mb-8">Live Missions</h1>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {liveMissions.map((mission) => (
//           <div key={mission._id} className="bg-gray-800 p-6 rounded-lg shadow-lg">
//             <h2 className="text-xl font-semibold text-neonBlue mt-4">{mission.title}</h2>
//             <p className="mt-2 text-gray-400">{mission.description}</p>
//             <button className="mt-4 bg-neonGreen text-dark py-2 px-4 rounded">
//               <a href={`/missions/${mission._id}`}>Join Mission</a>
//             </button>
//           </div>
//         ))}
//       </div>

//       <h1 className="text-3xl font-bold text-neonGreen mt-12 mb-8">Completed Missions</h1>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {completedMissions.map((mission) => (
//           <div key={mission._id} className="bg-gray-800 p-6 rounded-lg shadow-lg">
//             <h2 className="text-xl font-semibold text-neonBlue mt-4">{mission.title}</h2>
//             <p className="mt-2 text-gray-400">{mission.description}</p>
//             <p className="mt-2 text-gray-400">Winner: {mission.winner ? mission.winner.name : "N/A"}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
