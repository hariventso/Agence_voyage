import React from 'react';
import { List, Bell } from 'lucide-react';

const AdminHeader = ({ isMobile, setShowSidebar, getTabTitle, messages, onLogout, onForceRelogin }) => {
  return (
    <header className="header" style={{
      height: '70px', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 40px', position: 'sticky', top: 0, zIndex: 50, borderBottom: '1px solid #f1f5f9'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {isMobile && <List onClick={() => setShowSidebar(true)} size={24} style={{ marginRight: '8px', cursor: 'pointer' }} />}
        <h2 style={{ fontSize: '14px', fontWeight: 800, margin: 0, color: '#000', letterSpacing: '0.05em' }}>{getTabTitle()}</h2>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <div style={{ position: 'relative', cursor: 'pointer' }}>
          <Bell size={20} color="#000" />
          {Array.isArray(messages) && messages.some(m => m.unread) && (
            <div style={{ 
              position: 'absolute', top: '-4px', right: '-4px', width: '14px', height: '14px', 
              backgroundColor: '#ef4444', borderRadius: '50%', color: '#fff', fontSize: '9px', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 
            }}>
              {messages.filter(m => m.unread).length}
            </div>
          )}
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button onClick={onForceRelogin} style={{ color: '#111827', fontWeight: 700, border: 'none', background: 'transparent', cursor: 'pointer' }}>
            Se reconnecter
          </button>
          <button onClick={onLogout} style={{ color: '#111827', fontWeight: 700, border: 'none', background: 'transparent', cursor: 'pointer' }}>
            Déconnexion
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
