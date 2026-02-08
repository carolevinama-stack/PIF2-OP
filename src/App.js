import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Budget from './pages/Budget';
import Parametres from './pages/Parametres';
import Beneficiaires from './pages/Beneficiaires';
import NouvelOp from './pages/NouvelOp'; // AJOUTÉ

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch(currentPage) {
      case 'dashboard':
        return <div style={{ padding: '40px' }}><h1>📊 Tableau de bord</h1><p>Prêt pour les opérations.</p></div>;
      case 'budget':
        return <Budget />;
      case 'parametres':
        return <Parametres />;
      case 'beneficiaires':
        return <Beneficiaires />;
      case 'nouvelOp': // AJOUTÉ
        return <NouvelOp />; 
      default:
        return <div style={{ padding: '40px' }}><h1>Page en construction</h1></div>;
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#FDFBF7' }}>
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      <main style={{ marginLeft: '260px', flex: 1 }}>
        {renderPage()}
      </main>
    </div>
  );
}

export default App;
