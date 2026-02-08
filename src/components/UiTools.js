import React, { useState } from 'react';
import Select from 'react-select';

// --- COMPOSANT 1 : AUTOCOMPLETE (Recherche intelligente) ---
export const Autocomplete = ({ 
  options, 
  value, 
  onChange, 
  placeholder = 'Rechercher...', 
  isDisabled = false, 
  isClearable = true,
  noOptionsMessage = 'Aucun résultat',
  accentColor = '#0f4c3a'
}) => {
  const customStyles = {
    control: (base, state) => ({
      ...base,
      minHeight: 44,
      borderRadius: 8,
      border: state.isFocused ? `2px solid ${accentColor}` : '2px solid #e9ecef',
      boxShadow: 'none',
      '&:hover': { borderColor: accentColor },
      background: isDisabled ? '#f8f9fa' : 'white',
      cursor: isDisabled ? 'not-allowed' : 'pointer'
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected ? accentColor : state.isFocused ? `${accentColor}15` : 'white',
      color: state.isSelected ? 'white' : '#333',
    }),
  };

  return (
    <Select
      options={options}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      isDisabled={isDisabled}
      isClearable={isClearable}
      styles={customStyles}
      noOptionsMessage={() => noOptionsMessage}
    />
  );
};

// --- COMPOSANT 2 : PASSWORD MODAL (Protection Admin) ---
export const PasswordModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Action protégée", 
  description = "", 
  warningMessage = "", 
  confirmText = "Confirmer", 
  confirmColor = "#0f4c3a",
  adminPassword
}) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleConfirm = () => {
    // Si aucun mot de passe n'est configuré dans le projet, on laisse passer (ou on met un défaut)
    const targetPwd = adminPassword || 'admin123'; 
    
    if (password !== targetPwd) {
      setError('Mot de passe incorrect');
      return;
    }
    onConfirm();
  };

  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000 }}>
      <div style={{ background: 'white', borderRadius: 14, width: '90%', maxWidth: 400, overflow: 'hidden' }}>
        <div style={{ padding: 20, background: '#f8f9fa', borderBottom: '1px solid #eee' }}>
          <h3 style={{ margin: 0 }}>🔐 {title}</h3>
        </div>
        <div style={{ padding: 20 }}>
          {description && <p>{description}</p>}
          {warningMessage && <div style={{ background: '#ffebee', color: '#c62828', padding: 10, borderRadius: 6, marginBottom: 15, fontSize: 13 }}>⚠️ {warningMessage}</div>}
          
          <input 
            type="password" 
            value={password} 
            onChange={(e) => { setPassword(e.target.value); setError(''); }}
            placeholder="Mot de passe administrateur"
            style={{ width: '100%', padding: 12, border: '2px solid #eee', borderRadius: 8, boxSizing: 'border-box' }}
          />
          {error && <div style={{ color: 'red', fontSize: 12, marginTop: 5 }}>{error}</div>}
        </div>
        <div style={{ padding: 20, display: 'flex', justifyContent: 'end', gap: 10, background: '#f8f9fa' }}>
          <button onClick={onClose} style={{ padding: '10px 20px', border: 'none', background: '#e9ecef', borderRadius: 8, cursor: 'pointer' }}>Annuler</button>
          <button onClick={handleConfirm} style={{ padding: '10px 20px', border: 'none', background: confirmColor, color: 'white', borderRadius: 8, cursor: 'pointer' }}>{confirmText}</button>
        </div>
      </div>
    </div>
  );
};
