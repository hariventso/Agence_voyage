const express = require('express');

const pool = require('../db/pool');
const asyncHandler = require('../middleware/async-handler');

const router = express.Router();

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const result = await pool.query('SELECT * FROM messages ORDER BY created_at DESC');
    res.json(result.rows);
  })
);

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const { sender, email, subject, content } = req.body;
    const result = await pool.query(
      'INSERT INTO messages (sender, email, subject, content) VALUES ($1, $2, $3, $4) RETURNING *',
      [sender, email, subject, content]
    );
    res.json(result.rows[0]);
  })
);

router.put(
  '/:id/read',
  asyncHandler(async (req, res) => {
    await pool.query('UPDATE messages SET unread = FALSE WHERE id = $1', [req.params.id]);
    res.json({ message: 'Marked as read' });
  })
);

router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    await pool.query('DELETE FROM messages WHERE id = $1', [req.params.id]);
    res.json({ message: 'Deleted' });
  })
);

module.exports = router;
