// components/Navbar.tsx
"use client";

import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import "@solana/wallet-adapter-react-ui/styles.css";
import NameModal from "./NameModal";
import { useSetRecoilState } from "recoil";
import { userState } from "@/store/userState";
import Link from "next/link";

const colors = {
  background: "#121212",
  text: "#E0E0E0",
  button: "#4A90E2",
  buttonHover: "#6AB7E4",
};

interface NavbarProps {
  onCreateMissionClick: () => void;
}

export default function Navbar({ onCreateMissionClick }: NavbarProps) {
  const { publicKey } = useWallet();
  const [errorMessage, setErrorMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const setUser=useSetRecoilState(userState);

  async function checkUserExists(walletAddress: string) {
    const response = await fetch("/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ walletAddress }),
    });
    const jsonResponse = await response.json();
    if (jsonResponse.user) {
        setUser(jsonResponse.user);
    }
    console.log("response: ", jsonResponse);

    if (!response.ok) {
      // User not found, show modal to enter name
      setIsModalOpen(true);
    }
  }

  const handleRegister = async (name: string) => {
    const registerResponse = await fetch("/api/users/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ walletAddress, name }),
    });

    const registerJsonResponse = await registerResponse.json();
    if (registerResponse.ok) {
      alert("User registered successfully!");
    } else {
      setErrorMessage(registerJsonResponse.error || "Error during registration");
    }
  };

  // Automatically check if user exists when publicKey changes
  useEffect(()=>{
      if (publicKey && !walletAddress) {
        const address = publicKey.toString();
        setWalletAddress(address);
        checkUserExists(address);
      }
  },[publicKey])

  function handleCreateMis(){
    if (!publicKey) {
      alert("Connect to Wallet first to create a mission!!");
      return;
    }
    onCreateMissionClick();
  }
  return (
    <nav style={{ backgroundColor: colors.background }} className="pt-1 px-4 flex justify-between items-center">
      <Link href="/" className="text-3xl font-bold">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 animate-pulse">Cudis Missions</span>
      </Link>

      <div className="flex items-center">
        <button
          className="bg-purple-600 hover:bg-purple-700 text-white py-2 font-semibold  px-4 rounded transition mr-4"
          onClick={handleCreateMis}
          // onClick={onCreateMissionClick}
        >Create Cudis Mission</button>
        <WalletMultiButton />
      </div>

      {/* Error Message */}
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}

      {/* Modal for entering user name */}
      <NameModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleRegister} />
    </nav>
  );
}