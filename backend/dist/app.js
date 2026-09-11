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
const errorhandler_1 = require("./middleware/errorhandler");
const healthroutes_1 = __importDefault(require("./routes/healthroutes"));
const authroutes_1 = __importDefault(require("./routes/authroutes"));
const menuroutes_1 = __importDefault(require("./routes/menuroutes"));
const categoryroutes_1 = __importDefault(require("./routes/categoryroutes"));
const locationroutes_1 = __importDefault(require("./routes/locationroutes"));
const bookingroutes_1 = __importDefault(require("./routes/bookingroutes"));
const orderroutes_1 = __importDefault(require("./routes/orderroutes"));
const settingsroutes_1 = __importDefault(require("./routes/settingsroutes"));
const adminroutes_1 = __importDefault(require("./routes/adminroutes"));
function createApp() {
    const app = (0, express_1.default)();
    app.disable('x-powered-by');
    app.use((0, helmet_1.default)());
    const allowedOrigins = [env_1.env.frontendUrl, ...env_1.env.additionalAllowedOrigins].filter(Boolean);
    app.use((0, cors_1.default)({
        origin: (origin, callback) => {
            // Allow same-origin/non-browser requests and configured/localhost origins.
            if (!origin || allowedOrigins.includes(origin) || origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
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
    app.use('/api/health', healthroutes_1.default);
    app.use('/api/admin/auth', authroutes_1.default);
    app.use('/api/menu', menuroutes_1.default);
    app.use('/api/categories', categoryroutes_1.default);
    app.use('/api/locations', locationroutes_1.default);
    app.use('/api/bookings', bookingroutes_1.default);
    app.use('/api/orders', orderroutes_1.default);
    app.use('/api/settings', settingsroutes_1.default);
    app.use('/api/admin', adminroutes_1.default);
    app.use(errorhandler_1.notFoundHandler);
    app.use(errorhandler_1.errorHandler);
    return app;
}
