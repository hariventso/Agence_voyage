const express = require('express');

const config = require('../config/env');
const pool = require('../db/pool');
const asyncHandler = require('../middleware/async-handler');
const {
  calendarEventsQuery,
  findCalendarEventById,
  mapCalendarEvent,
  runReminderJob,
  sendReminderForEventIfDue,
  smtpConfigured,
} = require('../services/calendar.service');
const { sendMail } = require('../services/mail.service');

const router = express.Router();

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const params = [];
    let whereClause = '';

    if (req.query.month) {
      params.push(`${req.query.month}-01`);
      whereClause = "WHERE DATE_TRUNC('month', ce.event_date) = DATE_TRUNC('month', $1::date)";
    }

    const result = await pool.query(
      `${calendarEventsQuery}
       ${whereClause}
       ORDER BY ce.event_date ASC, ce.event_time ASC`,
      params
    );

    res.json(result.rows.map(mapCalendarEvent));
  })
);

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const { title, event_type, event_date, event_time, location, employee_id, description, status, color } = req.body;
    const result = await pool.query(
      `INSERT INTO calendar_events
      (title, event_type, event_date, event_time, location, employee_id, description, status, color, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, CURRENT_TIMESTAMP)
      RETURNING *`,
      [
        title,
        event_type || 'evenement',
        event_date,
        event_time,
        location,
        employee_id || null,
        description,
        status || 'todo',
        color || '#2563eb',
      ]
    );

    let reminder = { sent: false };
    try {
      reminder = await sendReminderForEventIfDue(result.rows[0].id);
    } catch (error) {
      console.error(`[Agenda] Rappel immédiat non envoyé pour l'événement ${result.rows[0].id}:`, error.message);
      reminder = { sent: false, error: error.message };
    }

    const createdEvent = await findCalendarEventById(result.rows[0].id);
    res.json({ ...createdEvent, reminder });
  })
);

router.put(
  '/:id',
  asyncHandler(async (req, res) => {
    const { title, event_type, event_date, event_time, location, employee_id, description, status, color } = req.body;
    await pool.query(
      `UPDATE calendar_events
      SET title = $1, event_type = $2, event_date = $3, event_time = $4, location = $5,
          employee_id = $6, description = $7, status = $8, color = $9,
          reminder_sent = FALSE, reminder_sent_at = NULL, updated_at = CURRENT_TIMESTAMP
      WHERE id = $10`,
      [
        title,
        event_type || 'evenement',
        event_date,
        event_time,
        location,
        employee_id || null,
        description,
        status || 'todo',
        color || '#2563eb',
        req.params.id,
      ]
    );

    let reminder = { sent: false };
    try {
      reminder = await sendReminderForEventIfDue(req.params.id);
    } catch (error) {
      console.error(`[Agenda] Rappel immédiat non envoyé pour l'événement ${req.params.id}:`, error.message);
      reminder = { sent: false, error: error.message };
    }

    const updatedEvent = await findCalendarEventById(req.params.id);
    res.json({ ...updatedEvent, reminder });
  })
);

router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    await pool.query('DELETE FROM calendar_events WHERE id = $1', [req.params.id]);
    res.json({ message: 'Deleted' });
  })
);

router.post(
  '/send-reminders',
  asyncHandler(async (req, res) => {
    const reminderResult = await runReminderJob();
    res.json({
      ...reminderResult,
      reminderLeadDays: config.calendar.reminderLeadDays,
      reminderLeadHours: config.calendar.reminderLeadHours,
      smtpConfigured,
    });
  })
);

router.post(
  '/send-test-email',
  asyncHandler(async (req, res) => {
    const recipient = String(req.body?.email || config.smtp.user || '').trim();

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

    return res.json({ ok: true, smtpConfigured, recipient, simulated: sent.simulated });
  })
);

module.exports = router;
