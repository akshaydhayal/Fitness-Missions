import { NextResponse } from "next/server";
import connectMongo from "@/lib/dbConnect";
import Mission from "@/models/missionModel";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  await connectMongo();
  const mission = await Mission.findById(params.id).populate("participants.user");

  if (!mission) {
    return NextResponse.json({ error: "Mission not found" });
  }

  return NextResponse.json({ mission });
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const { userId, steps, hoursSlept } = await request.json();

  await connectMongo();

  const mission = await Mission.findById(params.id);
  if (!mission) {
    return NextResponse.json({ error: "Mission not found" });
  }

  const points =
    mission.type === "Walking"
      ? (steps / 1000) * mission.pointsPerStep
      : hoursSlept === 8
      ? mission.pointsPerHour
      : (Math.abs(8 - hoursSlept) * mission.pointsPerHour) / 2;

  mission.participants.push({
    user: userId,
    records: [{ date: new Date(), steps, hoursSlept, points }],
  });

  await mission.save();

  return NextResponse.json({ mission });
}
