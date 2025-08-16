import { z } from "zod";
import { TransactionTypeEnum } from "../enums/transaction.enums";
import { RecurringEnum } from "../enums/recurring.enums";
import { PaymentMethodEnum } from "../enums/payment.enums";

export const transactionIdSchema = z.string().trim().min(1);

export const baseTransactionSchema = z.object({
	title: z
		.string({ error: "Title is required" })
		.min(1, { error: "Too short!" }),
	description: z.string().optional(),
	type: z.enum([TransactionTypeEnum.INCOME, TransactionTypeEnum.EXPENSE], {
		error: () => "Transaction type must either INCOME or EXPENSE",
	}),
	amount: z
		.number("Amount is required")
		.positive("Amount must be positive")
		.min(1),
	category: z.string({ error: "Category is required" }).min(1),
	date: z
		.union([z.iso.date({ error: "Invalid date string" }), z.date()])
		.transform((value) => new Date(value)),
	isRecurring: z.boolean().default(false),
	recurring: z
		.enum([
			RecurringEnum.DAILY,
			RecurringEnum.WEEKLY,
			RecurringEnum.MONTHLY,
			RecurringEnum.YEARLY,
		])
		.nullable()
		.optional(),
	receiptUrl: z.string().optional(),
	paymentMethod: z
		.enum([
			PaymentMethodEnum.CARD,
			PaymentMethodEnum.BANK_TRANSFER,
			PaymentMethodEnum.MOBILE_PAYMENT,
			PaymentMethodEnum.AUTO_DEBIT,
			PaymentMethodEnum.CASH,
			PaymentMethodEnum.OTHER,
		])
		.default(PaymentMethodEnum.CASH),
});

export const bulkDeleteTransactionSchema = z.object({
	transactionIds: z
		.array(z.string().length(24, "Invalid transaction ID format"))
		.min(1, "At least one transaction ID must be provided"),
});

export const bulkTransactionSchema = z.object({
	transactions: z
		.array(baseTransactionSchema)
		.min(1, "At least one transaction must be provided")
		.max(300, "Must not be more than 300 transactions")
		.refine(
			(txs) =>
				txs.every((tx) => {
					const amount = Number(tx.amount);
					return (
						!isNaN(amount) && amount > 0 && amount <= 1_000_0000_000
					);
				}),
			{
				error: "Amount must be a positive number",
			}
		),
});

export const createTransactionSchema = baseTransactionSchema;
export const updateTransactionSchema = baseTransactionSchema.partial();

export type CreateTransactionType = z.infer<typeof createTransactionSchema>;
export type UpdateTransactionType = z.infer<typeof updateTransactionSchema>;
export type BulkDeleteTransactionType = z.infer<
	typeof bulkDeleteTransactionSchema
>;
