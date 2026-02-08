import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Budget from './pages/Budget'; // On importe la nouvelle page

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch(currentPage) {
      case 'dashboard':
        return (
          <div style={{ padding: '40px' }}>
            <h1 style={{ color: '#0f4c3a' }}>📊 Tableau de bord</h1>
            <p>Bienvenue dans votre gestion financière PIF 2.</p>
          </div>
        );
      case 'budget':
        return <Budget />; // ICI : On affiche notre nouveau fichier Budget.js
      case 'nouvelOp':
        return <div style={{ padding: '40px' }}><h1>➕ Nouvel OP</h1><p>Module en cours de migration...</p></div>;
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
