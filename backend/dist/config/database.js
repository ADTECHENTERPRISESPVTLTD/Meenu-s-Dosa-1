"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDatabase = connectDatabase;
exports.isDatabaseConnected = isDatabaseConnected;
exports.disconnectDatabase = disconnectDatabase;
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = require("./env");
const logger_1 = require("../utils/logger");
let isConnected = false;
async function connectDatabase() {
    if (isConnected) {
        return;
    }
    if (!env_1.env.mongodbUri) {
        logger_1.logger.error('MONGODB_URI is not set. Refusing to start without a database connection.');
        throw new Error('MONGODB_URI is not configured');
    }
    mongoose_1.default.set('strictQuery', true);
    mongoose_1.default.connection.on('connected', () => {
        isConnected = true;
        logger_1.logger.info('MongoDB connection established');
    });
    mongoose_1.default.connection.on('error', (err) => {
        isConnected = false;
        logger_1.logger.error(`MongoDB connection error: ${err.message}`);
    });
    mongoose_1.default.connection.on('disconnected', () => {
        isConnected = false;
        logger_1.logger.warn('MongoDB disconnected');
    });
    try {
        await mongoose_1.default.connect(env_1.env.mongodbUri, {
            serverSelectionTimeoutMS: 8000,
        });
    }
    catch (err) {
        isConnected = false;
        logger_1.logger.error(`Failed to connect to MongoDB: ${err.message}`);
        throw err;
    }
}
function isDatabaseConnected() {
    return isConnected;
}
async function disconnectDatabase() {
    if (isConnected) {
        await mongoose_1.default.disconnect();
        isConnected = false;
    }
}
