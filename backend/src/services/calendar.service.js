const config = require('../config/env');
const pool = require('../db/pool');
const { buildEventDateTime, formatEventDate } = require('../utils/date');
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

const getReminderDateTime = (event) =>
  new Date(buildEventDateTime(event).getTime() - config.calendar.reminderLeadHours * 60 * 60 * 1000);

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
    'Merci de bien prendre vos dispositions.',
  ].join('\n');

  return sendMail({
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
};

const findCalendarEventById = async (id) => {
  const result = await pool.query(`${calendarEventsQuery} WHERE ce.id = $1`, [id]);
  return result.rows[0] ? mapCalendarEvent(result.rows[0]) : null;
};

const runReminderJob = async () => {
  try {
    const result = await pool.query(`
      ${calendarEventsQuery}
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

module.exports = {
  calendarEventsQuery,
  findCalendarEventById,
  mapCalendarEvent,
  runReminderJob,
  smtpConfigured,
};
