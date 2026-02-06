const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
require('dotenv').config();

// --- UPDATE START ---
// 1. Setup Firebase Admin (Cloud Compatible)
let serviceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  // If running on Render (Cloud), parse the internal JSON string
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
} else {
  // If running locally, look for the file
  serviceAccount = require('./serviceAccountKey.json');
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
// --- UPDATE END ---

const db = admin.firestore();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Online', timestamp: new Date() });
});

// FLIGHT SIMULATION ENGINE
const STATUS_OPTIONS = ['On Time', 'Delayed', 'Boarding', 'Departed', 'Cancelled'];

const simulateAirport = async () => {
  try {
    const snapshot = await db.collection('flights').get();
    if (snapshot.empty) return;

    const flights = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const randomFlight = flights[Math.floor(Math.random() * flights.length)];
    const newStatus = STATUS_OPTIONS[Math.floor(Math.random() * STATUS_OPTIONS.length)];

    console.log(`✈️ UPDATE: Flight ${randomFlight.code} is now ${newStatus}`);

    await db.collection('flights').doc(randomFlight.id).update({
      status: newStatus
    });

  } catch (error) {
    console.error("Simulation Error:", error);
  }
};

setInterval(simulateAirport, 5000);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('🤖 Airport Simulation Tower Active...');
});