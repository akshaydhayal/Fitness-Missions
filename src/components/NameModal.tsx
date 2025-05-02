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
      <div className="bg-white p-6 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Enter your name</h2>
        <input type="text" className="border p-2 rounded w-full mb-4" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
        <button className="bg-blue-500 text-white py-2 px-4 rounded" onClick={handleSubmit}>
          Register
        </button>
        <button className="ml-4 text-gray-600" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
}
