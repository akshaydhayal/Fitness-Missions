// app/page.tsx
"use client";

import { useEffect, useState } from "react";
import MissionModal from "@/components/MissionModal";
import Navbar from "@/components/Navbar";

const colors = {
  background: "#121212",
  text: "#E0E0E0",
  cardBackground: "#1E1E1E",
  button: "#4A90E2",
};

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
    <div style={{ backgroundColor: colors.background }} className="min-h-screen text-lightGray">
      <Navbar onCreateMissionClick={() => setIsModalOpen(true)} />
      <MissionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <h1 className="text-3xl font-bold mb-8">Live Missions</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {liveMissions.map((mission) => (
          <div key={mission._id} style={{ backgroundColor: colors.cardBackground }} className="p-6 rounded-lg shadow-lg">
            {mission.image && <img src={mission.image} alt={mission.title} className="rounded-lg mb-4 w-full h-32 object-cover" />}
            <h2 className="text-xl font-semibold mt-4">{mission.title}</h2>
            <p className="mt-2">{mission.description}</p>
            <button
              style={{
                backgroundColor: colors.button,
                color: colors.background,
              }}
              className="mt-4 py-2 px-4 rounded hover:bg-[#6AB7E4]"
            >
              <a href={`/missions/${mission._id}`}>Join Mission</a>
            </button>
          </div>
        ))}
      </div>

      <h1 className="text-3xl font-bold mt-12 mb-8">Completed Missions</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {completedMissions.map((mission) => (
          <div key={mission._id} style={{ backgroundColor: colors.cardBackground }} className="p-6 rounded-lg shadow-lg">
            {mission.image && <img src={mission.image} alt={mission.title} className="rounded-lg mb-4 w-full h-32 object-cover" />}
            <h2 className="text-xl font-semibold mt-4">{mission.title}</h2>
            <p className="mt-2">{mission.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// // app/page.tsx
// "use client";

// import { useEffect, useState } from "react";
// import MissionModal from "@/components/MissionModal";
// import Navbar from "@/components/Navbar";

// const colors = {
//   background: "#121212",
//   text: "#E0E0E0",
//   cardBackground: "#1E1E1E",
//   button: "#4A90E2",
// };

// export default function Home() {
//   const [liveMissions, setLiveMissions] = useState([]);
//   const [completedMissions, setCompletedMissions] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);

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
//     <div style={{ backgroundColor: colors.background }} className="min-h-screen text-lightGray">
//       <Navbar onCreateMissionClick={() => setIsModalOpen(true)} />
//       <MissionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

//       <h1 className="text-3xl font-bold mb-8">Live Missions</h1>
//       <div className="flex flex-col gap-4">
//         {liveMissions.map((mission) => (
//           <div key={mission._id} style={{ backgroundColor: colors.cardBackground }} className="p-6 rounded-lg shadow-lg flex flex-col md:flex-row">
//             {mission.image && <img src={mission.image} alt={mission.title} className="rounded-lg w-32 h-32 object-cover mr-4 mb-4 md:mb-0" />}
//             <div className="flex-1">
//               <h2 className="text-xl font-semibold">{mission.title}</h2>
//               <p className="mt-2">{mission.description}</p>
//               <button
//                 style={{
//                   backgroundColor: colors.button,
//                   color: colors.background,
//                 }}
//                 className="mt-4 py-2 px-4 rounded hover:bg-[#6AB7E4]"
//               >
//                 <a href={`/missions/${mission._id}`}>Join Mission</a>
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>

//       <h1 className="text-3xl font-bold mt-12 mb-8">Completed Missions</h1>
//       <div className="flex flex-col gap-4">
//         {completedMissions.map((mission) => (
//           <div key={mission._id} style={{ backgroundColor: colors.cardBackground }} className="p-6 rounded-lg shadow-lg flex flex-col md:flex-row">
//             {mission.image && <img src={mission.image} alt={mission.title} className="rounded-lg w-32 h-32 object-cover mr-4 mb-4 md:mb-0" />}
//             <div className="flex-1">
//               <h2 className="text-xl font-semibold">{mission.title}</h2>
//               <p className="mt-2">{mission.description}</p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
