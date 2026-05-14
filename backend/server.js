const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// AUTO-REPAIR: Vérifie et ajoute les colonnes manquantes
const repairDB = async () => {
  try {
    const client = await pool.connect();
    // Table Destinations
    await client.query("ALTER TABLE destinations ADD COLUMN IF NOT EXISTS image_url TEXT;");
    await client.query("ALTER TABLE destinations ADD COLUMN IF NOT EXISTS description TEXT;");
    await client.query("ALTER TABLE destinations ADD COLUMN IF NOT EXISTS itinerary TEXT;");
    await client.query("ALTER TABLE destinations ADD COLUMN IF NOT EXISTS accommodation TEXT;");
    await client.query("ALTER TABLE destinations ADD COLUMN IF NOT EXISTS budget TEXT;");
    await client.query("ALTER TABLE destinations ADD COLUMN IF NOT EXISTS tips TEXT;");
    await client.query("ALTER TABLE destinations ADD COLUMN IF NOT EXISTS highlights TEXT;");
    
    // Table Blog Posts
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

    // Table Messages (Contact Requests)
    await client.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        sender VARCHAR(255),
        subject VARCHAR(255),
        content TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Assurer que les colonnes email et unread existent (au cas où la table existait déjà)
    await client.query("ALTER TABLE messages ADD COLUMN IF NOT EXISTS email VARCHAR(255);");
    await client.query("ALTER TABLE messages ADD COLUMN IF NOT EXISTS unread BOOLEAN DEFAULT TRUE;");
    
    // Table Bookings (Quotes & Reservations)
    await client.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        type VARCHAR(50), -- 'devis' or 'reservation'
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

    // Table Team members
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

    // Table Testimonials
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
    
    console.log("Base de données vérifiée et à jour !");
    client.release();
  } catch (err) {
    console.error("Erreur lors de la vérification de la DB:", err.message);
  }
};
repairDB();

app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file' });
  res.json({ imageUrl: `http://localhost:5000/uploads/${req.file.filename}` });
});

// DESTINATIONS
app.get('/api/destinations', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM destinations ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/destinations/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM destinations WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Destination not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/destinations', async (req, res) => {
  try {
    const { name, type, price, status, image_url, description, itinerary, accommodation, budget, tips, highlights } = req.body;
    const result = await pool.query(
      'INSERT INTO destinations (name, type, price, status, image_url, description, itinerary, accommodation, budget, tips, highlights) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *',
      [name, type, price, status, image_url, description, itinerary, accommodation, budget, tips, highlights]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("POST Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/destinations/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, price, status, image_url, description, itinerary, accommodation, budget, tips, highlights } = req.body;
    const result = await pool.query(
      'UPDATE destinations SET name = $1, type = $2, price = $3, status = $4, image_url = $5, description = $6, itinerary = $7, accommodation = $8, budget = $9, tips = $10, highlights = $11 WHERE id = $12 RETURNING *',
      [name, type, price, status, image_url, description, itinerary, accommodation, budget, tips, highlights, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("PUT Error:", err.message);
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

// BLOG POSTS
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
    const { id } = req.params;
    const { title, category, content, image_url } = req.body;
    const result = await pool.query(
      'UPDATE posts SET title = $1, category = $2, content = $3, image_url = $4 WHERE id = $5 RETURNING *',
      [title, category, content, image_url, id]
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
    console.error("POST Message Error:", err.message);
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

// BOOKINGS
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
      'INSERT INTO bookings (type, sender, email, phone, participants, departure_date, duration, message, tour_name) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
      [type, sender, email, phone, participants, departure_date, duration, message, tour_name]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("POST Booking Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/bookings/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    await pool.query('UPDATE bookings SET status = $1 WHERE id = $2', [status, req.params.id]);
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

// TEAM
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
      'INSERT INTO team (name, role, bio, image_url, facebook_url, twitter_url, instagram_url, pinterest_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
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
      'UPDATE team SET name=$1, role=$2, bio=$3, image_url=$4, facebook_url=$5, twitter_url=$6, instagram_url=$7, pinterest_url=$8 WHERE id=$9 RETURNING *',
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

// TESTIMONIALS
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
      'UPDATE testimonials SET name=$1, role=$2, content=$3, rating=$4, image_url=$5 WHERE id=$6 RETURNING *',
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

app.listen(port, () => console.log(`Backend on http://localhost:${port}`));
