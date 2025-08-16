import { TransactionTypeEnum } from "../enums/transaction.enums";
import TransactionModel from "../models/transaction.model";
import { calculateNextOccurrence } from "../utils/helper";
import { CreateTransactionType } from "../validations/transaction.validation";

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
