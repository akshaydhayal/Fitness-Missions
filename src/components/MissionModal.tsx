// components/MissionModal.tsx
"use client";

import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Import the date picker CSS

const colors = {
  background: "#1E1E1E",
  text: "#E0E0E0",
  button: "#4A90E2",
  buttonHover: "#6AB7E4",
};

interface MissionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MissionModal({ isOpen, onClose }: MissionModalProps) {
  const [missionType, setMissionType] = useState("Walking");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [pointsPerStep, setPointsPerStep] = useState(100);
  const [pointsPerHour, setPointsPerHour] = useState(100);
  const [deadline, setDeadline] = useState<Date | null>(null);
  const [imageLink, setImageLink] = useState("");

  const createMission = async () => {
    if (!deadline || !title || !description || !imageLink) {
      alert("Please fill in all fields.");
      return;
    }

    // Convert the deadline to ISO string format
    const formattedDeadline = deadline.toISOString();

    const missionData = {
      type: missionType,
      title,
      description,
      deadline: formattedDeadline,
      pointsPerStep: missionType === "Walking" ? pointsPerStep : undefined,
      pointsPerHour: missionType === "Sleep" ? pointsPerHour : undefined,
      image: imageLink,
    };

    try {
      const res = await fetch("/api/missions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(missionData),
      });

      if (res.ok) {
        onClose();
      } else {
        const errorData = await res.json();
        alert(`Error: ${errorData.message || "Failed to create mission"}`);
      }
    } catch (error) {
      console.error("Error creating mission:", error);
      alert("An error occurred while creating the mission. Please try again.");
    }
  };

  return (
    isOpen && (
      <div style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }} className="fixed inset-0 flex justify-center items-center">
        <div
          style={{ backgroundColor: colors.background }}
          className="p-4 px-6 rounded-lg shadow-lg w-[600px]" // Adjusted width
        >
          <h2 style={{ color: colors.text }} className="text-2xl font-bold mb-4 text-center">
            Create a Mission
          </h2>

          <div className="grid grid-cols-1 gap-0 mb-4">
            {/* Mission Type */}
            <div className="mb-4">
              <label className="block mb-2" style={{ color: colors.text }}>
                Mission Type
              </label>
              <select className="bg-dark text-lightGray p-2 rounded w-full" value={missionType} onChange={(e) => setMissionType(e.target.value)}>
                <option value="Walking">Walking</option>
                <option value="Sleep">Sleep</option>
              </select>
            </div>

            {/* Title & Image Link */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block mb-2" style={{ color: colors.text }}>
                  Title
                </label>
                <input type="text" className="bg-dark text-lightGray p-2 rounded w-full" value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
              <div>
                <label className="block mb-2" style={{ color: colors.text }}>
                  Image Link
                </label>
                <input
                  type="text"
                  className="bg-dark text-lightGray p-2 rounded w-full"
                  value={imageLink}
                  onChange={(e) => setImageLink(e.target.value)}
                  placeholder="Enter image URL"
                />
              </div>
            </div>

            {/* Description */}
            <div className="mb-4">
              <label className="block mb-2" style={{ color: colors.text }}>
                Description
              </label>
              <textarea className="bg-dark text-lightGray p-2 rounded w-full" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
            </div>

            {/* Deadline and Points fields in one row */}
            <div className="grid grid-cols-2 gap-4 mb-0">
              <div>
                <label className="block mb-2" style={{ color: colors.text }}>
                  Deadline (dd/mm/yyyy)
                </label>
                <DatePicker
                  selected={deadline}
                  onChange={(date) => setDeadline(date)}
                  dateFormat="dd/MM/yyyy"
                  className="bg-dark text-lightGray p-2 rounded w-full"
                  placeholderText="Select date"
                  isClearable
                />
              </div>
              {missionType === "Walking" && (
                <div>
                  <label className="block mb-2" style={{ color: colors.text }}>
                    Points per 1000 steps
                  </label>
                  <input
                    type="number"
                    className="bg-dark text-lightGray p-2 rounded w-full"
                    value={pointsPerStep}
                    onChange={(e) => setPointsPerStep(Number(e.target.value))}
                  />
                </div>
              )}
              {missionType === "Sleep" && (
                <div>
                  <label className="block mb-2" style={{ color: colors.text }}>
                    Points for 8 hours sleep
                  </label>
                  <input
                    type="number"
                    className="bg-dark text-lightGray p-2 rounded w-full"
                    value={pointsPerHour}
                    onChange={(e) => setPointsPerHour(Number(e.target.value))}
                  />
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-end">
            <button className="bg-red-600 text-lightGray py-2 px-4 rounded mr-6" onClick={onClose}>
              Cancel
            </button>
            <button
              style={{
                backgroundColor: colors.button,
                color: colors.background,
              }}
              className="py-2 px-4 rounded hover:bg-[#6AB7E4] transition"
              onClick={createMission}
            >
              Create
            </button>
          </div>
        </div>
      </div>
    )
  );
}

// // components/MissionModal.tsx
// "use client";

// import { useState } from "react";

