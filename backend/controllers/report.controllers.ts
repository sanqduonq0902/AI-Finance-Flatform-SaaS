import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/async-handler.middleware";
import { HTTP_STATUS } from "../config/http.config";
import { getAllReportsService, updateReportSettingService } from "../services/report.services";
import { updateReportSettingSchema } from "../validations/report.validation";

export const getAllReportsController = asyncHandler(
    async (req: Request, res: Response) => {
        const userId = req.user?._id;

        const pagination = {
            pageSize: parseInt(req.params.pageSize) || 20,
            pageNumber: parseInt(req.params.pageNumber) || 1
        }

        const result = await getAllReportsService(userId, pagination);
        return res.status(HTTP_STATUS.OK).json({
            message: 'Reports history fetched successfully',
            result
        })
    }
)

export const updateReportSettingController = asyncHandler(
    async (req: Request, res: Response) => {
        const userId = req.user?._id;
        const body = updateReportSettingSchema.parse(req.body);
        await updateReportSettingService(userId, body);
        return res.status(HTTP_STATUS.OK).json({
            message: 'Reports setting updated successfully'
        })
    }
)