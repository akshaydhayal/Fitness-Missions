import mongoose, { Schema, model, models } from "mongoose";

const MissionSchema = new Schema({
  type: { type: String, enum: ["Walking", "Sleep"], required: true },
  title: { type: String, required: true },
  description: { type: String },
  image: { type: String },
  deadline: { type: Date, required: true },
  pointsPerStep: { type: Number }, // For walking mission
  pointsPerHour: { type: Number }, // For sleep mission
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  participants: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      records: [{ date: Date, steps: Number, hoursSlept: Number, points: Number }],
    },
  ],
  winner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

export default models.MissionModel || model("MissionModel", MissionSchema);
