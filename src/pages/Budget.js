import React, { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { collection, getDocs, addDoc, doc, updateDoc, query, where } from 'firebase/firestore';

export default function Budget() {
  const [sources, setSources] = useState([]);
  const [activeSource, setActiveSource] = useState(null);
  const [budgetLignes, setBudgetLignes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Charger les sources de financement
  useEffect(() => {
    const loadSources = async () => {
      const snap = await getDocs(collection(db, 'sources'));
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setSources(data);
      if (data.length > 0) setActiveSource(data[0].id);
      setLoading(false);
    };
    loadSources();
  }, []);

  if (loading) return <div style={{ padding: '40px' }}>Chargement du budget...</div>;

  return (
    <div style={{ padding: '40px', maxWidth: '1200px' }}>
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '28px', color: '#0f4c3a', marginBottom: '10px' }}>💰 Gestion Budgétaire</h1>
        <p style={{ color: '#666' }}>Définissez vos dotations par source de financement.</p>
      </div>

      {/* Onglets des Sources */}
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
            {source.sigle}
          </button>
        ))}
      </div>

      {/* Carte du Budget */}
      <div style={{ background: 'white', padding: '30px', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h3 style={{ margin: 0 }}>Lignes Budgétaires</h3>
          <button style={{ padding: '8px 16px', background: '#f0b429', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
            + Ajouter une ligne
          </button>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '2px solid #f8f9fa' }}>
              <th style={{ padding: '12px', fontSize: '12px', color: '#999' }}>CODE</th>
              <th style={{ padding: '12px', fontSize: '12px', color: '#999' }}>LIBELLÉ</th>
              <th style={{ padding: '12px', fontSize: '12px', color: '#999', textAlign: 'right' }}>DOTATION (FCFA)</th>
            </tr>
          </thead>
          <tbody>
            {/* On affichera les lignes ici */}
            <tr>
              <td colSpan="3" style={{ padding: '40px', textAlign: 'center', color: '#999' }}>
                Aucune ligne définie pour cette source.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
