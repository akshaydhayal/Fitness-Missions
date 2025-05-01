// components/Navbar.tsx
"use client";

import { useEffect, useState } from "react";

export default function Navbar() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        const address = accounts[0];
        setWalletAddress(address);
        // You can add wallet address check and registration here.
      } catch (error) {
        console.error("Wallet connection failed:", error);
      }
    } else {
      alert("MetaMask is not installed!");
    }
  };

  return (
    <nav className="bg-gray-900 text-gray-300 p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-neonGreen">Fitness Missions</h1>
      <button className="bg-neonGreen text-dark py-2 px-4 rounded hover:bg-neonBlue transition" onClick={connectWallet}>
        {walletAddress ? `Wallet: ${walletAddress.slice(0, 6)}...` : "Connect Wallet"}
      </button>
    </nav>
  );
}
