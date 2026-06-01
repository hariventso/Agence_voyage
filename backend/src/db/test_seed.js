const pool = require('./pool');

async function testSeed() {
  try {
    const connectionInfo = await pool.query('SELECT current_database(), current_user');
    console.log('Connected to DB:', connectionInfo.rows[0]);

    const servicesRes = await pool.query('SELECT * FROM services');
    console.log('=== CURRENT SERVICES ===');
    console.log(servicesRes.rows);

    if (servicesRes.rows.length === 0) {
      console.log('Services table is empty. Seeding services...');
      const insertQuery = `
        INSERT INTO services (name, description, image_url, status)
        VALUES
          ($1, $2, $3, $4),
          ($5, $6, $7, $8),
          ($9, $10, $11, $12)
        RETURNING id, name, status;
      `;

      const values = [
        'Circuit Culturel',
        "Plongez au coeur de la culture malgache a travers des rencontres authentiques avec les communautes locales.",
        '/image/isalo_destination.png',
        'Actif',

        'Sejour Balneaire',
        "Detendez-vous sur les plus belles plages de Madagascar, des eaux cristallines de Nosy Be aux cotes sauvages.",
        '/image/home_beach_hero.png',
        'Actif',

        'Aventure & Nature',
        "Explorez les paysages epoustouflants de Madagascar : randonnees dans les canyons, trekking et rencontres sauvages.",
        '/image/beach_sunset_hero.png',
        'Actif',
      ];

      const result = await pool.query(insertQuery, values);
      console.log('Services seeded successfully:', result.rows);
      
      const allServices = await pool.query('SELECT * FROM services');
      console.log('=== ALL SERVICES NOW ===');
      console.log(allServices.rows);
    } else {
      console.log('Services table already has data. No seed needed.');
    }
  } catch (error) {
    console.error('Database operation failed:', error);
  } finally {
    await pool.end();
  }
}

testSeed();
