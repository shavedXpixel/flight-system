import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';

const ActivityLog = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const q = query(collection(db, 'logs'), orderBy('timestamp', 'desc'), limit(10));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const logsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setLogs(logsData);
    });
    return () => unsubscribe();
  }, []);

  const getTypeColor = (type) => {
    if (type === 'error') return '#ff0055'; 
    if (type === 'success') return '#00f2ff'; 
    return '#8892b0'; 
  };

  return (
    <div className="glass-panel" style={{ 
      /* REMOVED marginTop: '20px' HERE to fix alignment */
      padding: '20px', 
      borderRadius: '12px',
      height: 'fit-content', // Ensures it wraps tightly
      maxHeight: '400px', // Taller log for desktop
      overflowY: 'auto',
      border: '1px solid rgba(0, 242, 255, 0.1)'
    }}>
      <h3 className="neon-text" style={{ 
        fontSize: '0.9rem', 
        borderBottom: '1px solid rgba(255,255,255,0.1)', 
        paddingBottom: '10px',
        marginTop: 0,
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        <span style={{ fontSize: '1.2rem' }}>📡</span> SYSTEM ACTIVITY LOG
      </h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {logs.length === 0 && <span style={{color: '#555', fontSize: '0.8rem', fontStyle: 'italic'}}>Waiting for satellite data...</span>}
        
        {logs.map(log => (
          <div key={log.id} style={{ 
            fontSize: '0.8rem', 
            fontFamily: "'Roboto Mono', monospace",
            display: 'grid',
            gridTemplateColumns: '50px 1fr', // Fixed width for time
            gap: '10px',
            alignItems: 'start',
            paddingBottom: '5px',
            borderBottom: '1px dashed rgba(255,255,255,0.05)'
          }}>
            <span style={{ color: '#666', fontSize: '0.75rem' }}>
               {log.timestamp ? new Date(log.timestamp.seconds * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'}) : '--:--'}
            </span>
            <span style={{ color: getTypeColor(log.type), lineHeight: '1.4' }}>
              {log.message}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityLog;