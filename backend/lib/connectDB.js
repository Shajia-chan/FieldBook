import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://Shajia2:Shajia33@football.tqga4wh.mongodb.net/?appName=Football");
    console.log("MongoDB is connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
};

export default connectDB;