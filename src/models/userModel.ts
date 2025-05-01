// models/User.js
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  walletAddress: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  points: { type: Number, default: 0 },
  missionsJoined: [{ type: mongoose.Schema.Types.ObjectId, ref: "Mission" }],
});

export default mongoose.models.UserModel || mongoose.model("UserModel", UserSchema);
