import { useRef, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import frLocale from '@fullcalendar/core/locales/fr';
import { CalendarPlus, ChevronLeft, ChevronRight, MapPin, Users } from 'lucide-react';

const AgendaView = ({
  events,
  openAddEventOnDate,
  openEditModal,
  onMoveEvent,
  reminderLeadDays,
  smtpConfigured,
  agendaViewMode,
  setAgendaViewMode,
}) => {
  const calendarRef = useRef(null);
  const [currentTitle, setCurrentTitle] = useState('');
  const [viewStart, setViewStart] = useState(null);
  const [viewEnd, setViewEnd] = useState(null);

  const getCalendarApi = () => calendarRef.current?.getApi();

  // Filtrer les événements pour la plage affichée (plus flexible)
  const filteredCalendarEvents = events.filter(event => {
    if (!viewStart || !viewEnd) return true;
    const eventDate = new Date(`${event.event_date}T00:00:00`);
    return eventDate >= viewStart && eventDate < viewEnd;
  });

  const monthTasksCount = filteredCalendarEvents.length;

  const handleEventClick = (clickInfo) => {
    const eventId = clickInfo.event.id;
    const originalEvent = events.find(e => String(e.id) === String(eventId));
    if (originalEvent) {
      openEditModal(originalEvent, 'event');
    }
  };

  const handleDateClick = (arg) => {
    const [date, rawTime] = arg.dateStr.split('T');
    openAddEventOnDate(date, rawTime ? rawTime.slice(0, 5) : '09:00');
  };

  const handleSelect = (selectionInfo) => {
    const [date, rawTime] = selectionInfo.startStr.split('T');
    openAddEventOnDate(date, rawTime ? rawTime.slice(0, 5) : '09:00');
    selectionInfo.view.calendar.unselect();
  };

  const handleEventDrop = async (dropInfo) => {
    const eventId = dropInfo.event.id;
    const originalEvent = events.find(e => String(e.id) === String(eventId));
    if (originalEvent) {
      const newDate = dropInfo.event.startStr.split('T')[0];
      const newTime = dropInfo.event.startStr.includes('T') 
        ? dropInfo.event.startStr.split('T')[1].slice(0, 5) 
        : originalEvent.event_time;
      await onMoveEvent(originalEvent, newDate, newTime);
    }
  };

  const calendarEvents = filteredCalendarEvents.map(event => ({
    id: String(event.id),
    title: event.title,
    start: `${event.event_date}T${event.event_time}`,
    backgroundColor: event.color || '#2563eb',
    borderColor: event.color || '#2563eb',
    extendedProps: { ...event }
  }));

  const changeView = (view) => {
    setAgendaViewMode(view);
    getCalendarApi()?.changeView(view);
  };

  const navigate = (action) => {
    const api = getCalendarApi();
    if (!api) return;
    api[action]();
    setCurrentTitle(api.view.title);
  };

  const renderEventContent = (eventInfo) => {
    const task = eventInfo.event.extendedProps;
    return (
      <div style={eventContentStyle}>
        <div style={eventContentTopStyle}>
          <span>{eventInfo.timeText}</span>
          <span style={eventStatusStyle}>{statusLabels[task.status] || 'A faire'}</span>
        </div>
        <strong style={eventTitleStyle}>{eventInfo.event.title}</strong>
        <div style={eventMetaStyle}>
          {task.employee?.name && <span><Users size={11} /> {task.employee.name}</span>}
          {task.location && <span><MapPin size={11} /> {task.location}</span>}
        </div>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={heroCardStyle}>
        <div>
          <div style={eyebrowStyle}>Agenda web SaaS</div>
          <h2 style={{ margin: '8px 0 10px', fontSize: 30, color: '#082f49' }}>Planifiez tâches, échéances et rappels</h2>
          <p style={{ margin: 0, color: '#475569', maxWidth: 620 }}>
            Cliquez sur un créneau libre pour créer une tâche, déplacez-la par glisser-déposer et gardez le rappel e-mail J-{reminderLeadDays}.
          </p>
        </div>
        <div style={heroStatsStyle}>
          <MiniStat label="Tâches du mois" value={monthTasksCount} />
          <MiniStat label="Rappel" value={`Rappel automatique J-${reminderLeadDays}`} />
          <MiniStat label="SMTP" value={smtpConfigured ? 'Actif' : 'A configurer'} />
        </div>
      </div>

      <div style={panelStyle}>
        <div style={calendarToolbarStyle}>
          <div>
            <div style={eyebrowStyle}>Planning interactif</div>
            <h3 style={calendarTitleStyle}>{currentTitle || 'Agenda'}</h3>
          </div>

          <div style={toolbarActionsStyle}>
            <div style={segmentedControlStyle}>
            {[
              ['dayGridMonth', 'Mois'],
              ['timeGridWeek', 'Semaine'],
              ['timeGridDay', 'Jour'],
            ].map(([value, label]) => (
              <button
                key={value}
                onClick={() => changeView(value)}
                style={{
                  ...segmentedButtonStyle,
                  backgroundColor: agendaViewMode === value ? '#082f49' : 'transparent',
                  color: agendaViewMode === value ? '#fff' : '#334155',
                }}
              >
                {label}
              </button>
            ))}
            </div>
            <button type="button" onClick={() => navigate('prev')} style={iconNavStyle} aria-label="Periode precedente">
              <ChevronLeft size={18} />
            </button>
            <button type="button" onClick={() => navigate('today')} style={todayButtonStyle}>
              Aujourd'hui
            </button>
            <button type="button" onClick={() => navigate('next')} style={iconNavStyle} aria-label="Periode suivante">
              <ChevronRight size={18} />
            </button>
            <button type="button" onClick={() => openAddEventOnDate(new Date().toISOString().slice(0, 10))} style={createButtonStyle}>
              <CalendarPlus size={16} />
              Nouvelle tache
            </button>
          </div>
        </div>

        <div className="full-calendar-wrapper">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView={agendaViewMode}
            initialDate={new Date()}
            headerToolbar={false}
            events={calendarEvents}
            locale={frLocale}
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            weekends={true}
            datesSet={(info) => {
              setCurrentTitle(info.view.title);
              setViewStart(info.start);
              setViewEnd(info.end);
            }}
            eventClick={handleEventClick}
            dateClick={handleDateClick}
            select={handleSelect}
            eventDrop={handleEventDrop}
            eventContent={renderEventContent}
            eventTimeFormat={{
              hour: '2-digit',
              minute: '2-digit',
              meridiem: false,
              hour12: false
            }}
            height="auto"
            slotMinTime="07:00:00"
            slotMaxTime="20:00:00"
            nowIndicator={true}
            allDaySlot={false}
          />
        </div>
      </div>
      
      <style>{`
        .full-calendar-wrapper .fc {
          font-family: 'Plus Jakarta Sans', sans-serif;
          --fc-border-color: #e2e8f0;
          --fc-daygrid-event-dot-width: 8px;
        }
        .full-calendar-wrapper .fc-header-toolbar {
          margin-bottom: 1.5em !important;
        }
        .full-calendar-wrapper .fc-view-harness {
          background-color: #fff;
          border-radius: 12px;
        }
        .full-calendar-wrapper .fc-col-header-cell {
          padding: 12px 0;
          background-color: #f8fafc;
          font-weight: 800;
          font-size: 13px;
          color: #64748b;
        }
        .full-calendar-wrapper .fc-day-today {
          background-color: rgba(15, 118, 110, 0.04) !important;
        }
        .full-calendar-wrapper .fc-event {
          cursor: pointer;
          border: none;
          padding: 0;
          border-radius: 10px;
          font-weight: 600;
          font-size: 11px;
          overflow: hidden;
        }
        .full-calendar-wrapper .fc-timegrid-event {
          box-shadow: 0 8px 18px rgba(15, 23, 42, 0.12);
        }
        .full-calendar-wrapper .fc-daygrid-day {
          cursor: pointer;
        }
        .full-calendar-wrapper .fc-timegrid-slot {
          height: 42px;
        }
      `}</style>
    </div>
  );
};

const statusLabels = {
  todo: 'A faire',
  in_progress: 'En cours',
  done: 'Terminee',
  blocked: 'Bloquee',
};

const MiniStat = ({ label, value }) => (
  <div style={miniStatCardStyle}>
    <div style={fieldLabelStyle}>{label}</div>
    <div style={{ fontSize: 18, fontWeight: 800, color: '#082f49' }}>{value}</div>
  </div>
);

// Styles copied from Admin.jsx
const heroCardStyle = {
  background: 'linear-gradient(135deg, rgba(240,253,250,0.95), rgba(224,242,254,0.95))',
  border: '1px solid rgba(125,211,252,0.5)',
  borderRadius: 28,
  padding: 28,
  display: 'flex',
  justifyContent: 'space-between',
  gap: 24,
  flexWrap: 'wrap',
};

const heroStatsStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
  gap: 12,
  minWidth: 320,
  flex: 1,
};

const miniStatCardStyle = {
  backgroundColor: 'rgba(255,255,255,0.78)',
  borderRadius: 20,
  padding: 16,
  border: '1px solid rgba(255,255,255,0.8)',
};

const fieldLabelStyle = {
  fontSize: 11,
  fontWeight: 900,
  color: '#94a3b8',
  marginBottom: 10,
  display: 'block',
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
};

const eyebrowStyle = {
  fontSize: 11,
  fontWeight: 900,
  letterSpacing: '0.14em',
  color: '#0f766e',
  textTransform: 'uppercase',
};

const panelStyle = {
  backgroundColor: 'rgba(255,255,255,0.92)',
  borderRadius: 28,
  padding: 24,
  border: '1px solid #e2e8f0',
  boxShadow: '0 20px 60px rgba(15, 23, 42, 0.06)',
};

const segmentedControlStyle = {
  display: 'inline-flex',
  padding: 4,
  borderRadius: 14,
  border: '1px solid #dbeafe',
  backgroundColor: '#fff',
};

const segmentedButtonStyle = {
  border: 'none',
  height: 36,
  padding: '0 16px',
  borderRadius: 10,
  fontSize: 12,
  fontWeight: 800,
  cursor: 'pointer',
};

const calendarToolbarStyle = {
  marginBottom: 20,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 16,
  flexWrap: 'wrap',
};

const toolbarActionsStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  flexWrap: 'wrap',
};

