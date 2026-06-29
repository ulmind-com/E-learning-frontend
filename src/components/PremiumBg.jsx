import React from 'react';

const PremiumBg = () => (
  <div style={{ position:'fixed', inset:0, overflow:'hidden', pointerEvents:'none', zIndex:0, backgroundColor: '#050505' }}>
    <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full opacity-[0.02] blur-[150px] animate-pulse-glow" style={{ backgroundColor: '#E87C41' }}></div>
    <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full opacity-[0.01] blur-[150px] animate-pulse-glow" style={{ backgroundColor: '#ff5e00', animationDelay: '2s' }}></div>
    {/* Animated 3D grid lines */}
    <div className="absolute inset-0 opacity-[0.05]" style={{ 
      backgroundImage: 'linear-gradient(#E87C41 1px, transparent 1px), linear-gradient(90deg, #E87C41 1px, transparent 1px)', 
      backgroundSize: '40px 40px',
      transform: 'perspective(1000px) rotateX(60deg) scale(2.5) translateY(-100px)',
      animation: 'grid-move 20s linear infinite'
    }}></div>
  </div>
);

export default PremiumBg;
