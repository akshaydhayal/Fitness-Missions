// components/NameModal.tsx

import { useState } from "react";

interface NameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
}

export default function NameModal({ isOpen, onClose, onSubmit }: NameModalProps) {
  const [name, setName] = useState("");

  const handleSubmit = () => {
    if (name) {
      onSubmit(name);
      onClose(); // Close the modal after submitting
    } else {
      alert("Please enter your name.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-[#1E1E1E] p-6 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Enter your name</h2>
        <input type="text" className="bg-[#4b4545]  p-2 rounded w-full mb-4" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
        <button className="bg-blue-500 text-white py-2 px-4 rounded" onClick={handleSubmit}>
          Register
        </button>
        <button className="bg-red-600 text-lightGray py-2 ml-4 px-4 rounded" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
}
