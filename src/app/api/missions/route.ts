import { NextResponse } from "next/server";
import connectMongo from "@/lib/dbConnect";
import Mission from "@/models/missionModel";

export async function POST(request: Request) {
  const { title, type, description, deadline, pointsPerStep, pointsPerHour } = await request.json();

  await connectMongo();

  const newMission = new Mission({
    title,
    type,
    description,
    deadline,
    pointsPerStep,
    pointsPerHour,
    participants: [],
  });

  try {
    const mission = await newMission.save();
    return NextResponse.json({ mission });
  } catch (error) {
    return NextResponse.json({ error: "Mission creation failed" });
  }
}

export async function GET() {
  await connectMongo();
  const liveMissions = await Mission.find({ deadline: { $gte: new Date() } });
  const completedMissions = await Mission.find({ deadline: { $lt: new Date() } });

  return NextResponse.json({ liveMissions, completedMissions });
}
