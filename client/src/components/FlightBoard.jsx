import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

// ⚠️ REPLACE THIS WITH YOUR ACTUAL RENDER BACKEND URL
const BACKEND_URL = "https://flight-system-backend.onrender.com"; 

const FlightBoard = () => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    const flightsRef = collection(db, 'flights');
    const q = query(flightsRef, orderBy('code'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const flightsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setFlights(flightsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // NEW: Function to call your backend
  const handleSync = async () => {
    setSyncing(true);
    try {
      await fetch(`${BACKEND_URL}/api/refresh-flights`, { method: 'POST' });
      console.log("Sync requested!");
    } catch (error) {
      console.error("Sync failed:", error);
      alert("Failed to sync data. Check console.");
    }
    setSyncing(false);
  };

  if (loading) return <div style={{ color: 'white', padding: '20px' }}>Loading Flight Data...</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: '#fff', margin: 0 }}>DEPARTURES</h2>
        
        {/* SYNC BUTTON */}
        <button 
          onClick={handleSync} 
          disabled={syncing}
          style={{
            background: syncing ? '#555' : '#00f2ff',
            color: syncing ? '#ccc' : '#000',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '4px',
            fontWeight: 'bold',
            cursor: syncing ? 'not-allowed' : 'pointer',
            transition: '0.3s'
          }}
        >
          {syncing ? '🔄 SYNCING...' : '🔄 SYNC REAL DATA'}
        </button>
      </div>
      
      <div style={{ display: 'grid', gap: '10px' }}>
        {flights.map((flight) => (
          <div key={flight.id} style={{
            display: 'grid', 
            gridTemplateColumns: '1fr 2fr 2fr 1fr 1fr',
            background: 'rgba(255, 255, 255, 0.1)',
            padding: '15px',
            borderRadius: '8px',
            alignItems: 'center',
            borderLeft: `5px solid ${getStatusColor(flight.status)}`
          }}>
            <strong style={{ color: '#00f2ff' }}>{flight.code}</strong>
            <span style={{ color: '#ccc' }}>{flight.airline}</span>
            <span style={{ color: 'white', fontWeight: 'bold' }}>{flight.destination}</span>
            <span style={{ 
              color: getStatusColor(flight.status), 
              fontWeight: 'bold',
              textTransform: 'uppercase',
              fontSize: '0.9em'
            }}>
              {flight.status}
            </span>
            <span style={{ color: '#fff', textAlign: 'right' }}>{flight.gate}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const getStatusColor = (status) => {
  const s = status.toLowerCase();
  if (s.includes('on time') || s.includes('landed') || s.includes('active')) return '#28a745'; // Green
  if (s.includes('delayed')) return '#dc3545'; // Red
  if (s.includes('boarding')) return '#ffc107'; // Yellow
  if (s.includes('scheduled')) return '#17a2b8'; // Blue
  return '#6c757d'; // Grey
};

export default FlightBoard;