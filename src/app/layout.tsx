"use client";
// app/layout.tsx
import WalletConnectProvider from "@/components/WalletProvider";
import "./globals.css";
import Navbar from "@/components/Navbar";
import MissionModal from "@/components/MissionModal";
import { useState } from "react";

// export const metadata = {
//   title: "Fitness Missions",
//   description: "Create and join fitness missions",
// };


export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <html lang="en">
      <body>
        {/* <Navbar /> */}
        <WalletConnectProvider>
          <Navbar onCreateMissionClick={() => setIsModalOpen(true)} />
          <MissionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
          <main className="p-4">{children}</main>
        </WalletConnectProvider>
      </body>
    </html>
  );
}
