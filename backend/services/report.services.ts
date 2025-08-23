import ReportSettingModel from "../models/report-setting.model";
import ReportModel from "../models/report.model";
import { NotFoundException } from "../utils/app-error";
import { calculateNextReportDate } from "../utils/helper";
import { UpdateReportSettingType } from "../validations/report.validation";

export const getAllReportsService = async (userId: string, pagination: {
    pageSize: number, 
    pageNumber: number
}) => {
    const { pageSize, pageNumber } = pagination;
    const query: Record<string, string> = { userId };
    const skip = (pageNumber - 1) * pageSize;

    const [reports, totalCount] = await Promise.all([
        ReportModel.find(query).skip(skip).limit(pageSize).sort({createdAt: -1}),
        ReportModel.countDocuments(query)
    ]);

    const totalPages = Math.ceil(totalCount / pageSize);

    return {
        reports, 
        pagination: {
            pageSize,
            pageNumber,
            totalCount,
            totalPages,
            skip
        }
    }
}

export const updateReportSettingService = async (userId: string, body: UpdateReportSettingType) => {
    const { isEnabled } = body;
    let nextReportDate = null;

    const existingReport = await ReportSettingModel.findOne({
        userId
    });

    if (!existingReport) throw new NotFoundException('Report setting not found');

    if (isEnabled) {
        const currentNextReportDate = existingReport.nextReportDate;
        const now = new Date();
        if (!currentNextReportDate || currentNextReportDate <= now) {
            nextReportDate = calculateNextReportDate(
                existingReport.lastSentDate
            )
        } else {
            nextReportDate = currentNextReportDate
        }
    }
    console.log(nextReportDate, 'nextReportDate');
    existingReport.set({
        ...body,
        nextReportDate
    })
    await existingReport.save();
}