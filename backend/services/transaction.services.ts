import TransactionModel from "../models/transaction.model";
import { calculateNextOccurrence } from "../utils/helper";
import { CreateTransactionType } from "../validations/transaction.validation";

export const createTransactionService = async (body: CreateTransactionType, userId: string) => {
    let nextRecurringDate: Date | undefined;
    const currentDate = new Date();

    if (body.isRecurring && body.recurring) {
        const calculatedDate = calculateNextOccurrence(body.date, body.recurring);

        nextRecurringDate = calculatedDate < currentDate 
            ? calculateNextOccurrence(currentDate, body.recurring)
            : calculatedDate
    }

    const transaction = await TransactionModel.create({
        ...body,
        userId,
        category: body.category,
        amount: Number(body.amount),
        isRecurring: body.isRecurring || false,
        recurring: body.recurring || null,
        nextRecurringDate,
        lastProcessed: null
    });
    return transaction;
}