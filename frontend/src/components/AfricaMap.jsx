import React, { memo } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from 'react-simple-maps';

// TopoJSON for Africa - using Natural Earth data
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// Target countries with their capital cities coordinates
const markers = [
  { name: 'Nairobi', country: 'Kenya', coordinates: [36.8219, -1.2921], iso: 'KEN' },
  { name: 'Kampala', country: 'Uganda', coordinates: [32.5825, 0.3476], iso: 'UGA' },
  { name: 'Dar es Salaam', country: 'Tanzania', coordinates: [39.2083, -6.7924], iso: 'TZA' },
  { name: 'Kigali', country: 'Rwanda', coordinates: [30.0619, -1.9403], iso: 'RWA' },
];

// ISO codes for our target countries
const targetCountries = ['KEN', 'UGA', 'TZA', 'RWA'];

// African country ISO codes for filtering
const africanCountries = [
  'DZA', 'AGO', 'BEN', 'BWA', 'BFA', 'BDI', 'CMR', 'CPV', 'CAF', 'TCD',
  'COM', 'COD', 'COG', 'CIV', 'DJI', 'EGY', 'GNQ', 'ERI', 'SWZ', 'ETH',
  'GAB', 'GMB', 'GHA', 'GIN', 'GNB', 'KEN', 'LSO', 'LBR', 'LBY', 'MDG',
  'MWI', 'MLI', 'MRT', 'MUS', 'MAR', 'MOZ', 'NAM', 'NER', 'NGA', 'RWA',
  'STP', 'SEN', 'SYC', 'SLE', 'SOM', 'ZAF', 'SSD', 'SDN', 'TZA', 'TGO',
  'TUN', 'UGA', 'ZMB', 'ZWE', 'ESH'
];

export const AfricaMap = memo(() => {
  return (
    <div className="relative w-full max-w-lg mx-auto">
      {/* Ambient glow effects */}
      <div className="absolute -inset-10 bg-gradient-radial from-primary/30 via-primary/5 to-transparent rounded-full blur-3xl opacity-60" />
      
      {/* Map container with glass effect */}
      <div className="relative bg-slate-900/40 backdrop-blur-xl rounded-3xl p-4 border border-white/10 shadow-2xl overflow-hidden">
        {/* Inner glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-32 bg-primary/20 blur-3xl" />
        
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            center: [20, 0],
            scale: 350,
          }}
          style={{ width: '100%', height: 'auto' }}
          width={400}
          height={450}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies
                .filter(geo => africanCountries.includes(geo.properties.ISO_A3 || geo.id))
                .map(geo => {
                  const isTarget = targetCountries.includes(geo.properties.ISO_A3 || geo.id);
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={isTarget ? 'rgba(22, 163, 74, 0.6)' : 'rgba(51, 65, 85, 0.7)'}
                      stroke={isTarget ? 'rgba(34, 197, 94, 0.8)' : 'rgba(71, 85, 105, 0.5)'}
                      strokeWidth={isTarget ? 1.5 : 0.5}
                      style={{
                        default: {
                          outline: 'none',
                          transition: 'all 0.3s ease',
                        },
                        hover: {
                          fill: isTarget ? 'rgba(22, 163, 74, 0.8)' : 'rgba(71, 85, 105, 0.7)',
                          outline: 'none',
                        },
                        pressed: { outline: 'none' },
                      }}
                    />
                  );
                })
            }
          </Geographies>

          {/* Animated markers */}
          {markers.map((marker, index) => (
            <Marker key={marker.name} coordinates={marker.coordinates}>
              {/* Outer pulse ring - large */}
              <circle
                r={20}
                fill="none"
                stroke="rgb(34, 197, 94)"
                strokeWidth={2}
                opacity={0}
                className="animate-ping-slow"
                style={{ 
                  animationDelay: `${index * 0.4}s`,
                  transformOrigin: 'center',
                }}
              />
              {/* Middle pulse ring */}
              <circle
                r={14}
                fill="none"
                stroke="rgb(34, 197, 94)"
                strokeWidth={1.5}
                opacity={0}
                className="animate-ping-medium"
                style={{ 
                  animationDelay: `${index * 0.4 + 0.2}s`,
                  transformOrigin: 'center',
                }}
              />
              {/* Glow effect */}
              <circle
                r={10}
                fill="rgba(34, 197, 94, 0.3)"
                className="animate-pulse"
                style={{ animationDuration: '2s' }}
              />
              {/* Main marker dot */}
              <circle
                r={6}
                fill="rgb(22, 163, 74)"
                stroke="white"
                strokeWidth={2}
                style={{ filter: 'drop-shadow(0 0 8px rgba(34, 197, 94, 0.8))' }}
              />
              {/* Inner bright dot */}
              <circle r={2} fill="white" />
            </Marker>
          ))}
        </ComposableMap>

        {/* City labels - positioned outside SVG for better styling */}
        <div className="absolute inset-0 pointer-events-none">
          {markers.map((marker, index) => {
            // Approximate pixel positions based on map projection
            const positions = {
              'Nairobi': { top: '52%', left: '72%' },
              'Kampala': { top: '44%', left: '65%' },
              'Dar es Salaam': { top: '62%', left: '76%' },
              'Kigali': { top: '48%', left: '60%' },
            };
            const pos = positions[marker.name];
            return (
              <div
                key={`label-${marker.name}`}
                className="absolute transform -translate-x-1/2 -translate-y-full"
                style={{ 
                  top: pos.top, 
                  left: pos.left,
                  animation: `fadeIn 0.5s ease-out ${index * 0.2}s both`,
                }}
              >
                <div className="bg-slate-900/95 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-primary/30 shadow-xl mb-2">
                  <p className="text-xs font-bold text-white whitespace-nowrap">{marker.name}</p>
                  <p className="text-[10px] text-primary whitespace-nowrap">{marker.country}</p>
                </div>
                {/* Connector line */}
                <div className="w-0.5 h-4 bg-gradient-to-b from-primary/50 to-transparent mx-auto" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-primary/20 blur-2xl rounded-full" />
      
      {/* CSS for custom animations */}
      <style>{`
        @keyframes ping-slow {
          0% {
            transform: scale(0.5);
            opacity: 0.8;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        @keyframes ping-medium {
          0% {
            transform: scale(0.5);
            opacity: 0.6;
          }
          100% {
            transform: scale(1.8);
            opacity: 0;
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translate(-50%, -100%) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -100%) translateY(0);
          }
        }
        .animate-ping-slow {
          animation: ping-slow 2.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        .animate-ping-medium {
          animation: ping-medium 2.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>
    </div>
  );
});

AfricaMap.displayName = 'AfricaMap';

export default AfricaMap;
