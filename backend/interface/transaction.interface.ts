import mongoose from "mongoose";
import { TransactionStatusEnum, TransactionTypeEnum } from "../enums/transaction.enums";
import { RecurringEnum } from "../enums/recurring.enums";
import { PaymentMethodEnum } from "../enums/payment.enums";

export interface ITransaction extends Document {
    userId: mongoose.Types.ObjectId,
    type: keyof typeof TransactionTypeEnum,
    title: string,
    amount: number,
    category: string,
    receiptUrl?: string,
    recurring?: keyof typeof RecurringEnum,
    nextRecurringDate?: Date,
    lastProcessed?: Date,
    isRecurring: boolean,
    description?: string,
    date: Date,
    status: keyof typeof TransactionStatusEnum,
    paymentMethod: keyof typeof PaymentMethodEnum
}

