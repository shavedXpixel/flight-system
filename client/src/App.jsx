import FlightBoard from './components/FlightBoard';

function App() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#0f172a', // Dark Navy Background
      padding: '40px',
      fontFamily: "'Courier New', Courier, monospace" // Airport board vibe
    }}>
      <h1 style={{ 
        textAlign: 'center', 
        color: 'white', 
        marginBottom: '40px',
        letterSpacing: '2px'
      }}>
        ✈️ FLIGHT MANAGEMENT SYSTEM
      </h1>
      
      <FlightBoard />
    </div>
  )
}

export default App;