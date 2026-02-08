import React, { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function Budget() {
  const [sources, setSources] = useState([]);
  const [activeSource, setActiveSource] = useState(null);
  const [loading, setLoading] = useState(true);

  // Charger les sources de financement
  useEffect(() => {
    const loadSources = async () => {
      try {
        const snap = await getDocs(collection(db, 'sources'));
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setSources(data);
        if (data.length > 0) setActiveSource(data[0].id);
      } catch (error) {
        console.error("Erreur:", error);
      }
      setLoading(false);
    };
    loadSources();
  }, []);

  if (loading) return <div style={{ padding: '40px' }}>Chargement du budget...</div>;

  return (
    <div style={{ padding: '40px', maxWidth: '1200px' }}>
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '28px', color: '#0f4c3a', marginBottom: '10px' }}>💰 Gestion Budgétaire</h1>
        <p style={{ color: '#666' }}>Module en cours d'intégration.</p>
      </div>

      {/* Liste des sources */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        {sources.map(source => (
          <button
            key={source.id}
            onClick={() => setActiveSource(source.id)}
            style={{
              padding: '10px 20px',
              borderRadius: '12px',
              border: 'none',
              background: activeSource === source.id ? '#0f4c3a' : '#e9ecef',
              color: activeSource === source.id ? 'white' : '#333',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            {source.sigle || source.nom}
          </button>
        ))}
        {sources.length === 0 && <p>Aucune source trouvée. Ajoutez-en dans Paramètres.</p>}
      </div>

      <div style={{ background: 'white', padding: '40px', borderRadius: '16px', textAlign: 'center', border: '1px dashed #ccc' }}>
        <p style={{ color: '#666' }}>Sélectionnez une source ci-dessus pour voir le détail.</p>
      </div>
    </div>
  );
}
