import React, { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { collection, getDocs, addDoc, doc, deleteDoc } from 'firebase/firestore';

export default function Parametres() {
  const [sources, setSources] = useState([]);
  const [newSource, setNewSource] = useState({ nom: '', sigle: '', couleur: '#0f4c3a' });

  // Charger les sources existantes
  const loadSources = async () => {
    const snap = await getDocs(collection(db, 'sources'));
    setSources(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  useEffect(() => { loadSources(); }, []);

  const handleAddSource = async () => {
    if (!newSource.nom || !newSource.sigle) return alert("Remplissez le nom et le sigle");
    await addDoc(collection(db, 'sources'), newSource);
    setNewSource({ nom: '', sigle: '', couleur: '#0f4c3a' });
    loadSources();
  };

  return (
    <div style={{ padding: '40px' }}>
      <h1 style={{ color: '#0f4c3a' }}>⚙️ Paramètres du Système</h1>
      
      <div style={{ background: 'white', padding: '30px', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', marginBottom: '30px' }}>
        <h3>🏦 Ajouter une Source de Financement</h3>
        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <input 
            placeholder="Nom (ex: Banque Mondiale)" 
            value={newSource.nom}
            onChange={e => setNewSource({...newSource, nom: e.target.value})}
            style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd', flex: 2 }}
          />
          <input 
            placeholder="Sigle (ex: IDA)" 
            value={newSource.sigle}
            onChange={e => setNewSource({...newSource, sigle: e.target.value})}
            style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd', flex: 1 }}
          />
          <button onClick={handleAddSource} style={{ padding: '10px 20px', background: '#0f4c3a', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
            Ajouter
          </button>
        </div>
      </div>

      <div style={{ background: 'white', padding: '30px', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <h3>Sources configurées</h3>
        <ul style={{ listStyle: 'none', padding: 0, marginTop: '20px' }}>
          {sources.map(s => (
            <li key={s.id} style={{ padding: '10px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between' }}>
              <strong>{s.sigle}</strong> - {s.nom}
            </li>
          ))}
          {sources.length === 0 && <p style={{ color: '#999' }}>Aucune source pour le moment.</p>}
        </ul>
      </div>
    </div>
  );
}
