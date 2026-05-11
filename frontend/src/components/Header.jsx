import React from 'react';
import { useNavigate } from 'react-router-dom';

function Header({ stats }) {
  const navigate = useNavigate();
  const displayCount = stats.total > 0 ? stats.total.toLocaleString() : "0";
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="header-container">
      <h1 className="main-title">LIVE CYBER THREAT MAP</h1>
      <div className="sub-title">
        <span className="attack-count">{displayCount}</span> ATTACKS ON THIS DAY
        {user.username && (
          <span style={{ marginLeft: '20px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            User: <b style={{ color: 'var(--text-primary)' }}>{user.username}</b>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </span>
        )}
      </div>
    </div>
  );
}

export default Header;
