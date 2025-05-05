import { NextResponse } from "next/server";
import connectMongo from "@/lib/dbConnect";
import Mission from "@/models/missionModel";
import User from "@/models/userModel"; // Import the User model

export async function POST(request: Request) {
  const { title, type, description, deadline, pointsPerStep,image, pointsPerHour,creator } = await request.json();
  console.log(title,"inside the post missions");
  await connectMongo();

  const newMission = new Mission({
    title,
    type,
    description,
    image,
    creator,
    deadline,
    pointsPerStep,
    pointsPerHour,
    // participants: [],
    participants: [{
      user: creator,
      records: { date: new Date("1900-01-01T00:00:00Z"), points: 0 },
    }],
  });

  try {
    const mission = await newMission.save();
    return NextResponse.json({ mission });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Mission creation failed",err:error });
  }
}

export async function GET() {
  await connectMongo();
  const liveMissions = await Mission.find({ deadline: { $gte: new Date() } }).populate({
    path: "creator",
    model: User,
    select: "name walletAddress points",
  });;
  const completedMissions = await Mission.find({ deadline: { $lt: new Date() } });

  return NextResponse.json({ liveMissions, completedMissions });
}
