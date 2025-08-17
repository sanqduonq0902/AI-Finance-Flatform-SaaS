import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/async-handler.middleware";
import { HTTP_STATUS } from "../config/http.config";
import { bulkDeleteTransactionSchema, bulkTransactionSchema, createTransactionSchema, transactionIdSchema, updateTransactionSchema } from "../validations/transaction.validation";
import { bulkDeleteTransactionService, bulkTransactionService, createTransactionService, deleteTransactionService, getAllTransactionService, getTransactionByIdService, scanReceiptService, updateTransactionService } from "../services/transaction.services";
import { TransactionTypeEnum } from "../enums/transaction.enums";

export const createTransactionController = asyncHandler(
    async (req: Request, res: Response) => {
        const body = createTransactionSchema.parse(req.body);
        const userId = req.user?._id;

        const transaction = await createTransactionService(body, userId);
        return res.status(HTTP_STATUS.CREATED).json({
            message: 'Transaction created successfully',
            transaction
        })
    }
)

export const getAllTransactionController = asyncHandler(
    async (req: Request, res: Response) => {
        const userId = req.user?._id;

        const filters = {
            keyword: req.query.keyword as string | undefined,
            type: req.query.type as keyof typeof TransactionTypeEnum | undefined,
            recurringStatus: req.query.recurringStatus as 
                | 'RECURRING'
                | 'NON_RECURRING'
                | undefined
        };

        const pagination = {
            pageSize: parseInt(req.query.pageSize as string) || 20,
            pageNumber: parseInt(req.query.pageNumber as string) || 1
        };

        const data = await getAllTransactionService(userId, filters, pagination);
        return res.status(HTTP_STATUS.OK).json({
            message: 'Transaction fetched successfully',
            data
        })
    }
)

export const getTransactionByIdController = asyncHandler(
    async (req: Request, res: Response) => {
        const userId = req.user?._id;
        const transactionId = transactionIdSchema.parse(req.params.id)

        const transaction = await getTransactionByIdService(userId, transactionId);
        return res.status(HTTP_STATUS.OK).json({
            message: 'Transaction fetched successfully',
            transaction
        })
    }
)

export const updateTransactionController = asyncHandler(
    async (req: Request, res: Response) => {
        const userId = req.user?._id;
        const transactionId = transactionIdSchema.parse(req.params.id);

        const body = updateTransactionSchema.parse(req.body);
        await updateTransactionService(userId, transactionId, body);
        return res.status(HTTP_STATUS.OK).json({
            message: 'Transaction updated successfully'
        })

    }
)

export const deleteTransactionController = asyncHandler(
    async (req: Request, res: Response) => {
        const userId = req.user?._id;
        const transactionId = transactionIdSchema.parse(req.params.id);

        await deleteTransactionService(userId, transactionId);
        return res.status(HTTP_STATUS.OK).json({
            message: 'Transaction deleted successfully'
        })
    }
)

export const bulkDeleteTransactionController = asyncHandler(
    async (req: Request, res: Response) => {
        const userId = req.user?._id;
        const { transactionIds } = bulkDeleteTransactionSchema.parse(req.body);

        const result = await bulkDeleteTransactionService(userId, transactionIds);
        return res.status(HTTP_STATUS.OK).json({
            message: 'Transaction deleted successfully',
            result
        })
    }
)

export const bulkTransactionController = asyncHandler(
    async (req: Request, res: Response) => {
        const userId = req.user?._id;

        const { transactions } = bulkTransactionSchema.parse(req.body);

        const result = await bulkTransactionService(userId, transactions);
        return res.status(HTTP_STATUS.OK).json({
            message: 'Bulk transaction inserted successfully',
            result
        })
    }
)

export const scanReceiptController = asyncHandler(
    async (req: Request, res: Response) => {
        const file = req?.file;

        const result = await scanReceiptService(file);
        return res.status(HTTP_STATUS.OK).json({
            message: 'Receipt scanned successfully',
            data: result
        })
    }
)