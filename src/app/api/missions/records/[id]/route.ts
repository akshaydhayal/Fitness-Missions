import { NextResponse } from "next/server";
import connectMongo from "@/lib/dbConnect";
import Mission from "@/models/missionModel";
import User from "@/models/userModel"; // Import the User model

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const { userId, steps, hoursSlept } = await request.json();

  await connectMongo();

  // Find the mission
  const mission = await Mission.findById(params.id).populate({
    path: "participants.user",
    model: User,
    select: "name walletAddress points", // Select the fields you want to include
  });

  if (!mission) {
    return NextResponse.json({ error: "Mission not found" }, { status: 404 });
  }

  // Find the user
  const user = await User.findById(userId);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Check if today's record already exists
  const today = new Date().toISOString().split("T")[0]; // Get current date in YYYY-MM-DD format
  //@ts-expect-error ignote type
  const participant = mission.participants.find((p) => p.user.equals(user._id));

  if (!participant) {
    return NextResponse.json({ error: "User not a participant of the mission" }, { status: 400 });
  }

  console.log("participant: ", participant);
  const existingRecord = new Date(`${participant.records.date}`).toISOString().split("T")[0] === today;
  console.log("existing record", existingRecord);

  if (existingRecord) {
    return NextResponse.json({ error: "You have already submitted your record for today" }, { status: 400 });
  }

  // Calculate points
  const points =
    mission.type == "Walking"
      ? (steps / 1000) * mission.pointsPerStep
      : hoursSlept <= 8
      ? hoursSlept * mission.pointsPerHour
      : 8 * mission.pointsPerHour - mission.pointsPerHour * Math.abs(8 - hoursSlept);
  // hoursSlept == 8? mission.pointsPerHour: (Math.abs(8 - hoursSlept) * mission.pointsPerHour) / 2;

  console.log(
    "mission type",
    mission.type,
    "hours slept",
    hoursSlept,
    "mission points per hour",
    mission.pointsPerHour,
    typeof mission.pointsPerHour,
    "points: ",
    points
  );
  
  participant.records = {
    date: new Date(),
    points: Number(participant.records.points) + Number(points),
  };
  await mission.save();

  return NextResponse.json({ success: true, mission });
}
