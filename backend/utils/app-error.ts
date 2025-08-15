import { HTTP_STATUS, HttpStatusCodeType } from "../config/http.config";
import { ErrorCodeEnums, ErrorCodeEnumType } from "../enums/error-code.enums";

export class AppError extends Error {
    public statusCode: HttpStatusCodeType;
    public errorCode?: ErrorCodeEnumType;

    constructor(
        message: string,
        statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR,
        errorCode?: ErrorCodeEnumType
    ) {
        super(message);
        this.statusCode = statusCode,
        this.errorCode = errorCode,
        Error.captureStackTrace(this, this.constructor);
    }
}

export class HttpException extends AppError {
    constructor(
        message = 'Http Exception Error',
        statusCode: HttpStatusCodeType,
        errorCode?: ErrorCodeEnumType
    ) {
        super(message, statusCode, errorCode)
    }
}

export class NotFoundException extends AppError {
    constructor(
        message = 'Resource not found',
        errorCode?: ErrorCodeEnumType
    ) {
        super(message, HTTP_STATUS.NOT_FOUND, errorCode || ErrorCodeEnums.RESOURCE_NOT_FOUND)
    }
}

export class BadRequestException extends AppError {
    constructor(
        message = 'Bad Request',
        errorCode?: ErrorCodeEnumType
    ) {
        super(message, HTTP_STATUS.BAD_REQUEST, errorCode || ErrorCodeEnums.VALIDATION_ERROR)
    }
}

export class UnauthorizedException extends AppError {
    constructor(
        message = 'Unauthorized access',
        errorCode?: ErrorCodeEnumType,
    ) {
        super(message, HTTP_STATUS.UNAUTHORIZED, errorCode || ErrorCodeEnums.ACCESS_UNAUTHORIZED)
    }
}

export class InternalServerException extends AppError {
    constructor(
        message = 'Internal Server Error',
        errorCode?: ErrorCodeEnumType
    ) {
        super(message, HTTP_STATUS.INTERNAL_SERVER_ERROR, errorCode || ErrorCodeEnums.INTERNAL_SERVER_ERROR)
    }
}