const pool = require('./pool');

async function checkDestinations() {
  try {
    const res = await pool.query('SELECT id, name, service_name, status FROM destinations');
    console.log('=== DESTINATIONS ===');
    console.log(res.rows);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await pool.end();
  }
}

checkDestinations();
