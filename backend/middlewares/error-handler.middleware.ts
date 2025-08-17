import { ErrorRequestHandler, Response } from "express";
import { HTTP_STATUS } from "../config/http.config";
import z, { ZodError } from "zod";
import { ErrorCodeEnums } from "../enums/error-code.enums";
import { MulterError } from "multer";

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

const handleMulterError = (err: MulterError) => {
    const message = {
        LIMIT_UNEXPECTED_FILE: "Invalid file field name. Please use 'file'",
        LIMIT_FILE_SIZE: 'File size exceed the limit',
        LIMIT_FILE_COUNT: 'Too many files uploaded',
        default: 'File upload error'
    }

    return {
        status: HTTP_STATUS.BAD_REQUEST,
        message: message[err.code as keyof typeof message] || message.default,
        error: err.message
    }
}

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    console.log('Error occurred on PATH', req.path, 'Error:', err);

    if (err instanceof ZodError) {
        return formatZodError(res, err)
    }
     
    if (err instanceof MulterError) {
        const { status, message, error } = handleMulterError(err);
        return res.status(status).json({
            message, 
            error,
            errorCode: ErrorCodeEnums.FILE_UPLOAD_ERROR
        })
    }

    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        message: 'Internal Server Error',
        error: err?.message || 'Unknown error occurred'
    });
}