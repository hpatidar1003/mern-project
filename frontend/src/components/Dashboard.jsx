import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import WorldMap from './WorldMap';
import Header from './Header';
import Sidebar from './Sidebar';

const socket = io('http://localhost:5000');

function Dashboard() {
  const [list, setList] = useState([]);
  const [stats, setStats] = useState({ total: 0, top: '-' });
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    socket.on('initial_data', (data) => {
      setList(data.reverse());
      calc(data);
    });

    socket.on('new_attack', (item) => {
      setList((prev) => {
        const updated = [item, ...prev].slice(0, 100);
        calc(updated);
        return updated;
      });
    });

    return () => {
      socket.off('initial_data');
      socket.off('new_attack');
    };
  }, []);

  const calc = (data) => {
    if (!data.length) return;
    
    const counts = {};
    let top = data[0].type;
    let max = 0;
    
    data.forEach(item => {
      counts[item.type] = (counts[item.type] || 0) + 1;
      if (counts[item.type] > max) {
        max = counts[item.type];
        top = item.type;
      }
    });

    setStats({ total: data.length, top });
  };

  const filtered = filter === 'All' 
    ? list 
    : list.filter(a => a.type === filter);

  return (
    <div className="app-container">
      <Header stats={stats} />
      
      <div className="map-wrapper">
        <WorldMap data={filtered} />
      </div>

      <Sidebar 
        data={filtered}
        filter={filter}
        setFilter={setFilter}
      />
    </div>
  );
}

export default Dashboard;
