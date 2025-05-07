import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: "UserModel", required: true },
  authorName: { type: String, required: true },
  authorAvatar: { type: String },
  content: { type: String, required: true },
  image: { type: String },
  timestamp: { type: Date, default: Date.now },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
});

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
    },
  ],
  winner: { type: mongoose.Schema.Types.ObjectId, ref: "UserModel" },
  posts: [PostSchema],
});

const MissionModel = mongoose.models.MissionModel || mongoose.model("MissionModel", MissionSchema);

export default MissionModel;

// import mongoose from "mongoose";

// const MissionSchema = new mongoose.Schema({
//   type: { type: String, enum: ["Walking", "Sleep"], required: true },
//   title: { type: String, required: true },
//   description: { type: String },
//   image: { type: String },
//   deadline: { type: Date, required: true },
//   pointsPerStep: { type: Number }, // For walking mission
//   pointsPerHour: { type: Number }, // For sleep mission
//   creator: { type: mongoose.Schema.Types.ObjectId, ref: "UserModel" },
//   participants: [
//     {
//       user: { type: mongoose.Schema.Types.ObjectId, ref: "UserModel" },
//       records: { date: Date, steps: Number, hoursSlept: Number, points: Number },
//     },
//   ],
//   winner: { type: mongoose.Schema.Types.ObjectId, ref: "UserModel" },
// });

// const MissionModel = mongoose.models.MissionModel || mongoose.model("MissionModel", MissionSchema);

// export default MissionModel;
