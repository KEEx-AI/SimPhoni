// src/services/DatabaseService.js

/**
 * DatabaseService.js
 * ------------------
 * Demonstrates how you might store/load user preferences, projects, or instruct lines.
 */

import { firestore, auth } from '../firebase';  // Adjust imports for your environment
import { doc, setDoc, getDoc, collection, addDoc, updateDoc } from 'firebase/firestore';

export async function saveUserSettings(settings) {
  if (!auth.currentUser) {
    throw new Error("No authenticated user - cannot save settings.");
  }
  const uid = auth.currentUser.uid;
  const ref = doc(firestore, 'users', uid, 'preferences', 'general');
  await setDoc(ref, { ...settings }, { merge: true });
  console.log("Saved user settings to Firestore:", settings);
}

export async function loadUserSettings() {
  if (!auth.currentUser) {
    throw new Error("No authenticated user - cannot load settings.");
  }
  const uid = auth.currentUser.uid;
  const ref = doc(firestore, 'users', uid, 'preferences', 'general');
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return snap.data();
}

// Example: Save an entire instruct schema
export async function saveInstructSchema(schemaName, schemaData) {
  if (!auth.currentUser) {
    throw new Error("No authenticated user - cannot save schema.");
  }
  const uid = auth.currentUser.uid;
  const schemasRef = collection(firestore, 'users', uid, 'instruct-schemas');
  // You could store by schemaName, or create a new doc each time
  await addDoc(schemasRef, {
    name: schemaName,
    data: schemaData,
    createdAt: new Date()
  });
  console.log(`Saved schema [${schemaName}] for user [${uid}]`);
}

export async function loadInstructSchema(schemaId) {
  // If you want to load a specific doc by id
  // Or adapt to your existing approach
  if (!auth.currentUser) {
    throw new Error("No authenticated user - cannot load schema.");
  }
  const uid = auth.currentUser.uid;
  // ... fetch doc by ID ...
  // Return data, or null if not found
  return null;
}
