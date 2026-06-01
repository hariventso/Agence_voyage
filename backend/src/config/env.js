const path = require("path");

require("dotenv").config({
  path: path.resolve(__dirname, "../../.env"),
  override: true,
});

const numberFromEnv = (name, fallback) => {
  const value = Number(process.env[name]);
  return Number.isFinite(value) ? value : fallback;
};

const port = numberFromEnv("PORT", 5000);
const allowedOrigins = (
  process.env.CORS_ORIGINS ||
  process.env.FRONTEND_URL ||
  "http://localhost:5173"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

for (let port = 5173; port <= 5179; port += 1) {
  const localOrigin = `http://localhost:${port}`;
  if (!allowedOrigins.includes(localOrigin)) {
    allowedOrigins.push(localOrigin);
  }
  const ipOrigin = `http://127.0.0.1:${port}`;
  if (!allowedOrigins.includes(ipOrigin)) {
    allowedOrigins.push(ipOrigin);
  }
}

const config = {
  app: {
    port,
    baseUrl: process.env.PUBLIC_BACKEND_URL || `http://localhost:${port}`,
    frontendUrl: process.env.FRONTEND_URL || allowedOrigins[0] || "http://localhost:5173",
    uploadDir: path.resolve(__dirname, "../../uploads"),
    allowedOrigins,
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
    username: process.env.ADMIN_USER,
    password: process.env.ADMIN_PASSWORD,
  },
  calendar: {
    reminderLeadDays: numberFromEnv("CALENDAR_REMINDER_DAYS", 5),
    reminderLeadHours: numberFromEnv("CALENDAR_REMINDER_DAYS", 5) * 24,
    reminderCheckIntervalMs: numberFromEnv(
      "CALENDAR_REMINDER_INTERVAL_MS",
      60 * 60 * 1000,
    ),
  },
  smtp: {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.SMTP_FROM,
    secure: String(process.env.SMTP_SECURE || "false") === "true",
  },
};

config.smtp.configured = Boolean(
  config.smtp.host &&
  config.smtp.port &&
  config.smtp.user &&
  config.smtp.pass &&
  config.smtp.from,
);

module.exports = config;
