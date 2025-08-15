import mongoose from "mongoose";
import { ReportFrequencyEnum, ReportStatusEnum } from "../enums/report.enums";

export interface IReport extends Document {
    userId: mongoose.Types.ObjectId,
    period: string,
    sentDate: Date,
    status: keyof typeof ReportStatusEnum
}

export interface IReportSetting extends Document {
    userId: mongoose.Types.ObjectId,
    frequency: keyof typeof ReportFrequencyEnum,
    isEnabled: boolean,
    nextReportDate?: Date,
    lastSentDate?: Date, 
}