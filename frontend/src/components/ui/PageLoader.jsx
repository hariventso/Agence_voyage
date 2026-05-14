import React from 'react';

const PageLoader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f8fafc' }}>
    <div className="spinner" style={{ width: '40px', height: '40px', border: '3px solid #f1f5f9', borderTopColor: '#0A2E36', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
  </div>
);

export default PageLoader;
