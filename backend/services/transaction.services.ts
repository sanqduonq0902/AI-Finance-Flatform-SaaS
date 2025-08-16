import { success } from "zod";
import { TransactionTypeEnum } from "../enums/transaction.enums";
import TransactionModel from "../models/transaction.model";
import { NotFoundException } from "../utils/app-error";
import { calculateNextOccurrence } from "../utils/helper";
import { CreateTransactionType, UpdateTransactionType } from "../validations/transaction.validation";

export const createTransactionService = async (
	body: CreateTransactionType,
	userId: string
) => {
	let nextRecurringDate: Date | undefined;
	const currentDate = new Date();

	if (body.isRecurring && body.recurring) {
		const calculatedDate = calculateNextOccurrence(
			body.date,
			body.recurring
		);

		nextRecurringDate =
			calculatedDate < currentDate
				? calculateNextOccurrence(currentDate, body.recurring)
				: calculatedDate;
	}

	const transaction = await TransactionModel.create({
		...body,
		userId,
		category: body.category,
		amount: Number(body.amount),
		isRecurring: body.isRecurring || false,
		recurring: body.recurring || null,
		nextRecurringDate,
		lastProcessed: null,
	});
	return transaction;
};

export const getAllTransactionService = async (
	userId: string,
	filters: {
		keyword?: string;
		type?: keyof typeof TransactionTypeEnum;
		recurringStatus?: "RECURRING" | "NON_RECURRING";
	},
	pagination: {
		pageSize: number;
		pageNumber: number;
	}
) => {
	const { keyword, type, recurringStatus } = filters;

	const filterCondition: Record<string, any> = {
		userId,
	};

	if (keyword) {
		filterCondition.$or = [
			{ title: { $regex: keyword, $options: "i" } },
			{ category: { $regex: keyword, $options: "i" } },
		];
	}

	if (type) {
		filterCondition.type = type;
	}

	if (recurringStatus) {
		if (recurringStatus === "RECURRING") {
			filterCondition.isRecurring = true;
		} else if (recurringStatus === "NON_RECURRING") {
			filterCondition.isRecurring = false;
		}
	}

	const { pageSize, pageNumber } = pagination;
	const skip = (pageNumber - 1) * pageSize;

	const [transactions, totalCount] = await Promise.all([
		TransactionModel.find(filterCondition)
			.skip(skip)
			.limit(pageSize)
			.sort({ createdAt: -1 }),
		TransactionModel.countDocuments(filterCondition),
	]);

	const totalPages = Math.ceil(totalCount / pageSize);

	return {
		transactions,
		pagination: {
			pageSize,
			pageNumber,
			totalCount,
			totalPages,
			skip,
		},
	};
};

export const getTransactionByIdService = async (userId: string, transactionId: string) => {
    const transaction = await TransactionModel.findOne({
        _id: transactionId,
        userId
    })
    if (!transaction) throw new NotFoundException('Transaction not found');
    
    return transaction;
}

export const updateTransactionService = async (userId: string, transactionId: string, body: UpdateTransactionType) => {
    const existingTransaction = await TransactionModel.findOne({
        _id: transactionId,
        userId
    });
    if (!existingTransaction) throw new NotFoundException('Transaction not found');

    const isRecurring = body.isRecurring ?? existingTransaction.isRecurring;
    const date = body.date !== undefined ? new Date(body.date) : existingTransaction.date;
    const recurring = body.recurring || existingTransaction.recurring;

    const now = new Date();
    let nextRecurringDate;
    if (isRecurring && recurring) {
        const calculatedDate = calculateNextOccurrence(date, recurring);

        nextRecurringDate = calculatedDate < now 
            ? calculateNextOccurrence(now, recurring) 
            : calculatedDate
    }
    existingTransaction.set({
        ...(body.title && { title: body.title}),
        ...(body.description && { description: body.description}),
        ...(body.category && { category: body.category}),
        ...(body.type && { type: body.type}),
        ...(body.paymentMethod && { paymentMethod: body.paymentMethod}),
        ...(body.amount != undefined && { amount: Number(body.amount)}),
        date,
        isRecurring,
        recurring,
        nextRecurringDate
    });
    await existingTransaction.save();
    return;
}

export const deleteTransactionService = async (userId: string, transactionId: string) => {
    const transaction = await TransactionModel.findByIdAndDelete({
        _id: transactionId,
        userId
    });
    if (!transaction) throw new NotFoundException('Transaction not found');
    return;
}

export const bulkDeleteTransactionService = async (userId: string, transactionIds: string[]) => {
    const result = await TransactionModel.deleteMany({
        _id: { $in: transactionIds},
        userId
    });
    if (result.deletedCount === 0) throw new NotFoundException('No transactions found');
    
    return {
        success: true,
        deletedCount: result.deletedCount
    }
}

export const bulkTransactionService = async (userId: string, transactions: CreateTransactionType[]) => {
    try {
        const bulkOps = transactions.map((tx) => ({
            insertOne: {
                document: {
                    ...tx,
                    userId,
                    isRecurring: false,
                    nextRecurringDate: null,
                    recurring: null,
                    lastProcessed: null,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            }
        }));

        const result = await TransactionModel.bulkWrite(bulkOps, {
            ordered: true
        })

        return {
            insertedCount: result.insertedCount,
            success: true
        }
    } catch (error) {
        throw error
    }
}