import React from 'react';

// Animated Africa Map with pulsing location markers
export const AfricaMap = () => {
  // City coordinates positioned on the map (relative percentages)
  const cities = [
    { name: 'Nairobi', country: 'Kenya', x: 72, y: 52, delay: '0s' },
    { name: 'Kampala', country: 'Uganda', x: 65, y: 48, delay: '0.5s' },
    { name: 'Dar es Salaam', country: 'Tanzania', x: 73, y: 60, delay: '1s' },
    { name: 'Kigali', country: 'Rwanda', x: 62, y: 52, delay: '1.5s' },
  ];

  return (
    <div className="relative w-full max-w-2xl mx-auto aspect-square">
      {/* Glow effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-emerald-500/20 rounded-full blur-3xl opacity-50" />
      
      {/* Africa continent shape - simplified SVG */}
      <svg 
        viewBox="0 0 100 100" 
        className="w-full h-full relative z-10"
        style={{ filter: 'drop-shadow(0 0 20px rgba(22, 163, 74, 0.3))' }}
      >
        {/* Africa outline - simplified shape */}
        <path
          d="M45 5 L55 8 L65 10 L72 15 L78 12 L82 18 L80 25 L82 32 L80 40 L78 48 
             L80 55 L78 62 L75 70 L70 78 L62 85 L55 90 L48 88 L42 85 L38 80 
             L35 72 L30 65 L28 58 L25 50 L22 42 L20 35 L22 28 L25 22 L30 15 
             L35 10 L40 7 Z"
          className="fill-slate-800/50 dark:fill-slate-700/50 stroke-primary/30"
          strokeWidth="0.5"
        />
        
        {/* East Africa region highlight */}
        <path
          d="M60 45 L72 42 L78 48 L80 55 L78 62 L75 68 L68 70 L62 65 L58 58 L60 50 Z"
          className="fill-primary/20 stroke-primary/40"
          strokeWidth="0.3"
        />
        
        {/* Grid lines for tech feel */}
        <g className="stroke-primary/10" strokeWidth="0.2">
          {[20, 40, 60, 80].map((x) => (
            <line key={`v${x}`} x1={x} y1="0" x2={x} y2="100" />
          ))}
          {[20, 40, 60, 80].map((y) => (
            <line key={`h${y}`} x1="0" y1={y} x2="100" y2={y} />
          ))}
        </g>
      </svg>
      
      {/* Pulsing city markers */}
      {cities.map((city, index) => (
        <div
          key={city.name}
          className="absolute z-20 group cursor-pointer"
          style={{ 
            left: `${city.x}%`, 
            top: `${city.y}%`,
            transform: 'translate(-50%, -50%)'
          }}
        >
          {/* Pulse rings */}
          <div 
            className="absolute inset-0 w-8 h-8 -translate-x-1/2 -translate-y-1/2"
            style={{ animationDelay: city.delay }}
          >
            <span 
              className="absolute inset-0 rounded-full bg-primary/40 animate-ping"
              style={{ animationDelay: city.delay, animationDuration: '2s' }}
            />
            <span 
              className="absolute inset-2 rounded-full bg-primary/30 animate-ping"
              style={{ animationDelay: `calc(${city.delay} + 0.3s)`, animationDuration: '2s' }}
            />
          </div>
          
          {/* Center dot */}
          <div className="relative w-4 h-4 bg-gradient-to-br from-primary to-emerald-500 rounded-full shadow-lg shadow-primary/50 border-2 border-white dark:border-slate-900">
            <div className="absolute inset-1 bg-white dark:bg-slate-900 rounded-full" />
            <div className="absolute inset-1.5 bg-primary rounded-full" />
          </div>
          
          {/* Tooltip */}
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <div className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap shadow-xl">
              <div className="font-bold">{city.name}</div>
              <div className="text-slate-400 dark:text-slate-600 text-[10px]">{city.country}</div>
            </div>
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900 dark:border-t-white" />
          </div>
        </div>
      ))}
      
      {/* Connection lines between cities */}
      <svg 
        className="absolute inset-0 w-full h-full z-15 pointer-events-none"
        viewBox="0 0 100 100"
      >
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgb(22, 163, 74)" stopOpacity="0.1" />
            <stop offset="50%" stopColor="rgb(22, 163, 74)" stopOpacity="0.5" />
            <stop offset="100%" stopColor="rgb(22, 163, 74)" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        
        {/* Connecting lines */}
        <path 
          d="M72 52 L65 48 L62 52 L73 60" 
          fill="none" 
          stroke="url(#lineGradient)" 
          strokeWidth="0.3"
          strokeDasharray="2,2"
          className="animate-pulse"
        />
      </svg>
    </div>
  );
};

export default AfricaMap;
