import { startJob } from "./schedules"

export const initializeCrons = async () => {
    try {
        const jobs = startJob();
        console.log(`${jobs.length} cron jobs initialized`);
        return jobs;
    } catch (error) {
        console.log(`Cron init error`, error);
        return [];
    }
}