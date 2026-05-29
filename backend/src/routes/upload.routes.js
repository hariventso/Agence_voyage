const express = require('express');
const fs = require('fs');
const multer = require('multer');
const path = require('path');

const config = require('../config/env');

fs.mkdirSync(config.app.uploadDir, { recursive: true });

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, config.app.uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}${path.extname(file.originalname)}`),
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      const error = new Error('Seuls les fichiers image sont acceptés.');
      error.statusCode = 400;
      error.expose = true;
      return cb(error);
    }
    return cb(null, true);
  },
});

router.post('/', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  return res.json({ imageUrl: `${config.app.baseUrl}/uploads/${req.file.filename}` });
});

module.exports = router;
