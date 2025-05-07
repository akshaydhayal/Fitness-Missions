import { NextResponse } from "next/server";
import connectMongo from "@/lib/dbConnect";
import Mission from "@/models/missionModel";
import User from "@/models/userModel"; 

//get mission endpoint
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectMongo(); // Ensure the DB connection is established

    const mission = await Mission.findById(params.id)
      .populate({
        path: "participants.user",
        model: User,
        select: "name walletAddress points",
      })
      .populate({
        path: "creator",
        model: User,
        select: "name walletAddress points",
      });

    if (!mission) {
      return NextResponse.json({ error: "Mission not found" }, { status: 404 });
    }

    return NextResponse.json({ mission });
  } catch (err) {
    console.error("error in get mission : ", err);
    return NextResponse.json({ error: "Server error", details: err }, { status: 500 });
  }
}



//join mission endpoint
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { walletAddress } = await request.json();
    await connectMongo();

    // Find the mission by its ID
    const mission = await Mission.findById(params.id);
    if (!mission) {
      return NextResponse.json({ error: "Mission not found" }, { status: 404 });
    }

    // Find the user by their ID
    const user = await User.findOne({walletAddress:walletAddress});
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user has already joined the mission
    //@ts-expect-error ignote type
    const isUserAlreadyParticipant = mission.participants.some((p) => p.user.equals(user._id));
    if (isUserAlreadyParticipant) {
      return NextResponse.json({ error: "User already joined the mission" }, { status: 400 });
    }
    mission.participants.push({
      user: user._id,
    //   records: { date: new Date("1900-01-01T00:00:00Z"), steps: 0, hoursSlept: 0, points: 0 },
      records: { date: new Date("1900-01-01T00:00:00Z"), points: 0 },
    });
    await mission.save();

    // Update user's missionsJoined (no points added at this stage)
    user.missionsJoined.push(mission._id);
    await user.save();

    // Return the updated mission and user
    return NextResponse.json({ mission, user });
  } catch (err) {
    console.error("Error in joining mission:", err);
    return NextResponse.json({ error: "Server error", details: err }, { status: 500 });
  }
}
