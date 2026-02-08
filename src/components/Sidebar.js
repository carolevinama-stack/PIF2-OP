import React from 'react';

const NavItem = ({ id, icon, label, active, onClick }) => (
  <button
    onClick={() => onClick(id)}
    style={{
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px 24px',
      border: 'none',
      background: active ? 'rgba(255,255,255,0.15)' : 'transparent',
      color: 'white',
      cursor: 'pointer',
      textAlign: 'left',
      fontSize: '14px',
      borderLeft: active ? '4px solid #f0b429' : '4px solid transparent',
      transition: 'all 0.2s'
    }}
  >
    <span style={{ fontSize: '18px' }}>{icon}</span>
    <span style={{ fontWeight: active ? '600' : '400' }}>{label}</span>
  </button>
);

export default function Sidebar({ currentPage, onNavigate }) {
  return (
    <div style={{
      width: '260px',
      height: '100vh',
      background: 'linear-gradient(180deg, #0a3528 0%, #0f4c3a 100%)',
      color: 'white',
      position: 'fixed',
      left: 0,
      top: 0,
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '4px 0 10px rgba(0,0,0,0.1)'
    }}>
      <div style={{ padding: '30px 24px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ background: '#f0b429', padding: '8px', borderRadius: '8px', fontSize: '20px' }}>🌳</div>
          <h1 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>PIF 2 - GESTION</h1>
        </div>
      </div>

      <nav style={{ flex: 1, paddingTop: '20px' }}>
        <NavItem id="dashboard" icon="📊" label="Tableau de bord" active={currentPage === 'dashboard'} onClick={onNavigate} />
        
        <div style={{ padding: '20px 24px 10px', fontSize: '11px', opacity: 0.5, letterSpacing: '1px' }}>OPÉRATIONS</div>
        <NavItem id="nouvelOp" icon="➕" label="Nouvel OP" active={currentPage === 'nouvelOp'} onClick={onNavigate} />
        <NavItem id="ops" icon="📋" label="Liste des OP" active={currentPage === 'ops'} onClick={onNavigate} />
        
        <div style={{ padding: '20px 24px 10px', fontSize: '11px', opacity: 0.5, letterSpacing: '1px' }}>GESTION</div>
        <NavItem id="budget" icon="💰" label="Budget" active={currentPage === 'budget'} onClick={onNavigate} />
        <NavItem id="parametres" icon="⚙️" label="Paramètres" active={currentPage === 'parametres'} onClick={onNavigate} />
      </nav>

      <div style={{ padding: '20px', borderTop: '1px solid rgba(255,255,255,0.1)', fontSize: '12px', opacity: 0.7 }}>
        Version 2.0.0
      </div>
    </div>
  );
}
