import { useState } from 'react';

// ⚠️ REPLACE WITH YOUR RENDER URL
const BACKEND_URL = "https://flight-system-backend.onrender.com";

const AdminPanel = ({ onClose }) => {
  const [formData, setFormData] = useState({
    code: '',
    airline: '',
    destination: '',
    status: 'Scheduled',
    gate: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${BACKEND_URL}/api/flights`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        alert("Flight Added Successfully!");
        setFormData({ code: '', airline: '', destination: '', status: 'Scheduled', gate: '' }); 
      } else {
        alert("Error adding flight");
      }
    } catch (error) {
      console.error(error);
      alert("Server Connection Failed");
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- STYLES ---
  const labelStyle = {
    display: 'block',
    color: '#8892b0',
    fontSize: '0.75rem',
    marginBottom: '8px', // More space between label and input
    fontWeight: 'bold',
    letterSpacing: '1px',
    textTransform: 'uppercase'
  };

  const inputStyle = {
    width: '100%',
    padding: '12px',
    background: 'rgba(15, 23, 42, 0.8)', 
    border: '1px solid rgba(0, 242, 255, 0.2)',
    borderRadius: '6px',
    color: 'white',
    outline: 'none',
    fontSize: '1rem',
    boxSizing: 'border-box' // PREVENTS OVERFLOW
  };

  const groupStyle = {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '0' // We handle spacing via grid gap
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.8)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div className="glass-panel" style={{ 
        width: '90%',
        maxWidth: '500px', 
        padding: '40px', 
        borderRadius: '16px',
        position: 'relative',
        background: '#1a2236', // Solid dark color to prevent see-through mess
        border: '1px solid rgba(0, 242, 255, 0.3)',
        boxShadow: '0 0 40px rgba(0, 242, 255, 0.1)'
      }}>
        
        {/* CLOSE BUTTON */}
        <button 
          onClick={onClose}
          style={{ 
            position: 'absolute', top: '20px', right: '20px', 
            background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '1.5rem'
          }}
        >✕</button>

        <h2 className="neon-text" style={{ marginTop: 0, textAlign: 'center', marginBottom: '30px' }}>
          FLIGHT CONTROL
        </h2>
        
        {/* MAIN FORM GRID - GAP HANDLES SPACING */}
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '25px' }}>
          
          {/* ROW 1: Code & Airline */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={groupStyle}>
              <label style={labelStyle}>CODE</label>
              <input name="code" placeholder="BA-99" style={inputStyle} value={formData.code} onChange={handleChange} required />
            </div>
            <div style={groupStyle}>
              <label style={labelStyle}>AIRLINE</label>
              <input name="airline" placeholder="British Airways" style={inputStyle} value={formData.airline} onChange={handleChange} required />
            </div>
          </div>

          {/* ROW 2: Destination (Full Width) */}
          <div style={groupStyle}>
            <label style={labelStyle}>DESTINATION</label>
            <input name="destination" placeholder="London (LHR)" style={inputStyle} value={formData.destination} onChange={handleChange} required />
          </div>

          {/* ROW 3: Gate & Status */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={groupStyle}>
              <label style={labelStyle}>GATE</label>
              <input name="gate" placeholder="A12" style={inputStyle} value={formData.gate} onChange={handleChange} required />
            </div>
            <div style={groupStyle}>
              <label style={labelStyle}>STATUS</label>
              <select name="status" style={{ ...inputStyle, cursor: 'pointer', height: '45px' }} value={formData.status} onChange={handleChange}>
                <option value="Scheduled">Scheduled</option>
                <option value="On Time">On Time</option>
                <option value="Delayed">Delayed</option>
                <option value="Boarding">Boarding</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <button type="submit" disabled={loading} style={{
            width: '100%',
            padding: '15px',
            background: 'linear-gradient(90deg, #00f2ff, #00a8ff)',
            color: '#000',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 'bold',
            marginTop: '10px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1
          }}>
            {loading ? 'TRANSMITTING...' : 'PUBLISH FLIGHT'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminPanel;