import React, { useEffect, useMemo, useState } from 'react';
import {
  BellRing,
  CalendarDays,
  Check,
  Clock3,
  Grid,
  Image as ImageIcon,
  List,
  Mail,
  MapPin,
  Pencil,
  Plus,
  Search,
  Shield,
  Trash2,
  User as UserIcon,
  Users,
  X,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { apiService } from '../services/api';
import { getImageUrl } from '../services/images';

import AdminSidebar from '../components/admin/AdminSidebar';
import AdminHeader from '../components/admin/AdminHeader';
import DashboardView from '../components/admin/DashboardView';
import ProductGrid from '../components/admin/ProductGrid';
import BookingsView from '../components/admin/BookingsView';
import MessagesView from '../components/admin/MessagesView';
import TeamView from '../components/admin/TeamView';
import TestimonialsView from '../components/admin/TestimonialsView';

const emptyFormData = {
  name: '',
  type: '',
  price: '',
  status: 'Actif',
  image_url: '',
  description: '',
  itinerary: '',
  accommodation: '',
  budget: '',
  tips: '',
  highlights: '',
  title: '',
  category: '',
  content: '',
  role: '',
  bio: '',
  facebook_url: '',
  twitter_url: '',
  instagram_url: '',
  pinterest_url: '',
  rating: 5,
  email: '',
  phone: '',
  event_type: 'reunion',
  event_date: '',
  event_time: '09:00',
  location: '',
  employee_id: '',
  button_text: '',
  link: '',
  slide_order: 0,
  subtitle: '',
};

const todayKey = () => new Date().toISOString().slice(0, 10);
const monthKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};

const formatDateLabel = (value) =>
  new Date(`${value}T00:00:00`).toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

const formatEventDateTime = (event) =>
  new Date(`${event.event_date}T${event.event_time}:00`).toLocaleString('fr-FR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });

const getReminderLabel = (hours) => `Rappel automatique ${hours}h avant`;

const normalizeSearch = (value) => (value || '').toLowerCase();

const parseItinerary = (itineraryStr, destination) => {
  let itineraryTitle = `Découvrez ${destination?.name || ''}`;
  let itineraryDesc = destination?.description || '';
  let stops = [];

  if (itineraryStr) {
    const trimmed = itineraryStr.trim();
    if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
      try {
        const parsed = JSON.parse(trimmed);
        itineraryTitle = parsed.title || itineraryTitle;
        itineraryDesc = parsed.description || itineraryDesc;
        stops = parsed.stops || [];
        return { title: itineraryTitle, description: itineraryDesc, stops };
      } catch (e) {
        console.error("Failed to parse itinerary JSON object", e);
      }
    } else if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      try {
        stops = JSON.parse(trimmed);
        return { title: itineraryTitle, description: itineraryDesc, stops };
      } catch (e) {
        console.error("Failed to parse itinerary JSON array", e);
      }
    }

    // Fallback to legacy parser:
    const lines = trimmed.split('\n').filter(p => p.trim() !== '');
    let startIndex = 0;
    
    const isStopPattern = (str) => {
      return /^(Jour\s+\d+|Étape\s+\d+|Stop\s+\d+|[A-Za-zÀ-ÿ\s\-]+[:\-]\s*[A-Za-zÀ-ÿ\s\-]+)/i.test(str.trim());
    };

    if (lines.length > 0 && !isStopPattern(lines[0])) {
      itineraryTitle = lines[0].trim();
      startIndex = 1;
      if (lines.length > 1 && !isStopPattern(lines[1])) {
        itineraryDesc = lines[1].trim();
        startIndex = 2;
      }
    }

    const stopLines = lines.slice(startIndex);
    const fallbackImages = ['/image/about_hero.png', '/image/mountain.png', '/image/madagascar_river_boat.png', '/image/beach_sunset_hero.png'];
    
    stops = stopLines.map((p, idx) => {
      let title = `Étape ${idx + 1}`;
      let desc = p;
      let incontournable = "Découverte des plus beaux secrets et panoramas de cette étape phare du circuit.";
      const matchTitle = p.match(/^(Jour\s+\d+|[A-Za-zÀ-ÿ\s\-]+)\s*[:\-]/i);
      if (matchTitle) {
        title = matchTitle[1].trim();
        desc = p.substring(matchTitle[0].length).trim();
      }
      const isLast = idx === stopLines.length - 1;
      return {
        name: title,
        role: idx === 0 ? 'Départ' : isLast ? 'Arrivée' : 'Escale',
        description: desc,
        incontournable: incontournable,
        image: fallbackImages[idx % fallbackImages.length],
        transit: !isLast ? `Transfert Local ➔ Étape ${idx + 2} - ~ 3h` : '',
        transitType: 'car'
      };
    });
  }

  return { title: itineraryTitle, description: itineraryDesc, stops };
};

