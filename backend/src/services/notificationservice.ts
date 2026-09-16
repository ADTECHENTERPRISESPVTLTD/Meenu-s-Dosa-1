import { env } from '../config/env';
import { logger } from '../utils/logger';
import { IBooking } from '../models/booking';


interface MessageProvider {
  sendMessage(to: string, body: string): Promise<void>;
}

class TrilioProvider implements MessageProvider {
  async sendMessage(to: string, body: string): Promise<void> {
    if (!env.trilio.accountSid || !env.trilio.authToken || !env.trilio.apiUrl) {
      logger.warn('Trilio credentials are not configured; skipping message send');
      return;
    }

    const auth = Buffer.from(`${env.trilio.accountSid}:${env.trilio.authToken}`).toString('base64');

    const response = await fetch(env.trilio.apiUrl, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        From: env.trilio.fromNumber,
        To: to,
        Body: body,
      }),
    });

    if (!response.ok) {
      logger.error(`Trilio message send failed with status ${response.status}`);
    }
  }
}

class NoopProvider implements MessageProvider {
  async sendMessage(): Promise<void> {
    // No provider configured. Intentionally a no-op rather than a fake success.
  }
}

function resolveProvider(): MessageProvider {
  if (env.trilio.accountSid && env.trilio.authToken) {
    return new TrilioProvider();
  }
  return new NoopProvider();
}

const provider = resolveProvider();

export async function notifyAdminOfBooking(booking: IBooking): Promise<void> {
  const adminNumber = env.whatsapp.phoneNumber;
  if (!adminNumber) {
    logger.debug('No admin WhatsApp number configured; skipping booking notification');
    return;
  }

  const body = `New booking request from ${booking.customerName} for ${booking.guestCount} guest(s) on ${
    booking.date.toISOString().split('T')[0]
  } at ${booking.time}.`;

  try {
    await provider.sendMessage(adminNumber, body);
  } catch (err) {
    logger.error(`Failed to send booking notification: ${(err as Error).message}`);
  }
}

export function getWhatsappClickToChatLink(message = 'Hi, I would like to know more about Meenu\'s Dosa'): string {
  if (!env.whatsapp.phoneNumber) return '';
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${env.whatsapp.phoneNumber}?text=${encoded}`;
}
