import React, { useEffect, useState, useRef } from 'react';
import { Order, TriangleCity } from '../types';
import { TRIANGLE_MAP_CITIES, MAP_INTERSECTIONS } from '../data/shops';

interface TrackingMapProps {
  order: Order | null;
  height?: string;
  isDriverPortal?: boolean;
  onDriverArrivedAtShop?: () => void;
  onDriverArrivedAtCustomer?: () => void;
}

export default function TrackingMap({
  order,
  height = 'h-80',
  isDriverPortal = false,
  onDriverArrivedAtShop,
  onDriverArrivedAtCustomer,
}: TrackingMapProps) {
  // Real-time animation coordinates for the driver
  const [driverPos, setDriverPos] = useState<{ x: number; y: number } | null>(null);
  const [pulse, setPulse] = useState(0);

  // Keep a reference to the animation timer
  const animRef = useRef<number | null>(null);

  // Generate simple path interpolation
  useEffect(() => {
    // Pulse animation timer
    const interval = setInterval(() => {
      setPulse((prev) => (prev + 1) % 100);
    }, 100);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!order) {
      setDriverPos(null);
      return;
    }

    const { shopCoords, deliveryCoords, status } = order;
    const startCoords = order.driverCoords || { x: 50, y: 50 }; // fall back to screen center

    let animationStep = 0;
    const duration = 200; // frames/ticks for movement simulation

    const animateDriver = () => {
      if (status === 'placed') {
        setDriverPos(null);
        return;
      }

      if (status === 'accepted') {
        // Moving from startCoords -> shopCoords
        const progress = Math.min(animationStep / duration, 1.0);
        const x = startCoords.x + (shopCoords.x - startCoords.x) * progress;
        const y = startCoords.y + (shopCoords.y - startCoords.y) * progress;
        setDriverPos({ x, y });

        if (progress < 1) {
          animationStep += 1;
          animRef.current = requestAnimationFrame(animateDriver);
        } else if (onDriverArrivedAtShop) {
          onDriverArrivedAtShop();
        }
      } else if (status === 'preparing') {
        // Waiting at shop
        setDriverPos(shopCoords);
      } else if (status === 'picked_up') {
        // Moving from shopCoords -> deliveryCoords
        const progress = Math.min(animationStep / duration, 1.0);
        const x = shopCoords.x + (deliveryCoords.x - shopCoords.x) * progress;
        const y = shopCoords.y + (deliveryCoords.y - shopCoords.y) * progress;
        setDriverPos({ x, y });

        if (progress < 1) {
          animationStep += 1;
          animRef.current = requestAnimationFrame(animateDriver);
        } else if (onDriverArrivedAtCustomer) {
          onDriverArrivedAtCustomer();
        }
      } else if (status === 'arriving_soon' || status === 'delivered') {
        // Parked at delivery location
        setDriverPos(deliveryCoords);
      }
    };

    // Trigger animation frame loop
    animRef.current = requestAnimationFrame(animateDriver);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [order, order?.status, order?.id]);

  // Major Raleigh-Durham-Chapel Hill Highway routes mapped as SVG curves
  // These represent genuine transit linkages in the NC Triangle
  const highwayRoutes = [
    // I-40: Chapel Hill (15, 35) -> RTP (48, 40) -> RDU (52, 38) -> WadeAve (70, 55) -> Raleigh (80, 60)
    'M 15 35 Q 35 38 48 40 T 52 38 T 70 55 T 80 60',
    // NC-147 / I-40 link: Durham (35, 15) -> Hwy147 (40, 25) -> RTP (48, 40) -> Cary (52, 68) -> Apex (44, 80)
    'M 35 15 Q 38 20 40 25 T 48 40 T 52 68 T 44 80',
    // US-1 Bypass: Apex (44, 80) -> Cary (52, 68) -> WadeAve (70, 55) -> Glenwood (82, 50)
    'M 44 80 Q 48 74 52 68 T 70 55 T 82 50'
  ];

  return (
    <div className={`relative w-full ${height} bg-[#050505] border border-white/10 rounded-2xl overflow-hidden shadow-inner`}>
      {/* Background HUD Grid */}
      <div className="absolute inset-0 bg-radial-[circle_at_center,rgba(191,161,129,0.05)_10%,transparent_70%] opacity-70 pointer-events-none" />
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:32px_32px] opacity-15 pointer-events-none" 
      />

      {/* SVG Canvas for Map Topology */}
      <svg viewBox="0 0 100 100" className="w-full h-full p-4" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="ringGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#bfa181" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#bfa181" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="destGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* 1. NC Trans-Triangle Highway Web Grid */}
        {highwayRoutes.map((path, idx) => (
          <React.Fragment key={idx}>
            {/* Wide blurred glow behind route */}
            <path
              d={path}
              fill="none"
              stroke="#bfa181"
              strokeWidth="0.8"
              strokeLinecap="round"
              strokeOpacity="0.15"
            />
            {/* Direct core route line */}
            <path
              d={path}
              fill="none"
              stroke="#bfa181"
              strokeWidth="0.4"
              strokeLinecap="round"
              strokeOpacity="0.4"
              strokeDasharray="1 1.5"
            />
          </React.Fragment>
        ))}

        {/* 2. Key Transportation Hub Overlay (HUD) */}
        <text x="54" y="36" className="fill-white/30 font-mono text-[1.8px] tracking-tight">RDU INTL AIRPORT</text>
        <circle cx="52" cy="38" r="0.4" className="fill-white/20" />
        <text x="50" y="42" className="fill-white/30 font-mono text-[1.8px] tracking-tight font-light">RTP RESEARCH HUB</text>
        <circle cx="48" cy="40" r="0.4" className="fill-white/20" />

        {/* 3. Major Triangle Anchors (Cities) */}
        {TRIANGLE_MAP_CITIES.map((city) => (
          <g key={city.name} className="opacity-90">
            <circle cx={city.x} cy={city.y} r="1.2" className="fill-[#080808] stroke-white/20 stroke-[0.2]" />
            <circle cx={city.x} cy={city.y} r="0.3" className="fill-[#bfa181]" />
            <text
              x={city.x}
              y={city.y - 2.2}
              textAnchor="middle"
              className="fill-white/80 font-sans font-semibold tracking-wider text-[2.5px]"
            >
              {city.name.toUpperCase()}
            </text>
            <text
              x={city.x}
              y={city.y - 1}
              textAnchor="middle"
              className="fill-white/40 font-mono text-[1.5px]"
            >
              {city.description}
            </text>
          </g>
        ))}

        {/* 4. Active Delivery Components */}
        {order && (
          <>
            {/* Shop Marker with pulsing gold radar beacon */}
            <g transform={`translate(${order.shopCoords.x}, ${order.shopCoords.y})`}>
              <circle cx="0" cy="0" r="3" className="fill-accent-gold/10 pointer-events-none" />
              <circle
                cx="0"
                cy="0"
                r={1.2 + (pulse / 50) * 3}
                fill="none"
                stroke="#bfa181"
                strokeWidth="0.15"
                opacity={1 - pulse / 100}
                className="transition-all duration-300 pointer-events-none"
              />
              <circle cx="0" cy="0" r="1" className="fill-accent-gold stroke-[#050505] stroke-[0.2] shadow" />
              <text x="2" y="2.5" className="fill-accent-gold font-bold font-sans text-[2.2px] tracking-wide drop-shadow-md">
                🏪 {order.shopName}
              </text>
            </g>

            {/* Destination Point with pulsing red marker */}
            <g transform={`translate(${order.deliveryCoords.x}, ${order.deliveryCoords.y})`}>
              <circle cx="0" cy="0" r="3" className="fill-red-500/10 pointer-events-none" />
              <circle
                cx="0"
                cy="0"
                r={1.2 + ((pulse + 50) % 100 / 50) * 2.5}
                fill="none"
                stroke="#ef4444"
                strokeWidth="0.15"
                opacity={1 - ((pulse + 50) % 100 / 100)}
                className="transition-all duration-300 pointer-events-none"
              />
              <polygon points="0,-1.4 1.2,0.6 -1.2,0.6" className="fill-red-500 stroke-[#050505] stroke-[0.2]" />
              <text x="2" y="2.5" className="fill-red-400 font-bold font-sans text-[2.2px] tracking-wide drop-shadow-md">
                📍 Dropoff ({order.deliveryCity})
              </text>
            </g>

            {/* Active Driver Route line (from Shop to Home) */}
            <line
              x1={order.shopCoords.x}
              y1={order.shopCoords.y}
              x2={order.deliveryCoords.x}
              y2={order.deliveryCoords.y}
              className="stroke-accent-gold/30 stroke-[0.3] stroke-dasharray-[1,1]"
            />

            {/* Simulated Animated Driver Carriage */}
            {driverPos && (
              <g transform={`translate(${driverPos.x}, ${driverPos.y})`}>
                <circle cx="0" cy="0" r="3.5" fill="url(#ringGlow)" className="pointer-events-none animate-pulse" />
                {/* Visual driver capsule */}
                <rect x="-1.2" y="-1.2" width="2.4" height="2.4" rx="0.6" className="fill-[#080808] stroke-accent-gold stroke-[0.3] shadow-md" />
                {/* Driver Emoji representing type of vehicle */}
                <text x="0" y="0.6" textAnchor="middle" className="text-[1.8px] select-none">
                  🚗
                </text>
                {/* Tiny Driver Banner */}
                <g transform="translate(0, -1.8)">
                  <rect x="-3" y="-1.1" width="6" height="1.5" rx="0.3" className="fill-[#050505]/90 stroke-accent-gold stroke-[0.1]" />
                  <text x="0" y="-0.1" textAnchor="middle" className="fill-accent-gold font-mono text-[0.8px] font-bold">
                    {order.driverName || 'DRIVER'}
                  </text>
                </g>
              </g>
            )}
          </>
        )}
      </svg>

      {/* Map Interactive Label overlay or Status Badge */}
      <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1.5 bg-[#080808]/90 border border-white/5 rounded-lg font-mono text-[9px] text-[#e0e0e0]/40 select-none shadow">
        <span className="w-1.5 h-1.5 bg-accent-gold rounded-full animate-pulse" />
        <span>RTP BEACON NAVIGATION</span>
      </div>

      <div className="absolute top-3 right-3 flex flex-col gap-1 items-end pointer-events-none">
        <span className="px-2 py-0.5 bg-[#080808]/90 border border-white/5 rounded text-[8px] font-mono text-[#e0e0e0]/40 whitespace-nowrap">
          CH: 15,35 • DU: 35,15 • RA: 80,60
        </span>
      </div>
    </div>
  );
}
