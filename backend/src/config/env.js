const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const numberFromEnv = (name, fallback) => {
  const value = Number(process.env[name]);
  return Number.isFinite(value) ? value : fallback;
};

const port = numberFromEnv('PORT', 5000);

const config = {
  app: {
    port,
    baseUrl: process.env.PUBLIC_BACKEND_URL || `http://localhost:${port}`,
    uploadDir: path.resolve(__dirname, '../../uploads'),
  },
  db: {
    connectionString: process.env.DATABASE_URL || undefined,
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : undefined,
  },
  admin: {
    username: process.env.ADMIN_USER || 'Tourisme',
    password: process.env.ADMIN_PASSWORD || '2026',
  },
  calendar: {
    reminderLeadHours: numberFromEnv('CALENDAR_REMINDER_HOURS', 24),
    reminderCheckIntervalMs: numberFromEnv('CALENDAR_REMINDER_INTERVAL_MS', 60 * 60 * 1000),
  },
  smtp: {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.SMTP_FROM,
    secure: String(process.env.SMTP_SECURE || 'false') === 'true',
  },
};

config.smtp.configured = Boolean(
  config.smtp.host &&
    config.smtp.port &&
    config.smtp.user &&
    config.smtp.pass &&
    config.smtp.from
);

module.exports = config;
