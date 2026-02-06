import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

// ⚠️ KEEP YOUR RENDER URL HERE
const BACKEND_URL = "https://flight-system-backend.onrender.com"; 

const FlightBoard = () => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    const flightsRef = collection(db, 'flights');
    const q = query(flightsRef, orderBy('updatedAt', 'desc')); // Show newest first

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

  const handleSync = async () => {
    setSyncing(true);
    try {
      await fetch(`${BACKEND_URL}/api/refresh-flights`, { method: 'POST' });
    } catch (error) {
      console.error("Sync failed:", error);
    }
    setSyncing(false);
  };

  if (loading) return <div className="neon-text">INITIALIZING SYSTEM...</div>;

  return (
    <div style={{ width: '100%', maxWidth: '1000px' }}>
      
      {/* TOOLBAR */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '20px',
        padding: '0 10px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '10px', height: '10px', background: '#00f2ff', borderRadius: '50%', boxShadow: '0 0 10px #00f2ff' }}></div>
            <span style={{ color: '#ccc', fontSize: '0.9rem' }}>LIVE FEED</span>
        </div>

        <button 
          onClick={handleSync} 
          disabled={syncing}
          className="glass-panel"
          style={{
            color: syncing ? '#888' : '#00f2ff',
            padding: '12px 24px',
            borderRadius: '30px', // Pill shape
            fontWeight: 'bold',
            cursor: syncing ? 'wait' : 'pointer',
            border: '1px solid rgba(0, 242, 255, 0.3)',
            transition: 'all 0.3s ease',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}
        >
          {syncing ? 'CONNECTING SATELLITE...' : '↻ REFRESH DATA'}
        </button>
      </div>
      
      {/* TABLE HEADER (Desktop Only) */}
      <div className="glass-panel" style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 2fr 2fr 1fr 1fr',
        padding: '15px 25px',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        color: '#8892b0',
        fontWeight: 'bold',
        fontSize: '0.8rem',
        letterSpacing: '1px',
        borderTopLeftRadius: '12px',
        borderTopRightRadius: '12px'
      }}>
        <span>FLIGHT</span>
        <span>AIRLINE</span>
        <span>DESTINATION</span>
        <span>STATUS</span>
        <span style={{textAlign: 'right'}}>GATE</span>
      </div>

      {/* FLIGHT LIST */}
      <div style={{ display: 'grid', gap: '4px' }}>
        {flights.map((flight) => (
          <div key={flight.id} className="glass-panel" style={{
            display: 'grid', 
            gridTemplateColumns: '1fr 2fr 2fr 1fr 1fr',
            padding: '20px 25px',
            alignItems: 'center',
            transition: 'transform 0.2s',
            borderLeft: `4px solid ${getStatusColor(flight.status)}`
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
          >
            <strong className="neon-text" style={{ fontSize: '1.1rem' }}>{flight.code}</strong>
            <span style={{ color: '#eee' }}>{flight.airline}</span>
            <span style={{ color: '#fff', fontWeight: '500' }}>{flight.destination}</span>
            <span style={{ 
              color: getStatusColor(flight.status), 
              fontWeight: 'bold',
              textTransform: 'uppercase',
              fontSize: '0.85rem',
              padding: '4px 8px',
              borderRadius: '4px',
              background: `${getStatusColor(flight.status)}20`, // 20% opacity background
              textAlign: 'center',
              width: 'fit-content'
            }}>
              {flight.status}
            </span>
            <span style={{ color: '#fff', textAlign: 'right', fontWeight: 'bold' }}>{flight.gate}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const getStatusColor = (status) => {
  const s = status.toLowerCase();
  if (s.includes('active') || s.includes('landed') || s.includes('scheduled')) return '#00f2ff'; // Cyan
  if (s.includes('delayed')) return '#ff0055'; // Neon Red
  if (s.includes('cancelled')) return '#ff0055'; // Neon Red
  if (s.includes('incident')) return '#ff0055'; // Neon Red
  if (s.includes('diverted')) return '#ffb700'; // Neon Orange
  return '#8892b0'; // Muted Blue
};

export default FlightBoard;