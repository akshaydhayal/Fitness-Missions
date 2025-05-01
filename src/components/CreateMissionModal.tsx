import { useState } from "react";

const CreateMissionModal = ({ showModal, setShowModal }) => {
  const [missionType, setMissionType] = useState("Walking");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mission creation logic
  };

  return showModal ? (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center">
      <div className="bg-dark p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-xl font-bold text-neonGreen mb-4">Create a New Mission</h2>
        <form onSubmit={handleSubmit}>
          <label className="block mb-2">Mission Type</label>
          <select value={missionType} onChange={(e) => setMissionType(e.target.value)} className="w-full bg-gray-800 text-gray-300 rounded p-2 mb-4">
            <option value="Walking">Walking</option>
            <option value="Sleep">Sleep</option>
          </select>
          <label className="block mb-2">Title</label>
          <input type="text" className="w-full bg-gray-800 text-gray-300 rounded p-2 mb-4" />
          <button className="bg-neonGreen text-dark py-2 px-4 rounded mt-4">Create Mission</button>
        </form>
      </div>
    </div>
  ) : null;
};

export default CreateMissionModal;
