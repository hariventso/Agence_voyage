const express = require('express');

const asyncHandler = require('../middleware/async-handler');
const { checkDatabaseConnection } = require('../db/pool');

const router = express.Router();

router.get(
  '/db',
  asyncHandler(async (req, res) => {
    const db = await checkDatabaseConnection();

    res.json({
      ok: true,
      database: {
        name: db.database,
        user: db.user,
        host: db.host,
        port: db.port,
        checkedAt: db.checked_at,
      },
    });
  })
);

module.exports = router;
