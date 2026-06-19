import path from 'node:path';
import 'dotenv/config';

function readInt(value: string | undefined, fallback: number): number {
  if (!value) return fallback;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function readCorsOrigins(value: string | undefined): string[] {
  return (value || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}

function readBool(value: string | undefined, fallback: boolean): boolean {
  if (!value) return fallback;
  return ['1', 'true', 'yes', 'on'].includes(value.toLowerCase());
}

export const config = {
  env: process.env.NODE_ENV || 'development',
  host: process.env.HOST || '127.0.0.1',
  port: readInt(process.env.PORT, 3001),
  corsOrigins: readCorsOrigins(process.env.CORS_ORIGIN),
  databaseUrl: process.env.DATABASE_URL || '',
  documentsPrivateDir:
    process.env.DOCUMENTS_PRIVATE_DIR || path.resolve(process.cwd(), 'storage', 'private'),
  smtpHost: process.env.SMTP_HOST || '',
  smtpPort: readInt(process.env.SMTP_PORT, 587),
  smtpSecure: readBool(process.env.SMTP_SECURE, false),
  smtpUser: process.env.SMTP_USER || '',
  smtpPass: process.env.SMTP_PASS || '',
  notificationFrom: process.env.NOTIFICATION_FROM || '',
  notificationTo: process.env.NOTIFICATION_TO || '',
  adminSessionSecret: process.env.ADMIN_SESSION_SECRET || 'dev-only-change-me-admin-session-secret',
};

export const isProduction = config.env === 'production';
