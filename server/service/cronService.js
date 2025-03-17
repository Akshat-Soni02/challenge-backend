import cron from "node-cron";
import { fetchAllEndingChallenges, fetchTodayLog } from "./challengeService.js";
import Challenge from "../models/challenge.js";

export const challengeStateCheck = () => {
    cron.schedule("0 0 * * *", async () => {
        console.log("cron job started");
        const challenges  = await fetchAllEndingChallenges();
        challenges.forEach( async(challenge) => {
            try {
                const todayLog = await fetchTodayLog(challenge);
                if(!todayLog) await Challenge.findByIdAndUpdate(challenge._id, {status: "failed"});
                else await Challenge.findByIdAndUpdate(challenge._id, {status: "completed"});
                console.log("Successfully updated ending challenges");
            } catch (error) {
                console.log("Error updating ending challenge");
            }
        })
    });
}

export const scheduleCronJobs = () => {
    challengeStateCheck();
} 