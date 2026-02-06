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
    const q = query(flightsRef, orderBy('updatedAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const flightsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
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
      
      {/* CSS FOR RESPONSIVE LAYOUT */}
      <style>{`
        /* DEFAULT (DESKTOP) - TABLE LAYOUT */
        .flight-row {
          display: grid;
          grid-template-columns: 0.8fr 2fr 2fr 1fr 0.5fr; /* 5 Columns */
          padding: 20px 25px;
          align-items: center;
          gap: 10px;
        }
        
        .header-row {
          display: grid;
        }

        /* MOBILE LAYOUT (Phones < 768px) - CARD LAYOUT */
        @media (max-width: 768px) {
          .header-row { display: none !important; } /* Hide Table Headers on Mobile */
          
          .flight-row {
            display: flex;           /* Stack vertically */
            flex-direction: column;
            padding: 15px;
            gap: 8px;
            position: relative;      /* For absolute positioning items */
          }
          
          /* Mobile Font Adjustments */
          .flight-code { font-size: 1.4rem !important; }
          .flight-dest { font-size: 1.1rem !important; color: white !important; }
          .flight-airline { font-size: 0.9rem !important; opacity: 0.7; }
          
          /* Move Status and Gate to top right for compact look */
          .flight-meta {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            margin-top: 5px;
            border-top: 1px solid rgba(255,255,255,0.1);
            padding-top: 8px;
          }
        }
      `}</style>

      {/* TOOLBAR */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '20px',
        flexWrap: 'wrap', // Allow wrapping on very small screens
        gap: '10px'
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
            padding: '10px 20px',
            borderRadius: '30px',
            fontWeight: 'bold',
            cursor: syncing ? 'wait' : 'pointer',
            border: '1px solid rgba(0, 242, 255, 0.3)',
            fontSize: '0.8rem',
            whiteSpace: 'nowrap' // Prevent text wrap button
          }}
        >
          {syncing ? 'CONNECTING...' : '↻ SYNC'}
        </button>
      </div>
      
      {/* TABLE HEADER (Hidden on Mobile via CSS) */}
      <div className="glass-panel header-row" style={{ 
        gridTemplateColumns: '0.8fr 2fr 2fr 1fr 0.5fr',
        padding: '15px 25px',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        color: '#8892b0',
        fontWeight: 'bold',
        fontSize: '0.8rem',
        letterSpacing: '1px',
        borderTopLeftRadius: '12px',
        borderTopRightRadius: '12px',
        gap: '10px'
      }}>
        <span>FLIGHT</span>
        <span>AIRLINE</span>
        <span>DESTINATION</span>
        <span>STATUS</span>
        <span style={{textAlign: 'right'}}>GATE</span>
      </div>

      {/* FLIGHT LIST */}
      <div style={{ display: 'grid', gap: '8px' }}>
        {flights.map((flight) => (
          <div key={flight.id} className="glass-panel flight-row" style={{
            transition: 'transform 0.2s',
            borderLeft: `4px solid ${getStatusColor(flight.status)}`
          }}>
            {/* ROW 1: Code & Airline (Mobile: Stacked) */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
               <strong className="neon-text flight-code" style={{ fontSize: '1.1rem' }}>{flight.code}</strong>
               <span className="flight-airline" style={{ color: '#eee', fontSize: '0.9rem' }}>{flight.airline}</span>
            </div>

            {/* ROW 2: Destination */}
            <span className="flight-dest" style={{ color: '#fff', fontWeight: '500' }}>{flight.destination}</span>

            {/* ROW 3: Meta Data (Desktop: Grid Columns / Mobile: Flex Row at bottom) */}
            
            {/* Wrapper for Mobile to group Status/Gate at bottom */}
            <div className="flight-meta" style={{ display: 'contents' }}> 
                <span style={{ 
                  color: getStatusColor(flight.status), 
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  fontSize: '0.75rem',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  background: `${getStatusColor(flight.status)}20`,
                  textAlign: 'center',
                  width: 'fit-content',
                  whiteSpace: 'nowrap'
                }}>
                  {flight.status}
                </span>
                
                <span style={{ color: '#fff', textAlign: 'right', fontWeight: 'bold' }}>
                  <span style={{ color: '#888', fontSize: '0.7rem', marginRight: '5px' }}>GATE</span>
                  {flight.gate}
                </span>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

const getStatusColor = (status) => {
  const s = status.toLowerCase();
  if (s.includes('active') || s.includes('landed') || s.includes('scheduled')) return '#00f2ff';
  if (s.includes('delayed')) return '#ff0055';
  if (s.includes('cancelled')) return '#ff0055'; 
  if (s.includes('diverted')) return '#ffb700';
  return '#8892b0';
};

export default FlightBoard;