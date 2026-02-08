import React, { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';

export default function Parametres() {
  const [sources, setSources] = useState([]);
  const [newSource, setNewSource] = useState({ nom: '', sigle: '', couleur: '#0f4c3a' });

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
      <h1 style={{ color: '#0f4c3a' }}>⚙️ Paramètres</h1>
      
      <div style={{ background: 'white', padding: '30px', borderRadius: '24px', marginBottom: '30px' }}>
        <h3>Ajouter une Source</h3>
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

      <div style={{ background: 'white', padding: '30px', borderRadius: '24px' }}>
        <h3>Sources existantes</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {sources.map(s => (
            <li key={s.id} style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
              <strong>{s.sigle}</strong> - {s.nom}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
