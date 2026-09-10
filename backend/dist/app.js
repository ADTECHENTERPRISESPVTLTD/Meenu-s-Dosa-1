"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const env_1 = require("./config/env");
const logger_1 = require("./utils/logger");
const errorHandler_1 = require("./middleware/errorHandler");
const healthRoutes_1 = __importDefault(require("./routes/healthRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const menuRoutes_1 = __importDefault(require("./routes/menuRoutes"));
const categoryRoutes_1 = __importDefault(require("./routes/categoryRoutes"));
const locationRoutes_1 = __importDefault(require("./routes/locationRoutes"));
const bookingRoutes_1 = __importDefault(require("./routes/bookingRoutes"));
const settingsRoutes_1 = __importDefault(require("./routes/settingsRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
function createApp() {
    const app = (0, express_1.default)();
    app.disable('x-powered-by');
    app.use((0, helmet_1.default)());
    const allowedOrigins = [env_1.env.frontendUrl, ...env_1.env.additionalAllowedOrigins].filter(Boolean);
    app.use((0, cors_1.default)({
        origin: (origin, callback) => {
            // Allow same-origin/non-browser requests (no Origin header) and configured origins only.
            if (!origin || allowedOrigins.includes(origin)) {
                return callback(null, true);
            }
            logger_1.logger.warn(`Blocked CORS request from origin: ${origin}`);
            return callback(new Error('Not allowed by CORS'));
        },
        credentials: true,
    }));
    app.use(express_1.default.json({ limit: '1mb' }));
    app.use(express_1.default.urlencoded({ extended: true }));
    if (env_1.env.nodeEnv !== 'test') {
        app.use((0, morgan_1.default)(env_1.env.nodeEnv === 'production' ? 'combined' : 'dev', {
            stream: { write: (message) => logger_1.logger.info(message.trim()) },
        }));
    }
    const apiLimiter = (0, express_rate_limit_1.default)({
        windowMs: env_1.env.rateLimitWindowMinutes * 60 * 1000,
        max: env_1.env.rateLimitMaxRequests,
        standardHeaders: true,
        legacyHeaders: false,
        message: {
            success: false,
            message: 'Too many requests, please try again later',
        },
    });
    app.use('/api', apiLimiter);
    const authLimiter = (0, express_rate_limit_1.default)({
        windowMs: 15 * 60 * 1000,
        max: 10,
        standardHeaders: true,
        legacyHeaders: false,
        message: {
            success: false,
            message: 'Too many login attempts, please try again later',
        },
    });
    app.use('/api/admin/auth/login', authLimiter);
    app.use('/api/health', healthRoutes_1.default);
    app.use('/api/admin/auth', authRoutes_1.default);
    app.use('/api/menu', menuRoutes_1.default);
    app.use('/api/categories', categoryRoutes_1.default);
    app.use('/api/locations', locationRoutes_1.default);
    app.use('/api/bookings', bookingRoutes_1.default);
    app.use('/api/settings', settingsRoutes_1.default);
    app.use('/api/admin', adminRoutes_1.default);
    app.use(errorHandler_1.notFoundHandler);
    app.use(errorHandler_1.errorHandler);
    return app;
}
