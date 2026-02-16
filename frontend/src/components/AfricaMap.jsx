import React, { memo } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from 'react-simple-maps';

// TopoJSON for world countries
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// Target countries with their capital cities coordinates
const markers = [
  { name: 'Nairobi', country: 'Kenya', coordinates: [36.8219, -1.2921] },
  { name: 'Kampala', country: 'Uganda', coordinates: [32.5825, 0.3476] },
  { name: 'Dar es Salaam', country: 'Tanzania', coordinates: [39.2083, -6.7924] },
  { name: 'Kigali', country: 'Rwanda', coordinates: [30.0619, -1.9403] },
];

// Numeric IDs for target East African countries (from world-atlas)
const targetCountryIds = ['404', '800', '834', '646']; // Kenya, Uganda, Tanzania, Rwanda

// Numeric IDs for all African countries (from world-atlas countries-110m.json)
const africanCountryIds = [
  '12',   // Algeria
  '24',   // Angola
  '204',  // Benin
  '72',   // Botswana
  '854',  // Burkina Faso
  '108',  // Burundi
  '120',  // Cameroon
  '132',  // Cape Verde
  '140',  // Central African Republic
  '148',  // Chad
  '174',  // Comoros
  '180',  // DR Congo
  '178',  // Congo
  '384',  // Cote d'Ivoire
  '262',  // Djibouti
  '818',  // Egypt
  '226',  // Equatorial Guinea
  '232',  // Eritrea
  '748',  // Eswatini
  '231',  // Ethiopia
  '266',  // Gabon
  '270',  // Gambia
  '288',  // Ghana
  '324',  // Guinea
  '624',  // Guinea-Bissau
  '404',  // Kenya
  '426',  // Lesotho
  '430',  // Liberia
  '434',  // Libya
  '450',  // Madagascar
  '454',  // Malawi
  '466',  // Mali
  '478',  // Mauritania
  '480',  // Mauritius
  '504',  // Morocco
  '508',  // Mozambique
  '516',  // Namibia
  '562',  // Niger
  '566',  // Nigeria
  '646',  // Rwanda
  '678',  // Sao Tome and Principe
  '686',  // Senegal
  '690',  // Seychelles
  '694',  // Sierra Leone
  '706',  // Somalia
  '710',  // South Africa
  '728',  // South Sudan
  '729',  // Sudan
  '834',  // Tanzania
  '768',  // Togo
  '788',  // Tunisia
  '800',  // Uganda
  '894',  // Zambia
  '716',  // Zimbabwe
  '732',  // Western Sahara
];

export const AfricaMap = memo(() => {
  return (
    <div className="relative w-full max-w-xl mx-auto">
      {/* Ambient glow effects */}
      <div className="absolute -inset-8 bg-gradient-radial from-primary/20 via-primary/5 to-transparent rounded-full blur-3xl opacity-70" />
      
      {/* Map container with glass effect */}
      <div className="relative bg-slate-900/50 backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-2xl overflow-hidden">
        {/* Inner glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-40 bg-primary/15 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-1/2 h-32 bg-emerald-500/10 blur-3xl" />
        
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            center: [20, 2],
            scale: 280,
          }}
          style={{ width: '100%', height: 'auto' }}
          width={400}
          height={450}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies
                .filter(geo => africanCountryIds.includes(String(geo.id)))
                .map(geo => {
                  const isTarget = targetCountryIds.includes(String(geo.id));
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={isTarget ? 'rgba(22, 163, 74, 0.7)' : 'rgba(51, 65, 85, 0.6)'}
                      stroke={isTarget ? 'rgba(34, 197, 94, 1)' : 'rgba(100, 116, 139, 0.4)'}
                      strokeWidth={isTarget ? 1.5 : 0.3}
                      style={{
                        default: {
                          outline: 'none',
                          transition: 'all 0.3s ease',
                        },
                        hover: {
                          fill: isTarget ? 'rgba(22, 163, 74, 0.9)' : 'rgba(71, 85, 105, 0.8)',
                          stroke: isTarget ? 'rgba(34, 197, 94, 1)' : 'rgba(100, 116, 139, 0.6)',
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
                r={18}
                fill="none"
                stroke="rgb(34, 197, 94)"
                strokeWidth={2}
                opacity={0}
                className="animate-ping-slow"
                style={{ 
                  animationDelay: `${index * 0.5}s`,
                  transformOrigin: 'center',
                }}
              />
              {/* Middle pulse ring */}
              <circle
                r={12}
                fill="none"
                stroke="rgb(34, 197, 94)"
                strokeWidth={1.5}
                opacity={0}
                className="animate-ping-medium"
                style={{ 
                  animationDelay: `${index * 0.5 + 0.25}s`,
                  transformOrigin: 'center',
                }}
              />
              {/* Glow effect */}
              <circle
                r={8}
                fill="rgba(34, 197, 94, 0.25)"
                className="animate-pulse"
                style={{ animationDuration: '2s' }}
              />
              {/* Main marker dot */}
              <circle
                r={5}
                fill="rgb(22, 163, 74)"
                stroke="white"
                strokeWidth={2}
                style={{ filter: 'drop-shadow(0 0 6px rgba(34, 197, 94, 0.9))' }}
              />
              {/* Inner bright dot */}
              <circle r={1.5} fill="white" />
            </Marker>
          ))}
        </ComposableMap>

        {/* City labels - positioned with adjusted coordinates */}
        <div className="absolute inset-0 pointer-events-none">
          {markers.map((marker, index) => {
            // Pixel positions calibrated for the new projection
            const positions = {
              'Nairobi': { top: '48%', left: '70%' },
              'Kampala': { top: '35%', left: '58%' },
              'Dar es Salaam': { top: '56%', left: '74%' },
              'Kigali': { top: '44%', left: '50%' },
            };
            const pos = positions[marker.name];
            return (
              <div
                key={`label-${marker.name}`}
                className="absolute transform -translate-x-1/2"
                style={{ 
                  top: pos.top, 
                  left: pos.left,
                  animation: `fadeIn 0.6s ease-out ${index * 0.15}s both`,
                }}
              >
                <div className="bg-slate-900/90 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-primary/40 shadow-lg shadow-primary/20">
                  <p className="text-[11px] font-bold text-white whitespace-nowrap leading-tight">{marker.name}</p>
                  <p className="text-[9px] text-primary/90 whitespace-nowrap">{marker.country}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom glow */}
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-2/3 h-12 bg-primary/15 blur-2xl rounded-full" />
      
      {/* CSS for custom animations */}
      <style>{`
        @keyframes ping-slow {
          0% {
            transform: scale(0.6);
            opacity: 0.7;
          }
          100% {
            transform: scale(2.2);
            opacity: 0;
          }
        }
        @keyframes ping-medium {
          0% {
            transform: scale(0.6);
            opacity: 0.5;
          }
          100% {
            transform: scale(1.8);
            opacity: 0;
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translate(-50%, 0) translateY(8px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0) translateY(0);
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
