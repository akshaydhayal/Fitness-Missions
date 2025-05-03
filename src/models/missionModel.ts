import mongoose from "mongoose";

const MissionSchema = new mongoose.Schema({
  type: { type: String, enum: ["Walking", "Sleep"], required: true },
  title: { type: String, required: true },
  description: { type: String },
  image: { type: String },
  deadline: { type: Date, required: true },
  pointsPerStep: { type: Number }, // For walking mission
  pointsPerHour: { type: Number }, // For sleep mission
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "UserModel" },
  participants: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "UserModel" },
      records: { date: Date, steps: Number, hoursSlept: Number, points: Number },
    //   records: [{ date: Date, steps: Number, hoursSlept: Number, points: Number }],
    },
  ],
  winner: { type: mongoose.Schema.Types.ObjectId, ref: "UserModel" },
});

const MissionModel = mongoose.models.MissionModel || mongoose.model("MissionModel", MissionSchema);

export default MissionModel;