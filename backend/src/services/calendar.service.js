const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');
const config = require('../config/env');
const pool = require('../db/pool');
const { formatEventDate, normalizeEventTime, toLocalDatePart } = require('../utils/date');
const { sendMail, smtpConfigured } = require('./mail.service');

const calendarEventsQuery = `
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

const mapCalendarEvent = (row) => ({
  ...row,
  event_date: toLocalDatePart(row.event_date),
  event_time: normalizeEventTime(row.event_time).slice(0, 5),
  reminder_sent: Boolean(row.reminder_sent || row.reminder_sent_at),
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

const loadTemplate = (name) => {
  const filePath = path.join(__dirname, 'templates', `${name}.hbs`);
  const source = fs.readFileSync(filePath, 'utf-8');
  return handlebars.compile(source);
};

const reminderTemplate = loadTemplate('reminder');

const getTargetReminderDate = () => {
  const target = new Date();
  target.setDate(target.getDate() + config.calendar.reminderLeadDays);
  return toLocalDatePart(target);
};

const sendReminderEmail = async (event) => {
  const subject = `Rappel agenda: ${event.title}`;
  const agendaUrl = `${config.app.frontendUrl.replace(/\/$/, '')}/admin`;

  const html = reminderTemplate({
    title: event.title,
    employeeName: event.employee_name,
    reminderLeadDays: config.calendar.reminderLeadDays,
    eventDate: toLocalDatePart(event.event_date),
    eventTime: normalizeEventTime(event.event_time).slice(0, 5),
    location: event.location || 'Non précisé',
    description: event.description || 'Aucune description',
    agendaUrl: agendaUrl
  });

  return sendMail({
    to: event.employee_email,
    subject,
    text: `Rappel pour ${event.title}. Échéance dans ${config.calendar.reminderLeadDays} jours.`,
    html,
  });
};

const sendReminderForEventIfDue = async (id) => {
  const result = await pool.query(
    `${calendarEventsQuery}
     WHERE ce.id = $1
       AND COALESCE(ce.reminder_sent, false) = false
       AND ce.employee_id IS NOT NULL
       AND ce.event_date = $2::date`,
    [id, getTargetReminderDate()]
  );

  const row = result.rows[0];
  if (!row?.employee_email) {
    return { sent: false, reason: 'not_due_or_missing_employee_email' };
  }

  await sendReminderEmail(row);
  await pool.query(
    'UPDATE calendar_events SET reminder_sent = TRUE, reminder_sent_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE id = $1',
    [id]
  );

  return { sent: true, eventId: Number(id), recipient: row.employee_email };
};

const findCalendarEventById = async (id) => {
  const result = await pool.query(`${calendarEventsQuery} WHERE ce.id = $1`, [id]);
  return result.rows[0] ? mapCalendarEvent(result.rows[0]) : null;
};

const runReminderJob = async () => {
  try {
    const targetDate = getTargetReminderDate();

    const result = await pool.query(`
      ${calendarEventsQuery}
      WHERE COALESCE(ce.reminder_sent, false) = false
        AND ce.employee_id IS NOT NULL
        AND ce.event_date IS NOT NULL
        AND ce.event_time IS NOT NULL
        AND ce.event_date = $1::date
      ORDER BY ce.event_date ASC, ce.event_time ASC
    `, [targetDate]);

    const sentEvents = [];
    const failedEvents = [];

    for (const row of result.rows) {
      const event = mapCalendarEvent(row);
      if (!event.employee?.email) continue;

      try {
        await sendReminderEmail(row);
        await pool.query(
          'UPDATE calendar_events SET reminder_sent = TRUE, reminder_sent_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE id = $1',
          [event.id]
        );
        sentEvents.push(event.id);
      } catch (err) {
        console.error(`[Agenda] Échec envoi email pour l'événement ${event.id}:`, err.message);
        failedEvents.push({ id: event.id, recipient: event.employee?.email, error: err.message });
      }
    }

    if (sentEvents.length > 0) {
      console.log(`[Agenda] ${sentEvents.length} rappel(s) envoyé(s): ${sentEvents.join(', ')}`);
    }

    return { sentEvents, failedEvents, targetDate };
  } catch (error) {
    console.error('[Agenda] Erreur durant la vérification des rappels:', error.message);
    return { sentEvents: [], failedEvents: [{ error: error.message }], targetDate: null };
  }
};

module.exports = {
  calendarEventsQuery,
  findCalendarEventById,
  mapCalendarEvent,
  runReminderJob,
  sendReminderForEventIfDue,
  smtpConfigured,
};
