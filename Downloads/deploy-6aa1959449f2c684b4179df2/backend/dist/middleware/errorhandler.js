"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = notFoundHandler;
exports.errorHandler = errorHandler;
exports.asyncHandler = asyncHandler;
const errors_1 = require("../utils/errors");
const logger_1 = require("../utils/logger");
function notFoundHandler(req, res) {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.originalUrl}`,
    });
}
function errorHandler(err, req, res, 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
next) {
    let statusCode = 500;
    let message = 'Internal server error';
    let errors;
    if (err instanceof errors_1.ValidationError) {
        statusCode = err.statusCode;
        message = err.message;
        errors = err.errors;
    }
    else if (err instanceof errors_1.AppError) {
        statusCode = err.statusCode;
        message = err.message;
    }
    else if (err.name === 'CastError') {
        statusCode = 400;
        message = 'Invalid identifier supplied';
    }
    else if (err.name === 'ValidationError') {
        statusCode = 422;
        message = 'Validation failed';
    }
    else if (err.code === 11000) {
        statusCode = 409;
        message = 'Duplicate record already exists';
    }
    if (statusCode >= 500) {
        logger_1.logger.error(`${req.method} ${req.originalUrl} -> ${err.message}\n${err.stack || ''}`);
    }
    else {
        logger_1.logger.warn(`${req.method} ${req.originalUrl} -> ${statusCode} ${message}`);
    }
    res.status(statusCode).json({
        success: false,
        message,
        ...(errors ? { errors } : {}),
    });
}
function asyncHandler(fn) {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
}
