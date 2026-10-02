import React from 'react';

const MarqueeTicker = () => {
  const items = [
    'REACT.JS ARCHITECTURE',
    'TAILWIND CSS',
    'JAVASCRIPT ES6+',
    'PIXEL-PERFECT FIGMA',
    'VITE & HMR',
    'VERCEL CI/CD',
    'RESPONSIVE UX',
    'GULISTON, UZBEKISTAN',
    'CONTINUOUS ITERATION',
    'HIGH PERFORMANCE'
  ];

  return (
    <div className="w-full py-5 border-y border-white/10 bg-black overflow-hidden select-none relative z-20">
      <div className="animate-marquee flex items-center gap-8 font-editorial text-sm sm:text-base font-extrabold tracking-widest text-zinc-400 uppercase">
        {/* Double array for infinite seamless looping */}
        {[...items, ...items, ...items, ...items].map((text, idx) => (
          <div key={idx} className="flex items-center gap-8 whitespace-nowrap group hover:text-white transition-colors">
            <span className="text-white group-hover:text-[#e60000] transition-colors">{text}</span>
            <span className="text-[#e60000]">&bull;</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarqueeTicker;
