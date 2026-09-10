"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleValidation = handleValidation;
const express_validator_1 = require("express-validator");
const errors_1 = require("../utils/errors");
function handleValidation(req, res, next) {
    const result = (0, express_validator_1.validationResult)(req);
    if (!result.isEmpty()) {
        const errors = result.array().map((e) => ({
            field: 'path' in e ? e.path : undefined,
            message: e.msg,
        }));
        return next(new errors_1.ValidationError('Validation failed', errors));
    }
    next();
}
