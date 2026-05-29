import {
  LayoutDashboard,
  Map,
  FileText,
  Users,
  MessageSquare,
  ShoppingCart,
  Mail,
  PlusCircle,
  LogOut,
  X,
  CalendarDays,
  Briefcase,
  ConciergeBell,
  Sliders,
} from 'lucide-react';

const sectionTitle = {
  fontSize: '10px',
  fontWeight: 800,
  color: '#cbd5e1',
  letterSpacing: '0.1em',
  margin: '24px 24px 12px',
};

const NavItem = ({ icon, label, active, onClick, badge }) => (
  <div
    onClick={onClick}
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '10px 16px',
      borderRadius: '10px',
      cursor: 'pointer',
      marginBottom: '4px',
      backgroundColor: active ? '#0A2E36' : 'transparent',
      color: active ? '#fff' : '#64748b',
      transition: 'all 0.2s',
      fontWeight: active ? 700 : 500,
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      {icon}
      <span style={{ fontSize: '13px' }}>{label}</span>
    </div>
    {badge > 0 && (
      <span
        style={{
          backgroundColor: active ? '#fff' : '#000',
          color: active ? '#000' : '#fff',
          width: '18px',
          height: '18px',
          borderRadius: '50%',
          fontSize: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 900,
        }}
      >
        {badge}
      </span>
    )}
  </div>
);

const AdminSidebar = ({
  isMobile,
  showSidebar,
  setShowSidebar,
  activeTab,
  setActiveTab,
  bookings,
  messages,
  employees = [],
  calendarEvents = [],
  openAddModal,
  setIsLoggedIn,
}) => {
  const quickCreateType =
    activeTab === 'agenda'
      ? 'event'
      : activeTab === 'employees'
        ? 'employee'
        : activeTab === 'services'
          ? 'service'
          : activeTab === 'destinations'
            ? 'destination'
            : activeTab === 'slides'
              ? 'slide'
              : 'post';

  const quickCreateLabel =
    activeTab === 'agenda'
      ? 'Nouvel evenement'
      : activeTab === 'employees'
        ? 'Nouvel employe'
        : activeTab === 'services'
          ? 'Nouveau service'
          : activeTab === 'destinations'
            ? 'Nouvelle destination'
            : activeTab === 'slides'
              ? 'Nouveau slide'
              : 'Nouvel article';

  return (
    <>
      {isMobile && showSidebar && (
        <div
          onClick={() => setShowSidebar(false)}
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000 }}
        />
      )}

      {(!isMobile || showSidebar) && (
        <aside
          style={{
            width: '260px',
            backgroundColor: '#fff',
            display: 'flex',
            flexDirection: 'column',
            position: isMobile ? 'fixed' : 'sticky',
            left: 0,
            top: 0,
            height: '100vh',
            zIndex: 1001,
            borderRight: '1px solid #f1f5f9',
            padding: '24px 0',
            transform: isMobile && !showSidebar ? 'translateX(-100%)' : 'translateX(0)',
            transition: 'transform 0.3s ease',
          }}
        >
          <div
            style={{
              padding: '0 24px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '40px',
            }}
          >
            <img src="/image/Logo.png" alt="Logo" style={{ height: '32px', objectFit: 'contain' }} />
            <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: '#0A2E36' }}>Admin</h3>
            {isMobile && (
              <X
                onClick={() => setShowSidebar(false)}
                size={20}
                style={{ marginLeft: 'auto', cursor: 'pointer' }}
              />
            )}
          </div>

          <nav style={{ flex: 1, padding: '0 12px', overflowY: 'auto' }}>
            <p style={sectionTitle}>PERFORMANCE</p>
            <NavItem
              icon={<LayoutDashboard size={18} />}
              label="Dashboard"
              active={activeTab === 'dashboard'}
              onClick={() => {
                setActiveTab('dashboard');
                if (isMobile) setShowSidebar(false);
              }}
            />

            <p style={sectionTitle}>OPERATIONS</p>
            <NavItem
              icon={<CalendarDays size={18} />}
              label="Agenda"
              active={activeTab === 'agenda'}
              onClick={() => {
                setActiveTab('agenda');
                if (isMobile) setShowSidebar(false);
              }}
              badge={calendarEvents.length}
            />
            <NavItem
              icon={<Briefcase size={18} />}
              label="Employes"
              active={activeTab === 'employees'}
              onClick={() => {
                setActiveTab('employees');
                if (isMobile) setShowSidebar(false);
              }}
              badge={employees.length}
            />
            <NavItem
              icon={<ConciergeBell size={18} />}
              label="Services"
              active={activeTab === 'services'}
              onClick={() => {
                setActiveTab('services');
                if (isMobile) setShowSidebar(false);
              }}
            />
            <NavItem
              icon={<Map size={18} />}
              label="Destinations"
              active={activeTab === 'destinations'}
              onClick={() => {
                setActiveTab('destinations');
                if (isMobile) setShowSidebar(false);
              }}
            />
            <NavItem
              icon={<ShoppingCart size={18} />}
              label="Reservations"
              active={activeTab === 'bookings'}
              onClick={() => {
                setActiveTab('bookings');
                if (isMobile) setShowSidebar(false);
              }}
              badge={bookings.filter((booking) => booking.status === 'En attente').length}
            />
            <NavItem
              icon={<Mail size={18} />}
              label="Messages"
              active={activeTab === 'messages'}
              onClick={() => {
                setActiveTab('messages');
                if (isMobile) setShowSidebar(false);
              }}
              badge={messages.filter((message) => message.unread).length}
            />

            <p style={sectionTitle}>CONTENU</p>
            <NavItem
              icon={<Users size={18} />}
              label="Equipe"
              active={activeTab === 'team'}
              onClick={() => {
                setActiveTab('team');
                if (isMobile) setShowSidebar(false);
              }}
            />
            <NavItem
              icon={<MessageSquare size={18} />}
              label="Temoignages"
              active={activeTab === 'testimonials'}
              onClick={() => {
                setActiveTab('testimonials');
                if (isMobile) setShowSidebar(false);
              }}
            />
            <NavItem
              icon={<FileText size={18} />}
              label="Articles"
              active={activeTab === 'blog'}
              onClick={() => {
                setActiveTab('blog');
                if (isMobile) setShowSidebar(false);
              }}
            />
            <NavItem
              icon={<Sliders size={18} />}
              label="Slides Hero"
              active={activeTab === 'slides'}
              onClick={() => {
                setActiveTab('slides');
                if (isMobile) setShowSidebar(false);
              }}
            />
            <NavItem
              icon={<PlusCircle size={18} />}
              label={quickCreateLabel}
              active={false}
              onClick={() => {
                openAddModal(quickCreateType);
                if (isMobile) setShowSidebar(false);
              }}
            />
          </nav>

          <div style={{ padding: '0 16px', marginTop: 'auto' }}>
            <div
              onClick={() => {
                setIsLoggedIn(false);
                window.location.hash = '#';
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px',
                borderRadius: '12px',
                cursor: 'pointer',
                marginTop: '8px',
                color: '#ef4444',
                transition: 'all 0.2s',
              }}
            >
              <LogOut size={18} />
              <span style={{ fontSize: '13px', fontWeight: 700 }}>Deconnexion</span>
            </div>
          </div>
        </aside>
      )}
    </>
  );
};

export default AdminSidebar;
