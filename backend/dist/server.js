"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const database_1 = require("./config/database");
const env_1 = require("./config/env");
const logger_1 = require("./utils/logger");
async function start() {
    try {
        await (0, database_1.connectDatabase)();
    }
    catch (err) {
        logger_1.logger.error('Unable to connect to the database. Server will not start.');
        process.exit(1);
    }
    const app = (0, app_1.createApp)();
    const server = app.listen(env_1.env.port, () => {
        logger_1.logger.info(`Meenu's Dosa API listening on port ${env_1.env.port} (${env_1.env.nodeEnv})`);
    });
    process.on('unhandledRejection', (reason) => {
        logger_1.logger.error(`Unhandled promise rejection: ${reason?.message || reason}`);
    });
    process.on('uncaughtException', (err) => {
        logger_1.logger.error(`Uncaught exception: ${err.message}`);
        server.close(() => process.exit(1));
    });
    process.on('SIGTERM', () => {
        logger_1.logger.info('SIGTERM received, shutting down gracefully');
        server.close(() => process.exit(0));
    });
}
start();
