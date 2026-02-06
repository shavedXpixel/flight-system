import { useState } from 'react';
import FlightBoard from './components/FlightBoard';
import AdminPanel from './components/AdminPanel';
import ActivityLog from './components/ActivityLog';

function App() {
  const [showAdmin, setShowAdmin] = useState(false);

  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      
      {/* BACKGROUND LAYER (Physics Stars) */}
      <div id="stars" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}></div>
      <div id="stars2" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}></div>
      
      {/* SHOOTING STAR DECORATION */}
      <span className="shooting-star" style={{ top: '10%', left: '20%', animationDelay: '0s' }}></span>
      <span className="shooting-star" style={{ top: '60%', left: '80%', animationDelay: '2s' }}></span>

      {/* MAIN CONTAINER */}
      <div style={{ 
        maxWidth: '1400px', 
        margin: '0 auto', 
        padding: '40px 20px',
        position: 'relative',
        zIndex: 1
      }}>
        
        {/* HEADER */}
        <header style={{ textAlign: 'center', marginBottom: '40px', animation: 'fadeInDown 1s' }}>
          <h1 className="neon-text" style={{ fontSize: '3rem', margin: 0, letterSpacing: '6px' }}>
            ✈️ SKY LINK
          </h1>
          <p style={{ color: '#8892b0', marginTop: '10px', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '3px' }}>
            Live Global Flight Telemetry
          </p>
        </header>

        {/* ADMIN TOGGLE */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <button 
            onClick={() => setShowAdmin(!showAdmin)}
            className="glass-panel"
            style={{
              background: 'transparent',
              color: '#8892b0',
              padding: '10px 24px',
              borderRadius: '30px',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: 'bold',
              letterSpacing: '1px',
              border: '1px solid rgba(255,255,255,0.1)'
            }}
            onMouseEnter={(e) => {e.target.style.borderColor = '#00f2ff'; e.target.style.color = '#00f2ff'}}
            onMouseLeave={(e) => {e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.color = '#8892b0'}}
          >
            {showAdmin ? '← BACK TO BOARD' : '⚙️ ACCESS CONTROL'}
          </button>
        </div>

        {showAdmin ? (
          <AdminPanel onClose={() => setShowAdmin(false)} />
        ) : (
          /* THE FIX: CSS GRID LAYOUT */
          <div className="dashboard-grid">
            <style>{`
              .dashboard-grid {
                display: grid;
                grid-template-columns: 1fr; /* Mobile: 1 column */
                gap: 25px;
                align-items: start; /* CRITICAL: Aligns Log to top of Board */
                width: 100%;
              }
              @media (min-width: 1000px) {
                .dashboard-grid {
                  grid-template-columns: 3fr 1fr; /* Desktop: Board (3 parts), Log (1 part) */
                }
              }
            `}</style>

            {/* LEFT COLUMN: FLIGHT BOARD */}
            <div style={{ animation: 'fadeInLeft 0.5s ease-out' }}>
              <FlightBoard />
            </div>

            {/* RIGHT COLUMN: ACTIVITY LOG */}
            <div style={{ animation: 'fadeInRight 0.5s ease-out' }}>
               <ActivityLog />
            </div>

          </div>
        )}
      </div>
    </div>
  )
}

export default App;