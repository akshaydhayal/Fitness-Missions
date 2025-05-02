import { NextResponse } from "next/server";
import connectMongo from "@/lib/dbConnect";
import Mission from "@/models/missionModel";
import User from "@/models/userModel"; // Import the User model

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectMongo(); // Ensure the DB connection is established

    // Find the mission by its ID and populate the participants.user field
    const mission = await Mission.findById(params.id).populate("participants.user");

    if (!mission) {
      return NextResponse.json({ error: "Mission not found" }, { status: 404 });
    }

    return NextResponse.json({ mission });
  } catch (err) {
    console.error("error in get mission : ", err);
    return NextResponse.json({ error: "Server error", details: err.message }, { status: 500 });
  }
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
