const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const axios = require('axios'); // NEW: For making API calls
require('dotenv').config();

// 1. Setup Firebase Admin (Cloud Compatible)
let serviceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  // If running on Render (Cloud), parse the internal JSON string
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
} else {
  // If running locally, look for the file
  try {
    serviceAccount = require('./serviceAccountKey.json');
  } catch (error) {
    console.error("❌ Error: serviceAccountKey.json not found. Please ensure it is in the server folder.");
    process.exit(1);
  }
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Online', timestamp: new Date() });
});

// --- REAL DATA ENGINE ---

// Helper: Fetch from AviationStack
const fetchRealFlights = async () => {
  try {
    const apiKey = process.env.AVIATION_STACK_KEY;
    if (!apiKey) {
      console.error("❌ Error: AVIATION_STACK_KEY is missing in .env");
      return;
    }

    console.log("🌍 Contacting AviationStack...");
    
    // We limit to 5 flights to keep data clean and save API usage
    const response = await axios.get(`http://api.aviationstack.com/v1/flights?access_key=${apiKey}&limit=5`);
    const realFlights = response.data.data;

    if (!realFlights || realFlights.length === 0) {
      console.log("⚠️ No flights returned from API.");
      return;
    }

    // Save to Firestore
    const batch = db.batch();
    
    realFlights.forEach(flight => {
      // Create a clean object (handle missing data)
      // Note: AviationStack structure is complex, we extract what we need
      const flightData = {
        code: flight.flight.iata || flight.flight.icao || 'UNKNOWN',
        airline: flight.airline.name || 'Unknown Airline',
        destination: flight.arrival.airport || 'Unknown Destination',
        // Simple status capitalization
        status: flight.flight_status ? (flight.flight_status.charAt(0).toUpperCase() + flight.flight_status.slice(1)) : 'Scheduled',
        gate: flight.departure.gate || 'TBD',
        updatedAt: new Date().toISOString()
      };

      // Use flight code as ID so we don't duplicate
      if (flightData.code !== 'UNKNOWN') {
        const docRef = db.collection('flights').doc(flightData.code);
        batch.set(docRef, flightData);
      }
    });

    await batch.commit();
    console.log(`✅ Synced ${realFlights.length} real flights from AviationStack`);

  } catch (error) {
    console.error("❌ API Error:", error.message);
  }
};

// Route to manually trigger data refresh
app.post('/api/refresh-flights', async (req, res) => {
  await fetchRealFlights();
  res.json({ message: "Real data synced successfully" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('📡 Real-Data Flight Engine Active. waiting for requests...');
});