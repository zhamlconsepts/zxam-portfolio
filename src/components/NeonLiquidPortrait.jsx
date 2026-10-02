import React, { useState } from 'react';
import { playHoverSound, playClickSound } from '../utils/audio';

/**
 * NeonLiquidPortrait Component
 * 
 * - Default State: Pure glowing all-white radiant neon silhouette ("toliq oppoq neon boladi")
 * - Hover State: Seamlessly reveals the real HD portrait in 100% true natural colors ("hover bolganda rasim oz rangida korinsin")
 * - Zero circular blotches/rings/dots ("boya aytgan doiralar bolmasin bilinib qolyabdi")
 * - Large, heroic scale filling the right column ("rasimni kattalashtir")
 * - Backdrop: Sits directly in front of the giant laser-red "ZXAM" typography
 */
const NeonLiquidPortrait = () => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    playHoverSound();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={playClickSound}
      className="relative w-full max-w-[360px] sm:max-w-[460px] md:max-w-[520px] lg:max-w-[560px] xl:max-w-[620px] 2xl:max-w-[660px] aspect-[3/4] flex justify-center items-center overflow-visible group select-none pointer-events-auto cursor-pointer"
      title="Surat ustiga sichqonchani olib boring (Asil rangda ochilish)"
    >
      {/* 0. Giant Red "ZXAM" Typography Backdrop Behind Portrait */}
      <div 
        className="absolute top-[28%] sm:top-[30%] lg:top-[32%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-full z-0 pointer-events-none select-none flex flex-col items-center justify-center text-center px-2"
        aria-hidden="true"
      >
        <span className="font-editorial font-black text-[#e60000] text-[95px] sm:text-[130px] md:text-[160px] lg:text-[190px] xl:text-[220px] leading-none tracking-tight uppercase select-none drop-shadow-[0_0_45px_rgba(230,0,0,0.95)] drop-shadow-[0_0_15px_rgba(230,0,0,0.85)] scale-y-105 whitespace-nowrap">
          ZXAM
        </span>
        <span className="font-mono text-[9px] sm:text-[11px] md:text-[13px] text-[#e60000] tracking-[0.35em] uppercase mt-1 sm:mt-2 font-bold drop-shadow-[0_0_10px_rgba(230,0,0,0.9)]">
          // IDENTITY: ZXAM
        </span>
      </div>

      {/* 1. Base Layer: Pure White Radiant Glowing Neon Silhouette (Default unhovered state) */}
      <img
        src="/assets/jamshid.png"
        alt="Ablakimov Jamshid (zxam) - White Neon Silhouette"
        className={`absolute inset-0 w-full h-full object-contain object-bottom select-none pointer-events-none z-10 transition-opacity duration-700 ease-out filter brightness-0 invert contrast-200 drop-shadow-[0_0_25px_rgba(255,255,255,0.95)] drop-shadow-[0_0_55px_rgba(255,255,255,0.65)] drop-shadow-[0_0_90px_rgba(230,0,0,0.45)] ${
          isHovered ? 'opacity-0' : 'opacity-100'
        }`}
        loading="eager"
      />

      {/* 2. Top Layer: Real Full-Color HD Portrait in Natural Colors (Hovered state - 100% circle-free) */}
      <img
        src="/assets/jamshid.png"
        alt="Ablakimov Jamshid (zxam) - Real Color HD Portrait"
        className={`absolute inset-0 w-full h-full object-contain object-bottom select-none pointer-events-none z-20 transition-opacity duration-700 ease-out filter contrast-[1.05] drop-shadow-[0_25px_60px_rgba(0,0,0,0.95)] ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
        loading="eager"
      />

      {/* 3. Interactive Status Badge */}
      <div className="absolute top-2 right-2 z-30 font-mono text-[9px] sm:text-[10px] tracking-widest uppercase bg-black/85 backdrop-blur-md text-white/80 px-2.5 py-1 border border-white/20 rounded pointer-events-none group-hover:border-[#e60000] group-hover:text-[#e60000] transition-colors flex items-center gap-1.5 shadow-[0_4px_15px_rgba(0,0,0,0.6)]">
        <span className={`inline-block w-2 h-2 rounded-full transition-colors ${isHovered ? 'bg-[#e60000] animate-pulse' : 'bg-white'}`} />
        <span>{isHovered ? 'ASIL RANG (REAL COLOR)' : 'OQ NEON SILUET'}</span>
      </div>
    </div>
  );
};

export default NeonLiquidPortrait;
