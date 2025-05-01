import mongoose from "mongoose";

const connectMongo = async () => {
  if (mongoose.connections[0].readyState) return; // Check if already connected
  await mongoose.connect(process.env.MONGO_URI || "");
  console.log("MongoDB Connected");
};

export default connectMongo;
