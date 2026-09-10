"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signAdminToken = signAdminToken;
exports.verifyAdminToken = verifyAdminToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
function signAdminToken(payload) {
    return jsonwebtoken_1.default.sign(payload, env_1.env.jwtSecret, { expiresIn: env_1.env.jwtExpiresIn });
}
function verifyAdminToken(token) {
    return jsonwebtoken_1.default.verify(token, env_1.env.jwtSecret);
}
