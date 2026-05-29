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

const buildEventDateTime = (event) =>
  new Date(`${toLocalDatePart(event.event_date)}T${normalizeEventTime(event.event_time)}`);

const formatEventDate = (eventDate, eventTime) =>
  new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'full',
    timeStyle: 'short',
  }).format(new Date(`${toLocalDatePart(eventDate)}T${normalizeEventTime(eventTime)}`));

module.exports = {
  buildEventDateTime,
  formatEventDate,
  normalizeEventTime,
  toLocalDatePart,
};
