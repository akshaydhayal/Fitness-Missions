import { NextResponse } from "next/server";
import connectMongo from "@/lib/dbConnect";
import Mission from "@/models/missionModel";

export async function POST(request: Request) {
  const { title, type, description, deadline, pointsPerStep,image, pointsPerHour } = await request.json();
  console.log(title,"inside the post missions");
  await connectMongo();

  const newMission = new Mission({
    title,
    type,
    description,
    image,
    deadline,
    pointsPerStep,
    pointsPerHour,
    participants: [],
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
  const liveMissions = await Mission.find({ deadline: { $gte: new Date() } });
  const completedMissions = await Mission.find({ deadline: { $lt: new Date() } });

  return NextResponse.json({ liveMissions, completedMissions });
}
