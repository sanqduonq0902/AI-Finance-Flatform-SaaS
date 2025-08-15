import mongoose, { Schema } from "mongoose";
import { ITransaction } from "../interface/transaction.interface";
import { TransactionStatusEnum, TransactionTypeEnum } from "../enums/transaction.enums";
import { convertToCents, convertToDollarUnit } from "../utils/format-currency";
import { RecurringEnum } from "../enums/recurring.enums";
import { PaymentMethodEnum } from "../enums/payment.enums";

const transactionSchema = new Schema<ITransaction>({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    title: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: Object.values(TransactionTypeEnum),
        required: true
    },
    amount: {
        type: Number,
        required: true,
        set: (value: number) => convertToCents(value),
        get: (value: number) => convertToDollarUnit(value)
    },
    description: {
        type: String
    },
    category: {
        type: String,
        required: true
    },
    receiptUrl: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    },
    isRecurring: {
        type: Boolean,
        default: false
    },
    recurring: {
        type: String,
        enum: Object.values(RecurringEnum),
        default: null
    },
    nextRecurringDate: {
        type: Date,
        default: null
    },
    lastProcessed: {
        type: Date,
        default: null
    },
    status: {
        type: String,
        enum: Object.values(TransactionStatusEnum),
        default: TransactionStatusEnum.COMPLETED
    },
    paymentMethod: {
        type: String,
        enum: Object.values(PaymentMethodEnum),
        default: PaymentMethodEnum.CASH
    }
}, {timestamps: true, collection: 'Transaction', 
    toJSON: {virtuals: true, getters: true}, 
    toObject: {virtuals: true, getters: true
    }
});

const TransactionModel = mongoose.model<ITransaction>('Transaction', transactionSchema);
export default TransactionModel;