import mongoose, { Schema } from "mongoose";
import { IReport } from "../interface/report.interface";
import { ReportStatusEnum } from "../enums/report.enums";

const reportSchema = new Schema<IReport> ({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    period: {
        type: String,
        required: true
    },
    sentDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: Object.values(ReportStatusEnum),
        default: ReportStatusEnum.PENDING
    }
}, {timestamps: true, collection: 'Report'});

const ReportModel = mongoose.model<IReport>('Report', reportSchema);
export default ReportModel;