import ReportModel from "../models/report.model";

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