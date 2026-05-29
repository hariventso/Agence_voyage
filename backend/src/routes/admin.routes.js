const express = require('express');

const config = require('../config/env');

const router = express.Router();

router.get('/config', (req, res) => {
  res.json({
    adminUser: config.admin.username,
    reminderLeadDays: config.calendar.reminderLeadDays,
    reminderLeadHours: config.calendar.reminderLeadHours,
    smtpConfigured: config.smtp.configured,
  });
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username === config.admin.username && password === config.admin.password) {
    return res.json({ ok: true });
  }

  return res.status(401).json({ error: "Nom d'utilisateur ou mot de passe incorrect" });
});

module.exports = router;
