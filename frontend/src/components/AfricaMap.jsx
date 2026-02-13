import React from 'react';

// Professional Africa Map with East Africa highlighted and pulsing markers
export const AfricaMap = () => {
  const cities = [
    { name: 'Nairobi', country: 'Kenya', x: 76, y: 48 },
    { name: 'Kampala', country: 'Uganda', x: 70, y: 44 },
    { name: 'Dar es Salaam', country: 'Tanzania', x: 74, y: 54 },
    { name: 'Kigali', country: 'Rwanda', x: 68, y: 47 },
  ];

  return (
    <div className="relative w-full aspect-square max-w-lg mx-auto">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-radial from-primary/20 via-transparent to-transparent rounded-full blur-2xl" />
      
      <svg 
        viewBox="0 0 100 100" 
        className="w-full h-full drop-shadow-2xl"
      >
        <defs>
          {/* Gradient for Africa continent */}
          <linearGradient id="africaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgb(51, 65, 85)" stopOpacity="0.8" />
            <stop offset="100%" stopColor="rgb(30, 41, 59)" stopOpacity="0.9" />
          </linearGradient>
          
          {/* Gradient for East Africa highlight */}
          <linearGradient id="eastAfricaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgb(22, 163, 74)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="rgb(16, 185, 129)" stopOpacity="0.6" />
          </linearGradient>
          
          {/* Glow filter */}
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          
          {/* Pulse animation */}
          <radialGradient id="pulseGradient">
            <stop offset="0%" stopColor="rgb(22, 163, 74)" stopOpacity="0.8" />
            <stop offset="100%" stopColor="rgb(22, 163, 74)" stopOpacity="0" />
          </radialGradient>
        </defs>
        
        {/* Africa Continent - Accurate outline */}
        <path
          d="M45.5,8 L48,7 L52,7.5 L56,9 L60,10 L64,9 L68,10 L72,12 L76,11 L79,13 L81,16 L82,20 L81,24 L82,28 L83,32 L82,36 L80,40 L81,44 L82,48 L81,52 L79,56 L80,60 L78,64 L75,68 L72,72 L68,76 L64,79 L60,81 L56,82 L52,81 L48,82 L44,80 L40,78 L36,76 L33,73 L30,69 L28,65 L26,60 L24,55 L22,50 L21,45 L20,40 L21,35 L23,30 L26,25 L30,21 L34,17 L38,13 L42,10 Z"
          fill="url(#africaGradient)"
          stroke="rgb(71, 85, 105)"
          strokeWidth="0.3"
          className="drop-shadow-lg"
        />
        
        {/* North Africa region */}
        <path
          d="M45.5,8 L48,7 L52,7.5 L56,9 L60,10 L64,9 L68,10 L72,12 L76,11 L79,13 L81,16 L82,20 L81,24 L78,26 L74,27 L70,26 L66,28 L62,27 L58,28 L54,27 L50,28 L46,26 L42,27 L38,25 L34,24 L30,21 L34,17 L38,13 L42,10 Z"
          fill="rgb(51, 65, 85)"
          fillOpacity="0.5"
          stroke="none"
        />
        
        {/* West Africa bulge */}
        <path
          d="M21,35 L23,30 L26,25 L30,21 L34,24 L32,28 L28,32 L24,36 L21,40 L20,40 L21,35 Z"
          fill="rgb(51, 65, 85)"
          fillOpacity="0.4"
          stroke="none"
        />
        
        {/* East Africa Region - Highlighted */}
        <path
          d="M66,38 L70,36 L74,38 L78,40 L80,44 L82,48 L81,52 L79,56 L76,60 L73,58 L70,54 L68,50 L66,46 L65,42 Z"
          fill="url(#eastAfricaGradient)"
          stroke="rgb(22, 163, 74)"
          strokeWidth="0.5"
          filter="url(#glow)"
          className="animate-pulse"
          style={{ animationDuration: '3s' }}
        />
        
        {/* Kenya outline */}
        <path
          d="M72,42 L76,40 L79,43 L80,47 L78,51 L75,53 L72,51 L70,47 L71,44 Z"
          fill="rgb(22, 163, 74)"
          fillOpacity="0.3"
          stroke="rgb(22, 163, 74)"
          strokeWidth="0.3"
        />
        
        {/* Uganda outline */}
        <path
          d="M66,40 L70,38 L72,42 L71,44 L68,46 L65,44 L66,40 Z"
          fill="rgb(22, 163, 74)"
          fillOpacity="0.25"
          stroke="rgb(22, 163, 74)"
          strokeWidth="0.3"
        />
        
        {/* Tanzania outline */}
        <path
          d="M70,51 L75,53 L76,57 L74,61 L70,62 L66,59 L66,55 L68,52 Z"
          fill="rgb(22, 163, 74)"
          fillOpacity="0.25"
          stroke="rgb(22, 163, 74)"
          strokeWidth="0.3"
        />
        
        {/* Rwanda outline */}
        <path
          d="M66,46 L68,46 L69,48 L68,50 L66,50 L65,48 Z"
          fill="rgb(22, 163, 74)"
          fillOpacity="0.35"
          stroke="rgb(22, 163, 74)"
          strokeWidth="0.3"
        />
        
        {/* Southern Africa */}
        <path
          d="M52,81 L56,82 L60,81 L64,79 L60,75 L56,78 L52,76 L48,78 L44,76 L48,82 Z"
          fill="rgb(51, 65, 85)"
          fillOpacity="0.4"
          stroke="none"
        />
        
        {/* Madagascar */}
        <path
          d="M82,58 L84,56 L85,60 L84,65 L82,68 L80,65 L81,61 Z"
          fill="rgb(51, 65, 85)"
          fillOpacity="0.6"
          stroke="rgb(71, 85, 105)"
          strokeWidth="0.2"
        />
        
        {/* Grid lines for tech aesthetic */}
        <g stroke="rgb(22, 163, 74)" strokeOpacity="0.1" strokeWidth="0.15">
          {[30, 40, 50, 60, 70, 80].map((x) => (
            <line key={`v${x}`} x1={x} y1="5" x2={x} y2="85" strokeDasharray="1,2" />
          ))}
          {[20, 30, 40, 50, 60, 70].map((y) => (
            <line key={`h${y}`} x1="18" y1={y} x2="86" y2={y} strokeDasharray="1,2" />
          ))}
        </g>
        
        {/* Connection lines between cities */}
        <g stroke="rgb(22, 163, 74)" strokeWidth="0.3" strokeOpacity="0.5" fill="none">
          <path d="M76,48 L70,44" strokeDasharray="2,1">
            <animate attributeName="stroke-dashoffset" from="0" to="6" dur="2s" repeatCount="indefinite" />
          </path>
          <path d="M70,44 L68,47" strokeDasharray="2,1">
            <animate attributeName="stroke-dashoffset" from="0" to="6" dur="2s" repeatCount="indefinite" />
          </path>
          <path d="M68,47 L74,54" strokeDasharray="2,1">
            <animate attributeName="stroke-dashoffset" from="0" to="6" dur="2s" repeatCount="indefinite" />
          </path>
          <path d="M74,54 L76,48" strokeDasharray="2,1">
            <animate attributeName="stroke-dashoffset" from="0" to="6" dur="2s" repeatCount="indefinite" />
          </path>
        </g>
        
        {/* City markers with pulse effect */}
        {cities.map((city, index) => (
          <g key={city.name}>
            {/* Outer pulse ring */}
            <circle cx={city.x} cy={city.y} r="3" fill="none" stroke="rgb(22, 163, 74)" strokeWidth="0.5" opacity="0.3">
              <animate attributeName="r" from="2" to="5" dur="2s" repeatCount="indefinite" begin={`${index * 0.5}s`} />
              <animate attributeName="opacity" from="0.6" to="0" dur="2s" repeatCount="indefinite" begin={`${index * 0.5}s`} />
            </circle>
            
            {/* Middle pulse ring */}
            <circle cx={city.x} cy={city.y} r="2" fill="none" stroke="rgb(22, 163, 74)" strokeWidth="0.3" opacity="0.5">
              <animate attributeName="r" from="1.5" to="4" dur="2s" repeatCount="indefinite" begin={`${index * 0.5 + 0.3}s`} />
              <animate attributeName="opacity" from="0.5" to="0" dur="2s" repeatCount="indefinite" begin={`${index * 0.5 + 0.3}s`} />
            </circle>
            
            {/* Center dot */}
            <circle 
              cx={city.x} 
              cy={city.y} 
              r="1.2" 
              fill="rgb(22, 163, 74)"
              stroke="white"
              strokeWidth="0.4"
              filter="url(#glow)"
            />
            
            {/* Inner bright dot */}
            <circle 
              cx={city.x} 
              cy={city.y} 
              r="0.5" 
              fill="white"
            />
          </g>
        ))}
      </svg>
      
      {/* City labels */}
      {cities.map((city, index) => (
        <div
          key={`label-${city.name}`}
          className="absolute transform -translate-x-1/2 pointer-events-none"
          style={{ 
            left: `${city.x}%`, 
            top: `${city.y + 4}%`,
          }}
        >
          <div className="bg-slate-900/90 backdrop-blur-sm px-2 py-1 rounded text-center border border-primary/30 shadow-lg">
            <p className="text-[10px] font-bold text-white whitespace-nowrap">{city.name}</p>
            <p className="text-[8px] text-primary whitespace-nowrap">{city.country}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AfricaMap;
