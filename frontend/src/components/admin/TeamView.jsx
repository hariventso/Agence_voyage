import { Edit, Trash2 } from 'lucide-react';
import { getImageUrl } from '../../services/images';

const thStyle = {
  padding: '16px 24px',
  fontSize: '11px',
  fontWeight: 800,
  color: '#94a3b8',
  textTransform: 'uppercase'
};

const tdStyle = {
  padding: '20px 24px',
  fontSize: '14px'
};

const cardStyle = {
  backgroundColor: '#fff',
  padding: '24px',
  borderRadius: '32px',
  border: '1px solid #f1f5f9',
  boxShadow: '0 10px 30px rgba(0,0,0,0.02)'
};

const TeamView = ({ t, viewMode, openEdit, onDelete }) => {
  if (viewMode === 'list') {
    return (
      <div style={{ backgroundColor: '#fff', borderRadius: '24px', border: '1px solid #f1f5f9', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid #f1f5f9' }}>
              <th style={thStyle}>Membre</th>
              <th style={thStyle}>Poste</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {t.map(member => (
              <tr key={member.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={tdStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img src={getImageUrl(member.image_url)} alt="" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                    <b>{member.name}</b>
                  </div>
                </td>
                <td style={tdStyle}>{member.role}</td>
                <td style={tdStyle}>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={() => openEdit(member)} style={{ color: '#6366f1', background: 'none', border: 'none', cursor: 'pointer' }}><Edit size={18} /></button>
                    <button onClick={() => onDelete(member.id)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '32px' }}>
      {t.map(member => (
        <div key={member.id} style={cardStyle}>
          <div style={{ position: 'relative', height: '280px', borderRadius: '24px', overflow: 'hidden', marginBottom: '24px' }}>
            <img src={getImageUrl(member.image_url)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
};

export default TeamView;
