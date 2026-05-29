const { Pool } = require('pg');

const config = require('../config/env');

const pool = new Pool(config.db);

const checkDatabaseConnection = async () => {
  const result = await pool.query(`
    SELECT
      current_database() AS database,
      current_user AS user,
      inet_server_addr() AS host,
      inet_server_port() AS port,
      NOW() AS checked_at
  `);

  return result.rows[0];
};

module.exports = pool;
module.exports.checkDatabaseConnection = checkDatabaseConnection;
