"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notifyAdminOfBooking = notifyAdminOfBooking;
exports.getWhatsappClickToChatLink = getWhatsappClickToChatLink;
const env_1 = require("../config/env");
const logger_1 = require("../utils/logger");
class TrilioProvider {
    async sendMessage(to, body) {
        if (!env_1.env.trilio.accountSid || !env_1.env.trilio.authToken || !env_1.env.trilio.apiUrl) {
            logger_1.logger.warn('Trilio credentials are not configured; skipping message send');
            return;
        }
        const auth = Buffer.from(`${env_1.env.trilio.accountSid}:${env_1.env.trilio.authToken}`).toString('base64');
        const response = await fetch(env_1.env.trilio.apiUrl, {
            method: 'POST',
            headers: {
                Authorization: `Basic ${auth}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                From: env_1.env.trilio.fromNumber,
                To: to,
                Body: body,
            }),
        });
        if (!response.ok) {
            logger_1.logger.error(`Trilio message send failed with status ${response.status}`);
        }
    }
}
class NoopProvider {
    async sendMessage() {
        // No provider configured. Intentionally a no-op rather than a fake success.
    }
}
function resolveProvider() {
    if (env_1.env.trilio.accountSid && env_1.env.trilio.authToken) {
        return new TrilioProvider();
    }
    return new NoopProvider();
}
const provider = resolveProvider();
async function notifyAdminOfBooking(booking) {
    const adminNumber = env_1.env.whatsapp.phoneNumber;
    if (!adminNumber) {
        logger_1.logger.debug('No admin WhatsApp number configured; skipping booking notification');
        return;
    }
    const body = `New booking request from ${booking.customerName} for ${booking.guestCount} guest(s) on ${booking.date.toISOString().split('T')[0]} at ${booking.time}.`;
    try {
        await provider.sendMessage(adminNumber, body);
    }
    catch (err) {
        logger_1.logger.error(`Failed to send booking notification: ${err.message}`);
    }
}
function getWhatsappClickToChatLink(message = 'Hi, I would like to know more about Meenu\'s Dosa') {
    if (!env_1.env.whatsapp.phoneNumber)
        return '';
    const encoded = encodeURIComponent(message);
    return `https://wa.me/${env_1.env.whatsapp.phoneNumber}?text=${encoded}`;
}
