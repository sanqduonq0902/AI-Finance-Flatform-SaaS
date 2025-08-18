import cron from 'node-cron';
import { processRecurringTransactions } from './jobs/transactions.job';

const scheduleJob = (name: string, time: string, job: Function) => {
    console.log(`Scheduling ${name} at ${time}`);

    return cron.schedule(
        time,
        async () => {
            try {
                await job();
                console.log(`${name} completed`);
            } catch (error) {
                console.log(`${name} failed`, error);
            }
        }, 
        {   
            scheduled: true,
            timezone: 'UTC'
        }
    )
}

export const startJob = () => {
    return [
        scheduleJob('Transactions', '5 0 * * *', processRecurringTransactions),
    ]
}

