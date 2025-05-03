// components/Navbar.tsx
"use client";

import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import "@solana/wallet-adapter-react-ui/styles.css";
import NameModal from "./NameModal"; // Import the NameModal component
import { useSetRecoilState } from "recoil";
import { userState } from "@/store/userState";

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
  const { publicKey, connect } = useWallet();
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
  if (publicKey && !walletAddress) {
    const address = publicKey.toString();
    setWalletAddress(address);
    checkUserExists(address);
  }

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
        <WalletMultiButton />
      </div>

      {/* Error Message */}
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}

      {/* Modal for entering user name */}
      <NameModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleRegister} />
    </nav>
  );
}

// // components/Navbar.tsx
// "use client";

// import { useState } from "react";
// import { useWallet } from "@solana/wallet-adapter-react";
// import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
// import "@solana/wallet-adapter-react-ui/styles.css"; // Import the wallet adapter CSS

// const colors = {
//   background: "#121212",
//   text: "#E0E0E0",
//   button: "#4A90E2",
//   buttonHover: "#6AB7E4",
// };

// interface NavbarProps {
//   onCreateMissionClick: () => void;
// }

// export default function Navbar({ onCreateMissionClick }: NavbarProps) {
//   const { publicKey, connected, connect } = useWallet();
//   const [errorMessage, setErrorMessage] = useState("");
//   console.log("pub key :",publicKey);

//       async function checkUserExists(walletAddress) {
//         const response = await fetch("/api/users/login", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ walletAddress:walletAddress }),
//         });
//         const jsonResponse=await response.json();
//         console.log("response 1 : ", jsonResponse);
//         console.log("response 1.2 : ", !jsonResponse.ok);

//         if (!jsonResponse.ok) {
//           // User not found, prompt for a name to register
//           const name = prompt("User not found. Please enter your name:");
//           if (name) {
//             const registerResponse = await fetch("/api/users/register", {
//               method: "POST",
//               headers: {
//                 "Content-Type": "application/json",
//               },
//               body: JSON.stringify({ walletAddress, name }),
//             });
//             const registerJsonResponse=await registerResponse.json();
//             if (registerJsonResponse.ok) {
//               alert("User registered successfully!");
//             } else {
//               const errorData = await registerResponse.json();
//               setErrorMessage(errorData.error || "Error during registration");
//             }
//           }
//         }
//       }

//       if(publicKey){
//           const walletAddress = publicKey.toString();
//           const body={"walletAddress" : walletAddress}
//           checkUserExists(walletAddress);
//     }

//   return (
//     <nav style={{ backgroundColor: colors.background }} className="p-4 flex justify-between items-center">
//       <h1 style={{ color: colors.text }} className="text-2xl font-bold">
//         Fitness Missions
//       </h1>
//       <div className="flex items-center">
//         <button
//           style={{
//             backgroundColor: colors.button,
//             color: colors.background,
//           }}
//           className="py-2 px-4 rounded hover:bg-[#6AB7E4] transition mr-4"
//           onClick={onCreateMissionClick}
//         >
//           Create Mission
//         </button>
//         <WalletMultiButton />
//         {/* <WalletMultiButton onClick={handleWalletConnect} /> */}
//         {/* {errorMessage && <p className="text-red-500">{errorMessage}</p>} */}
//       </div>
//     </nav>
//   );
// }
