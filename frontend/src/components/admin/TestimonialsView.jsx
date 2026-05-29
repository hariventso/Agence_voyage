import React from 'react';
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

const TestimonialsView = ({ t, viewMode, openEdit, onDelete }) => {
  if (viewMode === 'list') {
    return (
      <div style={{ backgroundColor: '#fff', borderRadius: '24px', border: '1px solid #f1f5f9', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid #f1f5f9' }}>
              <th style={thStyle}>Voyageur</th>
              <th style={thStyle}>Note</th>
              <th style={thStyle}>Message</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {t.map(item => (
              <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={tdStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img src={getImageUrl(item.image_url)} alt="" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                    <div>
                      <b>{item.name}</b>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>{item.role}</div>
                    </div>
                  </div>
                </td>
                <td style={tdStyle}>
                  <div style={{ display: 'flex', gap: '2px' }}>
                    {[...Array(5)].map((_, i) => (
                      <span key={i} style={{ color: i < item.rating ? '#f59e0b' : '#e2e8f0', fontSize: '12px' }}>★</span>
                    ))}
                  </div>
                </td>
                <td style={tdStyle}>
                  <div style={{ fontSize: '12px', color: '#64748b', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.content}
                  </div>
                </td>
                <td style={tdStyle}>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={() => openEdit(item)} style={{ color: '#6366f1', background: 'none', border: 'none', cursor: 'pointer' }}><Edit size={18} /></button>
                    <button onClick={() => onDelete(item.id)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 size={18} /></button>
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
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '32px' }}>
      {t.map(item => (
        <div key={item.id} style={cardStyle}>
          <div style={{ display: 'flex', gap: '20px', marginBottom: '24px' }}>
            <img src={getImageUrl(item.image_url)} alt="" style={{ width: '80px', height: '80px', borderRadius: '20px', objectFit: 'cover' }} />
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 900, margin: '0 0 4px', textTransform: 'uppercase' }}>{item.name}</h3>
              <p style={{ fontSize: '12px', color: '#22c55e', fontWeight: 800, margin: '0 0 8px' }}>{item.role}</p>
              <div style={{ display: 'flex', gap: '2px' }}>
                {[...Array(5)].map((_, i) => (
                  <span key={i} style={{ color: i < item.rating ? '#f59e0b' : '#e2e8f0', fontSize: '14px' }}>★</span>
                ))}
              </div>
            </div>
          </div>
          <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.6, marginBottom: '24px', fontStyle: 'italic' }}>"{item.content}"</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button onClick={() => openEdit(item)} style={{ background: 'none', border: 'none', color: '#6366f1', fontSize: '11px', fontWeight: 800, cursor: 'pointer' }}>MODIFIER →</button>
            <button onClick={() => onDelete(item.id)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 size={18} /></button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TestimonialsView;
