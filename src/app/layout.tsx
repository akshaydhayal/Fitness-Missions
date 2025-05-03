"use client";
// app/layout.tsx
import WalletConnectProvider from "@/components/WalletProvider";
import "./globals.css";
import Navbar from "@/components/Navbar";
import MissionModal from "@/components/MissionModal";
import { useState } from "react";
import { RecoilRoot } from "recoil";

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
          <RecoilRoot>
            <Navbar onCreateMissionClick={() => setIsModalOpen(true)} />
            <MissionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            <main className="p-4">{children}</main>
          </RecoilRoot>
        </WalletConnectProvider>
      </body>
    </html>
  );
}
