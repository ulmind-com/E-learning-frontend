import React from 'react';

const PremiumBg = ({ scrollY = 0 }) => (
  <div style={{ position:'fixed', inset:0, overflow:'hidden', pointerEvents:'none', zIndex:0, backgroundColor: '#030100' }}>
    {/* Deep Amber/Orange Core Glow */}
    <div style={{
      position:'absolute', top:'10%', left:'-5%',
      width:'900px', height:'900px', borderRadius:'50%',
      background:'radial-gradient(circle, rgba(255,100,20,0.08) 0%, rgba(232,124,65,0.03) 40%, transparent 70%)',
      filter:'blur(90px)', pointerEvents:'none'
    }} />

    {/* Secondary Vibrant Orange Glow */}
    <div style={{
      position:'absolute', bottom:'-10%', right:'-10%',
      width:'700px', height:'700px', borderRadius:'50%',
      background:'radial-gradient(circle, rgba(255,120,40,0.06) 0%, rgba(232,124,65,0.02) 40%, transparent 70%)',
      filter:'blur(70px)', pointerEvents:'none',
      transform: `translateY(${-scrollY*0.03}px)`
    }} />

    {/* Geometric Wireframe Patterns */}
    <svg width="100%" height="100%" className="absolute inset-0 opacity-[0.25]" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="dotGrid" width="40" height="40" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.5" fill="#E87C41" opacity="0.8" />
          <circle cx="20" cy="20" r="1" fill="#FF8C42" opacity="0.3" />
        </pattern>
        <linearGradient id="orangeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF6B00" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#FF9D00" stopOpacity="0.1" />
        </linearGradient>
      </defs>
      {/* Background Dots */}
      <rect width="100%" height="100%" fill="url(#dotGrid)" />
      
      {/* Large rotated diamond wireframes - enhanced with orange gradients */}
      <g stroke="url(#orangeGrad)" strokeWidth="1" fill="none" opacity="0.6" style={{ transform: `translateY(${scrollY*0.06}px)` }}>
        <path d="M 100 500 L 400 200 L 700 500 L 400 800 Z" />
        <path d="M 250 500 L 400 350 L 550 500 L 400 650 Z" />
        <path d="M -50 200 L 250 -100 L 550 200 L 250 500 Z" />
      </g>
      
      {/* Abstract connection lines */}
      <g stroke="#E87C41" strokeWidth="0.5" fill="none" opacity="0.4" style={{ transform: `translateY(${scrollY*0.02}px)` }}>
        <path d="M 0 350 L 400 350 L 700 650 L 1200 650" />
        <path d="M 400 0 L 400 800" />
        <path d="M 700 0 L 700 1000" />
      </g>
    </svg>
  </div>
);

export default PremiumBg;
