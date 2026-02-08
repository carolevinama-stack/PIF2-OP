import React, { useState, useEffect } from 'react';
// On importe notre config Firebase PROPRE
import { db } from '../config/firebase'; 
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
// On importe nos outils qu'on vient de créer
import { Autocomplete } from '../components/UiTools'; 

export default function Beneficiaires() {
  const [beneficiaires, setBeneficiaires] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ nom: '', ncc: '', ribs: [] });
  const [newRib, setNewRib] = useState({ banque: '', numero: '' });

  // Chargement des données
  const loadData = async () => {
    const q = query(collection(db, 'beneficiaires'), orderBy('nom'));
    const snap = await getDocs(q);
    setBeneficiaires(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  useEffect(() => { loadData(); }, []);

  // Sauvegarde
  const handleSave = async () => {
    if (!form.nom) return alert("Le nom est obligatoire");
    const data = { 
        nom: form.nom.toUpperCase(), 
        ncc: form.ncc, 
        ribs: form.ribs 
    };
    await addDoc(collection(db, 'beneficiaires'), data);
    setShowModal(false);
    setForm({ nom: '', ncc: '', ribs: [] });
    loadData(); // Recharger la liste
  };

  // Gestion des RIB
  const addRib = () => {
    if(!newRib.numero) return;
    setForm({ ...form, ribs: [...form.ribs, newRib] });
    setNewRib({ banque: '', numero: '' });
  };

  return (
    <div style={{ padding: '30px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
        <h1 style={{ color: '#0f4c3a' }}>👥 Gestion des Bénéficiaires</h1>
        <button 
            onClick={() => setShowModal(true)} 
            style={{ background: '#0f4c3a', color: 'white', border: 'none', padding: '10px 20px', borderRadius: 8, cursor: 'pointer' }}
        >
            + Nouveau Bénéficiaire
        </button>
      </div>

      {/* Liste */}
      <div style={{ background: 'white', borderRadius: 16, boxShadow: '0 2px 10px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: '#f8f9fa' }}>
                <tr>
                    <th style={{ padding: 15, textAlign: 'left' }}>Nom / Raison Sociale</th>
                    <th style={{ padding: 15, textAlign: 'left' }}>NCC</th>
                    <th style={{ padding: 15, textAlign: 'left' }}>RIB(s)</th>
                </tr>
            </thead>
            <tbody>
                {beneficiaires.map(ben => (
                    <tr key={ben.id} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: 15 }}><strong>{ben.nom}</strong></td>
                        <td style={{ padding: 15 }}>{ben.ncc || '-'}</td>
                        <td style={{ padding: 15 }}>
                            {ben.ribs && ben.ribs.map((r, i) => (
                                <div key={i} style={{ fontSize: 13, fontFamily: 'monospace' }}>
                                    {r.banque} : {r.numero}
                                </div>
                            ))}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
        {beneficiaires.length === 0 && <div style={{ padding: 30, textAlign: 'center', color: '#999' }}>Aucun bénéficiaire enregistré</div>}
      </div>

      {/* Modal Ajout */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ background: 'white', padding: 30, borderRadius: 16, width: 500 }}>
                <h2>Nouveau Bénéficiaire</h2>
                <div style={{ marginBottom: 15 }}>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600 }}>Nom *</label>
                    <input style={{ width: '100%', padding: 10, marginTop: 5 }} value={form.nom} onChange={e => setForm({...form, nom: e.target.value})} />
                </div>
                <div style={{ marginBottom: 15 }}>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600 }}>NCC</label>
                    <input style={{ width: '100%', padding: 10, marginTop: 5 }} value={form.ncc} onChange={e => setForm({...form, ncc: e.target.value})} />
                </div>
                
                <div style={{ background: '#f8f9fa', padding: 15, borderRadius: 8, marginBottom: 15 }}>
                    <label style={{ fontSize: 12, fontWeight: 600 }}>Ajouter un RIB</label>
                    <div style={{ display: 'flex', gap: 5, marginTop: 5 }}>
                        <input placeholder="Banque" style={{ width: 80, padding: 8 }} value={newRib.banque} onChange={e => setNewRib({...newRib, banque: e.target.value})} />
                        <input placeholder="Numéro de compte" style={{ flex: 1, padding: 8 }} value={newRib.numero} onChange={e => setNewRib({...newRib, numero: e.target.value})} />
                        <button onClick={addRib} style={{ cursor: 'pointer' }}>➕</button>
                    </div>
                    <div style={{ marginTop: 10 }}>
                        {form.ribs.map((r, i) => <div key={i} style={{ fontSize: 12 }}>🏦 {r.banque} - {r.numero}</div>)}
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'end', gap: 10 }}>
                    <button onClick={() => setShowModal(false)} style={{ padding: '10px 20px', cursor: 'pointer' }}>Annuler</button>
                    <button onClick={handleSave} style={{ padding: '10px 20px', background: '#0f4c3a', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer' }}>Enregistrer</button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}
