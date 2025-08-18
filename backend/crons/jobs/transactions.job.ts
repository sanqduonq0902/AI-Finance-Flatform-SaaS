import mongoose from "mongoose";
import TransactionModel from "../../models/transaction.model";
import { calculateNextOccurrence } from "../../utils/helper";

export const processRecurringTransactions = async () => {
	const now = new Date();
	let processedCount = 0;
	let failedCount = 0;

	try {
		const transactions = TransactionModel.find({
			isRecurring: true,
			nextRecurringDate: { $lte: now },
		}).cursor();

		console.log("Starting recurring process");

		for await (const tx of transactions) {
			const nextDate = calculateNextOccurrence(
				tx.nextRecurringDate!,
				tx.recurring!
			);

			const session = await mongoose.startSession();
			try {
				await session.withTransaction(
					async () => {
						await TransactionModel.create(
							[
								{
									...tx.toObject(),
									_id: new mongoose.Types.ObjectId(),
									title: `Recurring - ${tx.title}`,
									date: tx.nextRecurringDate,
									isRecurring: false,
									nextRecurringDate: null,
									recurring: null,
									lastProcessed: null,
									createdAt: null,
									updatedAt: null,
								},
							],
							{ session }
						);
						await TransactionModel.updateOne(
							{ _id: tx._id },
							{
								$set: {
									nextRecurringDate: nextDate,
									lastProcessed: now,
								},
							},
							{ session }
						);
					},
					{
						maxCommitTimeMS: 20000,
					}
				);
				processedCount++;
			} catch (error) {
				failedCount++;
				console.log(`Failed recurring tx: ${tx._id}`, error);
			} finally {
				await session.endSession();
			}
		}

		console.log(`Processed: ${processedCount} transactions`);
		console.log(`Failed: ${failedCount} transactions`);

		return {
			success: true,
			processedCount,
			failedCount,
		};
	} catch (error: any) {
        console.log(`Error occur processing transaction`, error);
        return {
            success: false,
            error: error?.message
        }
    }
};
