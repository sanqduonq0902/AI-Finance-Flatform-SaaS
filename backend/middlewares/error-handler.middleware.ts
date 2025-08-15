import { ErrorRequestHandler } from "express";
import { HTTP_STATUS } from "../config/http.config";

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    console.log('Error occurred on PATH', req.path);
    console.log('Detail error', err);
    
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        message: 'Internal Server Error',
        error: err?.message || 'Unknown error occurred'
    });
}