import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export default async function connectDb(dbName) {
  const connectionString = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017";

  try {
    await mongoose.connect(connectionString, {
      dbName: dbName,
    });

    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection failed: please setup your mongodb connection string in env variables");
    process.exit(1);
  }
}
