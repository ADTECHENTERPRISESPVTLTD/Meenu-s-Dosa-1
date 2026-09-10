"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function required(name, fallback) {
    const value = process.env[name] ?? fallback;
    if (value === undefined || value === '') {
        if (process.env.NODE_ENV === 'production') {
            throw new Error(`Missing required environment variable: ${name}`);
        }
        return '';
    }
    return value;
}
exports.env = {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '5000', 10),
    mongodbUri: required('MONGODB_URI'),
    jwtSecret: required('JWT_SECRET'),
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
    seedAdminEmail: process.env.SEED_ADMIN_EMAIL || '',
    seedAdminPassword: process.env.SEED_ADMIN_PASSWORD || '',
    seedAdminName: process.env.SEED_ADMIN_NAME || 'Super Admin',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
    additionalAllowedOrigins: (process.env.ADDITIONAL_ALLOWED_ORIGINS || '')
        .split(',')
        .map((o) => o.trim())
        .filter(Boolean),
    rateLimitWindowMinutes: parseInt(process.env.RATE_LIMIT_WINDOW_MINUTES || '15', 10),
    rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '200', 10),
    whatsapp: {
        phoneNumber: process.env.WHATSAPP_PHONE_NUMBER || '',
        apiToken: process.env.WHATSAPP_API_TOKEN || '',
        apiUrl: process.env.WHATSAPP_API_URL || '',
        businessAccountId: process.env.WHATSAPP_BUSINESS_ACCOUNT_ID || '',
    },
    zomatoUrl: process.env.ZOMATO_URL || '',
    swiggyUrl: process.env.SWIGGY_URL || '',
    trilio: {
        accountSid: process.env.TRILIO_ACCOUNT_SID || '',
        authToken: process.env.TRILIO_AUTH_TOKEN || '',
        fromNumber: process.env.TRILIO_FROM_NUMBER || '',
        apiUrl: process.env.TRILIO_API_URL || '',
    },
};
