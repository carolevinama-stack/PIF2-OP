import React, { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { collection, getDocs, addDoc, query, orderBy, where } from 'firebase/firestore';
import { Autocomplete } from '../components/UiTools';

export default function NouvelOp() {
  // Données de base
  const [sources, setSources] = useState([]);
  const [exercices, setExercices] = useState([]);
  const [beneficiaires, setBeneficiaires] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [ops, setOps] = useState([]);
  
  // Formulaire
  const [activeSource, setActiveSource] = useState('');
  const [form, setForm] = useState({
    type: 'DIRECT',
    beneficiaireId: '',
    objet: '',
    montant: '',
    ligneBudgetaire: '',
    modeReglement: 'VIREMENT',
    piecesJustificatives: ''
  });

  const [loading, setLoading] = useState(true);

  // Chargement de toutes les données nécessaires
  useEffect(() => {
    const loadAllData = async () => {
      const snapSources = await getDocs(collection(db, 'sources'));
      const snapExercices = await getDocs(collection(db, 'exercices'));
      const snapBen = await getDocs(collection(db, 'beneficiaires'));
      const snapBudgets = await getDocs(collection(db, 'budgets'));
      const snapOps = await getDocs(collection(db, 'ops'));

      setSources(snapSources.docs.map(d => ({ id: d.id, ...d.data() })));
      setExercices(snapExercices.docs.map(d => ({ id: d.id, ...d.data() })));
      setBeneficiaires(snapBen.docs.map(d => ({ id: d.id, ...d.data() })));
      setBudgets(snapBudgets.docs.map(d => ({ id: d.id, ...d.data() })));
      setOps(snapOps.docs.map(d => ({ id: d.id, ...d.data() })));
      
      const sourcesData = snapSources.docs.map(d => ({ id: d.id, ...d.data() }));
      if(sourcesData.length > 0) setActiveSource(sourcesData[0].id);
      
      setLoading(false);
    };
    loadAllData();
  }, []);

  // --- LOGIQUE CALCULS BUDGETAIRES ---
  const exActif = exercices.find(e => e.actif);
  const budgetActif = budgets.find(b => b.sourceId === activeSource && b.exerciceId === exActif?.id);
  const ligneSelectionnee = budgetActif?.lignes?.find(l => l.code === form.ligneBudgetaire);
  
  const dotation = ligneSelectionnee?.dotation || 0;
  
  const engagementsAnterieurs = ops
    .filter(op => op.sourceId === activeSource && op.exerciceId === exActif?.id && op.ligneBudgetaire === form.ligneBudgetaire && op.statut !== 'REJETE')
    .reduce((sum, op) => sum + (op.montant || 0), 0);

  const montantActuel = parseFloat(form.montant) || 0;
  const cumulEngagements = engagementsAnterieurs + montantActuel;
  const disponible = dotation - cumulEngagements;

  // --- SAUVEGARDE ---
  const handleSave = async () => {
    if (!form.beneficiaireId || !form.montant || !form.ligneBudgetaire) {
        return alert("Veuillez remplir les champs obligatoires (*)");
    }
    if (disponible < 0) {
        return alert("❌ Budget insuffisant sur cette ligne !");
    }

    try {
        const opData = {
            ...form,
            montant: montantActuel,
            sourceId: activeSource,
            exerciceId: exActif.id,
            statut: 'CREE',
            dateCreation: new Date().toISOString().split('T')[0],
            createdAt: new Date().toISOString()
        };
        await addDoc(collection(db, 'ops'), opData);
        alert("✅ OP créé avec succès !");
        setForm({ ...form, objet: '', montant: '', piecesJustificatives: '' });
    } catch (e) {
        alert("Erreur lors de la création");
    }
  };

  if (loading) return <div style={{ padding: 40 }}>Chargement du formulaire...</div>;

  return (
    <div style={{ padding: '30px', maxWidth: '1000px' }}>
      <h1 style={{ color: '#0f4c3a', marginBottom: '20px' }}>➕ Nouvel Ordre de Paiement</h1>

      {/* Choix de la source */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 25 }}>
        {sources.map(s => (
          <button 
            key={s.id} 
            onClick={() => setActiveSource(s.id)}
            style={{ 
                padding: '10px 20px', borderRadius: 10, border: 'none', cursor: 'pointer',
                background: activeSource === s.id ? '#0f4c3a' : '#eee',
                color: activeSource === s.id ? 'white' : '#333',
                fontWeight: 600
            }}
          >
            {s.sigle}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: 20 }}>
        {/* Formulaire Saisie */}
        <div style={{ background: 'white', padding: 25, borderRadius: 20, boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
          <div style={{ marginBottom: 15 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 5 }}>Bénéficiaire *</label>
            <Autocomplete 
                options={beneficiaires.map(b => ({ value: b.id, label: b.nom }))}
                value={beneficiaires.filter(b => b.id === form.beneficiaireId).map(b => ({ value: b.id, label: b.nom }))[0]}
                onChange={(opt) => setForm({ ...form, beneficiaireId: opt?.value })}
            />
          </div>

          <div style={{ marginBottom: 15 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 5 }}>Objet de la dépense *</label>
            <textarea 
                style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #ddd', minHeight: 60 }}
                value={form.objet}
                onChange={e => setForm({ ...form, objet: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', gap: 15, marginBottom: 15 }}>
            <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 5 }}>Ligne Budgétaire *</label>
                <Autocomplete 
                    options={(budgetActif?.lignes || []).map(l => ({ value: l.code, label: `${l.code} - ${l.libelle}` }))}
                    onChange={(opt) => setForm({ ...form, ligneBudgetaire: opt?.value })}
                />
            </div>
            <div style={{ width: 150 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 5 }}>Montant (FCFA) *</label>
                <input 
                    type="number"
                    style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #ddd', textAlign: 'right' }}
                    value={form.montant}
                    onChange={e => setForm({ ...form, montant: e.target.value })}
                />
            </div>
          </div>

          <button 
            onClick={handleSave}
            style={{ width: '100%', padding: 15, background: '#0f4c3a', color: 'white', border: 'none', borderRadius: 12, fontWeight: 'bold', cursor: 'pointer', fontSize: 16 }}
          >
            ENREGISTRER L'ORDRE DE PAIEMENT
          </button>
        </div>

        {/* Panneau de contrôle budgétaire */}
        <div style={{ background: '#f8f9fa', padding: 20, borderRadius: 20, border: '1px solid #eee' }}>
          <h3 style={{ fontSize: 14, color: '#0f4c3a', marginBottom: 15 }}>📊 SITUATION BUDGÉTAIRE</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 12, color: '#666' }}>Dotation :</span>
                <span style={{ fontWeight: 'bold' }}>{new Intl.NumberFormat('fr-FR').format(dotation)} F</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 12, color: '#666' }}>Déjà engagé :</span>
                <span style={{ fontWeight: 'bold', color: '#e65100' }}>{new Intl.NumberFormat('fr-FR').format(engagementsAnterieurs)} F</span>
            </div>
            <hr style={{ border: 'none', borderTop: '1px solid #ddd' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15 }}>
                <span style={{ fontWeight: 600 }}>Disponible :</span>
                <span style={{ fontWeight: 'bold', color: disponible < 0 ? 'red' : '#2e7d32' }}>
                    {new Intl.NumberFormat('fr-FR').format(disponible)} F
                </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
