import React from 'react';

const SheryiansBg = () => {
  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: '#000000', zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      
      {/* 1. Center Subtle Orange Glow */}
      <div 
        className="absolute top-[30%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full pointer-events-none" 
        style={{ 
          background: 'radial-gradient(ellipse at center, rgba(232,124,65,0.06) 0%, transparent 70%)',
          filter: 'blur(40px)'
        }}
      ></div>

      {/* 2. Top Radial Sunburst / Rays */}
      <div 
        className="absolute top-[-20%] left-0 w-full h-[120%] pointer-events-none" 
        style={{
          background: 'repeating-conic-gradient(from 0deg at 50% 0%, transparent 0deg, transparent 3deg, rgba(255,255,255,0.015) 3deg, rgba(255,255,255,0.015) 6deg)',
          maskImage: 'radial-gradient(circle at 50% 0%, rgba(0,0,0,1) 10%, rgba(0,0,0,0) 60%)',
          WebkitMaskImage: 'radial-gradient(circle at 50% 0%, rgba(0,0,0,1) 10%, rgba(0,0,0,0) 60%)'
        }}
      ></div>

      {/* 3. Center Dotted Pattern (Faded edges) */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle, #E87C41 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          backgroundPosition: 'center center',
          maskImage: 'radial-gradient(circle at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 50%)',
          WebkitMaskImage: 'radial-gradient(circle at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 50%)'
        }}
      ></div>

      {/* 4. Tech Geometric Wireframes */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        {/* Left Side Shape */}
        <g stroke="rgba(255,255,255,0.08)" strokeWidth="0.2" fill="none">
          <path d="M 0 35 L 15 35 L 25 50 L 15 65 L 0 65" />
          <path d="M 15 35 L 22 20" />
          <path d="M 15 65 L 22 80" />
          <circle cx="15" cy="35" r="0.4" fill="rgba(255,255,255,0.3)" stroke="none" />
          <circle cx="25" cy="50" r="0.4" fill="rgba(255,255,255,0.3)" stroke="none" />
          <circle cx="15" cy="65" r="0.4" fill="rgba(255,255,255,0.3)" stroke="none" />
        </g>

        {/* Right Side Shape */}
        <g stroke="rgba(255,255,255,0.08)" strokeWidth="0.2" fill="none">
          <path d="M 100 35 L 85 35 L 75 50 L 85 65 L 100 65" />
          <path d="M 85 35 L 78 20" />
          <path d="M 85 65 L 78 80" />
          <circle cx="85" cy="35" r="0.4" fill="rgba(255,255,255,0.3)" stroke="none" />
          <circle cx="75" cy="50" r="0.4" fill="rgba(255,255,255,0.3)" stroke="none" />
          <circle cx="85" cy="65" r="0.4" fill="rgba(255,255,255,0.3)" stroke="none" />
        </g>
      </svg>

      {/* 5. Bottom Floor Perspective Grid */}
      <div 
        className="absolute bottom-0 left-0 w-full h-[40vh] pointer-events-none opacity-[0.06]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          backgroundPosition: 'center bottom',
          transformOrigin: 'bottom center',
          transform: 'perspective(800px) rotateX(75deg) scale(2)',
          maskImage: 'linear-gradient(to top, rgba(0,0,0,1) 10%, rgba(0,0,0,0) 90%)',
          WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,1) 10%, rgba(0,0,0,0) 90%)'
        }}
      ></div>

    </div>
  );
};

export default SheryiansBg;
