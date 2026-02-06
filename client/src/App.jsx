import { useState } from 'react';
import FlightBoard from './components/FlightBoard';
import AdminPanel from './components/AdminPanel';
import ActivityLog from './components/ActivityLog';

function App() {
  const [showAdmin, setShowAdmin] = useState(false);

  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      
      {/* BACKGROUNDS (Stars) */}
      <div id="stars" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}></div>
      <div id="stars2" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}></div>
      
      <span className="shooting-star" style={{ top: '10%', left: '20%', animationDelay: '0s' }}></span>
      <span className="shooting-star" style={{ top: '60%', left: '80%', animationDelay: '2s' }}></span>

      {/* MAIN CONTAINER */}
      <div className="app-container">
        {/* RESPONSIVE PADDING STYLE */}
        <style>{`
          .app-container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 40px 20px; /* Desktop Padding */
            position: relative;
            z-index: 1;
          }
          @media (max-width: 768px) {
            .app-container {
              padding: 20px 10px; /* Mobile Padding (Reduced) */
            }
            h1 { font-size: 2rem !important; } /* Smaller Title */
          }
        `}</style>
        
        {/* HEADER */}
        <header style={{ textAlign: 'center', marginBottom: '30px', animation: 'fadeInDown 1s' }}>
          <h1 className="neon-text" style={{ fontSize: '3rem', margin: 0, letterSpacing: '4px' }}>
            ✈️ SKY LINK
          </h1>
          <p style={{ color: '#8892b0', marginTop: '10px', fontSize: '0.8rem', letterSpacing: '2px' }}>
            LIVE FLIGHT TELEMETRY
          </p>
        </header>

        {/* ADMIN BUTTON */}
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
          >
            {showAdmin ? '← BACK' : '⚙️ CONTROL'}
          </button>
        </div>

        {showAdmin ? (
          <AdminPanel onClose={() => setShowAdmin(false)} />
        ) : (
          <div className="dashboard-grid">
            <style>{`
              .dashboard-grid {
                display: grid;
                grid-template-columns: 1fr;
                gap: 25px;
                align-items: start;
                width: 100%;
              }
              @media (min-width: 1000px) {
                .dashboard-grid {
                  grid-template-columns: 3fr 1fr; 
                }
              }
            `}</style>

            <div style={{ animation: 'fadeInLeft 0.5s ease-out' }}>
              <FlightBoard />
            </div>

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