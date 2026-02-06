import { useState, useEffect } from 'react'

function App() {
  const [serverStatus, setServerStatus] = useState('Checking...');

  useEffect(() => {
    // Check if backend is reachable
    fetch('http://localhost:5000/api/health')
      .then(res => res.json())
      .then(data => setServerStatus(data.status))
      .catch(() => setServerStatus('Offline'));
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>✈️ Flight Management System</h1>
      <div style={{ 
        padding: '10px', 
        backgroundColor: serverStatus === 'Online' ? '#d4edda' : '#f8d7da',
        color: serverStatus === 'Online' ? '#155724' : '#721c24',
        border: '1px solid currentColor',
        borderRadius: '4px'
      }}>
        <strong>System Status:</strong> {serverStatus}
      </div>
    </div>
  )
}

export default App