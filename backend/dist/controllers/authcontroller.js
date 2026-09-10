"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.me = exports.login = void 0;
const Admin_1 = require("../models/Admin");
const errorHandler_1 = require("../middleware/errorHandler");
const apiResponse_1 = require("../utils/apiResponse");
const errors_1 = require("../utils/errors");
const jwt_1 = require("../utils/jwt");
exports.login = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { email, password } = req.body;
    const admin = await Admin_1.Admin.findOne({ email: email.toLowerCase() }).select('+password');
    if (!admin || !admin.isActive) {
        throw new errors_1.UnauthorizedError('Invalid email or password');
    }
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
        throw new errors_1.UnauthorizedError('Invalid email or password');
    }
    admin.lastLoginAt = new Date();
    await admin.save();
    const token = (0, jwt_1.signAdminToken)({
        id: admin.id,
        email: admin.email,
        role: admin.role,
    });
    (0, apiResponse_1.sendSuccess)(res, {
        token,
        admin: {
            id: admin.id,
            name: admin.name,
            email: admin.email,
            role: admin.role,
        },
    }, 'Login successful');
});
exports.me = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const admin = await Admin_1.Admin.findById(req.admin?.id);
    if (!admin) {
        throw new errors_1.UnauthorizedError('Account not found');
    }
    (0, apiResponse_1.sendSuccess)(res, {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        lastLoginAt: admin.lastLoginAt,
    });
});
exports.logout = (0, errorHandler_1.asyncHandler)(async (_req, res) => {
    // Stateless JWT: logout is handled client-side by discarding the token.
    // Endpoint exists so the frontend has a consistent, predictable session flow.
    (0, apiResponse_1.sendSuccess)(res, null, 'Logged out successfully');
});
