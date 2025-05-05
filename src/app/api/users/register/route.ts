// app/api/users/register/route.js
import dbConnect from "@/lib/dbConnect"; // Ensure you have a function to connect to your MongoDB
import User from "@/models/userModel"; // Import the User model
import { NextRequest } from "next/server";

export async function POST(req:NextRequest) {
    try{   
        await dbConnect(); // Connect to the database
        const { walletAddress, name } = await req.json();
        
        // Check if user already exists
        const existingUser = await User.findOne({ walletAddress });
        if (existingUser) {
            return new Response(JSON.stringify({ error: "User already registered" }), { status: 400 });
            }
        
        // Create new user
        const newUser = new User({ walletAddress, name });
        await newUser.save();
        
        return new Response(JSON.stringify({ message: "User registered successfully" }), { status: 201 });
    }catch(err){
        console.log("err in register user : ",err);
        return new Response(JSON.stringify({ message: "Err",err:err }), { status: 501 });
    }
}
