const pool = require('./pool');

async function updateDestinations() {
  try {
    console.log('Connecting to database...');
    
    // Check current destinations
    const initial = await pool.query('SELECT id, name, service_name FROM destinations');
    console.log('Current destinations before update:', initial.rows);

    const updates = [
      { name: 'Nosy Be', service: 'Sejour Balneaire' },
      { name: 'Kimony', service: 'Sejour Balneaire' },
      { name: 'Sud Madagascar', service: 'Aventure & Nature' },
      { name: 'ouest Madagascar', service: 'Aventure & Nature' },
      { name: 'Est madagascar', service: 'Circuit Culturel' },
      { name: "Excursions d'une journée", service: 'Circuit Culturel' }
    ];

    for (const item of updates) {
      const res = await pool.query(
        'UPDATE destinations SET service_name = $1 WHERE name = $2 RETURNING id, name, service_name',
        [item.service, item.name]
      );
      if (res.rows.length > 0) {
        console.log(`Updated destination: ${item.name} -> ${item.service}`);
      } else {
        // Try case-insensitive matching or generic updates
        const ciRes = await pool.query(
          'UPDATE destinations SET service_name = $1 WHERE LOWER(name) = LOWER($2) RETURNING id, name, service_name',
          [item.service, item.name]
        );
        if (ciRes.rows.length > 0) {
          console.log(`Updated destination (CI): ${ciRes.rows[0].name} -> ${item.service}`);
        } else {
          console.log(`Destination not found for update: ${item.name}`);
        }
      }
    }

    const final = await pool.query('SELECT id, name, service_name FROM destinations');
    console.log('All destinations after update:', final.rows);

  } catch (error) {
    console.error('Update failed:', error);
  } finally {
    await pool.end();
  }
}

updateDestinations();
