import React from 'react';
import { Eye, Trash2 } from 'lucide-react';

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

const formatWhatsAppNumber = (phone) => phone ? phone.replace(/\D/g, '') : '';

const BookingsView = ({ b, onUpdateStatus, onDelete, onView }) => (
  <div style={{ backgroundColor: '#fff', borderRadius: '24px', border: '1px solid #f1f5f9', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '840px' }}>
      <thead>
        <tr style={{ textAlign: 'left', borderBottom: '1px solid #f1f5f9' }}>
          <th style={thStyle}>Client</th>
          <th style={thStyle}>Circuit</th>
          <th style={thStyle}>Téléphone</th>
          <th style={thStyle}>Statut</th>
          <th style={thStyle}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {b.map(item => {
          const waNumber = formatWhatsAppNumber(item.phone);
          return (
            <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
              <td style={tdStyle}>
                <b>{item.sender}</b><br />
                <span style={{ fontSize: '11px', color: '#94a3b8' }}>{item.email}</span>
              </td>
              <td style={tdStyle}>{item.tour_name}</td>
              <td style={tdStyle}>
                {item.phone ? (
                  <a href={`https://wa.me/${waNumber}`} target="_blank" rel="noreferrer" style={{ color: '#2563eb', fontWeight: 700, textDecoration: 'none' }}>
                    {item.phone}
                  </a>
                ) : (
                  <span style={{ color: '#94a3b8' }}>N/A</span>
                )}
              </td>
              <td style={tdStyle}>
                <select
                  value={item.status}
                  onChange={(e) => onUpdateStatus(item.id, e.target.value)}
                  style={{
                    backgroundColor: item.status === 'En attente' ? '#fef3c7' : item.status === 'Confirmé' ? '#dcfce7' : '#fee2e2',
                    color: item.status === 'En attente' ? '#92400e' : item.status === 'Confirmé' ? '#15803d' : '#991b1b',
                    padding: '6px 12px',
                    borderRadius: '10px',
                    border: 'none',
                    fontSize: '11px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    outline: 'none'
                  }}
                >
                  <option value="En attente">EN ATTENTE</option>
                  <option value="Confirmé">CONFIRMÉ</option>
                  <option value="Annulé">ANNULÉ</option>
                </select>
              </td>
              <td style={tdStyle}>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button onClick={() => onView(item)} style={{ color: '#6366f1', background: 'none', border: 'none', cursor: 'pointer' }}><Eye size={18} /></button>
                  <button onClick={() => onDelete(item.id)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 size={18} /></button>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

export default BookingsView;
