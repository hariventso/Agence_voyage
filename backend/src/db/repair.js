const pool = require('./pool');

const ensureSchema = async () => {
  const client = await pool.connect();

  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS destinations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        type VARCHAR(100),
        price VARCHAR(50),
        status VARCHAR(50) DEFAULT 'Actif',
        service_name VARCHAR(255),
        duration INTEGER,
        image_url TEXT,
        description TEXT,
        itinerary TEXT,
        accommodation TEXT,
        budget TEXT,
        tips TEXT,
        highlights TEXT,
        is_popular BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query("ALTER TABLE destinations ADD COLUMN IF NOT EXISTS image_url TEXT;");
    await client.query("ALTER TABLE destinations ADD COLUMN IF NOT EXISTS description TEXT;");
    await client.query("ALTER TABLE destinations ADD COLUMN IF NOT EXISTS itinerary TEXT;");
    await client.query("ALTER TABLE destinations ADD COLUMN IF NOT EXISTS accommodation TEXT;");
    await client.query("ALTER TABLE destinations ADD COLUMN IF NOT EXISTS budget TEXT;");
    await client.query("ALTER TABLE destinations ADD COLUMN IF NOT EXISTS tips TEXT;");
    await client.query("ALTER TABLE destinations ADD COLUMN IF NOT EXISTS highlights TEXT;");
    await client.query("ALTER TABLE destinations ADD COLUMN IF NOT EXISTS service_name VARCHAR(255);");
    await client.query("ALTER TABLE destinations ADD COLUMN IF NOT EXISTS is_popular BOOLEAN DEFAULT FALSE;");
    await client.query("ALTER TABLE destinations ADD COLUMN IF NOT EXISTS gallery TEXT;");

    await client.query(`
      CREATE TABLE IF NOT EXISTS services (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        image_url TEXT,
        status VARCHAR(50) DEFAULT 'Actif',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS posts (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        category VARCHAR(100),
        content TEXT,
        image_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        sender VARCHAR(255),
        email VARCHAR(255),
        subject VARCHAR(255),
        content TEXT,
        unread BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    await client.query("ALTER TABLE messages ADD COLUMN IF NOT EXISTS email VARCHAR(255);");
    await client.query("ALTER TABLE messages ADD COLUMN IF NOT EXISTS unread BOOLEAN DEFAULT TRUE;");

    await client.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        type VARCHAR(50),
        sender VARCHAR(255),
        email VARCHAR(255),
        phone VARCHAR(50),
        participants INTEGER,
        departure_date DATE,
        duration VARCHAR(100),
        message TEXT,
        tour_name VARCHAR(255),
        status VARCHAR(50) DEFAULT 'En attente',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS team (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(255) NOT NULL,
        bio TEXT,
        image_url TEXT,
        facebook_url TEXT,
        twitter_url TEXT,
        instagram_url TEXT,
        pinterest_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS testimonials (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(255),
        content TEXT NOT NULL,
        rating INTEGER DEFAULT 5,
        image_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS employees (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        role VARCHAR(255),
        phone VARCHAR(50),
        status VARCHAR(50) DEFAULT 'Actif',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS calendar_events (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        event_type VARCHAR(80) DEFAULT 'evenement',
        event_date DATE NOT NULL,
        event_time TIME NOT NULL,
        location VARCHAR(255),
        employee_id INTEGER REFERENCES employees(id) ON DELETE CASCADE,
        description TEXT,
        reminder_sent_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query("ALTER TABLE calendar_events ADD COLUMN IF NOT EXISTS reminder_sent_at TIMESTAMP;");
    await client.query("ALTER TABLE calendar_events ADD COLUMN IF NOT EXISTS event_type VARCHAR(80) DEFAULT 'evenement';");
    await client.query("ALTER TABLE calendar_events ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;");

    await client.query(`
      CREATE TABLE IF NOT EXISTS slides (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255),
        subtitle VARCHAR(255),
        description TEXT,
        image_url TEXT,
        button_text VARCHAR(100),
        link VARCHAR(255),
        slide_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    const slidesCount = await client.query('SELECT COUNT(*) FROM slides;');
    if (Number(slidesCount.rows[0].count) === 0) {
      await client.query(`
        INSERT INTO slides (title, subtitle, description, image_url, button_text, link, slide_order)
        VALUES
        ('Explor''île', 'Sur les traces des Malgaches', 'Envie de découvrir Madagascar au-delà des sentiers battus ? Explor’île vous invite à vivre des expériences uniques, au croisement du tourisme culturel et de l’aventure. Nos voyages sont conçus à partir de recherches scientifiques, de savoirs locaux et de récits authentiques, pour vous offrir bien plus qu’un simple séjour : une véritable immersion au cœur de l’âme malgache.', '/image/beach_sunset_hero.png', 'Découvrir nos offres', '#destinations', 0),
        ('Aventure Isalo', 'Randonnées et Canyons Spectaculaires', 'Parcourez les paysages lunaires et les piscines naturelles du parc national de l''Isalo. Une immersion totale au milieu de canyons sculptés par le temps, de faune endémique et de savanes dorées, guidée par nos experts locaux.', '/image/isalo_destination.png', 'Explorer les circuits', '#destinations', 1),
        ('Nosy Be & Sainte Marie', 'Paradis Tropicaux et Eaux Cristallines', 'Évadez-vous sur des plages de sable blanc bordées de cocotiers. Du parfum d''ylang-ylang de Nosy Be aux eaux calmes de Sainte Marie où dansent les baleines à bosse, vivez une expérience balnéaire inoubliable.', '/image/home_beach_hero.png', 'Découvrir nos séjours', '#destinations', 2);
      `);
    }

    console.log('Base de données vérifiée et à jour.');
  } finally {
    client.release();
  }
};

module.exports = ensureSchema;
