const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
require('dotenv').config();

// 1. Setup Firebase Admin (The "Manager")
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// 2. Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Online', timestamp: new Date() });
});

// 3. FLIGHT SIMULATION ENGINE
// This function picks a random flight and changes its status randomly
const STATUS_OPTIONS = ['On Time', 'Delayed', 'Boarding', 'Departed', 'Cancelled'];

const simulateAirport = async () => {
  try {
    // Get all flights
    const snapshot = await db.collection('flights').get();
    if (snapshot.empty) return;

    const flights = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Pick a random flight
    const randomFlight = flights[Math.floor(Math.random() * flights.length)];
    
    // Pick a random new status
    const newStatus = STATUS_OPTIONS[Math.floor(Math.random() * STATUS_OPTIONS.length)];

    console.log(`✈️ UPDATE: Flight ${randomFlight.code} is now ${newStatus}`);

    // Update in Firestore
    await db.collection('flights').doc(randomFlight.id).update({
      status: newStatus
    });

  } catch (error) {
    console.error("Simulation Error:", error);
  }
};

// Run simulation every 5 seconds
setInterval(simulateAirport, 5000);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('🤖 Airport Simulation Tower Active...');
});