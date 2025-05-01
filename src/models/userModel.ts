import mongoose, { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
  walletAddress: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  points: { type: Number, default: 0 },
  missionsJoined: [{ type: mongoose.Schema.Types.ObjectId, ref: "Mission" }],
});

export default models.UserModel || model("UserModel", UserSchema);
