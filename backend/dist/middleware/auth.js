"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAdminAuth = void 0;
exports.requireRole = requireRole;
const admin_1 = require("../models/admin");
const errors_1 = require("../utils/errors");
const jwt_1 = require("../utils/jwt");
const errorhandler_1 = require("./errorhandler");
exports.requireAdminAuth = (0, errorhandler_1.asyncHandler)(async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new errors_1.UnauthorizedError('Authentication token is missing');
    }
    const token = authHeader.split(' ')[1];
    let payload;
    try {
        payload = (0, jwt_1.verifyAdminToken)(token);
    }
    catch {
        throw new errors_1.UnauthorizedError('Invalid or expired authentication token');
    }
    const admin = await admin_1.Admin.findById(payload.id);
    if (!admin || !admin.isActive) {
        throw new errors_1.UnauthorizedError('Account no longer has access');
    }
    req.admin = payload;
    next();
});
function requireRole(...roles) {
    return (req, res, next) => {
        if (!req.admin || !roles.includes(req.admin.role)) {
            return next(new errors_1.ForbiddenError('You do not have permission to perform this action'));
        }
        next();
    };
}