const calendarTitleStyle = {
  margin: '6px 0 0',
  color: '#082f49',
  fontSize: 22,
  textTransform: 'capitalize',
};

const iconNavStyle = {
  width: 38,
  height: 38,
  borderRadius: 12,
  border: '1px solid #dbeafe',
  backgroundColor: '#fff',
  color: '#082f49',
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const todayButtonStyle = {
  height: 38,
  borderRadius: 12,
  border: '1px solid #dbeafe',
  backgroundColor: '#f8fafc',
  color: '#082f49',
  cursor: 'pointer',
  padding: '0 14px',
  fontSize: 12,
  fontWeight: 800,
};

const createButtonStyle = {
  height: 38,
  borderRadius: 12,
  border: 'none',
  backgroundColor: '#0f766e',
  color: '#fff',
  cursor: 'pointer',
  padding: '0 14px',
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  fontSize: 12,
  fontWeight: 900,
};

const eventContentStyle = {
  padding: '6px 8px',
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
  minWidth: 0,
};

const eventContentTopStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 6,
  fontSize: 10,
  opacity: 0.92,
};

const eventStatusStyle = {
  backgroundColor: 'rgba(255,255,255,0.22)',
  borderRadius: 999,
  padding: '2px 6px',
  whiteSpace: 'nowrap',
};

const eventTitleStyle = {
  display: 'block',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  fontSize: 12,
};

const eventMetaStyle = {
  display: 'flex',
  gap: 8,
  flexWrap: 'wrap',
  fontSize: 10,
  opacity: 0.9,
};

export default AgendaView;