const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('agenda');
  const [showSidebar, setShowSidebar] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [adminConfig, setAdminConfig] = useState({
    adminUser: 'Tourisme',
    reminderLeadHours: 24,
    smtpConfigured: false,
  });

  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [visibleMonth, setVisibleMonth] = useState(monthKey(new Date()));
  const [selectedDate, setSelectedDate] = useState(todayKey());

  const [destinations, setDestinations] = useState([]);
  const [services, setServices] = useState([]);
  const [posts, setPosts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [team, setTeam] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [slides, setSlides] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [modalType, setModalType] = useState('event');
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyFormData);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [dialog, setDialog] = useState({ show: false, message: '', type: 'alert', onConfirm: null });
  const [itineraryData, setItineraryData] = useState({ title: '', description: '', stops: [] });

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    apiService.getAdminConfig().then(setAdminConfig).catch(() => null);
  }, []);

  useEffect(() => {
    if (!isLoggedIn) return;
    fetchData();
  }, [isLoggedIn, visibleMonth]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [d, s, m, p, b, t, te, e, events, sl] = await Promise.all([
        apiService.getDestinations(),
        apiService.getServices(),
        apiService.getMessages(),
        apiService.getPosts(),
        apiService.getBookings(),
        apiService.getTeam(),
        apiService.getTestimonials(),
        apiService.getEmployees(),
        apiService.getCalendarEvents(visibleMonth),
        apiService.getSlides(),
      ]);

      setDestinations(d);
      setServices(s);
      setMessages(m);
      setPosts(p);
      setBookings(b);
      setTeam(t);
      setTestimonials(te);
      setEmployees(e);
      setCalendarEvents(events);
      setSlides(sl);
    } catch (error) {
      console.error(error);
      setDialog({ show: true, type: 'alert', message: error.message, onConfirm: null });
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      await apiService.loginAdmin(loginData);
      setIsLoggedIn(true);
      setLoginError('');
    } catch (error) {
      setLoginError(error.message);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setLoginData({ username: '', password: '' });
    setLoginError('');
  };

  const resetForm = (type = 'event') => {
    setModalType(type);
    setEditingId(null);
    setSelectedFile(null);
    setFormData({
      ...emptyFormData,
      event_date: selectedDate,
    });
    if (type === 'destination') {
      setItineraryData({ title: '', description: '', stops: [] });
    }
  };

  const openAddModal = (type = 'event') => {
    resetForm(type);
    setShowModal(true);
  };

  const openEditModal = (item, type = 'event') => {
    setModalType(type);
    setEditingId(item.id);
    setSelectedFile(null);

    if (type === 'event') {
      setFormData({
        ...emptyFormData,
        ...item,
        employee_id: item.employee?.id || item.employee_id || '',
      });
    } else {
      setFormData({ ...emptyFormData, ...item });
    }

    if (type === 'destination') {
      setItineraryData(parseItinerary(item.itinerary, item));
    }

    setShowModal(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setUploading(true);

    try {
      let finalImageUrl = formData.image_url;

      if (selectedFile) {
        const uploadResult = await apiService.uploadImage(selectedFile);
        finalImageUrl = uploadResult.imageUrl;
      }

      switch (modalType) {
        case 'destination': {
          const payload = {
            name: formData.name,
            type: formData.type,
            price: formData.price,
            status: formData.status,
            image_url: finalImageUrl,
            description: formData.description,
            itinerary: JSON.stringify(itineraryData),
            accommodation: formData.accommodation,
            budget: formData.budget,
            tips: formData.tips,
            highlights: formData.highlights,
          };
          if (editingId) await apiService.updateDestination(editingId, payload);
          else await apiService.createDestination(payload);
          break;
        }
        case 'service': {
          const payload = {
            name: formData.name,
            description: formData.description,
            image_url: finalImageUrl,
            status: formData.status,
          };
          if (editingId) await apiService.updateService(editingId, payload);
          else await apiService.createService(payload);
          break;
        }
        case 'post': {
          const payload = {
            title: formData.title,
            category: formData.category,
            content: formData.content,
            image_url: finalImageUrl,
          };
          if (editingId) await apiService.updatePost(editingId, payload);
          else await apiService.createPost(payload);
          break;
        }
        case 'team': {
          const payload = {
            name: formData.name,
            role: formData.role,
            bio: formData.bio,
            image_url: finalImageUrl,
            facebook_url: formData.facebook_url,
            twitter_url: formData.twitter_url,
            instagram_url: formData.instagram_url,
            pinterest_url: formData.pinterest_url,
          };
          if (editingId) await apiService.updateTeam(editingId, payload);
          else await apiService.createTeam(payload);
          break;
        }
        case 'testimonial': {
          const payload = {
            name: formData.name,
            role: formData.role,
            content: formData.content,
            rating: formData.rating,
            image_url: finalImageUrl,
          };
          if (editingId) await apiService.updateTestimonial(editingId, payload);
          else await apiService.createTestimonial(payload);
          break;
        }
        case 'slide': {
          const payload = {
            title: formData.title,
            subtitle: formData.subtitle,
            description: formData.description,
            image_url: finalImageUrl,
            button_text: formData.button_text,
            link: formData.link,
            slide_order: Number(formData.slide_order || 0),
          };
          if (editingId) await apiService.updateSlide(editingId, payload);
          else await apiService.createSlide(payload);
          break;
        }
        case 'employee': {
          const payload = {
            name: formData.name,
            email: formData.email,
            role: formData.role,
            phone: formData.phone,
            status: formData.status,
          };
          if (editingId) await apiService.updateEmployee(editingId, payload);
          else await apiService.createEmployee(payload);
          break;
        }
        case 'event': {
          const payload = {
            title: formData.title,
            event_type: formData.event_type,
            event_date: formData.event_date,
            event_time: formData.event_time,
            location: formData.location,
            employee_id: formData.employee_id || null,
            description: formData.description,
          };
          if (editingId) await apiService.updateCalendarEvent(editingId, payload);
          else await apiService.createCalendarEvent(payload);
          break;
        }
        default:
          break;
      }

      setShowModal(false);
      await fetchData();
    } catch (error) {
      setDialog({ show: true, type: 'alert', message: error.message, onConfirm: null });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = (id, type) => {
    const labelMap = {
      destination: 'cette destination',
      service: 'ce service',
      post: 'cet article',
      team: 'ce membre de l equipe',
      testimonial: 'ce temoignage',
      employee: 'cet employe',
      event: 'cet evenement',
      booking: 'cette reservation',
      message: 'ce message',
      slide: 'ce slide',
    };

    setDialog({
      show: true,
      type: 'confirm',
      message: `Voulez-vous vraiment supprimer ${labelMap[type] || 'cet element'} ?`,
      onConfirm: async () => {
        try {
          if (type === 'destination') await apiService.deleteDestination(id);
          if (type === 'service') await apiService.deleteService(id);
          if (type === 'post') await apiService.deletePost(id);
          if (type === 'team') await apiService.deleteTeam(id);
          if (type === 'testimonial') await apiService.deleteTestimonial(id);
          if (type === 'employee') await apiService.deleteEmployee(id);
          if (type === 'event') await apiService.deleteCalendarEvent(id);
          if (type === 'booking') await apiService.deleteBooking(id);
          if (type === 'message') await apiService.deleteMessage(id);
          if (type === 'slide') await apiService.deleteSlide(id);
          setDialog((current) => ({ ...current, show: false }));
          await fetchData();
        } catch (error) {
          setDialog({ show: true, type: 'alert', message: error.message, onConfirm: null });
        }
      },
    });
  };

  const handleMarkRead = async (id) => {
    await apiService.markMessageRead(id);
    fetchData();
  };

  const handleUpdateBookingStatus = async (id, status) => {
    await apiService.updateBookingStatus(id, status);
    fetchData();
  };

  const handleSendReminders = async () => {
    try {
      const result = await apiService.sendCalendarReminders();
      const count = result.sentEvents.length;
      const smtpState = result.smtpConfigured ? 'emails envoyes' : 'simulation sans SMTP';
      setDialog({
        show: true,
        type: 'alert',
        message: `${count} rappel(s) traites (${smtpState}).`,
        onConfirm: null,
      });
      fetchData();
    } catch (error) {
      setDialog({ show: true, type: 'alert', message: error.message, onConfirm: null });
    }
  };

  const handleSendTestEmail = async () => {
    try {
      const result = await apiService.sendCalendarTestEmail();
      const mode = result.simulated ? 'simulation sans SMTP' : 'email envoye';
      setDialog({
        show: true,
        type: 'alert',
        message: `Test effectue vers ${result.recipient} (${mode}).`,
        onConfirm: null,
      });
    } catch (error) {
      setDialog({ show: true, type: 'alert', message: error.message, onConfirm: null });
    }
  };

  const visibleEvents = useMemo(
    () =>
      calendarEvents.filter((item) => {
        const search = normalizeSearch(searchTerm);
        if (!search) return true;
        return [
          item.title,
          item.location,
          item.description,
          item.employee?.name,
          item.event_type,
        ].some((value) => normalizeSearch(value).includes(search));
      }),
    [calendarEvents, searchTerm]
  );

  const selectedDayEvents = useMemo(
    () => visibleEvents.filter((item) => item.event_date === selectedDate),
    [selectedDate, visibleEvents]
  );

  const filteredEmployees = useMemo(
    () =>
      employees.filter((item) =>
        [item.name, item.email, item.role, item.status].some((value) =>
          normalizeSearch(value).includes(normalizeSearch(searchTerm))
        )
      ),
    [employees, searchTerm]
  );

  const getTabTitle = () => {
    const titles = {
      dashboard: 'TABLEAU DE BORD',
      agenda: 'AGENDA PROFESSIONNEL',
      employees: 'GESTION DES EMPLOYES',
      services: 'GESTION DES SERVICES',
      destinations: 'DESTINATIONS',
      blog: 'ARTICLES',
      team: 'EQUIPE',
      testimonials: 'TEMOIGNAGES',
      bookings: 'RESERVATIONS',
      messages: 'MESSAGES',
      slides: 'SLIDES HERO',
    };
    return titles[activeTab] || 'ADMIN';
  };

  const addActionType = useMemo(() => {
    if (activeTab === 'agenda') return 'event';
    if (activeTab === 'employees') return 'employee';
    if (activeTab === 'services') return 'service';
    if (activeTab === 'destinations') return 'destination';
    if (activeTab === 'team') return 'team';
    if (activeTab === 'testimonials') return 'testimonial';
    if (activeTab === 'slides') return 'slide';
    return 'post';
  }, [activeTab]);

  if (!isLoggedIn) {
    return (
      <div style={loginContainerStyle}>
        <div style={{ width: '100%', maxWidth: 400 }}>
          <form onSubmit={handleLogin} style={loginFormStyle}>
            <div style={accentLineStyle} />
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <img src="/image/Logo.png" alt="Logo" style={{ height: 82, margin: '0 auto 20px', display: 'block' }} />
              <h2 style={loginTitleStyle}>Administration</h2>
              <p style={{ color: '#64748b', fontSize: 14, margin: 0 }}>Agenda professionnel et gestion du site</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <InputGroup
                label="Utilisateur"
                icon={<UserIcon size={16} />}
                type="text"
                value={loginData.username}
                onChange={(e) => setLoginData((current) => ({ ...current, username: e.target.value }))}
              />
              <InputGroup
                label="Mot de passe"
                icon={<Shield size={16} />}
                type="password"
                value={loginData.password}
                onChange={(e) => setLoginData((current) => ({ ...current, password: e.target.value }))}
              />
              {loginError && <div style={errorStyle}>{loginError}</div>}
              <button style={loginButtonStyle} type="submit">
                Se connecter
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={appShellStyle}>
      <AdminSidebar
        isMobile={isMobile}
        showSidebar={showSidebar}
        setShowSidebar={setShowSidebar}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        bookings={bookings}
        messages={messages}
        employees={employees}
        calendarEvents={calendarEvents}
        openAddModal={openAddModal}
        setIsLoggedIn={setIsLoggedIn}
      />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <AdminHeader
          isMobile={isMobile}
          setShowSidebar={setShowSidebar}
          getTabTitle={getTabTitle}
          messages={messages}
          onLogout={handleLogout}
          onForceRelogin={() => {
            setLoginError('');
            handleLogout();
          }}
        />

        <main style={mainStyle}>
          {!showModal && (
            <div style={controlsRowStyle}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Search size={18} style={searchIconStyle} />
                <input
                  placeholder="Rechercher..."
                  style={searchBarStyle}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <IconButton icon={<Grid size={18} />} active={viewMode === 'grid'} onClick={() => setViewMode('grid')} />
                <IconButton icon={<List size={18} />} active={viewMode === 'list'} onClick={() => setViewMode('list')} />
                {activeTab === 'agenda' && (
                  <button onClick={handleSendTestEmail} style={secondaryButtonStyle}>
                    <Mail size={16} />
                    Tester l email
                  </button>
                )}
                {activeTab === 'agenda' && (
                  <button onClick={handleSendReminders} style={secondaryButtonStyle}>
                    <BellRing size={16} />
                    Envoyer les rappels
                  </button>
                )}
                <button onClick={() => openAddModal(addActionType)} style={addButtonStyle}>
                  <Plus size={18} />
                  AJOUTER
                </button>
              </div>
            </div>
          )}

          {showModal ? (
            <AdminForm
              modalType={modalType}
              editingId={editingId}
              formData={formData}
              setFormData={setFormData}
              selectedFile={selectedFile}
              setSelectedFile={setSelectedFile}
              handleSubmit={handleSubmit}
              setShowModal={setShowModal}
              uploading={uploading}
              employees={employees}
              reminderLeadHours={adminConfig.reminderLeadHours}
              itineraryData={itineraryData}
              setItineraryData={setItineraryData}
            />
          ) : loading ? (
            <div style={emptyStateStyle}>Chargement des donnees...</div>
          ) : (
            <>
              {activeTab === 'dashboard' && <DashboardView d={destinations} b={bookings} m={messages} />}
              {activeTab === 'agenda' && (
                <AgendaView
                  visibleMonth={visibleMonth}
                  setVisibleMonth={setVisibleMonth}
                  selectedDate={selectedDate}
                  setSelectedDate={setSelectedDate}
                  events={visibleEvents}
                  selectedDayEvents={selectedDayEvents}
                  openAddModal={openAddModal}
                  openEditModal={openEditModal}
                  onDelete={(id) => handleDelete(id, 'event')}
                  reminderLeadHours={adminConfig.reminderLeadHours}
                  smtpConfigured={adminConfig.smtpConfigured}
                />
              )}
              {activeTab === 'employees' && (
                <EmployeeView employees={filteredEmployees} openEditModal={openEditModal} onDelete={handleDelete} />
              )}
              {activeTab === 'services' && (
                <ProductGrid
                  d={services.filter((item) => normalizeSearch(item.name).includes(normalizeSearch(searchTerm)))}
                  viewMode={viewMode}
                  openEdit={(item) => openEditModal(item, 'service')}
                  onDelete={(id) => handleDelete(id, 'service')}
                />
              )}
              {activeTab === 'destinations' && (
                <ProductGrid
                  d={destinations.filter((item) => normalizeSearch(item.name).includes(normalizeSearch(searchTerm)))}
                  viewMode={viewMode}
                  openEdit={(item) => openEditModal(item, 'destination')}
                  onDelete={(id) => handleDelete(id, 'destination')}
                />
              )}
              {activeTab === 'blog' && (
                <ProductGrid
                  p={posts.filter((item) => normalizeSearch(item.title).includes(normalizeSearch(searchTerm)))}
                  viewMode={viewMode}
                  openEdit={(item) => openEditModal(item, 'post')}
                  onDelete={(id) => handleDelete(id, 'post')}
                />
              )}
              {activeTab === 'team' && (
                <TeamView
                  t={team.filter((item) => normalizeSearch(item.name).includes(normalizeSearch(searchTerm)))}
                  viewMode={viewMode}
                  openEdit={(item) => openEditModal(item, 'team')}
                  onDelete={(id) => handleDelete(id, 'team')}
                />
              )}
              {activeTab === 'bookings' && (
                <BookingsView
                  b={bookings.filter(
                    (item) =>
                      normalizeSearch(item.sender).includes(normalizeSearch(searchTerm)) ||
                      normalizeSearch(item.tour_name).includes(normalizeSearch(searchTerm))
                  )}
                  onUpdateStatus={handleUpdateBookingStatus}
                  onDelete={(id) => handleDelete(id, 'booking')}
                  onView={(item) => {
                    setSelectedBooking(item);
                    setShowBookingModal(true);
                  }}
                />
              )}
              {activeTab === 'messages' && (
                <MessagesView
                  m={messages.filter(
                    (item) =>
                      normalizeSearch(item.sender).includes(normalizeSearch(searchTerm)) ||
                      normalizeSearch(item.content).includes(normalizeSearch(searchTerm))
                  )}
                  onDelete={(id) => handleDelete(id, 'message')}
                  onMarkRead={handleMarkRead}
                />
              )}
              {activeTab === 'testimonials' && (
                <TestimonialsView
                  t={testimonials.filter((item) => normalizeSearch(item.name).includes(normalizeSearch(searchTerm)))}
                  viewMode={viewMode}
                  openEdit={(item) => openEditModal(item, 'testimonial')}
                  onDelete={(id) => handleDelete(id, 'testimonial')}
                />
              )}
              {activeTab === 'slides' && (
                <ProductGrid
                  p={slides.filter((item) => normalizeSearch(item.title).includes(normalizeSearch(searchTerm)))}
                  viewMode={viewMode}
                  openEdit={(item) => openEditModal(item, 'slide')}
                  onDelete={(id) => handleDelete(id, 'slide')}
                />
              )}
            </>
          )}
        </main>
      </div>

      {dialog.show && <Dialog dialog={dialog} setDialog={setDialog} />}
      {showBookingModal && (
        <BookingDetailModal selectedBooking={selectedBooking} setShowBookingModal={setShowBookingModal} />
      )}
    </div>
  );
};

const InputGroup = ({ label, icon, ...props }) => (
  <div>
    <label style={inputLabelStyle}>{label}</label>
    <div style={{ position: 'relative' }}>
      <span style={inputIconStyle}>{icon}</span>
      <input {...props} style={loginInputStyle} />
    </div>
  </div>
);

const IconButton = ({ icon, active, onClick }) => (
  <button
    onClick={onClick}
    style={{
      ...iconButtonStyle,
      backgroundColor: active ? '#fff' : 'transparent',
      color: active ? '#000' : '#94a3b8',
      boxShadow: active ? '0 4px 12px rgba(0,0,0,0.05)' : 'none',
    }}
  >
    {icon}
  </button>
);

const AgendaView = ({
  visibleMonth,
  setVisibleMonth,
  selectedDate,
  setSelectedDate,
  events,
  selectedDayEvents,
  openAddModal,
  openEditModal,
  onDelete,
  reminderLeadHours,
  smtpConfigured,
}) => {
  const [year, month] = visibleMonth.split('-').map(Number);
  const firstDay = new Date(year, month - 1, 1);
  const totalDays = new Date(year, month, 0).getDate();
  const startOffset = (firstDay.getDay() + 6) % 7;

  const days = [];
  for (let index = 0; index < startOffset; index += 1) {
    days.push(null);
  }
  for (let day = 1; day <= totalDays; day += 1) {
    days.push(`${visibleMonth}-${String(day).padStart(2, '0')}`);
  }

  const groupedEvents = events.reduce((accumulator, event) => {
    accumulator[event.event_date] = accumulator[event.event_date] || [];
    accumulator[event.event_date].push(event);
    return accumulator;
  }, {});

  const currentMonthLabel = firstDay.toLocaleDateString('fr-FR', {
    month: 'long',
    year: 'numeric',
  });

  const moveMonth = (offset) => {
    const nextDate = new Date(year, month - 1 + offset, 1);
    const nextMonth = monthKey(nextDate);
    setVisibleMonth(nextMonth);
    if (!selectedDate.startsWith(nextMonth)) {
      setSelectedDate(`${nextMonth}-01`);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={heroCardStyle}>
        <div>
          <div style={eyebrowStyle}>Agenda telephone like</div>
          <h2 style={{ margin: '8px 0 10px', fontSize: 30, color: '#082f49' }}>Planifiez reunions, programmes et rappels</h2>
          <p style={{ margin: 0, color: '#475569', maxWidth: 620 }}>
            Chaque evenement peut etre rattache a un employe et declenche un rappel e-mail automatique la veille.
          </p>
        </div>
        <div style={heroStatsStyle}>
          <MiniStat label="Evenements du mois" value={events.length} />
          <MiniStat label="Rappel" value={getReminderLabel(reminderLeadHours)} />
          <MiniStat label="SMTP" value={smtpConfigured ? 'Actif' : 'A configurer'} />
        </div>
      </div>

      <div style={agendaGridStyle}>
        <section style={panelStyle}>
          <div style={calendarHeaderStyle}>
            <button onClick={() => moveMonth(-1)} style={monthNavButtonStyle}>
              <X size={14} style={{ transform: 'rotate(45deg)' }} />
            </button>
            <div>
              <div style={eyebrowStyle}>Vue calendrier</div>
              <h3 style={{ margin: '6px 0 0', fontSize: 22, textTransform: 'capitalize' }}>{currentMonthLabel}</h3>
            </div>
            <button onClick={() => moveMonth(1)} style={monthNavButtonStyle}>
              <X size={14} style={{ transform: 'rotate(-45deg)' }} />
            </button>
          </div>

          <div style={weekdayGridStyle}>
            {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day) => (
              <div key={day} style={weekdayCellStyle}>
                {day}
              </div>
            ))}
          </div>

          <div style={monthGridStyle}>
            {days.map((day, index) => {
              if (!day) {
                return <div key={`empty-${index}`} style={{ ...dayCellStyle, background: 'transparent', border: 'none' }} />;
              }

              const items = groupedEvents[day] || [];
              const isSelected = day === selectedDate;
              const isToday = day === todayKey();

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDate(day)}
                  style={{
                    ...dayCellStyle,
                    border: isSelected ? '1px solid #0f766e' : '1px solid #e2e8f0',
                    background: isSelected
                      ? 'linear-gradient(180deg, rgba(15,118,110,0.08), rgba(255,255,255,0.95))'
                      : '#fff',
                    boxShadow: isSelected ? '0 10px 24px rgba(15, 118, 110, 0.12)' : 'none',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 800, color: isToday ? '#0f766e' : '#0f172a' }}>{Number(day.slice(-2))}</span>
                    {items.length > 0 && <span style={badgeStyle}>{items.length}</span>}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {items.slice(0, 2).map((item) => (
                      <div key={item.id} style={eventPillStyle}>
                        {item.event_time.slice(0, 5)} {item.title}
                      </div>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <section style={panelStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center', marginBottom: 18 }}>
            <div>
              <div style={eyebrowStyle}>Jour selectionne</div>
              <h3 style={{ margin: '6px 0 0', fontSize: 22, textTransform: 'capitalize' }}>{formatDateLabel(selectedDate)}</h3>
            </div>
            <button onClick={() => openAddModal('event')} style={secondaryButtonStyle}>
              <Plus size={16} />
              Ajouter
            </button>
          </div>

          {selectedDayEvents.length === 0 ? (
            <div style={emptyStateStyle}>Aucun evenement programme pour cette date.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {selectedDayEvents.map((item) => (
                <article key={item.id} style={timelineCardStyle}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start' }}>
                    <div>
                      <div style={eventTypeChipStyle}>{item.event_type}</div>
                      <h4 style={{ margin: '10px 0 8px', fontSize: 18 }}>{item.title}</h4>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => openEditModal(item, 'event')} style={miniActionStyle}>
                        <Pencil size={16} />
                      </button>
                      <button onClick={() => onDelete(item.id)} style={miniDangerStyle}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <div style={metaRowStyle}>
                    <span style={metaItemStyle}><Clock3 size={14} /> {item.event_time.slice(0, 5)}</span>
                    <span style={metaItemStyle}><MapPin size={14} /> {item.location || 'Lieu a definir'}</span>
                    <span style={metaItemStyle}><Users size={14} /> {item.employee?.name || 'Sans employe'}</span>
                  </div>
                  {item.description && <p style={{ margin: '12px 0 0', color: '#475569', lineHeight: 1.6 }}>{item.description}</p>}
                  <div style={{ ...metaRowStyle, marginTop: 14 }}>
                    <span style={metaItemStyle}><Mail size={14} /> {getReminderLabel(reminderLeadHours)}</span>
                    <span style={metaItemStyle}>
                      <Check size={14} />
                      {item.reminder_sent_at ? 'Rappel deja envoye' : 'Rappel en attente'}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

const EmployeeView = ({ employees, openEditModal, onDelete }) => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
    {employees.length === 0 ? (
      <div style={emptyStateStyle}>Aucun employe enregistre.</div>
    ) : (
      employees.map((employee) => (
        <article key={employee.id} style={employeeCardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
            <div>
              <div style={employeeStatusStyle}>{employee.status}</div>
              <h3 style={{ margin: '10px 0 4px', fontSize: 20 }}>{employee.name}</h3>
              <p style={{ margin: 0, color: '#475569' }}>{employee.role || 'Fonction non definie'}</p>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => openEditModal(employee, 'employee')} style={miniActionStyle}>
                <Pencil size={16} />
              </button>
              <button onClick={() => onDelete(employee.id, 'employee')} style={miniDangerStyle}>
                <Trash2 size={16} />
              </button>
            </div>
          </div>
          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span style={metaItemStyle}><Mail size={14} /> {employee.email}</span>
            <span style={metaItemStyle}><UserIcon size={14} /> {employee.phone || 'Telephone non renseigne'}</span>
          </div>
        </article>
      ))
    )}
  </div>
);

const AdminForm = ({
  modalType,
  editingId,
  formData,
  setFormData,
  selectedFile,
  setSelectedFile,
  handleSubmit,
  setShowModal,
  uploading,
  employees,
  reminderLeadHours,
  itineraryData,
  setItineraryData,
}) => (
  <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
      <div>
        <div style={eyebrowStyle}>Administration</div>
        <h2 style={{ fontSize: 28, fontWeight: 900, margin: '8px 0 0' }}>
          {editingId ? 'Modifier' : 'Ajouter'} {modalType === 'event' ? 'un evenement' : modalType === 'employee' ? 'un employe' : 'un contenu'}
        </h2>
      </div>
      <button onClick={() => setShowModal(false)} style={closeButtonStyle}>
        <X size={24} />
      </button>
    </div>

    <form onSubmit={handleSubmit} style={formGridStyle}>
      {['destination', 'post', 'team', 'testimonial', 'slide'].includes(modalType) ? (
        <div style={imageUploadAreaStyle}>
          {selectedFile || formData.image_url ? (
            <img
              src={selectedFile ? URL.createObjectURL(selectedFile) : getImageUrl(formData.image_url)}
              alt=""
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <div style={{ textAlign: 'center', color: '#94a3b8' }}>
              <ImageIcon size={64} style={{ marginBottom: 16, opacity: 0.3 }} />
              <p>Choisir une image</p>
            </div>
          )}
          <input
            type="file"
            onChange={(e) => setSelectedFile(e.target.files[0])}
            style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
          />
        </div>
      ) : (
        <div style={spotlightCardStyle}>
          <div style={eyebrowStyle}>{modalType === 'event' ? 'Rappel automatique' : 'Employe concerne'}</div>
          {modalType === 'event' ? (
            <>
              <h3 style={{ fontSize: 26, margin: '10px 0' }}>{getReminderLabel(reminderLeadHours)}</h3>
              <p style={{ color: '#475569', lineHeight: 1.7 }}>
                L employe recevra un e-mail automatique avant l evenement, si la configuration SMTP est active dans le backend.
              </p>
            </>
          ) : (
            <>
              <h3 style={{ fontSize: 26, margin: '10px 0' }}>Fiche employee</h3>
              <p style={{ color: '#475569', lineHeight: 1.7 }}>
                Renseignez le nom, l e-mail et le role pour pouvoir rattacher cette personne aux rendez-vous du calendrier.
              </p>
            </>
          )}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {modalType === 'event' && (
          <>
            <FormField label="Titre">
              <input style={inputStyle} value={formData.title} onChange={(e) => setFormData((current) => ({ ...current, title: e.target.value }))} required />
            </FormField>
            <div style={dualFieldGridStyle}>
              <FormField label="Type">
                <select style={inputStyle} value={formData.event_type} onChange={(e) => setFormData((current) => ({ ...current, event_type: e.target.value }))}>
                  <option value="reunion">Reunion</option>
                  <option value="programme">Programme</option>
                  <option value="evenement">Evenement</option>
                  <option value="mission">Mission</option>
                </select>
              </FormField>
              <FormField label="Employe">
                <select style={inputStyle} value={formData.employee_id} onChange={(e) => setFormData((current) => ({ ...current, employee_id: e.target.value }))} required>
                  <option value="">Selectionner</option>
                  {employees.map((employee) => (
                    <option key={employee.id} value={employee.id}>
                      {employee.name} - {employee.email}
                    </option>
                  ))}
                </select>
              </FormField>
            </div>
            <div style={tripleFieldGridStyle}>
              <FormField label="Date">
                <input type="date" style={inputStyle} value={formData.event_date} onChange={(e) => setFormData((current) => ({ ...current, event_date: e.target.value }))} required />
              </FormField>
              <FormField label="Heure">
                <input type="time" style={inputStyle} value={formData.event_time} onChange={(e) => setFormData((current) => ({ ...current, event_time: e.target.value }))} required />
              </FormField>
              <FormField label="Lieu">
                <input style={inputStyle} value={formData.location} onChange={(e) => setFormData((current) => ({ ...current, location: e.target.value }))} required />
              </FormField>
            </div>
            <FormField label="Description">
              <textarea style={{ ...inputStyle, height: 180 }} value={formData.description} onChange={(e) => setFormData((current) => ({ ...current, description: e.target.value }))} />
            </FormField>
          </>
        )}

        {modalType === 'employee' && (
          <>
            <FormField label="Nom complet">
              <input style={inputStyle} value={formData.name} onChange={(e) => setFormData((current) => ({ ...current, name: e.target.value }))} required />
            </FormField>
            <div style={dualFieldGridStyle}>
              <FormField label="E-mail">
                <input type="email" style={inputStyle} value={formData.email} onChange={(e) => setFormData((current) => ({ ...current, email: e.target.value }))} required />
              </FormField>
              <FormField label="Telephone">
                <input style={inputStyle} value={formData.phone} onChange={(e) => setFormData((current) => ({ ...current, phone: e.target.value }))} />
              </FormField>
            </div>
            <div style={dualFieldGridStyle}>
              <FormField label="Role">
                <input style={inputStyle} value={formData.role} onChange={(e) => setFormData((current) => ({ ...current, role: e.target.value }))} />
              </FormField>
              <FormField label="Statut">
                <select style={inputStyle} value={formData.status} onChange={(e) => setFormData((current) => ({ ...current, status: e.target.value }))}>
                  <option value="Actif">Actif</option>
                  <option value="Conge">Conge</option>
                  <option value="Indisponible">Indisponible</option>
                </select>
              </FormField>
            </div>
          </>
        )}

        {modalType === 'post' && (
          <>
            <FormField label="Titre">
              <input style={inputStyle} value={formData.title} onChange={(e) => setFormData((current) => ({ ...current, title: e.target.value }))} required />
            </FormField>
            <FormField label="Categorie">
              <input style={inputStyle} value={formData.category} onChange={(e) => setFormData((current) => ({ ...current, category: e.target.value }))} />
            </FormField>
            <FormField label="Contenu">
              <textarea style={{ ...inputStyle, height: 260 }} value={formData.content} onChange={(e) => setFormData((current) => ({ ...current, content: e.target.value }))} required />
            </FormField>
          </>
        )}

        {modalType === 'service' && (
          <>
            <FormField label="Nom du service">
              <input style={inputStyle} value={formData.name} onChange={(e) => setFormData((current) => ({ ...current, name: e.target.value }))} required />
            </FormField>
            <FormField label="Description">
              <textarea style={{ ...inputStyle, height: 220 }} value={formData.description} onChange={(e) => setFormData((current) => ({ ...current, description: e.target.value }))} />
            </FormField>
            <FormField label="Statut">
              <select style={inputStyle} value={formData.status} onChange={(e) => setFormData((current) => ({ ...current, status: e.target.value }))}>
                <option value="Actif">Actif</option>
                <option value="Draft">Draft</option>
                <option value="Archive">Archive</option>
              </select>
            </FormField>
          </>
        )}

        {modalType === 'team' && (
          <>
            <FormField label="Nom">
              <input style={inputStyle} value={formData.name} onChange={(e) => setFormData((current) => ({ ...current, name: e.target.value }))} required />
            </FormField>
            <FormField label="Poste">
              <input style={inputStyle} value={formData.role} onChange={(e) => setFormData((current) => ({ ...current, role: e.target.value }))} required />
            </FormField>
            <FormField label="Bio">
              <textarea style={{ ...inputStyle, height: 220 }} value={formData.bio} onChange={(e) => setFormData((current) => ({ ...current, bio: e.target.value }))} />
            </FormField>
          </>
        )}

        {modalType === 'testimonial' && (
          <>
            <FormField label="Nom">
              <input style={inputStyle} value={formData.name} onChange={(e) => setFormData((current) => ({ ...current, name: e.target.value }))} required />
            </FormField>
            <div style={dualFieldGridStyle}>
              <FormField label="Role">
                <input style={inputStyle} value={formData.role} onChange={(e) => setFormData((current) => ({ ...current, role: e.target.value }))} />
              </FormField>
              <FormField label="Note">
                <input type="number" min="1" max="5" style={inputStyle} value={formData.rating} onChange={(e) => setFormData((current) => ({ ...current, rating: e.target.value }))} />
              </FormField>
            </div>
            <FormField label="Message">
              <textarea style={{ ...inputStyle, height: 220 }} value={formData.content} onChange={(e) => setFormData((current) => ({ ...current, content: e.target.value }))} required />
            </FormField>
          </>
        )}

        {modalType === 'slide' && (
          <>
            <FormField label="Titre">
              <input style={inputStyle} value={formData.title} onChange={(e) => setFormData((current) => ({ ...current, title: e.target.value }))} required />
            </FormField>
            <FormField label="Sous-titre">
              <input style={inputStyle} value={formData.subtitle} onChange={(e) => setFormData((current) => ({ ...current, subtitle: e.target.value }))} />
            </FormField>
            <div style={dualFieldGridStyle}>
              <FormField label="Texte du bouton">
                <input style={inputStyle} value={formData.button_text} onChange={(e) => setFormData((current) => ({ ...current, button_text: e.target.value }))} />
              </FormField>
              <FormField label="Lien du bouton">
                <input style={inputStyle} value={formData.link} onChange={(e) => setFormData((current) => ({ ...current, link: e.target.value }))} />
              </FormField>
            </div>
            <FormField label="Ordre d'affichage">
              <input type="number" style={inputStyle} value={formData.slide_order} onChange={(e) => setFormData((current) => ({ ...current, slide_order: e.target.value }))} />
            </FormField>
            <FormField label="Description">
              <textarea style={{ ...inputStyle, height: 160 }} value={formData.description} onChange={(e) => setFormData((current) => ({ ...current, description: e.target.value }))} />
            </FormField>
          </>
        )}

        {modalType === 'destination' && (
          <>
            <FormField label="Nom">
              <input style={inputStyle} value={formData.name} onChange={(e) => setFormData((current) => ({ ...current, name: e.target.value }))} required />
            </FormField>
            <div style={dualFieldGridStyle}>
              <FormField label="Type">
                <input style={inputStyle} value={formData.type} onChange={(e) => setFormData((current) => ({ ...current, type: e.target.value }))} />
              </FormField>
              <FormField label="Prix">
                <input style={inputStyle} value={formData.price} onChange={(e) => setFormData((current) => ({ ...current, price: e.target.value }))} />
              </FormField>
            </div>
            <FormField label="Description">
              <textarea style={{ ...inputStyle, height: 130 }} value={formData.description} onChange={(e) => setFormData((current) => ({ ...current, description: e.target.value }))} />
            </FormField>
            <div style={dualFieldGridStyle}>
              <FormField label="Hebergement">
                <textarea style={{ ...inputStyle, height: 110 }} value={formData.accommodation} onChange={(e) => setFormData((current) => ({ ...current, accommodation: e.target.value }))} />
              </FormField>
              <FormField label="Points forts">
                <textarea style={{ ...inputStyle, height: 110 }} value={formData.highlights} onChange={(e) => setFormData((current) => ({ ...current, highlights: e.target.value }))} />
              </FormField>
            </div>
            <div style={dualFieldGridStyle}>
              <FormField label="Budget">
                <textarea style={{ ...inputStyle, height: 110 }} value={formData.budget} onChange={(e) => setFormData((current) => ({ ...current, budget: e.target.value }))} />
              </FormField>
              <FormField label="Conseils">
                <textarea style={{ ...inputStyle, height: 110 }} value={formData.tips} onChange={(e) => setFormData((current) => ({ ...current, tips: e.target.value }))} />
              </FormField>
            </div>

            {/* Custom Structured Itinerary Editor */}
            <div style={{
              border: '1px solid #cbd5e1',
              borderRadius: '20px',
              padding: '24px',
              backgroundColor: '#f8fafc',
              marginTop: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px'
            }}>
              <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
                <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#0f766e', margin: 0 }}>Éditeur d'Itinéraire</h4>
                <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 0' }}>Configurez le titre de l'itinéraire, sa description générale et les différentes étapes.</p>
              </div>

              <FormField label="Titre de l'itinéraire">
                <input
                  style={inputStyle}
                  value={itineraryData?.title || ''}
                  onChange={(e) => setItineraryData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder={`Découvrez ${formData.name || ''}`}
                />
              </FormField>

              <FormField label="Description générale de l'itinéraire">
                <textarea
                  style={{ ...inputStyle, height: '80px' }}
                  value={itineraryData?.description || ''}
                  onChange={(e) => setItineraryData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Itinéraire sur-mesure proposé pour votre voyage..."
                />
              </FormField>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label style={fieldLabelStyle}>Étapes de l'itinéraire ({itineraryData?.stops?.length || 0})</label>
                  <button
                    type="button"
                    onClick={() => setItineraryData(prev => ({
                      ...prev,
                      stops: [
                        ...(prev.stops || []),
                        {
                          name: '',
                          role: (prev.stops || []).length === 0 ? 'Départ' : 'Escale',
                          description: '',
                          incontournable: '',
                          image: '',
                          transit: '',
                          transitType: 'car'
                        }
                      ]
                    }))}
                    style={{
                      ...secondaryButtonStyle,
                      height: '32px',
                      padding: '0 12px',
                      borderRadius: '8px'
                    }}
                  >
                    <Plus size={14} /> Ajouter une étape
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {(itineraryData?.stops || []).map((stop, index) => {
                    const handleStepFieldChange = (field, val) => {
                      setItineraryData(prev => ({
                        ...prev,
                        stops: prev.stops.map((s, i) => i === index ? { ...s, [field]: val } : s)
                      }));
                    };

                    const handleMoveStep = (direction) => {
                      if (direction === 'up' && index === 0) return;
                      if (direction === 'down' && index === itineraryData.stops.length - 1) return;
                      const nextIndex = direction === 'up' ? index - 1 : index + 1;
                      const newStops = [...itineraryData.stops];
                      const temp = newStops[index];
                      newStops[index] = newStops[nextIndex];
                      newStops[nextIndex] = temp;
                      
                      // Also adjust roles intelligently if it's moved to first or last
                      const updatedStops = newStops.map((s, idx) => {
                        let role = s.role;
                        if (idx === 0) role = 'Départ';
                        else if (idx === newStops.length - 1) role = 'Arrivée';
                        else if (s.role === 'Départ' || s.role === 'Arrivée') role = 'Escale';
                        return { ...s, role };
                      });

                      setItineraryData(prev => ({ ...prev, stops: updatedStops }));
                    };

                    const handleStepFileChange = async (e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      try {
                        const uploadResult = await apiService.uploadImage(file);
                        handleStepFieldChange('image', uploadResult.imageUrl);
                      } catch (err) {
                        alert("Erreur lors de l'upload de l'image de l'étape : " + err.message);
                      }
                    };

                    return (
                      <div key={index} style={{
                        border: '1px solid #e2e8f0',
                        borderRadius: '16px',
                        padding: '16px',
                        backgroundColor: '#fff',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.02)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                        position: 'relative'
                      }}>
                        {/* Step Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                          <span style={{ fontWeight: 800, color: '#1e293b', fontSize: '13px' }}>
                            Étape {index + 1} ({stop.role || 'Escale'})
                          </span>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button
                              type="button"
                              disabled={index === 0}
                              onClick={() => handleMoveStep('up')}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '28px',
                                height: '28px',
                                borderRadius: '6px',
                                border: '1px solid #e2e8f0',
                                backgroundColor: '#fff',
                                cursor: index === 0 ? 'not-allowed' : 'pointer',
                                opacity: index === 0 ? 0.3 : 1
                              }}
                            >
                              <ArrowUp size={14} />
                            </button>
                            <button
                              type="button"
                              disabled={index === itineraryData.stops.length - 1}
                              onClick={() => handleMoveStep('down')}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '28px',
                                height: '28px',
                                borderRadius: '6px',
                                border: '1px solid #e2e8f0',
                                backgroundColor: '#fff',
                                cursor: index === itineraryData.stops.length - 1 ? 'not-allowed' : 'pointer',
                                opacity: index === itineraryData.stops.length - 1 ? 0.3 : 1
                              }}
                            >
                              <ArrowDown size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setItineraryData(prev => ({
                                  ...prev,
                                  stops: prev.stops.filter((_, i) => i !== index)
                                }));
                              }}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '28px',
                                height: '28px',
                                borderRadius: '6px',
                                border: '1px solid #fee2e2',
                                backgroundColor: '#fff',
                                color: '#ef4444',
                                cursor: 'pointer'
                              }}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>

                        {/* Step Form Body */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '16px' }}>
                          {/* Left Column Fields */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <FormField label="Nom de l'étape">
                              <input
                                style={inputStyle}
                                value={stop.name || ''}
                                onChange={(e) => handleStepFieldChange('name', e.target.value)}
                                placeholder="ex: Haute Ville"
                              />
                            </FormField>

                            <FormField label="Rôle de l'étape">
                              <select
                                style={inputStyle}
                                value={stop.role || 'Escale'}
                                onChange={(e) => handleStepFieldChange('role', e.target.value)}
                              >
                                <option value="Départ">Départ</option>
                                <option value="Escale">Escale</option>
                                <option value="Arrivée">Arrivée</option>
                              </select>
                            </FormField>

                            <FormField label="L'incontournable (Highlight)">
                              <input
                                style={inputStyle}
                                value={stop.incontournable || ''}
                                onChange={(e) => handleStepFieldChange('incontournable', e.target.value)}
                                placeholder="ex: Le Palais de la Reine (Rova)"
                              />
                            </FormField>

                            <FormField label="Transit / Transfert">
                              <input
                                style={inputStyle}
                                value={stop.transit || ''}
                                onChange={(e) => handleStepFieldChange('transit', e.target.value)}
                                placeholder="ex: Véhicule Privé ➔ Antsirabe - 4h"
                              />
                            </FormField>

                            <FormField label="Type de transit">
                              <select
                                style={inputStyle}
                                value={stop.transitType || 'car'}
                                onChange={(e) => handleStepFieldChange('transitType', e.target.value)}
                              >
                                <option value="car">Voiture / Véhicule</option>
                                <option value="ship">Bateau / Pirogue</option>
                                <option value="train">Train</option>
                              </select>
                            </FormField>
                          </div>

                          {/* Right Column Step Image Upload/Preview */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={fieldLabelStyle}>Image de l'étape</label>
                            <div style={{
                              border: '1px dashed #cbd5e1',
                              borderRadius: '12px',
                              height: '140px',
                              position: 'relative',
                              overflow: 'hidden',
                              backgroundColor: '#f8fafc',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}>
                              {stop.image ? (
                                <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                                  <img src={getImageUrl(stop.image)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                  <button
                                    type="button"
                                    onClick={() => handleStepFieldChange('image', '')}
                                    style={{
                                      position: 'absolute',
                                      top: '6px',
                                      right: '6px',
                                      backgroundColor: 'rgba(15, 23, 42, 0.75)',
                                      color: '#fff',
                                      border: 'none',
                                      borderRadius: '50%',
                                      width: '24px',
                                      height: '24px',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      cursor: 'pointer'
                                    }}
                                  >
                                    <X size={12} />
                                  </button>
                                </div>
                              ) : (
                                <div style={{ textAlign: 'center', padding: '12px', color: '#94a3b8' }}>
                                  <ImageIcon size={32} style={{ margin: '0 auto 8px', opacity: 0.5 }} />
                                  <span style={{ fontSize: '11px', display: 'block' }}>Uploader une image</span>
                                </div>
                              )}
                              <input
                                type="file"
                                onChange={handleStepFileChange}
                                style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Step Description Field */}
                        <FormField label="Description de l'étape">
                          <textarea
                            style={{ ...inputStyle, height: '80px' }}
                            value={stop.description || ''}
                            onChange={(e) => handleStepFieldChange('description', e.target.value)}
                            placeholder="Entrez les détails de ce que les voyageurs feront durant cette étape..."
                          />
                        </FormField>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </>
        )}

        <button type="submit" disabled={uploading} style={submitButtonStyle}>
          {uploading ? 'Sauvegarde en cours...' : 'Enregistrer'}
        </button>
      </div>
    </form>
  </div>
);

const FormField = ({ label, children }) => (
  <div>
    <label style={fieldLabelStyle}>{label}</label>
    {children}
  </div>
);

const Dialog = ({ dialog, setDialog }) => (
  <div style={modalOverlayStyle}>
    <div style={dialogContentStyle}>
      <div
        style={{
          ...dialogIconWrapper,
          backgroundColor: dialog.type === 'confirm' ? '#fff7ed' : '#dcfce7',
          color: dialog.type === 'confirm' ? '#f97316' : '#15803d',
        }}
      >
        {dialog.type === 'confirm' ? <Clock3 size={28} /> : <Check size={28} />}
      </div>
      <h3 style={dialogTitleStyle}>{dialog.type === 'confirm' ? 'Confirmation' : 'Information'}</h3>
      <p style={dialogMessageStyle}>{dialog.message}</p>
      <div style={{ display: 'flex', gap: 12 }}>
        {dialog.type === 'confirm' ? (
          <>
            <button onClick={() => setDialog((current) => ({ ...current, show: false }))} style={cancelButtonStyle}>
              Annuler
            </button>
            <button onClick={dialog.onConfirm} style={confirmButtonStyle}>
              Confirmer
            </button>
          </>
        ) : (
          <button onClick={() => setDialog((current) => ({ ...current, show: false }))} style={okButtonStyle}>
            D accord
          </button>
        )}
      </div>
    </div>
  </div>
);

const BookingDetailModal = ({ selectedBooking, setShowBookingModal }) => (
  <div style={modalOverlayStyle}>
    <div style={bookingModalContentStyle}>
      <div style={modalHeaderStyle}>
        <h2 style={{ fontSize: 20, fontWeight: 900, margin: 0 }}>Details de la reservation</h2>
        <button onClick={() => setShowBookingModal(false)} style={closeButtonStyleSmall}>
          <X size={20} />
        </button>
      </div>
      <div style={{ padding: 32, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24 }}>
        <div>
          <label style={fieldLabelStyle}>Client</label>
          <p style={{ fontWeight: 800, margin: '4px 0' }}>{selectedBooking.sender}</p>
          <p style={{ color: '#64748b', fontSize: 14, margin: 0 }}>{selectedBooking.email}</p>
          <p style={{ color: '#64748b', fontSize: 14, margin: '6px 0 0' }}>{selectedBooking.phone}</p>
        </div>
        <div>
          <label style={fieldLabelStyle}>Circuit</label>
          <p style={{ fontWeight: 800, margin: '4px 0' }}>{selectedBooking.tour_name}</p>
          <p style={{ color: '#0f766e', fontSize: 12, fontWeight: 800, margin: 0 }}>{selectedBooking.type?.toUpperCase()}</p>
        </div>
        <div>
          <label style={fieldLabelStyle}>Participants</label>
          <p style={{ fontWeight: 800, margin: '4px 0' }}>{selectedBooking.participants}</p>
        </div>
        <div>
          <label style={fieldLabelStyle}>Depart</label>
          <p style={{ fontWeight: 800, margin: '4px 0' }}>
            {selectedBooking.departure_date ? new Date(selectedBooking.departure_date).toLocaleDateString('fr-FR') : 'N/A'}
          </p>
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={fieldLabelStyle}>Message</label>
          <div style={messageBoxStyle}>{selectedBooking.message || 'Aucun message particulier.'}</div>
        </div>
      </div>
      <div style={modalFooterStyle}>
        <button onClick={() => setShowBookingModal(false)} style={okButtonStyle}>
          Fermer
        </button>
      </div>
    </div>
  </div>
);

const MiniStat = ({ label, value }) => (
  <div style={miniStatCardStyle}>
    <div style={fieldLabelStyle}>{label}</div>
    <div style={{ fontSize: 18, fontWeight: 800, color: '#082f49' }}>{value}</div>
  </div>
);

const appShellStyle = {
  display: 'flex',
  minHeight: '100vh',
  background:
    'radial-gradient(circle at top left, rgba(45,212,191,0.08), transparent 24%), linear-gradient(180deg, #f8fafc 0%, #eef6ff 100%)',
  color: '#000',
  fontFamily: "'Plus Jakarta Sans', sans-serif",
};

const mainStyle = {
  flex: 1,
  padding: '32px',
  overflowY: 'auto',
};

const loginContainerStyle = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background:
    'radial-gradient(circle at top left, rgba(6,182,212,0.12), transparent 28%), linear-gradient(180deg, #f8fafc 0%, #ecfeff 100%)',
  padding: 20,
  fontFamily: "'Plus Jakarta Sans', sans-serif",
};

const loginFormStyle = {
  backgroundColor: '#fff',
  padding: 40,
  borderRadius: 32,
  boxShadow: '0 40px 100px -20px rgba(8, 47, 73, 0.18)',
  border: '1px solid rgba(226, 232, 240, 0.8)',
  position: 'relative',
  overflow: 'hidden',
};

const accentLineStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: 4,
  background: 'linear-gradient(90deg, #0f766e, #38bdf8)',
};

const loginTitleStyle = {
  fontSize: 24,
  fontWeight: 800,
  color: '#082f49',
  margin: '0 0 6px',
};

const inputLabelStyle = {
  display: 'block',
  fontSize: 10,
  fontWeight: 800,
  color: '#94a3b8',
  marginBottom: 8,
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
};

const inputIconStyle = {
  position: 'absolute',
  left: 16,
  top: '50%',
  transform: 'translateY(-50%)',
  color: '#cbd5e1',
};

const loginInputStyle = {
  width: '100%',
  padding: '12px 12px 12px 44px',
  fontSize: 13,
  backgroundColor: '#f8fafc',
  border: '1px solid #e2e8f0',
  borderRadius: 12,
  outline: 'none',
};

const loginButtonStyle = {
  width: '100%',
  padding: 14,
  marginTop: 8,
  backgroundColor: '#082f49',
  color: '#fff',
  border: 'none',
  borderRadius: 16,
  cursor: 'pointer',
  fontWeight: 800,
  fontSize: 15,
};

const errorStyle = {
  color: '#dc2626',
  fontSize: 12,
  fontWeight: 700,
  textAlign: 'center',
};

const controlsRowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 20,
  marginBottom: 28,
  flexWrap: 'wrap',
};

const searchBarStyle = {
  width: '100%',
  padding: '14px 20px 14px 50px',
  borderRadius: 18,
  height: 54,
  border: '1px solid #e2e8f0',
  outline: 'none',
  fontSize: 13,
  backgroundColor: 'rgba(255,255,255,0.9)',
};

const searchIconStyle = {
  position: 'absolute',
  left: 24,
  top: '50%',
  transform: 'translateY(-50%)',
  color: '#94a3b8',
};

const iconButtonStyle = {
  width: 44,
  height: 44,
  borderRadius: 14,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  border: '1px solid #e2e8f0',
};

const addButtonStyle = {
  backgroundColor: '#082f49',
  color: '#fff',
  padding: '0 24px',
  borderRadius: 14,
  border: 'none',
  fontWeight: 800,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  fontSize: 12,
  height: 44,
};

const secondaryButtonStyle = {
  backgroundColor: '#ecfeff',
  color: '#155e75',
  padding: '0 18px',
  borderRadius: 14,
  border: '1px solid #a5f3fc',
  fontWeight: 700,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  fontSize: 12,
  height: 44,
};

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

const eyebrowStyle = {
  fontSize: 11,
  fontWeight: 900,
  letterSpacing: '0.14em',
  color: '#0f766e',
  textTransform: 'uppercase',
};

const agendaGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1.4fr) minmax(320px, 0.9fr)',
  gap: 24,
};

const panelStyle = {
  backgroundColor: 'rgba(255,255,255,0.92)',
  borderRadius: 28,
  padding: 24,
  border: '1px solid #e2e8f0',
  boxShadow: '0 20px 60px rgba(15, 23, 42, 0.06)',
};

const calendarHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 16,
  marginBottom: 20,
};

const monthNavButtonStyle = {
  width: 42,
  height: 42,
  borderRadius: 14,
  border: '1px solid #dbeafe',
  backgroundColor: '#f8fafc',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const weekdayGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
  gap: 10,
  marginBottom: 10,
};

const weekdayCellStyle = {
  textAlign: 'center',
  fontSize: 12,
  fontWeight: 800,
  color: '#64748b',
  padding: '8px 0',
};

const monthGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
  gap: 10,
};

const dayCellStyle = {
  minHeight: 108,
  borderRadius: 20,
  padding: 12,
  textAlign: 'left',
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
};

const badgeStyle = {
  minWidth: 22,
  height: 22,
  borderRadius: 999,
  backgroundColor: '#082f49',
  color: '#fff',
  fontSize: 11,
  fontWeight: 800,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const eventPillStyle = {
  fontSize: 11,
  color: '#0f766e',
  backgroundColor: '#f0fdfa',
  borderRadius: 999,
  padding: '4px 8px',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
};

const timelineCardStyle = {
  border: '1px solid #e2e8f0',
  borderRadius: 22,
  padding: 18,
  backgroundColor: '#fff',
};

const eventTypeChipStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '6px 10px',
  borderRadius: 999,
  backgroundColor: '#e0f2fe',
  color: '#075985',
  fontSize: 11,
  fontWeight: 800,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
};

const metaRowStyle = {
  display: 'flex',
  gap: 12,
  flexWrap: 'wrap',
  marginTop: 8,
};

const metaItemStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  color: '#475569',
  fontSize: 13,
};

const employeeCardStyle = {
  backgroundColor: '#fff',
  borderRadius: 24,
  padding: 22,
  border: '1px solid #e2e8f0',
  boxShadow: '0 18px 40px rgba(15, 23, 42, 0.05)',
};

const employeeStatusStyle = {
  display: 'inline-flex',
  padding: '6px 10px',
  borderRadius: 999,
  backgroundColor: '#f1f5f9',
  color: '#334155',
  fontSize: 11,
  fontWeight: 800,
};

const miniActionStyle = {
  width: 38,
  height: 38,
  borderRadius: 12,
  border: '1px solid #dbeafe',
  backgroundColor: '#eff6ff',
  color: '#1d4ed8',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
};

const miniDangerStyle = {
  ...miniActionStyle,
  border: '1px solid #fecaca',
  backgroundColor: '#fef2f2',
  color: '#dc2626',
};

const emptyStateStyle = {
  backgroundColor: 'rgba(255,255,255,0.92)',
  borderRadius: 20,
  border: '1px dashed #cbd5e1',
  padding: 28,
  color: '#64748b',
  textAlign: 'center',
};

const closeButtonStyle = {
  background: '#f1f5f9',
  border: 'none',
  borderRadius: '50%',
  width: 50,
  height: 50,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
};

const closeButtonStyleSmall = {
  background: '#f1f5f9',
  border: 'none',
  borderRadius: '50%',
  width: 40,
  height: 40,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
};

const formGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'minmax(260px, 0.85fr) minmax(0, 1.15fr)',
  gap: 32,
};

const imageUploadAreaStyle = {
  position: 'relative',
  minHeight: 420,
  backgroundColor: '#f8fafc',
  borderRadius: 32,
  overflow: 'hidden',
  border: '2px dashed #e2e8f0',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const spotlightCardStyle = {
  minHeight: 300,
  borderRadius: 32,
  padding: 28,
  border: '1px solid #bfdbfe',
  background: 'linear-gradient(135deg, rgba(219,234,254,0.8), rgba(240,249,255,0.95))',
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

const inputStyle = {
  width: '100%',
  padding: '14px 18px',
  borderRadius: 14,
  border: '1px solid #e2e8f0',
  fontSize: 14,
  outline: 'none',
  backgroundColor: '#fff',
};

const dualFieldGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: 16,
};

const tripleFieldGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
  gap: 16,
};

const submitButtonStyle = {
  backgroundColor: '#082f49',
  color: '#fff',
  padding: 18,
  borderRadius: 18,
  border: 'none',
  fontWeight: 900,
  cursor: 'pointer',
  marginTop: 8,
};

const modalOverlayStyle = {
  position: 'fixed',
  inset: 0,
  backgroundColor: 'rgba(8, 47, 73, 0.35)',
  backdropFilter: 'blur(8px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 2000,
  padding: 20,
};

const dialogContentStyle = {
  backgroundColor: '#fff',
  width: '100%',
  maxWidth: 420,
  borderRadius: 24,
  padding: 32,
  textAlign: 'center',
  boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
};

const dialogIconWrapper = {
  width: 56,
  height: 56,
  borderRadius: 18,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto 20px',
};

const dialogTitleStyle = {
  fontSize: 18,
  fontWeight: 800,
  color: '#082f49',
  marginBottom: 12,
};

const dialogMessageStyle = {
  color: '#64748b',
  fontSize: 14,
  lineHeight: 1.6,
  marginBottom: 28,
};

const cancelButtonStyle = {
  flex: 1,
  padding: 12,
  borderRadius: 14,
  border: '1px solid #e2e8f0',
  backgroundColor: '#fff',
  color: '#64748b',
  fontWeight: 700,
  fontSize: 14,
  cursor: 'pointer',
};

const confirmButtonStyle = {
  flex: 1,
  padding: 12,
  borderRadius: 14,
  border: 'none',
  backgroundColor: '#dc2626',
  color: '#fff',
  fontWeight: 700,
  fontSize: 14,
  cursor: 'pointer',
};

const okButtonStyle = {
  flex: 1,
  padding: 12,
  borderRadius: 14,
  border: 'none',
  backgroundColor: '#082f49',
  color: '#fff',
  fontWeight: 700,
  fontSize: 14,
  cursor: 'pointer',
};

const bookingModalContentStyle = {
  backgroundColor: '#fff',
  width: '100%',
  maxWidth: 720,
  borderRadius: 32,
  overflow: 'hidden',
  boxShadow: '0 40px 100px rgba(0,0,0,0.2)',
};

const modalHeaderStyle = {
  padding: 32,
  borderBottom: '1px solid #f1f5f9',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const modalFooterStyle = {
  padding: '24px 32px',
  backgroundColor: '#f8fafc',
  display: 'flex',
  justifyContent: 'flex-end',
};

const messageBoxStyle = {
  backgroundColor: '#f8fafc',
  padding: 20,
  borderRadius: 16,
  fontSize: 14,
  color: '#444',
  lineHeight: 1.6,
  border: '1px solid #f1f5f9',
};

export default Admin;
