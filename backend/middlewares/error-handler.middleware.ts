import { ErrorRequestHandler, Response } from "express";
import { HTTP_STATUS } from "../config/http.config";
import z, { ZodError } from "zod";
import { ErrorCodeEnums } from "../enums/error-code.enums";

const formatZodError = (res: Response, error: z.ZodError) => {
    const errors = error?.issues?.map((err) => ({
        field: err.path.join("."),
        message: err.message
    }));
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: 'Validation failed',
        errors: errors,
        errorCode: ErrorCodeEnums.VALIDATION_ERROR
    })
}

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    console.log('Error occurred on PATH', req.path, 'Error:', err);

    if (err instanceof ZodError) {
        return formatZodError(res, err)
    }
    
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        message: 'Internal Server Error',
        error: err?.message || 'Unknown error occurred'
    });
}