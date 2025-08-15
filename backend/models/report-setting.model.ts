import mongoose, { Schema } from "mongoose";
import { IReportSetting } from "../interface/report.interface";
import { ReportFrequencyEnum } from "../enums/report.enums";

const reportSettingSchema = new Schema<IReportSetting>({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    frequency: {
        type: String,
        enum: Object.values(ReportFrequencyEnum),
        default: ReportFrequencyEnum.MONTHLY
    },
    isEnabled: {
        type: Boolean,
        default: false
    },
    nextReportDate: {
        type: Date
    }
}, {timestamps: true, collection: 'ReportSetting'});

const ReportSettingModel = mongoose.model<IReportSetting>('ReportSetting', reportSettingSchema);
export default ReportSettingModel;