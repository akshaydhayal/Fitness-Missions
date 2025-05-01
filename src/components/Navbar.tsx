import { useState } from "react";

const Navbar = ({ connectWallet }) => {
  return (
    <nav className="bg-dark p-4">
      <div className="container mx-auto flex justify-between">
        <h1 className="text-neonBlue text-xl">Fitness Missions</h1>
        <button onClick={connectWallet} className="bg-neonGreen text-dark py-2 px-4 rounded">
          Connect Wallet
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
