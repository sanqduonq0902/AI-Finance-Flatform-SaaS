import { addDays, addMonths, addWeeks, addYears, startOfMonth } from "date-fns";
import { RecurringEnum } from "../enums/recurring.enums";

export function calculateNextReportDate(lastSentDate?: Date): Date {
    const now = new Date();
    const lastSent = lastSentDate || now;

    const nextDate = startOfMonth(addMonths(lastSent, 1));
    nextDate.setHours(0,0,0,0);

    console.log(nextDate, 'nextDate');
    return nextDate;
}

export function calculateNextOccurrence(date: Date, recurring: keyof typeof RecurringEnum) {
    const base = new Date(date);
    base.setHours(0,0,0,0);

    switch(recurring){
        case RecurringEnum.DAILY:
            return addDays(base, 1)
        case RecurringEnum.WEEKLY: 
            return addWeeks(base, 1)
        case RecurringEnum.MONTHLY:
            return addMonths(base, 1)
        case RecurringEnum.YEARLY:
            return addYears(base, 1)
        default: 
            return base;
    }
}

export function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toLocaleUpperCase() + string.slice(1).toLowerCase();
}