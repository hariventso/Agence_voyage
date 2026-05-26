const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const multer = require('multer');
const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;
const baseUrl = process.env.PUBLIC_BACKEND_URL || `http://localhost:${port}`;
const reminderLeadHours = Number(process.env.CALENDAR_REMINDER_HOURS || 24);
const reminderCheckIntervalMs = Number(process.env.CALENDAR_REMINDER_INTERVAL_MS || 60 * 60 * 1000);

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}${path.extname(file.originalname)}`),
});

const upload = multer({ storage });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || undefined,
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : undefined,
});

const adminUser = process.env.ADMIN_USER || 'Tourisme';
const adminPassword = process.env.ADMIN_PASSWORD || '2026';

const smtpConfigured = Boolean(
  process.env.SMTP_HOST &&
  process.env.SMTP_PORT &&
  process.env.SMTP_USER &&
  process.env.SMTP_PASS &&
  process.env.SMTP_FROM
);

const mailTransporter = smtpConfigured
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: String(process.env.SMTP_SECURE || 'false') === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
  : null;

const ensureArray = (value) => (Array.isArray(value) ? value : []);

const toLocalDatePart = (eventDate) => {
  if (eventDate instanceof Date) {
    const year = eventDate.getFullYear();
    const month = String(eventDate.getMonth() + 1).padStart(2, '0');
    const day = String(eventDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  if (typeof eventDate === 'string') {
    return eventDate.includes('T') ? eventDate.slice(0, 10) : eventDate;
  }

  return String(eventDate);
};

const normalizeEventTime = (eventTime) => {
  if (!eventTime) return '09:00:00';
  return String(eventTime).length === 5 ? `${eventTime}:00` : String(eventTime);
};

const formatEventDate = (eventDate, eventTime) => {
  const date = new Date(`${toLocalDatePart(eventDate)}T${normalizeEventTime(eventTime)}`);
  return new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'full',
    timeStyle: 'short',
  }).format(date);
};

const buildEventDateTime = (event) =>
  new Date(`${toLocalDatePart(event.event_date)}T${normalizeEventTime(event.event_time)}`);

const getReminderDateTime = (event) =>
  new Date(buildEventDateTime(event).getTime() - reminderLeadHours * 60 * 60 * 1000);

const sendMail = async ({ to, subject, text, html }) => {
  if (!mailTransporter) {
    console.log(`[Agenda] SMTP non configure. Envoi simule pour ${to}: ${subject}`);
    return { simulated: true, recipient: to };
  }

  await mailTransporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject,
    text,
    html,
  });

  return { simulated: false, recipient: to };
};

const sendReminderEmail = async (event) => {
  const eventMoment = formatEventDate(event.event_date, event.event_time);
  const subject = `Rappel agenda: ${event.title}`;
  const text = [
    `Bonjour ${event.employee_name},`,
    '',
    `Ceci est un rappel pour votre événement "${event.title}".`,
    `Date et heure: ${eventMoment}`,
    `Lieu: ${event.location || 'Non précisé'}`,
    `Type: ${event.event_type || 'Événement'}`,
    `Description: ${event.description || 'Aucune description'}`,
    '',
    "Merci de bien prendre vos dispositions.",
  ].join('\n');

  if (!mailTransporter) {
    console.log(`[Agenda] SMTP non configuré. Rappel simulé pour ${event.employee_email}: ${subject}`);
    return { simulated: true };
  }

  await mailTransporter.sendMail({
    from: process.env.SMTP_FROM,
    to: event.employee_email,
    subject,
    text,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #0f172a;">
        <h2 style="margin-bottom: 8px;">Rappel agenda</h2>
        <p>Bonjour ${event.employee_name},</p>
        <p>Ceci est un rappel pour votre événement <strong>${event.title}</strong>.</p>
        <ul>
          <li><strong>Date et heure:</strong> ${eventMoment}</li>
          <li><strong>Lieu:</strong> ${event.location || 'Non précisé'}</li>
          <li><strong>Type:</strong> ${event.event_type || 'Événement'}</li>
          <li><strong>Description:</strong> ${event.description || 'Aucune description'}</li>
        </ul>
        <p>Merci de bien prendre vos dispositions.</p>
      </div>
    `,
  });

  return { simulated: false };
};

