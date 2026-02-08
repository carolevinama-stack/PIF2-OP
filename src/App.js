import React, { useState } from 'react';
import Sidebar from './components/Sidebar';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  // Cette fonction change la page affichée
  const renderPage = () => {
    switch(currentPage) {
      case 'dashboard':
        return <div style={{ padding: '40px' }}><h1>📊 Tableau de bord</h1><p>Bienvenue dans votre nouvel espace.</p></div>;
      case 'nouvelOp':
        return <div style={{ padding: '40px' }}><h1>➕ Créer un OP</h1><p>Le formulaire sera ici.</p></div>;
      case 'budget':
        return <div style={{ padding: '40px' }}><h1>💰 Gestion du Budget</h1><p>Les lignes budgétaires seront ici.</p></div>;
      default:
        return <div style={{ padding: '40px' }}><h1>Page en construction</h1></div>;
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#FDFBF7' }}>
      {/* Notre nouveau menu */}
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />

      {/* Le contenu à droite du menu */}
      <main style={{ marginLeft: '260px', flex: 1 }}>
        {renderPage()}
      </main>
    </div>
  );
}

export default App;
