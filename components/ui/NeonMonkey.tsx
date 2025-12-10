import React from 'react';

export const NeonMonkey: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-20">
      <div className="absolute top-24 right-10 animate-pulse-slow">
        <svg width="300" height="300" viewBox="0 0 200 200" className="drop-shadow-[0_0_15px_rgba(139,92,246,0.5)]">
          <g className="animate-bounce" style={{ animationDuration: '6s' }}>
             {/* Monkey Head Outline - Neon Purple */}
             <circle cx="100" cy="100" r="60" fill="none" stroke="#8b5cf6" strokeWidth="3" />
             
             {/* Ears - Neon Cyan */}
             <circle cx="40" cy="100" r="20" fill="none" stroke="#06b6d4" strokeWidth="3" />
             <circle cx="160" cy="100" r="20" fill="none" stroke="#06b6d4" strokeWidth="3" />
             
             {/* Eyes (Visor style) - Neon Pink */}
             <rect x="70" y="80" width="60" height="20" rx="10" fill="rgba(236, 72, 153, 0.2)" stroke="#ec4899" strokeWidth="2" />
             
             {/* Mouth - Neon Green */}
             <path d="M 80 130 Q 100 150 120 130" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" />
             
             {/* Cyber Antenna */}
             <line x1="100" y1="40" x2="100" y2="10" stroke="#8b5cf6" strokeWidth="2" />
             <circle cx="100" cy="10" r="4" fill="#8b5cf6" className="animate-ping" style={{ animationDuration: '3s' }}/>
          </g>
          
          {/* Hanging Vine/Cable */}
          <path d="M 100 0 L 100 40" stroke="#8b5cf6" strokeWidth="2" strokeDasharray="4,4" />
        </svg>
      </div>
    </div>
  );
};