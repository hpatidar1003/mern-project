import React, { useEffect, useRef, useState } from 'react';
import Globe from 'react-globe.gl';

function WorldMap({ data }) {
  const globeEl = useRef();
  const [size, setSize] = useState({
    w: window.innerWidth,
    h: window.innerHeight
  });

  useEffect(() => {
    const onResize = () => {
      setSize({
        w: window.innerWidth,
        h: window.innerHeight
      });
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    if (globeEl.current) {
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = 0.8;
    }
  }, []);

  const arcs = data.map(item => {
    let color = '#3b82f6';
    switch(item.type) {
      case 'DDoS': color = '#ef4444'; break;
      case 'Phishing': color = '#f59e0b'; break;
      case 'Malware': color = '#8b5cf6'; break;
      case 'SQL Injection': color = '#10b981'; break;
      case 'Ransomware': color = '#ec4899'; break;
      case 'Brute Force': color = '#3b82f6'; break;
      default: color = '#f59e0b'; break;
    }
    
    return {
      startLat: item.srcLoc.lat,
      startLng: item.srcLoc.lng,
      endLat: item.destLoc.lat,
      endLng: item.destLoc.lng,
      color: [color, color],
      label: item.type,
      id: item.id
    };
  });

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
      <Globe
        ref={globeEl}
        width={size.w}
        height={size.h}
        backgroundColor="#f0f2f5"
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-day.jpg"
        arcsData={arcs}

        arcColor="color"
        arcDashLength={0.4}
        arcDashGap={0.2}
        arcDashAnimateTime={2000}
        arcsTransitionDuration={0}
        ringColor={() => '#f59e0b'}
        ringsData={data.map(a => ({ lat: a.destLoc.lat, lng: a.destLoc.lng }))}
        ringMaxRadius={5}
        ringPropagationSpeed={2}
        ringRepeatPeriod={800}
      />
    </div>
  );
}

export default WorldMap;


