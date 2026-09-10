"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const database_1 = require("../config/database");
const router = (0, express_1.Router)();
router.get('/', (_req, res) => {
    res.status(200).json({
        success: true,
        message: 'Meenu\'s Dosa API is running',
        status: 'ok',
        database: (0, database_1.isDatabaseConnected)() ? 'connected' : 'disconnected',
        timestamp: new Date().toISOString(),
    });
});
exports.default = router;
