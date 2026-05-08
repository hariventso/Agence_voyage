import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard, Map, FileText, Users, Settings, LogOut, Plus, Search, Bell, TrendingUp, MessageSquare,
  Calendar, MoreVertical, Edit, Trash2, Eye, CheckCircle, Clock, ArrowUpRight, ArrowDownRight,
  Shield, Briefcase, Layers, ChevronRight, Filter, Download, Share2, X, Upload, Image as ImageIcon,
  User as UserIcon, LogIn, Mail, Grid, List, PlusCircle, Trash, Package, ShoppingCart, Truck
} from 'lucide-react';

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
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('post');
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '', type: '', price: '', status: 'Actif', image_url: '', description: '',
    title: '', category: '', content: '',
    role: '', bio: '', facebook_url: '', twitter_url: '', instagram_url: '', pinterest_url: ''
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
    try {
      const [dRes, mRes, pRes, bRes, tRes] = await Promise.all([
        fetch('http://localhost:5000/api/destinations'),
        fetch('http://localhost:5000/api/messages'),
        fetch('http://localhost:5000/api/posts'),
        fetch('http://localhost:5000/api/bookings'),
        fetch('http://localhost:5000/api/team')
      ]);
      setDestinations(await dRes.json());
      setMessages(await mRes.json());
      setPosts(await pRes.json());
      setBookings(await bRes.json());
      setTeam(await tRes.json());
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginData.username === 'admin' && loginData.password === 'admin') setIsLoggedIn(true);
    else alert('Identifiants incorrects');
  };

  const openAddModal = (type = 'post') => {
    setModalType(type);
    setEditingId(null);
    setFormData({ name: '', type: '', price: '', status: 'Actif', image_url: '', description: '', title: '', category: '', content: '', role: '', bio: '', facebook_url: '', twitter_url: '', instagram_url: '', pinterest_url: '' });
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
      const fData = new FormData();
      fData.append('image', selectedFile);
      const uRes = await fetch('http://localhost:5000/api/upload', { method: 'POST', body: fData });
      const uData = await uRes.json();
      finalImageUrl = uData.imageUrl;
    }

    const endpoint = modalType === 'destination' ? 'destinations' : modalType === 'post' ? 'posts' : 'team';
    const url = editingId ? `http://localhost:5000/api/${endpoint}/${editingId}` : `http://localhost:5000/api/${endpoint}`;

    let body = {};
    if (modalType === 'destination') {
      body = { name: formData.name, type: formData.type, price: formData.price, status: formData.status, image_url: finalImageUrl, description: formData.description };
    } else if (modalType === 'post') {
      body = { title: formData.title, category: formData.category, content: formData.content, image_url: finalImageUrl };
    } else if (modalType === 'team') {
      body = {
        name: formData.name,
        role: formData.role,
        bio: formData.bio,
        image_url: finalImageUrl,
        facebook_url: formData.facebook_url,
        twitter_url: formData.twitter_url,
        instagram_url: formData.instagram_url,
        pinterest_url: formData.pinterest_url
      };
    }

    const res = await fetch(url, {
      method: editingId ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (res.ok) { setShowModal(false); fetchData(); }
    else alert('Erreur lors de la sauvegarde');
    setUploading(false);
  };

  const handleDelete = async (id, type = 'destination') => {
    if (window.confirm('Supprimer cet élément ?')) {
      const endpoint = type === 'destination' ? 'destinations' : type === 'post' ? 'posts' : 'team';
      await fetch(`http://localhost:5000/api/${endpoint}/${id}`, { method: 'DELETE' });
      fetchData();
    }
  };

  const handleMarkRead = async (id) => {
    await fetch(`http://localhost:5000/api/messages/${id}/read`, { method: 'PUT' });
    fetchData();
  };

  const handleDeleteMessage = async (id) => {
    if (window.confirm('Supprimer ce message ?')) {
      await fetch(`http://localhost:5000/api/messages/${id}`, { method: 'DELETE' });
      fetchData();
    }
  };

  const handleUpdateBookingStatus = async (id, status) => {
    await fetch(`http://localhost:5000/api/bookings/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    fetchData();
  };

  const handleDeleteBooking = async (id) => {
    if (window.confirm('Supprimer cette demande ?')) {
      await fetch(`http://localhost:5000/api/bookings/${id}`, { method: 'DELETE' });
      fetchData();
    }
  };

  if (!isLoggedIn) return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f8fafc',
      backgroundImage: 'radial-gradient(at 0% 0%, rgba(10, 46, 54, 0.05) 0, transparent 50%), radial-gradient(at 50% 0%, rgba(210, 157, 82, 0.05) 0, transparent 50%)',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      padding: '20px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '380px',
        animation: 'fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        <form onSubmit={handleLogin} style={{
          backgroundColor: '#fff',
          padding: '40px',
          borderRadius: '32px',
          boxShadow: '0 40px 100px -20px rgba(10, 46, 54, 0.1)',
          border: '1px solid rgba(241, 245, 249, 0.8)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Subtle accent line */}
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', background: 'linear-gradient(90deg, #0A2E36, #D29D52)' }}></div>

          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <img
              src="/image/Logo.png"
              alt="Explor'île"
              style={{
                height: '80px',
                width: 'auto',
                margin: '0 auto 20px',
                display: 'block'
              }}
            />
            <h2 style={{
              fontSize: '24px',
              fontWeight: 800,
              color: '#0A2E36',
              marginBottom: '6px',
              letterSpacing: '-0.02em',
              fontFamily: "'Playfair Display', serif"
            }}>Administration</h2>
            <p style={{ color: '#64748b', fontSize: '14px', fontWeight: 500 }}>Gestion de la plateforme</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '10px', fontWeight: 800, color: '#94a3b8', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Utilisateur</label>
              <div style={{ position: 'relative' }}>
                <UserIcon size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#cbd5e1' }} />
                <input
                  type="text"
                  placeholder="admin"
                  style={{ ...inputStyle, padding: '12px 12px 12px 44px', fontSize: '13px', backgroundColor: '#f8fafc' }}
                  value={loginData.username}
                  onChange={e => setLoginData({ ...loginData, username: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '10px', fontWeight: 800, color: '#94a3b8', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Mot de passe</label>
              <div style={{ position: 'relative' }}>
                <Shield size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#cbd5e1' }} />
                <input
                  type="password"
                  placeholder="••••••••"
                  style={{ ...inputStyle, padding: '12px 12px 12px 44px', fontSize: '13px', backgroundColor: '#f8fafc' }}
                  value={loginData.password}
                  onChange={e => setLoginData({ ...loginData, password: e.target.value })}
                />
              </div>
            </div>

            <button style={{
              width: '100%',
              padding: '14px',
              marginTop: '10px',
              backgroundColor: '#0A2E36',
              color: '#fff',
              border: 'none',
              borderRadius: '16px',
              cursor: 'pointer',
              fontWeight: 800,
              fontSize: '15px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: '0 10px 20px -5px rgba(10, 46, 54, 0.2)'
            }}>
              Se connecter <LogIn size={18} />
            </button>
          </div>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', color: '#94a3b8', fontSize: '12px', fontWeight: 500 }}>
          &copy; 2026 Explor’île &bull; Agence de Tourisme
        </p>
      </div>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );

  const getTabTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'TABLEAU DE BORD';
      case 'destinations': return 'DESTINATIONS';
      case 'blog': return 'ARTICLES';
      case 'team': return 'ÉQUIPE';
      case 'bookings': return 'COMMANDES';
      case 'messages': return 'MESSAGES';
      default: return 'ADMIN';
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc', color: '#000', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Sidebar Overlay for Mobile */}
      {isMobile && showSidebar && (
        <div onClick={() => setShowSidebar(false)} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000 }} />
      )}

      {(!isMobile || (isMobile && showSidebar)) && (
        <aside style={{
          width: '260px', backgroundColor: '#fff', display: 'flex', flexDirection: 'column',
          position: isMobile ? 'fixed' : 'sticky', left: 0, top: 0, height: '100vh',
          zIndex: 1001, borderRight: '1px solid #f1f5f9', padding: '24px 0',
          transform: isMobile && !showSidebar ? 'translateX(-100%)' : 'translateX(0)',
          transition: 'transform 0.3s ease'
        }}>
          <div style={{ padding: '0 24px', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
            <img src="/image/Logo.png" alt="Logo" style={{ height: '32px', objectFit: 'contain' }} />
            <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: '#0A2E36' }}>Admin</h3>
            {isMobile && <X onClick={() => setShowSidebar(false)} size={20} style={{ marginLeft: 'auto', cursor: 'pointer' }} />}
          </div>

          <nav style={{ flex: 1, padding: '0 12px', overflowY: 'auto' }} className="custom-scrollbar">
            <p style={sectionTitle}>PERFORMANCE</p>
            <NavItem icon={<LayoutDashboard size={18} />} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => { setActiveTab('dashboard'); if (isMobile) setShowSidebar(false); }} />

            <p style={sectionTitle}>OPÉRATIONS</p>
            <NavItem icon={<Map size={18} />} label="Produits" active={activeTab === 'destinations'} onClick={() => { setActiveTab('destinations'); if (isMobile) setShowSidebar(false); }} />
            <NavItem icon={<ShoppingCart size={18} />} label="Commandes" active={activeTab === 'bookings'} onClick={() => { setActiveTab('bookings'); if (isMobile) setShowSidebar(false); }} badge={bookings.filter(b => b.status === 'En attente').length} />
            <NavItem icon={<Mail size={18} />} label="Messages" active={activeTab === 'messages'} onClick={() => { setActiveTab('messages'); if (isMobile) setShowSidebar(false); }} badge={messages.filter(m => m.unread).length} />

            <p style={sectionTitle}>RÉDACTIONNEL</p>
            <NavItem icon={<Users size={18} />} label="Équipe" active={activeTab === 'team'} onClick={() => { setActiveTab('team'); if (isMobile) setShowSidebar(false); }} />
            <NavItem icon={<FileText size={18} />} label="Articles" active={activeTab === 'blog'} onClick={() => { setActiveTab('blog'); if (isMobile) setShowSidebar(false); }} />
            <NavItem icon={<PlusCircle size={18} />} label="Nouvel Article" active={false} onClick={() => { openAddModal('post'); if (isMobile) setShowSidebar(false); }} />

          </nav>

          <div style={{ padding: '0 16px', marginTop: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '12px', cursor: 'pointer' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '12px', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                <UserIcon size={20} />
              </div>
              <div style={{ overflow: 'hidden' }}>
                <p style={{ margin: 0, fontSize: '13px', fontWeight: 700 }}>Admin</p>
                <p style={{ margin: 0, fontSize: '11px', color: '#64748b' }}>admin@explorile.com</p>
              </div>
              <ChevronRight size={14} color="#94a3b8" style={{ marginLeft: 'auto' }} />
            </div>

            <div onClick={() => setIsLoggedIn(false)} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '12px', cursor: 'pointer', marginTop: '8px', color: '#ef4444', transition: 'all 0.2s' }}>
              <LogOut size={18} />
              <span style={{ fontSize: '13px', fontWeight: 700 }}>Déconnexion</span>
            </div>
          </div>
        </aside>
      )}

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <header className="header" style={{
          height: '70px', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 40px', position: 'sticky', top: 0, zIndex: 50, borderBottom: '1px solid #f1f5f9'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {isMobile && <List onClick={() => setShowSidebar(true)} size={24} style={{ marginRight: '8px', cursor: 'pointer' }} />}
            <h2 style={{ fontSize: '14px', fontWeight: 800, margin: 0, color: '#000', letterSpacing: '0.05em' }}>{getTabTitle()}</h2>
            <span className="mobile-hide" style={{ backgroundColor: '#dcfce7', color: '#15803d', padding: '2px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: 800 }}>● LIVE</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div style={{ position: 'relative', cursor: 'pointer' }}>
              <Bell size={20} color="#000" />
              {messages.some(m => m.unread) && <div style={{ position: 'absolute', top: '-4px', right: '-4px', width: '14px', height: '14px', backgroundColor: '#ef4444', borderRadius: '50%', color: '#fff', fontSize: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>1</div>}
            </div>
          </div>
        </header>

        <main className="main-content" style={{ flex: 1, padding: '40px', boxSizing: 'border-box', position: 'relative', overflowY: 'auto' }}>
          {!showModal ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <Search size={18} style={{ position: 'absolute', left: '24px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input placeholder="Rechercher..." style={{ ...searchBar, borderRadius: '50px', paddingLeft: '60px', height: '54px' }} />
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <IconButton icon={<Grid size={18} />} active={true} />
                  <IconButton icon={<List size={18} />} active={false} />
                  <button onClick={() => openAddModal(activeTab === 'blog' ? 'post' : activeTab === 'destinations' ? 'destination' : 'team')} style={{ backgroundColor: '#000', color: '#fff', padding: '0 20px', borderRadius: '14px', border: 'none', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
                    <Plus size={18} /> AJOUTER
                  </button>
                </div>
              </div>

              {activeTab === 'dashboard' ? <DashboardView d={destinations} m={messages} p={posts} b={bookings} /> :
                activeTab === 'destinations' ? <ProductGrid d={destinations} openEdit={(item) => openEditModal(item, 'destination')} onDelete={(id) => handleDelete(id, 'destination')} /> :
                  activeTab === 'blog' ? <ProductGrid p={posts} openEdit={(item) => openEditModal(item, 'post')} onDelete={(id) => handleDelete(id, 'post')} /> :
                    activeTab === 'team' ? <TeamView t={team} openEdit={(item) => openEditModal(item, 'team')} onDelete={(id) => handleDelete(id, 'team')} /> :
                      activeTab === 'bookings' ? <BookingsView b={bookings} onUpdateStatus={handleUpdateBookingStatus} onDelete={handleDeleteBooking} /> :
                        activeTab === 'messages' ? <MessagesView m={messages} onDelete={(id) => handleDeleteMessage(id)} onMarkRead={handleMarkRead} /> :
                          <div style={{ textAlign: 'center', padding: '100px', color: '#64748b' }}>Section en développement</div>
              }
            </>
          ) : (
            <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <h2 style={{ fontSize: '28px', fontWeight: 900, margin: 0, textTransform: 'uppercase' }}>{editingId ? 'Modifier' : 'Ajouter'}</h2>
                <button onClick={() => setShowModal(false)} style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px' }}>
                <div style={{ position: 'relative', height: 'auto', minHeight: '400px', backgroundColor: '#f8fafc', borderRadius: '40px', overflow: 'hidden', border: '2px dashed #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {(selectedFile || formData.image_url) ? (
                    <img src={selectedFile ? URL.createObjectURL(selectedFile) : formData.image_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ textAlign: 'center', color: '#94a3b8' }}>
                      <ImageIcon size={64} style={{ marginBottom: '16px', opacity: 0.3 }} />
                      <p>Choisir une image</p>
                    </div>
                  )}
                  <input type="file" onChange={e => setSelectedFile(e.target.files[0])} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {modalType === 'post' ? (
                    <>
                      <label style={labelStyle}>TITRE</label>
                      <input style={inputStyle} value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                      <label style={labelStyle}>CONTENU</label>
                      <textarea style={{ ...inputStyle, height: '300px' }} value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })} />
                    </>
                  ) : modalType === 'team' ? (
                    <>
                      <label style={labelStyle}>NOM</label>
                      <input style={inputStyle} value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                      <label style={labelStyle}>POSTE</label>
                      <input style={inputStyle} value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} />
                      <label style={labelStyle}>BIO</label>
                      <textarea style={{ ...inputStyle, height: '200px' }} value={formData.bio} onChange={e => setFormData({ ...formData, bio: e.target.value })} />
                    </>
                  ) : (
                    <>
                      <label style={labelStyle}>NOM</label>
                      <input style={inputStyle} value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                      <label style={labelStyle}>PRIX</label>
                      <input style={inputStyle} value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} />
                      <label style={labelStyle}>DESCRIPTION</label>
                      <textarea style={{ ...inputStyle, height: '200px' }} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                    </>
                  )}
                  <button type="submit" disabled={uploading} style={{ backgroundColor: '#000', color: '#fff', padding: '20px', borderRadius: '18px', border: 'none', fontWeight: 900, cursor: 'pointer', marginTop: '20px' }}>
                    {uploading ? 'PATIENTEZ...' : 'ENREGISTRER'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        
        @media (max-width: 1024px) {
          .stat-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .dual-grid { grid-template-columns: 1fr !important; }
          .form-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
        }
        
        @media (max-width: 768px) {
          .stat-grid { grid-template-columns: 1fr !important; }
          .mobile-hide { display: none !important; }
          .main-content { padding: 24px !important; }
          .header { padding: 0 24px !important; }
        }

        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
      `}</style>
    </div>
  );
};

const NavItem = ({ icon, label, active, onClick, badge }) => (
  <div onClick={onClick} style={{
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '10px 16px', borderRadius: '10px', cursor: 'pointer', marginBottom: '4px',
    backgroundColor: active ? '#0A2E36' : 'transparent',
    color: active ? '#fff' : '#64748b', transition: 'all 0.2s', fontWeight: active ? 700 : 500
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>{icon} <span style={{ fontSize: '13px' }}>{label}</span></div>
    {badge > 0 && <span style={{ backgroundColor: active ? '#fff' : '#000', color: active ? '#000' : '#fff', width: '18px', height: '18px', borderRadius: '50%', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>{badge}</span>}
  </div>
);

const FilterTab = ({ label, active }) => (
  <button style={{
    padding: '8px 24px', borderRadius: '10px', border: 'none', fontSize: '11px', fontWeight: 800, cursor: 'pointer',
    backgroundColor: active ? '#f8fafc' : 'transparent', color: active ? '#000' : '#94a3b8', boxShadow: active ? '0 2px 8px rgba(0,0,0,0.05)' : 'none', transition: 'all 0.2s'
  }}>{label}</button>
);

const IconButton = ({ icon, active }) => (
  <button style={{
    width: '44px', height: '44px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
    border: '1px solid #f1f5f9', backgroundColor: active ? '#fff' : 'transparent', color: active ? '#000' : '#94a3b8', boxShadow: active ? '0 4px 12px rgba(0,0,0,0.05)' : 'none', transition: 'all 0.2s'
  }}>{icon}</button>
);

const ProductGrid = ({ p, d, openEdit, onDelete }) => {
  const items = p || d || [];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '32px' }}>
      {items.map(item => (
        <div key={item.id} style={cardStyle}>
          <div style={{ position: 'relative', height: '240px', borderRadius: '24px', overflow: 'hidden', marginBottom: '24px' }}>
            <img src={item.image_url || '/image/placeholder.png'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', top: '20px', left: '20px', backgroundColor: '#22c55e', color: '#fff', padding: '4px 12px', borderRadius: '8px', fontSize: '10px', fontWeight: 900 }}>PUBLIÉ</div>
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: 900, marginBottom: '8px', textTransform: 'uppercase' }}>{item.title || item.name}</h3>
          <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.6, marginBottom: '24px' }}>{item.content?.substring(0, 100) || item.description?.substring(0, 100)}...</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button onClick={() => openEdit(item)} style={{ background: 'none', border: 'none', color: '#6366f1', fontSize: '11px', fontWeight: 800, cursor: 'pointer' }}>ÉDITER →</button>
            <button onClick={() => onDelete(item.id)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 size={18} /></button>
          </div>
        </div>
      ))}
    </div>
  );
};

const DashboardView = ({ d, b, m }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
    <div className="stat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
      <div style={statCard}><p style={statLabel}>DESTINATIONS</p><p style={statValue}>{d.length}</p></div>
      <div style={statCard}><p style={statLabel}>RÉSERVATIONS</p><p style={statValue}>{b.length}</p></div>
      <div style={statCard}><p style={statLabel}>MESSAGES</p><p style={statValue}>{m.length}</p></div>
    </div>

    <div className="dual-grid" style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '32px' }}>
      {/* Bar Chart - Statistiques Hebdomadaires */}
      <div style={{ ...cardStyle, padding: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.02em' }}>Flux de Réservations</h3>
            <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '13px' }}>Performance sur les 7 derniers jours</p>
          </div>
        </div>
        <div style={{ height: '240px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '12px', paddingBottom: '20px' }}>
          {[
            { label: 'LUN', val: 40 }, { label: 'MAR', val: 65 }, { label: 'MER', val: 45 },
            { label: 'JEU', val: 90 }, { label: 'VEN', val: 55 }, { label: 'SAM', val: 80 }, { label: 'DIM', val: 70 }
          ].map((item, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '100%',
                height: `${item.val}%`,
                backgroundColor: i === 3 ? '#000' : '#f1f5f9',
                borderRadius: '8px',
                transition: 'all 0.3s',
                position: 'relative'
              }}>
                {i === 3 && <div style={{ position: 'absolute', top: '-30px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#000', color: '#fff', padding: '4px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: 900 }}>+24%</div>}
              </div>
              <span style={{ fontSize: '10px', fontWeight: 800, color: '#94a3b8' }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Pie Chart - Répartition des Circuits */}
      <div style={{ ...cardStyle, padding: '32px' }}>
        <h3 style={{ margin: '0 0 24px', fontSize: '16px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.02em' }}>Répartition</h3>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '30px' }}>
          <div style={{ position: 'relative', width: '160px', height: '160px' }}>
            <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
              <circle cx="18" cy="18" r="15.9" fill="transparent" stroke="#f1f5f9" strokeWidth="3.8"></circle>
              <circle cx="18" cy="18" r="15.9" fill="transparent" stroke="#000" strokeWidth="3.8" strokeDasharray="65 100"></circle>
              <circle cx="18" cy="18" r="15.9" fill="transparent" stroke="#6366f1" strokeWidth="3.8" strokeDasharray="20 100" strokeDashoffset="-65"></circle>
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '24px', fontWeight: 900 }}>85%</span>
              <span style={{ fontSize: '9px', color: '#94a3b8', fontWeight: 800 }}>OBJECTIF</span>
            </div>
          </div>
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#000' }}></div>
                <span style={{ fontSize: '12px', fontWeight: 700 }}>Circuits</span>
              </div>
              <span style={{ fontSize: '12px', fontWeight: 800 }}>65%</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#6366f1' }}></div>
                <span style={{ fontSize: '12px', fontWeight: 700 }}>Hébergement</span>
              </div>
              <span style={{ fontSize: '12px', fontWeight: 800 }}>20%</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="dual-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '32px' }}>
      <div style={cardStyle}>
        <h3 style={{ margin: '0 0 24px', fontSize: '15px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Destinations à la une</h3>
        {d.slice(0, 4).map(item => (
          <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 0', borderBottom: '1px solid #f8fafc' }}>
            <img src={item.image_url || '/image/placeholder.png'} style={{ width: '44px', height: '44px', borderRadius: '12px', objectFit: 'cover' }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '13px', fontWeight: 700 }}>{item.name}</div>
              <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>{item.type || 'Circuit touristique'}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '13px', fontWeight: 900, color: '#000' }}>{item.price}</div>
              <div style={{ fontSize: '10px', color: '#22c55e', fontWeight: 800 }}>+12%</div>
            </div>
          </div>
        ))}
      </div>

      <div style={cardStyle}>
        <h3 style={{ margin: '0 0 24px', fontSize: '15px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Derniers Messages</h3>
        {m.slice(0, 4).map(item => (
          <div key={item.id} style={{ padding: '16px 0', borderBottom: '1px solid #f8fafc' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '12px', fontWeight: 800 }}>{item.sender}</span>
              <span style={{ fontSize: '10px', color: '#94a3b8' }}>{new Date(item.created_at).toLocaleDateString()}</span>
            </div>
            <div style={{ fontSize: '12px', color: '#64748b', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.content}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const BookingsView = ({ b, onUpdateStatus, onDelete }) => (
  <div style={{ backgroundColor: '#fff', borderRadius: '24px', border: '1px solid #f1f5f9', overflow: 'hidden' }}>
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ textAlign: 'left', borderBottom: '1px solid #f1f5f9' }}><th style={thStyle}>Client</th><th style={thStyle}>Circuit</th><th style={thStyle}>Statut</th><th style={thStyle}>Actions</th></tr>
      </thead>
      <tbody>
        {b.map(item => (
          <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
            <td style={tdStyle}><b>{item.sender}</b><br /><span style={{ fontSize: '11px', color: '#94a3b8' }}>{item.email}</span></td>
            <td style={tdStyle}>{item.tour_name}</td>
            <td style={tdStyle}>
              <select
                value={item.status}
                onChange={(e) => onUpdateStatus(item.id, e.target.value)}
                style={{
                  backgroundColor: item.status === 'En attente' ? '#fef3c7' : item.status === 'Confirmé' ? '#dcfce7' : '#fee2e2',
                  color: item.status === 'En attente' ? '#92400e' : item.status === 'Confirmé' ? '#15803d' : '#991b1b',
                  padding: '6px 12px', borderRadius: '10px', border: 'none', fontSize: '11px', fontWeight: 800, cursor: 'pointer', outline: 'none'
                }}
              >
                <option value="En attente">EN ATTENTE</option>
                <option value="Confirmé">CONFIRMÉ</option>
                <option value="Annulé">ANNULÉ</option>
              </select>
            </td>
            <td style={tdStyle}><button onClick={() => onDelete(item.id)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 size={18} /></button></td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const MessagesView = ({ m, onDelete, onMarkRead }) => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '24px' }}>
    {m.map(msg => (
      <div key={msg.id} style={{ ...cardStyle, borderLeft: msg.unread ? '4px solid #6366f1' : '1px solid #f1f5f9' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ fontWeight: 800 }}>{msg.sender} {msg.unread && <span style={{ color: '#6366f1', fontSize: '10px', marginLeft: '4px' }}>●</span>}</div>
          <div style={{ fontSize: '11px', color: '#94a3b8' }}>{new Date(msg.created_at).toLocaleDateString()}</div>
        </div>
        <div style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.6, marginBottom: '20px' }}>{msg.content}</div>
        <div style={{ display: 'flex', gap: '16px' }}>
          {msg.unread && <button onClick={() => onMarkRead(msg.id)} style={{ color: '#6366f1', background: 'none', border: 'none', cursor: 'pointer', fontSize: '11px', fontWeight: 800 }}>MARQUER LU</button>}
          <button onClick={() => onDelete(msg.id)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontSize: '11px', fontWeight: 800 }}>SUPPRIMER</button>
        </div>
      </div>
    ))}
  </div>
);

const TeamView = ({ t, openEdit, onDelete }) => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '32px' }}>
    {t.map(member => (
      <div key={member.id} style={cardStyle}>
        <div style={{ position: 'relative', height: '280px', borderRadius: '24px', overflow: 'hidden', marginBottom: '24px' }}>
          <img src={member.image_url || '/image/placeholder.png'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', top: '20px', left: '20px', backgroundColor: '#6366f1', color: '#fff', padding: '4px 12px', borderRadius: '8px', fontSize: '10px', fontWeight: 900 }}>{member.role?.toUpperCase()}</div>
        </div>
        <h3 style={{ fontSize: '18px', fontWeight: 900, marginBottom: '8px', textTransform: 'uppercase' }}>{member.name}</h3>
        <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.6, marginBottom: '24px' }}>{member.bio?.substring(0, 100)}...</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button onClick={() => openEdit(member)} style={{ background: 'none', border: 'none', color: '#6366f1', fontSize: '11px', fontWeight: 800, cursor: 'pointer' }}>MODIFIER →</button>
          <button onClick={() => onDelete(member.id)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 size={18} /></button>
        </div>
      </div>
    ))}
  </div>
);

const sectionTitle = { fontSize: '10px', fontWeight: 800, color: '#cbd5e1', letterSpacing: '0.1em', margin: '24px 24px 12px' };
const inputStyle = { width: '100%', padding: '14px 18px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '14px', boxSizing: 'border-box', outline: 'none' };
const searchBar = { width: '100%', padding: '14px 20px 14px 50px', borderRadius: '16px', border: '1px solid #f1f5f9', fontSize: '13px', backgroundColor: '#fff', outline: 'none', fontWeight: 500 };
const cardStyle = { backgroundColor: '#fff', padding: '24px', borderRadius: '32px', border: '1px solid #f1f5f9', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' };
const thStyle = { padding: '16px 24px', fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' };
const tdStyle = { padding: '20px 24px', fontSize: '14px' };
const statCard = { backgroundColor: '#fff', padding: '28px', borderRadius: '28px', border: '1px solid #f1f5f9', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' };
const statLabel = { fontSize: '10px', fontWeight: 800, color: '#94a3b8', margin: '0 0 10px', letterSpacing: '0.05em' };
const statValue = { fontSize: '22px', fontWeight: 900, margin: 0, color: '#000' };
const labelStyle = { fontSize: '11px', fontWeight: 900, color: '#94a3b8', marginBottom: '12px', display: 'block', letterSpacing: '0.1em' };
const modalBg = { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 };
const modalContent = { backgroundColor: '#fff', width: '100%', maxWidth: '500px', borderRadius: '32px', overflow: 'hidden' };

export default Admin;
