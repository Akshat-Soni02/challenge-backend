import Challenge from "../models/challenge.js";
import moment from "moment";

export const fetchAllEndingChallenges = async () => {
    try {
        const todayStr = new Date().toISOString().split('T')[0];

        const challenges = await Challenge.find({
            status: "active",
            $expr: {
                $eq: [
                    { $dateToString: { format: "%Y-%m-%d", date: "$completeDate" } },
                    todayStr
                ]
            }
        });

        console.log("These are all the challenges", challenges);
        return challenges;
    } catch (error) {
        console.log("Error getting user challenges:", error);
    }
};


export const fetchTodayLog = async (challenge) => {
    try {
        const today = moment().format("YYYY-MM-DD");
  
        // Find today's log entry
        const todayLog = await challenge.logs.find((log) => moment(log.date).format("YYYY-MM-DD") === today);
        return todayLog;
    } catch (error) {
        console.log("Error getting today's log");
    }
}