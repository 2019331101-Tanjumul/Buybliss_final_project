import mongoose from "mongoose";

export async function connectDB() {
  try {
    const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}`);
    console.log(`\n MongoDB connected!! DB HOST: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection Error:", error);
    process.exit(1);
  }
};