const repairDB = async () => {
  const client = await pool.connect();

  try {
    await client.query("ALTER TABLE destinations ADD COLUMN IF NOT EXISTS image_url TEXT;");
    await client.query("ALTER TABLE destinations ADD COLUMN IF NOT EXISTS description TEXT;");
    await client.query("ALTER TABLE destinations ADD COLUMN IF NOT EXISTS itinerary TEXT;");
    await client.query("ALTER TABLE destinations ADD COLUMN IF NOT EXISTS accommodation TEXT;");
    await client.query("ALTER TABLE destinations ADD COLUMN IF NOT EXISTS budget TEXT;");
    await client.query("ALTER TABLE destinations ADD COLUMN IF NOT EXISTS tips TEXT;");
    await client.query("ALTER TABLE destinations ADD COLUMN IF NOT EXISTS highlights TEXT;");
    await client.query("ALTER TABLE destinations ADD COLUMN IF NOT EXISTS service_name VARCHAR(255);");
    await client.query("ALTER TABLE destinations ADD COLUMN IF NOT EXISTS is_popular BOOLEAN DEFAULT FALSE;");

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

    console.log('Base de données vérifiée et à jour.');
  } finally {
    client.release();
  }
};

const mapCalendarEvent = (row) => ({
  ...row,
  employee: row.employee_id
    ? {
        id: row.employee_id,
        name: row.employee_name,
        email: row.employee_email,
        role: row.employee_role,
        phone: row.employee_phone,
        status: row.employee_status,
      }
    : null,
});

const getCalendarEventsQuery = `
  SELECT
    ce.*,
    e.name AS employee_name,
    e.email AS employee_email,
    e.role AS employee_role,
    e.phone AS employee_phone,
    e.status AS employee_status
  FROM calendar_events ce
  LEFT JOIN employees e ON e.id = ce.employee_id
`;

const runReminderJob = async () => {
  try {
    const result = await pool.query(`
      ${getCalendarEventsQuery}
      WHERE ce.reminder_sent_at IS NULL
        AND ce.employee_id IS NOT NULL
        AND ce.event_date IS NOT NULL
        AND ce.event_time IS NOT NULL
      ORDER BY ce.event_date ASC, ce.event_time ASC
    `);

    const now = new Date();
    const sentEvents = [];

    for (const row of result.rows) {
      const event = mapCalendarEvent(row);
      if (!event.employee?.email) continue;

      const eventDateTime = buildEventDateTime(event);
      const reminderDateTime = getReminderDateTime(event);

      if (now >= reminderDateTime && now < eventDateTime) {
        await sendReminderEmail(event);
        await pool.query(
          'UPDATE calendar_events SET reminder_sent_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE id = $1',
          [event.id]
        );
        sentEvents.push(event.id);
      }
    }

    if (sentEvents.length > 0) {
      console.log(`[Agenda] ${sentEvents.length} rappel(s) envoyé(s): ${sentEvents.join(', ')}`);
    }

    return sentEvents;
  } catch (error) {
    console.error('[Agenda] Erreur durant la vérification des rappels:', error.message);
    return [];
  }
};

app.get('/api/admin/config', (req, res) => {
  res.json({
    adminUser,
    reminderLeadHours,
    smtpConfigured,
  });
});

app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;

  if (username === adminUser && password === adminPassword) {
    return res.json({ ok: true });
  }

  return res.status(401).json({ error: "Nom d'utilisateur ou mot de passe incorrect" });
});

app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  return res.json({ imageUrl: `${baseUrl}/uploads/${req.file.filename}` });
});

