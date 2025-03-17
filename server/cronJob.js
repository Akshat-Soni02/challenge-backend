import mongoose from "mongoose";
import dotenv from "dotenv";
import { fetchAllEndingChallenges, fetchTodayLog } from "./service/challengeService.js";
import Challenge from "./models/challenge.js";

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("MongoDB connected for cron job...");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
};

const challengeStateCheck = async () => {
    console.log("Running Render Cron Job...");

    await connectDB();
    const challenges = await fetchAllEndingChallenges();

    for (const challenge of challenges) {
        try {
            const todayLog = await fetchTodayLog(challenge);
            const newStatus = todayLog ? "completed" : "failed";
            await Challenge.findByIdAndUpdate(challenge._id, { status: newStatus });
            console.log(`Updated challenge ${challenge._id} to ${newStatus}`);
        } catch (error) {
            console.error("Error updating challenge:", error);
        }
    }

    console.log("Cron job completed!");
    process.exit(0);
};

challengeStateCheck();
