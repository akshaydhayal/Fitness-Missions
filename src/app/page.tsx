"use client";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import connectMongo from "../lib/mongodb";
import MissionModel from "../models/missionModel";

export default function Home({ missions }) {
  const [walletConnected, setWalletConnected] = useState(false);

  const connectWallet = () => {
    // Wallet connection logic goes here
    setWalletConnected(true);
  };

  return (
    <div className="min-h-screen bg-dark text-gray-300">
      <Navbar connectWallet={connectWallet} />
      <main className="container mx-auto py-10">
        <h1 className="text-3xl font-bold text-neonGreen mb-8">Live Missions</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {missions.map((mission) => (
            <div key={mission._id} className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <img src={mission.image} alt={mission.title} className="w-full h-40 object-cover rounded-md" />
              <h2 className="text-xl font-semibold text-neonBlue mt-4">{mission.title}</h2>
              <p className="mt-2 text-gray-400">{mission.description}</p>
              <button className="mt-4 bg-neonGreen text-dark py-2 px-4 rounded">Join Mission</button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export async function getServerSideProps() {
  await connectMongo();
  const missions = await Mission.find({ deadline: { $gt: new Date() } });
  return { props: { missions: JSON.parse(JSON.stringify(missions)) } };
}
