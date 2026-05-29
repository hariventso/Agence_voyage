const cron = require('node-cron');
const config = require('./config/env');
const pool = require('./db/pool');
const { checkDatabaseConnection } = require('./db/pool');
const ensureSchema = require('./db/repair');
const createApp = require('./app');
const { runReminderJob } = require('./services/calendar.service');

let server;

const startServer = async () => {
  const db = await checkDatabaseConnection();
  console.log(`Connexion PostgreSQL OK: ${db.database} (${db.user})`);

  await ensureSchema();

  // Exécuter immédiatement au démarrage (optionnel, mais utile pour tester)
  await runReminderJob();

  // Planification avec node-cron : tous les jours à 08h00 du matin
  cron.schedule('0 8 * * *', async () => {
    console.log('[Cron] Exécution du job de rappels (08h00)...');
    await runReminderJob();
  });

  const app = createApp();
  server = app.listen(config.app.port, () => {
    console.log(`Backend on ${config.app.baseUrl}`);
    console.log(`Origines API autorisées: ${config.app.allowedOrigins.join(', ')}`);
  });
};

const shutdown = async (signal) => {
  console.log(`${signal} reçu. Arrêt du backend...`);

  if (server) {
    await new Promise((resolve) => server.close(resolve));
  }

  await pool.end();
  process.exit(0);
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

startServer().catch((error) => {
  console.error('Impossible de démarrer le backend:', error.message);
  process.exit(1);
});
