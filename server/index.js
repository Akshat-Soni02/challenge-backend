import express from "express";
import userRouter from "./routes/user.js";
import challengeRouter from "./routes/challenge.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import { errorMiddleware } from "./middlewares/error.js";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { scheduleCronJobs } from "./service/cronService.js";

dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();
const upload = multer({ storage });


const app = express();
const PORT = process.env.PORT || 3000;
const URI = process.env.MONGO_URI;

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json({ limit: "30mb", extended: true }));

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});

mongoose
  .connect(URI)
  .then(() => console.log("Connected to Database"))
  .catch((err) => console.log(err));


// scheduleCronJobs();

app.use("/api/v1/user", userRouter);
app.use("/api/v1/challenge", challengeRouter);
app.use(errorMiddleware);
export default app;
