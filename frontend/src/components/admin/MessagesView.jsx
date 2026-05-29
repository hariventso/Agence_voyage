
const cardStyle = {
  backgroundColor: '#fff',
  padding: '24px',
  borderRadius: '32px',
  border: '1px solid #f1f5f9',
  boxShadow: '0 10px 30px rgba(0,0,0,0.02)'
};

const MessagesView = ({ m, onDelete, onMarkRead }) => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '24px' }}>
    {m.map(msg => (
      <div key={msg.id} style={{ ...cardStyle, borderLeft: msg.unread ? '4px solid #6366f1' : '1px solid #f1f5f9' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ fontWeight: 800 }}>
            {msg.sender} {msg.unread && <span style={{ color: '#6366f1', fontSize: '10px', marginLeft: '4px' }}>●</span>}
          </div>
          <div style={{ fontSize: '11px', color: '#94a3b8' }}>
            {new Date(msg.created_at).toLocaleDateString()}
          </div>
        </div>
        <div style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.6, marginBottom: '20px' }}>
          {msg.content}
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          {msg.unread && (
            <button 
              onClick={() => onMarkRead(msg.id)} 
              style={{ color: '#6366f1', background: 'none', border: 'none', cursor: 'pointer', fontSize: '11px', fontWeight: 800 }}
            >
              MARQUER LU
            </button>
          )}
          <button 
            onClick={() => onDelete(msg.id)} 
            style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontSize: '11px', fontWeight: 800 }}
          >
            SUPPRIMER
          </button>
        </div>
      </div>
    ))}
  </div>
);

export default MessagesView;
