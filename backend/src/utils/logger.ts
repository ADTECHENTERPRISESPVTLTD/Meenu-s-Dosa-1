/* eslint-disable no-console */
type LogLevel = 'info' | 'warn' | 'error' | 'debug';

const SENSITIVE_KEYS = ['password', 'token', 'secret', 'authorization', 'jwt', 'apikey', 'api_key'];

function redact(message: string): string {
  let redacted = message;
  for (const key of SENSITIVE_KEYS) {
    const pattern = new RegExp(`(${key}\\s*[:=]\\s*)([^\\s,}"']+)`, 'gi');
    redacted = redacted.replace(pattern, '$1[REDACTED]');
  }
  return redacted;
}

function log(level: LogLevel, message: string) {
  const timestamp = new Date().toISOString();
  const safeMessage = redact(message);
  const line = `[${timestamp}] [${level.toUpperCase()}] ${safeMessage}`;

  if (level === 'error') {
    console.error(line);
  } else if (level === 'warn') {
    console.warn(line);
  } else {
    console.log(line);
  }
}

export const logger = {
  info: (message: string) => log('info', message),
  warn: (message: string) => log('warn', message),
  error: (message: string) => log('error', message),
  debug: (message: string) => {
    if (process.env.NODE_ENV !== 'production') {
      log('debug', message);
    }
  },
};
