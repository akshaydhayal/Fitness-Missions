import { NextResponse } from "next/server";
import connectMongo from "@/lib/dbConnect";
import Mission from "@/models/missionModel";
import User from "@/models/userModel"; // Import the User model

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectMongo(); // Ensure the DB connection is established

    // Find the mission by its ID and populate the participants.user field
    // const mission = await Mission.findById(params.id).populate("participants.user");
    // const mission = await Mission.findById(params.id);
    
     const mission = await Mission.findById(params.id).populate({
       path: "participants.user",
       model: User,
       select: "name walletAddress points", // Select the fields you want to include
     });

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



// export async function POST(request: Request, { params }: { params: { id: string } }) {
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    // Parse request data (userId)
    const { userId,walletAddress } = await request.json();

    // Connect to MongoDB
    await connectMongo();

    // Find the mission by its ID
    const mission = await Mission.findById(params.id);
    if (!mission) {
      return NextResponse.json({ error: "Mission not found" }, { status: 404 });
    }

    // Find the user by their ID
    // const user = await User.findById(userId);
    const user = await User.findOne({walletAddress:walletAddress});
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user has already joined the mission
    const isUserAlreadyParticipant = mission.participants.some((p) => p.user.equals(user._id));
    if (isUserAlreadyParticipant) {
      return NextResponse.json({ error: "User already joined the mission" }, { status: 400 });
    }

    // Add user as a participant in the mission without any points initially
    mission.participants.push({
      user: user._id,
      records: [{ date: new Date(), steps: 0, hoursSlept: 0, points: 0 }],
    });

    // Save the updated mission
    await mission.save();

    // Update user's missionsJoined (no points added at this stage)
    user.missionsJoined.push(mission._id);
    await user.save();

    // Return the updated mission and user
    return NextResponse.json({ mission, user });
  } catch (err) {
    console.error("Error in joining mission:", err);
    return NextResponse.json({ error: "Server error", details: err.message }, { status: 500 });
  }
}
