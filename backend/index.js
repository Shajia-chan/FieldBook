import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./lib/connectDB.js";
import fieldRouter from "./routes/field.route.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Routes
app.use("/fields", fieldRouter);

app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server is running on port ${PORT}`);
});
