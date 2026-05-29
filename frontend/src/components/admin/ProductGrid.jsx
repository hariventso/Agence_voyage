import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { getImageUrl } from '../../services/images';

const thStyle = {
  padding: '20px 24px',
  color: '#94a3b8',
  fontSize: '11px',
  fontWeight: 800,
  textTransform: 'uppercase',
  letterSpacing: '0.1em'
};

const tdStyle = {
  padding: '20px 24px',
  verticalAlign: 'middle'
};

const cardStyle = {
  backgroundColor: '#fff',
  padding: '24px',
  borderRadius: '32px',
  border: '1px solid #f1f5f9',
  transition: 'all 0.3s ease'
};

const ProductGrid = ({ p, d, viewMode, openEdit, onDelete }) => {
  const items = p || d || [];

  if (viewMode === 'list') {
    return (
      <div style={{ backgroundColor: '#fff', borderRadius: '24px', border: '1px solid #f1f5f9', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid #f1f5f9' }}>
              <th style={thStyle}>Image</th>
              <th style={thStyle}>Nom / Titre</th>
              <th style={thStyle}>Détails</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={tdStyle}>
                  <img src={getImageUrl(item.image_url)} alt="" style={{ width: '44px', height: '44px', borderRadius: '10px', objectFit: 'cover' }} />
                </td>
                <td style={tdStyle}><b>{item.title || item.name}</b></td>
                <td style={tdStyle}><span style={{ fontSize: '12px', color: '#64748b' }}>{item.price || item.category || 'Article'}</span></td>
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
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '32px' }}>
      {items.map(item => (
        <div key={item.id} style={cardStyle}>
          <div style={{ position: 'relative', height: '240px', borderRadius: '24px', overflow: 'hidden', marginBottom: '24px' }}>
            <img src={getImageUrl(item.image_url)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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

export default ProductGrid;
