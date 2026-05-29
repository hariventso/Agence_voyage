const config = require('./config/env');
const pool = require('./db/pool');
const ensureSchema = require('./db/repair');
const createApp = require('./app');
const { runReminderJob } = require('./services/calendar.service');

let reminderInterval;
let server;

const shutdown = async (signal) => {
  console.log(`${signal} reçu. Arrêt du backend...`);

  if (reminderInterval) {
    clearInterval(reminderInterval);
  }

  if (server) {
    await new Promise((resolve) => server.close(resolve));
  }

  await pool.end();
  process.exit(0);
};

const startServer = async () => {
  await ensureSchema();
  await runReminderJob();

  const app = createApp();
  reminderInterval = setInterval(runReminderJob, config.calendar.reminderCheckIntervalMs);
  server = app.listen(config.app.port, () => console.log(`Backend on ${config.app.baseUrl}`));
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

startServer().catch((error) => {
  console.error('Impossible de démarrer le backend:', error.message);
  process.exit(1);
});
