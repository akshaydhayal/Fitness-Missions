import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  walletAddress: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  points: { type: Number, default: 0 },
  missionsJoined: [{ type: mongoose.Schema.Types.ObjectId, ref: "MissionModel" }],
});

const UserModel = mongoose.models.UserModel || mongoose.model("UserModel", UserSchema);

export default UserModel;

// import mongoose, { Schema, model, models } from "mongoose";

// const UserSchema = new Schema({
//   walletAddress: { type: String, required: true, unique: true },
//   name: { type: String, required: true },
//   points: { type: Number, default: 0 },
//   missionsJoined: [{ type: mongoose.Schema.Types.ObjectId, ref: "MissionModel" }],
// });

// export default models.UserModel || model("UserModel", UserSchema);
