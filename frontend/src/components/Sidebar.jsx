import React from 'react';

const types = ['All', 'DDoS', 'Phishing', 'Malware', 'SQL Injection', 'Ransomware', 'Brute Force'];

function Sidebar({ data, filter, setFilter }) {
  const getClr = (t) => {
    switch(t) {
      case 'DDoS': return 'var(--color-ddos)';
      case 'Phishing': return 'var(--color-phishing)';
      case 'Malware': return 'var(--color-malware)';
      case 'SQL Injection': return 'var(--color-sql)';
      case 'Ransomware': return 'var(--color-ransomware)';
      case 'Brute Force': return 'var(--color-brute)';
      default: return 'var(--accent-color)';
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-title">Live Feed</div>
        <select 
          className="filter-select"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          {types.map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>
      
      <div className="event-feed">
        {data.length === 0 ? (
          <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            Loading...
          </div>
        ) : (
          data.map((item) => (
            <div key={item.id} className="event-card" style={{ borderLeftColor: getClr(item.type) }}>
              <div className="event-header">
                <span className="event-type" style={{ color: getClr(item.type) }}>
                  {item.type}
                </span>
                <span className="event-time">
                  {new Date(item.time).toLocaleTimeString()}
                </span>
              </div>
              <div className="event-details">
                <div>From: <span className="event-ip">{item.srcIp}</span> <br/> ({item.srcLoc.name})</div>
                <div style={{ marginTop: '4px' }}>To: <span className="event-ip">{item.destIp}</span> <br/> ({item.destLoc.name})</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Sidebar;

