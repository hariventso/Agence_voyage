import React, { useState, useEffect } from 'react';
import {
  X, Search, Grid, List, Plus, ImageIcon, User as UserIcon, LogIn, Shield, Clock, Eye
} from 'lucide-react';
import { apiService } from '../services/api';

// Extracted Components
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminHeader from '../components/admin/AdminHeader';
import DashboardView from '../components/admin/DashboardView';
import ProductGrid from '../components/admin/ProductGrid';
import BookingsView from '../components/admin/BookingsView';
import MessagesView from '../components/admin/MessagesView';
import TeamView from '../components/admin/TeamView';
import TestimonialsView from '../components/admin/TestimonialsView';

const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('blog');
  const [showSidebar, setShowSidebar] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [destinations, setDestinations] = useState([]);
  const [posts, setPosts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [team, setTeam] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [dialog, setDialog] = useState({ show: false, message: '', type: 'alert', onConfirm: null });
  const [loginError, setLoginError] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [modalType, setModalType] = useState('post');
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '', type: '', price: '', status: 'Actif', image_url: '', description: '',
    itinerary: '', accommodation: '', budget: '', tips: '', highlights: '',
    title: '', category: '', content: '',
    role: '', bio: '', facebook_url: '', twitter_url: '', instagram_url: '', pinterest_url: '',
    rating: 5
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    if (isLoggedIn) fetchData();
    return () => window.removeEventListener('resize', handleResize);
  }, [isLoggedIn]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [d, m, p, b, t, te] = await Promise.all([
        apiService.getDestinations(),
        apiService.getMessages(),
        apiService.getPosts(),
        apiService.getBookings(),
        apiService.getTeam(),
        apiService.getTestimonials()
      ]);
      setDestinations(d);
      setMessages(m);
      setPosts(p);
      setBookings(b);
      setTeam(t);
      setTestimonials(te);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginData.username === 'Tourisme' && loginData.password === '2026') {
      setIsLoggedIn(true);
      setLoginError('');
    } else {
      setLoginError('Nom d\'utilisateur ou mot de passe incorrect');
    }
  };

  const openAddModal = (type = 'post') => {
    setModalType(type);
    setEditingId(null);
    setFormData({ 
      name: '', type: '', price: '', status: 'Actif', image_url: '', description: '', 
      itinerary: '', accommodation: '', budget: '', tips: '', highlights: '',
      title: '', category: '', content: '', role: '', bio: '', 
      facebook_url: '', twitter_url: '', instagram_url: '', pinterest_url: '', rating: 5 
    });
    setSelectedFile(null);
    setShowModal(true);
  };

  const openEditModal = (item, type = 'post') => {
    setModalType(type);
    setEditingId(item.id);
    setFormData({ ...item });
    setSelectedFile(null);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    let finalImageUrl = formData.image_url;
    
    if (selectedFile) {
      const uData = await apiService.uploadImage(selectedFile);
      finalImageUrl = uData.imageUrl;
    }

    let result;
    if (modalType === 'destination') {
      const data = { 
        name: formData.name, 
        type: formData.type, 
        price: formData.price, 
        status: formData.status, 
        image_url: finalImageUrl, 
        description: formData.description,
        itinerary: formData.itinerary,
        accommodation: formData.accommodation,
        budget: formData.budget,
        tips: formData.tips,
        highlights: formData.highlights
      };
      result = editingId ? await apiService.updateDestination(editingId, data) : await apiService.createDestination(data);
    } else if (modalType === 'post') {
      const data = { title: formData.title, category: formData.category, content: formData.content, image_url: finalImageUrl };
      result = editingId ? await apiService.updatePost(editingId, data) : await apiService.createPost(data);
    } else if (modalType === 'team') {
      const data = { name: formData.name, role: formData.role, bio: formData.bio, image_url: finalImageUrl, facebook_url: formData.facebook_url, twitter_url: formData.twitter_url, instagram_url: formData.instagram_url, pinterest_url: formData.pinterest_url };
      result = editingId ? await apiService.updateTeam(editingId, data) : await apiService.createTeam(data);
    } else if (modalType === 'testimonial') {
      const data = { name: formData.name, role: formData.role, content: formData.content, rating: formData.rating, image_url: finalImageUrl };
      result = editingId ? await apiService.updateTestimonial(editingId, data) : await apiService.createTestimonial(data);
    }

    if (result.ok) {
      setShowModal(false);
      fetchData();
    } else {
      setDialog({ show: true, message: 'Erreur lors de la sauvegarde', type: 'alert' });
    }
    setUploading(false);
  };

  const handleDelete = (id, type = 'destination') => {
    setDialog({
      show: true,
      message: 'Voulez-vous vraiment supprimer cet élément ?',
      type: 'confirm',
      onConfirm: async () => {
        if (type === 'destination') await apiService.deleteDestination(id);
        else if (type === 'post') await apiService.deletePost(id);
        else if (type === 'team') await apiService.deleteTeam(id);
        else if (type === 'testimonial') await apiService.deleteTestimonial(id);
        fetchData();
        setDialog({ ...dialog, show: false });
      }
    });
  };

  const handleMarkRead = async (id) => {
    await apiService.markMessageRead(id);
    fetchData();
  };

  const handleDeleteMessage = (id) => {
    setDialog({
      show: true,
      message: 'Supprimer ce message définitivement ?',
      type: 'confirm',
      onConfirm: async () => {
        await apiService.deleteMessage(id);
        fetchData();
        setDialog({ ...dialog, show: false });
      }
    });
  };

  const handleUpdateBookingStatus = async (id, status) => {
    await apiService.updateBookingStatus(id, status);
    fetchData();
  };

  const handleDeleteBooking = (id) => {
    setDialog({
      show: true,
      message: 'Supprimer cette demande de réservation ?',
      type: 'confirm',
      onConfirm: async () => {
        await apiService.deleteBooking(id);
        fetchData();
        setDialog({ ...dialog, show: false });
      }
    });
  };

  const getTabTitle = () => {
    const titles = {
      dashboard: 'TABLEAU DE BORD',
      destinations: 'DESTINATIONS',
      blog: 'ARTICLES',
      team: 'ÉQUIPE',
      testimonials: 'TÉMOIGNAGES',
      bookings: 'RÉSERVATIONS',
      messages: 'MESSAGES'
    };
    return titles[activeTab] || 'ADMIN';
  };

  if (!isLoggedIn) return (
    <div className="login-container" style={loginContainerStyle}>
      <div className="login-card-wrapper" style={{ width: '100%', maxWidth: '380px', animation: 'fadeInUp 0.8s ease' }}>
        <form onSubmit={handleLogin} style={loginFormStyle}>
          <div style={accentLineStyle}></div>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <img src="/image/Logo.png" alt="Explor'île" style={{ height: '80px', margin: '0 auto 20px', display: 'block' }} />
            <h2 style={loginTitleStyle}>Administration</h2>
            <p style={{ color: '#64748b', fontSize: '14px' }}>Gestion de la plateforme</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <InputGroup label="Utilisateur" icon={<UserIcon size={16} />} type="text" placeholder="Nom d'utilisateur" value={loginData.username} onChange={e => setLoginData({ ...loginData, username: e.target.value })} />
            <InputGroup label="Mot de passe" icon={<Shield size={16} />} type="password" placeholder="••••••••" value={loginData.password} onChange={e => setLoginData({ ...loginData, password: e.target.value })} />
            {loginError && <div style={errorStyle}>⚠️ {loginError}</div>}
            <button style={loginButtonStyle}>Se connecter <LogIn size={18} /></button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc', color: '#000', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <AdminSidebar 
        isMobile={isMobile} 
        showSidebar={showSidebar} 
        setShowSidebar={setShowSidebar} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        bookings={bookings} 
        messages={messages} 
        openAddModal={openAddModal} 
        setIsLoggedIn={setIsLoggedIn} 
      />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <AdminHeader 
          isMobile={isMobile} 
          setShowSidebar={setShowSidebar} 
          getTabTitle={getTabTitle} 
          messages={messages} 
        />

        <main style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
          {!showModal ? (
            <>
              <div style={controlsRowStyle}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <Search size={18} style={searchIconStyle} />
                  <input placeholder="Rechercher..." style={searchBarStyle} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <IconButton icon={<Grid size={18} />} active={viewMode === 'grid'} onClick={() => setViewMode('grid')} />
                  <IconButton icon={<List size={18} />} active={viewMode === 'list'} onClick={() => setViewMode('list')} />
                  <button onClick={() => openAddModal(activeTab === 'blog' ? 'post' : activeTab === 'destinations' ? 'destination' : activeTab === 'team' ? 'team' : 'testimonial')} style={addButtonStyle}>
                    <Plus size={18} /> AJOUTER
                  </button>
                </div>
              </div>

              {activeTab === 'dashboard' && <DashboardView d={destinations} m={messages} p={posts} b={bookings} />}
              {activeTab === 'destinations' && <ProductGrid d={destinations.filter(i => i.name.toLowerCase().includes(searchTerm.toLowerCase()))} viewMode={viewMode} openEdit={(item) => openEditModal(item, 'destination')} onDelete={(id) => handleDelete(id, 'destination')} />}
              {activeTab === 'blog' && <ProductGrid p={posts.filter(i => i.title.toLowerCase().includes(searchTerm.toLowerCase()))} viewMode={viewMode} openEdit={(item) => openEditModal(item, 'post')} onDelete={(id) => handleDelete(id, 'post')} />}
              {activeTab === 'team' && <TeamView t={team.filter(i => i.name.toLowerCase().includes(searchTerm.toLowerCase()))} viewMode={viewMode} openEdit={(item) => openEditModal(item, 'team')} onDelete={(id) => handleDelete(id, 'team')} />}
              {activeTab === 'bookings' && <BookingsView b={bookings.filter(i => i.sender.toLowerCase().includes(searchTerm.toLowerCase()) || i.tour_name.toLowerCase().includes(searchTerm.toLowerCase()))} onUpdateStatus={handleUpdateBookingStatus} onDelete={handleDeleteBooking} onView={(item) => { setSelectedBooking(item); setShowBookingModal(true); }} />}
              {activeTab === 'messages' && <MessagesView m={messages.filter(i => i.sender.toLowerCase().includes(searchTerm.toLowerCase()) || i.content.toLowerCase().includes(searchTerm.toLowerCase()))} onDelete={(id) => handleDeleteMessage(id)} onMarkRead={handleMarkRead} />}
              {activeTab === 'testimonials' && <TestimonialsView t={testimonials.filter(i => i.name.toLowerCase().includes(searchTerm.toLowerCase()))} viewMode={viewMode} openEdit={(item) => openEditModal(item, 'testimonial')} onDelete={(id) => handleDelete(id, 'testimonial')} />}
            </>
          ) : (
            <AdminForm 
              editingId={editingId} 
              modalType={modalType} 
              formData={formData} 
              setFormData={setFormData} 
              selectedFile={selectedFile} 
              setSelectedFile={setSelectedFile} 
              handleSubmit={handleSubmit} 
              setShowModal={setShowModal} 
              uploading={uploading} 
            />
          )}
        </main>
      </div>

      {/* Dialog & Booking Detail Modals */}
      {dialog.show && <Dialog dialog={dialog} setDialog={setDialog} />}
      {showBookingModal && <BookingDetailModal selectedBooking={selectedBooking} setShowBookingModal={setShowBookingModal} />}
    </div>
  );
};

// Sub-components for Admin
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
  <button onClick={onClick} style={{ ...iconButtonStyle, backgroundColor: active ? '#fff' : 'transparent', color: active ? '#000' : '#94a3b8', boxShadow: active ? '0 4px 12px rgba(0,0,0,0.05)' : 'none' }}>{icon}</button>
);

const AdminForm = ({ editingId, modalType, formData, setFormData, selectedFile, setSelectedFile, handleSubmit, setShowModal, uploading }) => (
  <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
      <h2 style={{ fontSize: '28px', fontWeight: 900, textTransform: 'uppercase' }}>{editingId ? 'Modifier' : 'Ajouter'}</h2>
      <button onClick={() => setShowModal(false)} style={closeButtonStyle}><X size={24} /></button>
    </div>

    <form onSubmit={handleSubmit} style={formGridStyle}>
      <div style={imageUploadAreaStyle}>
        {(selectedFile || formData.image_url) ? (
          <img src={selectedFile ? URL.createObjectURL(selectedFile) : formData.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ textAlign: 'center', color: '#94a3b8' }}>
            <ImageIcon size={64} style={{ marginBottom: '16px', opacity: 0.3 }} />
            <p>Choisir une image</p>
          </div>
        )}
        <input type="file" onChange={e => setSelectedFile(e.target.files[0])} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {modalType === 'post' && (
          <>
            <label style={fieldLabelStyle}>TITRE</label>
            <input style={inputStyle} value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
            <label style={fieldLabelStyle}>CONTENU</label>
            <textarea style={{ ...inputStyle, height: '300px' }} value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })} />
          </>
        )}
        {modalType === 'team' && (
          <>
            <label style={fieldLabelStyle}>NOM</label>
            <input style={inputStyle} value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
            <label style={fieldLabelStyle}>POSTE</label>
            <input style={inputStyle} value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} />
            <label style={fieldLabelStyle}>BIO</label>
            <textarea style={{ ...inputStyle, height: '200px' }} value={formData.bio} onChange={e => setFormData({ ...formData, bio: e.target.value })} />
          </>
        )}
        {modalType === 'testimonial' && (
          <>
            <label style={fieldLabelStyle}>NOM</label>
            <input style={inputStyle} value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
            <label style={fieldLabelStyle}>RÔLE / TYPE</label>
            <input style={inputStyle} value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} />
            <label style={fieldLabelStyle}>NOTE (1-5)</label>
            <input type="number" min="1" max="5" style={inputStyle} value={formData.rating} onChange={e => setFormData({ ...formData, rating: e.target.value })} />
            <label style={fieldLabelStyle}>MESSAGE</label>
            <textarea style={{ ...inputStyle, height: '200px' }} value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })} />
          </>
        )}
        {modalType === 'destination' && (
          <>
            <label style={fieldLabelStyle}>NOM</label>
            <input style={inputStyle} value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
            <label style={fieldLabelStyle}>PRIX</label>
            <input style={inputStyle} value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} />
            <label style={fieldLabelStyle}>DESCRIPTION GÉNÉRALE</label>
            <textarea style={{ ...inputStyle, height: '100px' }} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={fieldLabelStyle}>ITINÉRAIRE</label>
                <textarea style={{ ...inputStyle, height: '120px' }} value={formData.itinerary} onChange={e => setFormData({ ...formData, itinerary: e.target.value })} />
              </div>
              <div>
                <label style={fieldLabelStyle}>HÉBERGEMENT</label>
                <textarea style={{ ...inputStyle, height: '120px' }} value={formData.accommodation} onChange={e => setFormData({ ...formData, accommodation: e.target.value })} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={fieldLabelStyle}>BUDGET</label>
                <textarea style={{ ...inputStyle, height: '120px' }} value={formData.budget} onChange={e => setFormData({ ...formData, budget: e.target.value })} />
              </div>
              <div>
                <label style={fieldLabelStyle}>NOS CONSEILS</label>
                <textarea style={{ ...inputStyle, height: '120px' }} value={formData.tips} onChange={e => setFormData({ ...formData, tips: e.target.value })} />
              </div>
            </div>

            <label style={fieldLabelStyle}>POINTS FORTS (Un par ligne)</label>
            <textarea style={{ ...inputStyle, height: '100px' }} value={formData.highlights} onChange={e => setFormData({ ...formData, highlights: e.target.value })} />
          </>
        )}
        <button type="submit" disabled={uploading} style={submitButtonStyle}>
          {uploading ? 'PATIENTEZ...' : 'ENREGISTRER'}
        </button>
      </div>
    </form>
  </div>
);

const Dialog = ({ dialog, setDialog }) => (
  <div style={modalOverlayStyle}>
    <div style={dialogContentStyle}>
      <div style={{ ...dialogIconWrapper, backgroundColor: dialog.type === 'confirm' ? '#fff7ed' : '#fee2e2', color: dialog.type === 'confirm' ? '#f97316' : '#ef4444' }}>
        {dialog.type === 'confirm' ? <Clock size={28} /> : <X size={28} />}
      </div>
      <h3 style={dialogTitleStyle}>{dialog.type === 'confirm' ? 'Confirmation' : 'Attention'}</h3>
      <p style={dialogMessageStyle}>{dialog.message}</p>
      <div style={{ display: 'flex', gap: '12px' }}>
        {dialog.type === 'confirm' ? (
          <>
            <button onClick={() => setDialog({ ...dialog, show: false })} style={cancelButtonStyle}>Annuler</button>
            <button onClick={dialog.onConfirm} style={confirmButtonStyle}>Confirmer</button>
          </>
        ) : (
          <button onClick={() => setDialog({ ...dialog, show: false })} style={okButtonStyle}>D'accord</button>
        )}
      </div>
    </div>
  </div>
);

const BookingDetailModal = ({ selectedBooking, setShowBookingModal }) => (
  <div style={modalOverlayStyle}>
    <div style={bookingModalContentStyle}>
      <div style={modalHeaderStyle}>
        <h2 style={{ fontSize: '20px', fontWeight: 900 }}>DÉTAILS DE LA RÉSERVATION</h2>
        <button onClick={() => setShowBookingModal(false)} style={closeButtonStyleSmall}><X size={20} /></button>
      </div>
      <div style={{ padding: '32px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
        <div>
          <label style={fieldLabelStyle}>CLIENT</label>
          <p style={{ fontWeight: 800, margin: '4px 0' }}>{selectedBooking.sender}</p>
          <p style={{ color: '#64748b', fontSize: '14px' }}>{selectedBooking.email}</p>
          <p style={{ color: '#64748b', fontSize: '14px' }}>{selectedBooking.phone}</p>
        </div>
        <div>
          <label style={fieldLabelStyle}>CIRCUIT</label>
          <p style={{ fontWeight: 800, margin: '4px 0' }}>{selectedBooking.tour_name}</p>
          <p style={{ color: '#22c55e', fontSize: '12px', fontWeight: 800 }}>TYPE: {selectedBooking.type?.toUpperCase()}</p>
        </div>
        <div style={{ gridColumn: 'span 2' }}>
          <label style={fieldLabelStyle}>LOGISTIQUE</label>
          <div style={{ display: 'flex', gap: '24px', marginTop: '8px' }}>
            <div><div style={statLabelMini}>PERS.</div><div style={{ fontWeight: 800 }}>{selectedBooking.participants}</div></div>
            <div><div style={statLabelMini}>DÉPART</div><div style={{ fontWeight: 800 }}>{new Date(selectedBooking.departure_date).toLocaleDateString()}</div></div>
            <div><div style={statLabelMini}>DURÉE</div><div style={{ fontWeight: 800 }}>{selectedBooking.duration || 'N/A'} j</div></div>
          </div>
        </div>
        <div style={{ gridColumn: 'span 2' }}>
          <label style={fieldLabelStyle}>MESSAGE</label>
          <div style={messageBoxStyle}>{selectedBooking.message || "Aucun message particulier."}</div>
        </div>
      </div>
      <div style={modalFooterStyle}>
        <button onClick={() => setShowBookingModal(false)} style={okButtonStyle}>FERMER</button>
      </div>
    </div>
  </div>
);

// Styles
const loginContainerStyle = { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc', backgroundImage: 'radial-gradient(at 0% 0%, rgba(10, 46, 54, 0.05) 0, transparent 50%), radial-gradient(at 50% 0%, rgba(210, 157, 82, 0.05) 0, transparent 50%)', fontFamily: "'Plus Jakarta Sans', sans-serif", padding: '20px' };
const loginFormStyle = { backgroundColor: '#fff', padding: '40px', borderRadius: '32px', boxShadow: '0 40px 100px -20px rgba(10, 46, 54, 0.1)', border: '1px solid rgba(241, 245, 249, 0.8)', position: 'relative', overflow: 'hidden' };
const accentLineStyle = { position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', background: 'linear-gradient(90deg, #0A2E36, #D29D52)' };
const loginTitleStyle = { fontSize: '24px', fontWeight: 800, color: '#0A2E36', marginBottom: '6px', letterSpacing: '-0.02em', fontFamily: "'Playfair Display', serif" };
const inputLabelStyle = { display: 'block', fontSize: '10px', fontWeight: 800, color: '#94a3b8', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.1em' };
const inputIconStyle = { position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#cbd5e1' };
const loginInputStyle = { width: '100%', padding: '12px 12px 12px 44px', fontSize: '13px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', outline: 'none' };
const loginButtonStyle = { width: '100%', padding: '14px', marginTop: '10px', backgroundColor: '#0A2E36', color: '#fff', border: 'none', borderRadius: '16px', cursor: 'pointer', fontWeight: 800, fontSize: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: '0 10px 20px -5px rgba(10, 46, 54, 0.2)' };
const errorStyle = { color: '#ef4444', fontSize: '12px', fontWeight: 700, textAlign: 'center' };
const searchBarStyle = { width: '100%', padding: '14px 20px 14px 50px', borderRadius: '50px', height: '54px', border: '1px solid #f1f5f9', outline: 'none', fontSize: '13px' };
const searchIconStyle = { position: 'absolute', left: '24px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' };
const controlsRowStyle = { display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px' };
const iconButtonStyle = { width: '44px', height: '44px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '1px solid #f1f5f9' };
const addButtonStyle = { backgroundColor: '#000', color: '#fff', padding: '0 24px', borderRadius: '14px', border: 'none', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', height: '44px' };
const closeButtonStyle = { background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' };
const closeButtonStyleSmall = { background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' };
const formGridStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px' };
const imageUploadAreaStyle = { position: 'relative', height: 'auto', minHeight: '400px', backgroundColor: '#f8fafc', borderRadius: '40px', overflow: 'hidden', border: '2px dashed #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const fieldLabelStyle = { fontSize: '11px', fontWeight: 900, color: '#94a3b8', marginBottom: '12px', display: 'block', letterSpacing: '0.1em' };
const inputStyle = { width: '100%', padding: '14px 18px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '14px', outline: 'none' };
const submitButtonStyle = { backgroundColor: '#000', color: '#fff', padding: '20px', borderRadius: '18px', border: 'none', fontWeight: 900, cursor: 'pointer', marginTop: '20px' };
const modalOverlayStyle = { position: 'fixed', inset: 0, backgroundColor: 'rgba(10, 46, 54, 0.4)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '20px' };
const dialogContentStyle = { backgroundColor: '#fff', width: '100%', maxWidth: '400px', borderRadius: '24px', padding: '32px', textAlign: 'center', boxShadow: '0 20px 50px rgba(0,0,0,0.1)' };
const dialogIconWrapper = { width: '56px', height: '56px', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' };
const dialogTitleStyle = { fontSize: '18px', fontWeight: 800, color: '#0A2E36', marginBottom: '12px' };
const dialogMessageStyle = { color: '#64748b', fontSize: '14px', lineHeight: 1.6, marginBottom: '32px' };
const cancelButtonStyle = { flex: 1, padding: '12px', borderRadius: '14px', border: '1px solid #e2e8f0', backgroundColor: '#fff', color: '#64748b', fontWeight: 700, fontSize: '14px', cursor: 'pointer' };
const confirmButtonStyle = { flex: 1, padding: '12px', borderRadius: '14px', border: 'none', backgroundColor: '#ef4444', color: '#fff', fontWeight: 700, fontSize: '14px', cursor: 'pointer' };
const okButtonStyle = { flex: 1, padding: '12px', borderRadius: '14px', border: 'none', backgroundColor: '#0A2E36', color: '#fff', fontWeight: 700, fontSize: '14px', cursor: 'pointer' };
const bookingModalContentStyle = { backgroundColor: '#fff', width: '100%', maxWidth: '600px', borderRadius: '32px', overflow: 'hidden', boxShadow: '0 40px 100px rgba(0,0,0,0.2)' };
const modalHeaderStyle = { padding: '32px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const modalFooterStyle = { padding: '24px 32px', backgroundColor: '#f8fafc', display: 'flex', justifyContent: 'flex-end' };
const messageBoxStyle = { backgroundColor: '#f8fafc', padding: '20px', borderRadius: '16px', fontSize: '14px', color: '#444', lineHeight: 1.6, border: '1px solid #f1f5f9' };
const statLabelMini = { fontSize: '10px', color: '#94a3b8', fontWeight: 800 };

export default Admin;
