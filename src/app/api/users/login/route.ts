// app/api/users/login/route.js
import dbConnect from "@/lib/dbConnect"; // Ensure you have a function to connect to your MongoDB
import User from "@/models/userModel"; // Import the User model
import { NextRequest } from "next/server";

export async function POST(req:NextRequest) {
  try {
    await dbConnect(); // Connect to the database
    const { walletAddress } = await req.json();
    // Check if user exists
    const user = await User.findOne({ walletAddress });
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: "User logged in successfully", user }), { status: 200 });
  }catch (err) {
    console.log("err in login user : ", err);
    return new Response(JSON.stringify({ message: "Err", err: err }), { status: 501 });
  }
}
