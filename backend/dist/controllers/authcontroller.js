"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.me = exports.login = void 0;
const admin_1 = require("../models/admin");
const errorhandler_1 = require("../middleware/errorhandler");
const apiresponse_1 = require("../utils/apiresponse");
const errors_1 = require("../utils/errors");
const jwt_1 = require("../utils/jwt");
exports.login = (0, errorhandler_1.asyncHandler)(async (req, res) => {
    const { email, password } = req.body;
    const admin = await admin_1.Admin.findOne({ email: email.toLowerCase() }).select('+password');
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
    (0, apiresponse_1.sendSuccess)(res, {
        token,
        admin: {
            id: admin.id,
            name: admin.name,
            email: admin.email,
            role: admin.role,
        },
    }, 'Login successful');
});
exports.me = (0, errorhandler_1.asyncHandler)(async (req, res) => {
    const admin = await admin_1.Admin.findById(req.admin?.id);
    if (!admin) {
        throw new errors_1.UnauthorizedError('Account not found');
    }
    (0, apiresponse_1.sendSuccess)(res, {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        lastLoginAt: admin.lastLoginAt,
    });
});
exports.logout = (0, errorhandler_1.asyncHandler)(async (_req, res) => {
    // Stateless JWT: logout is handled client-side by discarding the token.
    // Endpoint exists so the frontend has a consistent, predictable session flow.
    (0, apiresponse_1.sendSuccess)(res, null, 'Logged out successfully');
});
