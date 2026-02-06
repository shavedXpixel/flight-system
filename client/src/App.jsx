import { useState } from 'react';
import FlightBoard from './components/FlightBoard';
import AdminPanel from './components/AdminPanel';

function App() {
  const [showAdmin, setShowAdmin] = useState(false);

  return (
    <div style={{ 
      minHeight: '100vh',
      padding: '40px 20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <header style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 className="neon-text" style={{ fontSize: '2.5rem', margin: 0, letterSpacing: '4px' }}>
          ✈️ SKY LINK
        </h1>
        <p style={{ color: '#8892b0', marginTop: '10px' }}>Live Global Flight Telemetry</p>
      </header>
      
      {/* TOGGLE BUTTON */}
      <button 
        onClick={() => setShowAdmin(!showAdmin)}
        style={{
          marginBottom: '20px',
          background: 'transparent',
          border: '1px solid #8892b0',
          color: '#8892b0',
          padding: '8px 16px',
          borderRadius: '20px',
          cursor: 'pointer',
          fontSize: '0.8rem'
        }}
      >
        {showAdmin ? '← BACK TO BOARD' : '⚙️ ACCESS ADMIN PANEL'}
      </button>

      {/* CONDITIONAL RENDERING */}
      {showAdmin ? (
        <AdminPanel onClose={() => setShowAdmin(false)} />
      ) : (
        <FlightBoard />
      )}
    </div>
  )
}

export default App;