app.get('/api/destinations', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM destinations ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/services', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM services ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/services', async (req, res) => {
  try {
    const { name, description, image_url, status } = req.body;
    const result = await pool.query(
      'INSERT INTO services (name, description, image_url, status) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, description, image_url, status || 'Actif']
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/services/:id', async (req, res) => {
  try {
    const { name, description, image_url, status } = req.body;
    const result = await pool.query(
      'UPDATE services SET name = $1, description = $2, image_url = $3, status = $4 WHERE id = $5 RETURNING *',
      [name, description, image_url, status, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/services/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM services WHERE id = $1', [req.params.id]);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/destinations/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM destinations WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Destination not found' });
    }
    return res.json(result.rows[0]);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.post('/api/destinations', async (req, res) => {
  try {
    const {
      name,
      type,
      price,
      status,
      image_url,
      description,
      itinerary,
      accommodation,
      budget,
      tips,
      highlights,
    } = req.body;

    const result = await pool.query(
      `INSERT INTO destinations
      (name, type, price, status, image_url, description, itinerary, accommodation, budget, tips, highlights)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *`,
      [name, type, price, status, image_url, description, itinerary, accommodation, budget, tips, highlights]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/destinations/:id', async (req, res) => {
  try {
    const {
      name,
      type,
      price,
      status,
      image_url,
      description,
      itinerary,
      accommodation,
      budget,
      tips,
      highlights,
    } = req.body;

    const result = await pool.query(
      `UPDATE destinations
      SET name = $1, type = $2, price = $3, status = $4, image_url = $5, description = $6,
          itinerary = $7, accommodation = $8, budget = $9, tips = $10, highlights = $11
      WHERE id = $12
      RETURNING *`,
      [name, type, price, status, image_url, description, itinerary, accommodation, budget, tips, highlights, req.params.id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/destinations/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM destinations WHERE id = $1', [req.params.id]);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/posts', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM posts ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/posts', async (req, res) => {
  try {
    const { title, category, content, image_url } = req.body;
    const result = await pool.query(
      'INSERT INTO posts (title, category, content, image_url) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, category, content, image_url]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/posts/:id', async (req, res) => {
  try {
    const { title, category, content, image_url } = req.body;
    const result = await pool.query(
      'UPDATE posts SET title = $1, category = $2, content = $3, image_url = $4 WHERE id = $5 RETURNING *',
      [title, category, content, image_url, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/posts/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM posts WHERE id = $1', [req.params.id]);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/messages', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM messages ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/messages', async (req, res) => {
  try {
    const { sender, email, subject, content } = req.body;
    const result = await pool.query(
      'INSERT INTO messages (sender, email, subject, content) VALUES ($1, $2, $3, $4) RETURNING *',
      [sender, email, subject, content]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/messages/:id/read', async (req, res) => {
  try {
    await pool.query('UPDATE messages SET unread = FALSE WHERE id = $1', [req.params.id]);
    res.json({ message: 'Marked as read' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/messages/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM messages WHERE id = $1', [req.params.id]);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/bookings', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM bookings ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/bookings', async (req, res) => {
  try {
    const { type, sender, email, phone, participants, departure_date, duration, message, tour_name } = req.body;
    const result = await pool.query(
      `INSERT INTO bookings
      (type, sender, email, phone, participants, departure_date, duration, message, tour_name)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *`,
      [type, sender, email, phone, participants, departure_date, duration, message, tour_name]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/bookings/:id/status', async (req, res) => {
  try {
    await pool.query('UPDATE bookings SET status = $1 WHERE id = $2', [req.body.status, req.params.id]);
    res.json({ message: 'Status updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/bookings/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM bookings WHERE id = $1', [req.params.id]);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/team', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM team ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/team', async (req, res) => {
  try {
    const { name, role, bio, image_url, facebook_url, twitter_url, instagram_url, pinterest_url } = req.body;
    const result = await pool.query(
      `INSERT INTO team (name, role, bio, image_url, facebook_url, twitter_url, instagram_url, pinterest_url)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *`,
      [name, role, bio, image_url, facebook_url, twitter_url, instagram_url, pinterest_url]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/team/:id', async (req, res) => {
  try {
    const { name, role, bio, image_url, facebook_url, twitter_url, instagram_url, pinterest_url } = req.body;
    const result = await pool.query(
      `UPDATE team
      SET name = $1, role = $2, bio = $3, image_url = $4, facebook_url = $5, twitter_url = $6, instagram_url = $7, pinterest_url = $8
      WHERE id = $9
      RETURNING *`,
      [name, role, bio, image_url, facebook_url, twitter_url, instagram_url, pinterest_url, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/team/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM team WHERE id = $1', [req.params.id]);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/testimonials', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM testimonials ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/testimonials', async (req, res) => {
  try {
    const { name, role, content, rating, image_url } = req.body;
    const result = await pool.query(
      'INSERT INTO testimonials (name, role, content, rating, image_url) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, role, content, rating, image_url]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/testimonials/:id', async (req, res) => {
  try {
    const { name, role, content, rating, image_url } = req.body;
    const result = await pool.query(
      'UPDATE testimonials SET name = $1, role = $2, content = $3, rating = $4, image_url = $5 WHERE id = $6 RETURNING *',
      [name, role, content, rating, image_url, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/testimonials/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM testimonials WHERE id = $1', [req.params.id]);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/employees', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM employees ORDER BY name ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/employees', async (req, res) => {
  try {
    const { name, email, role, phone, status } = req.body;
    const result = await pool.query(
      'INSERT INTO employees (name, email, role, phone, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, email, role, phone, status || 'Actif']
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/employees/:id', async (req, res) => {
  try {
    const { name, email, role, phone, status } = req.body;
    const result = await pool.query(
      'UPDATE employees SET name = $1, email = $2, role = $3, phone = $4, status = $5 WHERE id = $6 RETURNING *',
      [name, email, role, phone, status, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/employees/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM employees WHERE id = $1', [req.params.id]);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/calendar-events', async (req, res) => {
  try {
    const month = req.query.month;
    const params = [];
    let whereClause = '';

    if (month) {
      params.push(`${month}-01`);
      whereClause = `WHERE DATE_TRUNC('month', ce.event_date) = DATE_TRUNC('month', $1::date)`;
    }

    const result = await pool.query(
      `${getCalendarEventsQuery}
       ${whereClause}
       ORDER BY ce.event_date ASC, ce.event_time ASC`,
      params
    );

    res.json(result.rows.map(mapCalendarEvent));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/calendar-events', async (req, res) => {
  try {
    const { title, event_type, event_date, event_time, location, employee_id, description } = req.body;
    const result = await pool.query(
      `INSERT INTO calendar_events
      (title, event_type, event_date, event_time, location, employee_id, description, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP)
      RETURNING *`,
      [title, event_type || 'evenement', event_date, event_time, location, employee_id || null, description]
    );

    const fullResult = await pool.query(`${getCalendarEventsQuery} WHERE ce.id = $1`, [result.rows[0].id]);
    res.json(mapCalendarEvent(fullResult.rows[0]));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/calendar-events/:id', async (req, res) => {
  try {
    const { title, event_type, event_date, event_time, location, employee_id, description } = req.body;
    await pool.query(
      `UPDATE calendar_events
      SET title = $1, event_type = $2, event_date = $3, event_time = $4, location = $5,
          employee_id = $6, description = $7, reminder_sent_at = NULL, updated_at = CURRENT_TIMESTAMP
      WHERE id = $8`,
      [title, event_type || 'evenement', event_date, event_time, location, employee_id || null, description, req.params.id]
    );

    const fullResult = await pool.query(`${getCalendarEventsQuery} WHERE ce.id = $1`, [req.params.id]);
    res.json(mapCalendarEvent(fullResult.rows[0]));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/calendar-events/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM calendar_events WHERE id = $1', [req.params.id]);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/calendar-events/send-reminders', async (req, res) => {
  const sentEvents = await runReminderJob();
  res.json({ sentEvents, reminderLeadHours, smtpConfigured });
});

app.post('/api/calendar-events/send-test-email', async (req, res) => {
  try {
    const recipient = String(req.body?.email || process.env.SMTP_USER || '').trim();

    if (!recipient) {
      return res.status(400).json({ error: 'Aucune adresse e-mail de test n est configuree.' });
    }

    const sent = await sendMail({
      to: recipient,
      subject: 'Test SMTP agenda',
      text: [
        'Bonjour,',
        '',
        'Ceci est un e-mail de test envoye immediatement depuis le module agenda.',
        `Date du test: ${new Date().toLocaleString('fr-FR')}`,
        '',
        'Si vous recevez ce message, la configuration SMTP fonctionne.',
      ].join('\n'),
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #0f172a;">
          <h2 style="margin-bottom: 8px;">Test SMTP agenda</h2>
          <p>Bonjour,</p>
          <p>Ceci est un e-mail de test envoye immediatement depuis le module agenda.</p>
          <p><strong>Date du test:</strong> ${new Date().toLocaleString('fr-FR')}</p>
          <p>Si vous recevez ce message, la configuration SMTP fonctionne.</p>
        </div>
      `,
    });

    res.json({ ok: true, smtpConfigured, recipient, simulated: sent.simulated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const startServer = async () => {
  try {
    await repairDB();
    await runReminderJob();
    setInterval(runReminderJob, reminderCheckIntervalMs);
    app.listen(port, () => console.log(`Backend on ${baseUrl}`));
  } catch (error) {
    console.error('Impossible de démarrer le backend:', error.message);
    process.exit(1);
  }
};

startServer();
