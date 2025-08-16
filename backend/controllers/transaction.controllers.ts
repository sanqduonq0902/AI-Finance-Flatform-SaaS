import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/async-handler.middleware";
import { HTTP_STATUS } from "../config/http.config";
import { createTransactionSchema, transactionIdSchema } from "../validations/transaction.validation";
import { createTransactionService, getAllTransactionService, getTransactionByIdService } from "../services/transaction.services";
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