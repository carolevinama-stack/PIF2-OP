import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// --- COLLE TES CLES FIREBASE V2 ICI ---
const firebaseConfig = {
  apiKey: "CHANGE_MOI",
  authDomain: "CHANGE_MOI",
  projectId: "CHANGE_MOI",
  storageBucket: "CHANGE_MOI",
  messagingSenderId: "CHANGE_MOI",
  appId: "CHANGE_MOI"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
