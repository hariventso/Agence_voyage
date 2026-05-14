import React from 'react';

const statCard = {
  backgroundColor: '#fff',
  padding: '24px',
  borderRadius: '24px',
  border: '1px solid #f1f5f9',
  boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
};

const statLabel = {
  fontSize: '11px',
  fontWeight: 800,
  color: '#94a3b8',
  margin: '0 0 8px',
  letterSpacing: '0.1em'
};

const statValue = {
  fontSize: '28px',
  fontWeight: 900,
  margin: 0,
  color: '#0A2E36'
};

const cardStyle = {
  backgroundColor: '#fff',
  padding: '24px',
  borderRadius: '32px',
  border: '1px solid #f1f5f9',
  transition: 'all 0.3s ease'
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
  </div>
);

export default DashboardView;
