import cron from "node-cron";
import { fetchAllEndingChallenges, fetchTodayLog } from "./challengeService.js";
import Challenge from "../models/challenge.js";

export const challengeStateCheck = () => {
    cron.schedule("30 19 * * *", async () => {
        console.log("cron job started");
        const challenges  = await fetchAllEndingChallenges();
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
    });
}

export const scheduleCronJobs = () => {
    challengeStateCheck();
} 