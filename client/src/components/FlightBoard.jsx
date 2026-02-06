import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

const FlightBoard = () => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Reference the 'flights' collection
    const flightsRef = collection(db, 'flights');
    
    // 2. Create a query (optional: order by code)
    const q = query(flightsRef, orderBy('code'));

    // 3. LISTEN for real-time updates
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const flightsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setFlights(flightsData);
      setLoading(false);
    });

    // 4. Cleanup listener when component unmounts
    return () => unsubscribe();
  }, []);

  if (loading) return <div style={{ color: 'white' }}>Loading Flight Data...</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ color: '#fff', borderBottom: '2px solid #00f2ff', paddingBottom: '10px' }}>
        DEPARTURES
      </h2>
      
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
              textTransform: 'uppercase'
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

// Helper function for colors
const getStatusColor = (status) => {
  switch (status) {
    case 'On Time': return '#28a745'; // Green
    case 'Delayed': return '#dc3545'; // Red
    case 'Boarding': return '#ffc107'; // Yellow
    case 'Departed': return '#6c757d'; // Grey
    default: return '#ffffff';
  }
};

export default FlightBoard;