// const colors = {
//   background: "#1E1E1E",
//   text: "#E0E0E0",
//   button: "#4A90E2",
//   buttonHover: "#6AB7E4",
// };

// interface MissionModalProps {
//   isOpen: boolean;
//   onClose: () => void;
// }

// export default function MissionModal({ isOpen, onClose }: MissionModalProps) {
//   const [missionType, setMissionType] = useState("Walking");
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [pointsPerStep, setPointsPerStep] = useState(100);
//   const [pointsPerHour, setPointsPerHour] = useState(100);
//   const [deadline, setDeadline] = useState("");
//   const [imageLink, setImageLink] = useState("");

//   const createMission = async () => {
//     console.log("deadline : ",deadline);
//     if (!deadline) return;

//     // Convert the deadline to the required date format
//     const formattedDeadline = new Date(deadline).toISOString();

//     const missionData = {
//       type: missionType,
//       title,
//       description,
//       deadline: formattedDeadline,
//       pointsPerStep: missionType === "Walking" ? pointsPerStep : undefined,
//       pointsPerHour: missionType === "Sleep" ? pointsPerHour : undefined,
//       image: imageLink, // Use image link instead of upload
//     };

//     const res = await fetch("/api/missions", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(missionData),
//     });

//     if (res.ok) {
//       onClose();
//     }
//   };

//   return (
//     isOpen && (
//       <div style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }} className="fixed inset-0 flex justify-center items-center">
//         <div
//           style={{ backgroundColor: colors.background }}
//           className="p-4 px-6 rounded-lg shadow-lg w-[600px]" // Increased width
//         >
//           <h2 style={{ color: colors.text }} className="text-2xl font-bold mb-4 text-center">
//             Create a Mission
//           </h2>

//           <div className="grid grid-cols-1 gap-0 mb-4">
//             {/* Mission Type */}
//             <div className="mb-4">
//               <label className="block mb-2" style={{ color: colors.text }}>
//                 Mission Type
//               </label>
//               <select className="bg-dark text-lightGray p-2 rounded w-full" value={missionType} onChange={(e) => setMissionType(e.target.value)}>
//                 <option value="Walking">Walking</option>
//                 <option value="Sleep">Sleep</option>
//               </select>
//             </div>

//             {/* Title & Image Link */}
//             <div className="grid grid-cols-2 gap-4 mb-4">
//               <div>
//                 <label className="block mb-2" style={{ color: colors.text }}>
//                   Title
//                 </label>
//                 <input type="text" className="bg-dark text-lightGray p-2 rounded w-full" value={title} onChange={(e) => setTitle(e.target.value)} />
//               </div>
//               <div>
//                 <label className="block mb-2" style={{ color: colors.text }}>
//                   Image Link
//                 </label>
//                 <input
//                   type="text"
//                   className="bg-dark text-lightGray p-2 rounded w-full"
//                   value={imageLink}
//                   onChange={(e) => setImageLink(e.target.value)}
//                   placeholder="Enter image URL"
//                 />
//               </div>
//             </div>

//             {/* Description */}
//             <div className="mb-4">
//               <label className="block mb-2" style={{ color: colors.text }}>
//                 Description
//               </label>
//               <textarea className="bg-dark text-lightGray p-2 rounded w-full" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
//             </div>

//             {/* Deadline and Points fields in one row */}
//             <div className="grid grid-cols-2 gap-4 mb-0">
//               <div>
//                 <label className="block mb-2" style={{ color: colors.text }}>
//                   Deadline
//                 </label>
//                 <input
//                   type="datetime-local"
//                   className="bg-dark text-lightGray p-2 rounded w-full"
//                   value={deadline}
//                   onChange={(e) => setDeadline(e.target.value)}
//                 />
//               </div>
//               {missionType === "Walking" && (
//                 <div>
//                   <label className="block mb-2" style={{ color: colors.text }}>
//                     Points per 1000 steps
//                   </label>
//                   <input
//                     type="number"
//                     className="bg-dark text-lightGray p-2 rounded w-full"
//                     value={pointsPerStep}
//                     onChange={(e) => setPointsPerStep(Number(e.target.value))}
//                   />
//                 </div>
//               )}
//               {missionType === "Sleep" && (
//                 <div>
//                   <label className="block mb-2" style={{ color: colors.text }}>
//                     Points for 8 hours sleep
//                   </label>
//                   <input
//                     type="number"
//                     className="bg-dark text-lightGray p-2 rounded w-full"
//                     value={pointsPerHour}
//                     onChange={(e) => setPointsPerHour(Number(e.target.value))}
//                   />
//                 </div>
//               )}
//             </div>
//           </div>
//           <div className="flex justify-end">
//             <button className="bg-red-600 text-lightGray py-2 px-4 rounded mr-6" onClick={onClose}>
//               Cancel
//             </button>
//             <button
//               style={{
//                 backgroundColor: colors.button,
//                 color: colors.background,
//               }}
//               className="py-2 px-4 rounded hover:bg-[#6AB7E4] transition"
//               onClick={createMission}
//             >
//               Create
//             </button>
//           </div>
//         </div>
//       </div>
//     )
//   );
// }
