const express = require('express');

const pool = require('../db/pool');
const asyncHandler = require('../middleware/async-handler');

const router = express.Router();

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const result = await pool.query('SELECT * FROM bookings ORDER BY created_at DESC');
    res.json(result.rows);
  })
);

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const { type, sender, email, phone, participants, departure_date, duration, message, tour_name } = req.body;
    const result = await pool.query(
      `INSERT INTO bookings
      (type, sender, email, phone, participants, departure_date, duration, message, tour_name)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *`,
      [type, sender, email, phone, participants, departure_date, duration, message, tour_name]
    );
    res.json(result.rows[0]);
  })
);

router.put(
  '/:id/status',
  asyncHandler(async (req, res) => {
    await pool.query('UPDATE bookings SET status = $1 WHERE id = $2', [req.body.status, req.params.id]);
    res.json({ message: 'Status updated' });
  })
);

router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    await pool.query('DELETE FROM bookings WHERE id = $1', [req.params.id]);
    res.json({ message: 'Deleted' });
  })
);

module.exports = router;
