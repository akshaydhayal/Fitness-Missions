// components/Navbar.tsx
"use client";

import { useEffect, useState, useMemo } from "react";
import { ConnectionProvider, WalletProvider, useWallet } from "@solana/wallet-adapter-react";
import { PhantomWalletAdapter, SolletWalletAdapter } from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";

const colors = {
  background: "#121212",
  text: "#E0E0E0",
  button: "#4A90E2",
  buttonHover: "#6AB7E4",
};

interface NavbarProps {
  onCreateMissionClick: () => void;
}

// Wallet connection provider wrapper
export const WalletConnectionProvider = ({ children }: { children: React.ReactNode }) => {
  const endpoint = useMemo(() => clusterApiUrl("devnet"), []);
  const wallets = useMemo(() => [new PhantomWalletAdapter(), new SolletWalletAdapter()], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets}>{children}</WalletProvider>
    </ConnectionProvider>
  );
};

export default function Navbar({ onCreateMissionClick }: NavbarProps) {
  const { publicKey, connected, connect, disconnect } = useWallet();

  return (
    <nav style={{ backgroundColor: colors.background }} className="p-4 flex justify-between items-center">
      <h1 style={{ color: colors.text }} className="text-2xl font-bold">
        Fitness Missions
      </h1>
      <div className="flex items-center">
        <button
          style={{
            backgroundColor: colors.button,
            color: colors.background,
          }}
          className="py-2 px-4 rounded hover:bg-[#6AB7E4] transition mr-4"
          onClick={onCreateMissionClick}
        >
          Create Mission
        </button>
        <button
          style={{
            backgroundColor: colors.button,
            color: colors.background,
          }}
          className="py-2 px-4 rounded hover:bg-[#6AB7E4] transition"
          onClick={connected ? disconnect : connect}
        >
          {connected ? `Wallet: ${publicKey?.toString().slice(0, 6)}...` : "Connect Wallet"}
        </button>
      </div>
    </nav>
  );
}
