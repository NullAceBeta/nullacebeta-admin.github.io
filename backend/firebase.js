// firebase.js — Inicializa Firebase Admin SDK
const admin = require('firebase-admin');

// Opción A: serviceAccountKey.json local (desarrollo)
// Opción B: Variable de entorno FIREBASE_SERVICE_ACCOUNT en producción (Render)
let serviceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
} else {
  serviceAccount = require('./serviceAccountKey.json');
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  });
}

const db = admin.firestore();

module.exports = { db, admin };
