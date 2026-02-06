import FlightBoard from './components/FlightBoard';

function App() {
  return (
    <div style={{ 
      minHeight: '100vh',
      padding: '40px 20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      {/* HEADER */}
      <header style={{ 
        textAlign: 'center', 
        marginBottom: '50px',
        animation: 'fadeIn 1s ease-in'
      }}>
        <h1 className="neon-text" style={{ 
          fontSize: '2.5rem', 
          margin: 0, 
          letterSpacing: '4px',
          textTransform: 'uppercase'
        }}>
          ✈️ SKY LINK
        </h1>
        <p style={{ color: '#8892b0', marginTop: '10px', letterSpacing: '1px' }}>
          Live Global Flight Telemetry
        </p>
      </header>
      
      {/* MAIN BOARD */}
      <FlightBoard />
    </div>
  )
}

export default App;