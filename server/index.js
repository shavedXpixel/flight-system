const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const axios = require('axios'); 
require('dotenv').config();

// Setup Firebase
let serviceAccount;
if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
} else {
  try {
    serviceAccount = require('./serviceAccountKey.json');
  } catch (error) {
    console.error("❌ Error: serviceAccountKey.json missing.");
    process.exit(1);
  }
}

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// --- NEW: LOGGING SYSTEM ---
const logEvent = async (message, type = 'info') => {
  try {
    await db.collection('logs').add({
      message,
      type, // 'info', 'warning', 'error', 'success'
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });
  } catch (error) {
    console.error("Logging failed:", error);
  }
};

app.get('/api/health', (req, res) => res.json({ status: 'Online' }));

// --- REAL DATA ENGINE ---
const fetchRealFlights = async () => {
  try {
    const apiKey = process.env.AVIATION_STACK_KEY;
    if (!apiKey) return console.error("❌ AVIATION_STACK_KEY missing");

    const response = await axios.get(`http://api.aviationstack.com/v1/flights?access_key=${apiKey}&limit=5`);
    const realFlights = response.data.data;

    if (!realFlights || realFlights.length === 0) return;

    const batch = db.batch();
    realFlights.forEach(flight => {
      const flightData = {
        code: flight.flight.iata || flight.flight.icao || 'UNKNOWN',
        airline: flight.airline.name || 'Unknown',
        destination: flight.arrival.airport || 'Unknown',
        status: flight.flight_status ? (flight.flight_status.charAt(0).toUpperCase() + flight.flight_status.slice(1)) : 'Scheduled',
        gate: flight.departure.gate || 'TBD',
        updatedAt: new Date().toISOString()
      };
      if (flightData.code !== 'UNKNOWN') {
        const docRef = db.collection('flights').doc(flightData.code);
        batch.set(docRef, flightData);
      }
    });

    await batch.commit();
    // LOG IT
    await logEvent(`Synced ${realFlights.length} flights from Global API`, 'info');
    console.log(`✅ Synced ${realFlights.length} real flights`);

  } catch (error) {
    await logEvent(`API Sync Failed: ${error.message}`, 'error');
  }
};

app.post('/api/refresh-flights', async (req, res) => {
  await fetchRealFlights();
  res.json({ message: "Sync complete" });
});

// --- ADMIN ROUTE ---
app.post('/api/flights', async (req, res) => {
  try {
    const flightData = req.body;
    if (!flightData.code || !flightData.destination) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const newFlight = { ...flightData, updatedAt: new Date().toISOString() };
    await db.collection('flights').doc(newFlight.code).set(newFlight);
    
    // LOG IT
    await logEvent(`Flight ${newFlight.code} to ${newFlight.destination} added manually`, 'success');
    
    res.json({ message: "Flight added", flight: newFlight });
  } catch (error) {
    await logEvent(`Failed to add flight: ${error.message}`, 'error');
    res.status(500).json({ error: "Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});