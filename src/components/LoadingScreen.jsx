import React, { useState, useEffect } from 'react';

const LoadingScreen = ({ onLoadingComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    // Smooth progress simulation from 0 to 100%
    const startTime = performance.now();
    const duration = 1200; // 1.2s sleek loading time

    const updateProgress = (currentTime) => {
      const elapsed = currentTime - startTime;
      const rawProgress = Math.min(100, Math.floor((elapsed / duration) * 100));
      
      setProgress(rawProgress);

      if (rawProgress < 100) {
        requestAnimationFrame(updateProgress);
      } else {
        setTimeout(() => {
          setIsFadingOut(true);
          setTimeout(() => {
            setIsDone(true);
            onLoadingComplete?.();
          }, 650);
        }, 200);
      }
    };

    const frameId = requestAnimationFrame(updateProgress);

    return () => cancelAnimationFrame(frameId);
  }, [onLoadingComplete]);

  if (isDone) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#08080a] select-none transition-all duration-700 ease-out ${
        isFadingOut
          ? 'opacity-0 pointer-events-none scale-105 filter blur-sm'
          : 'opacity-100'
      }`}
      aria-hidden="true"
    >
      {/* Subtle Background Radial Aura */}
      <div className="absolute w-72 h-72 rounded-full bg-[#e60000]/5 blur-[90px] pointer-events-none" />

      {/* Main Container */}
      <div className="relative flex flex-col items-center">
        {/* 3x3 Square Matrix Loader */}
        <div className="matrix-loader-container mb-8">
          <div className="matrix-square" id="sq1" />
          <div className="matrix-square" id="sq2" />
          <div className="matrix-square" id="sq3" />
          <div className="matrix-square" id="sq4" />
          <div className="matrix-square matrix-square-center" id="sq5" />
          <div className="matrix-square" id="sq6" />
          <div className="matrix-square" id="sq7" />
          <div className="matrix-square" id="sq8" />
          <div className="matrix-square" id="sq9" />
        </div>

        {/* Minimalist Brand Caption */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#e60000] animate-pulse" />
            <span className="font-mono text-xs tracking-[0.28em] text-white/90 uppercase font-semibold">
              ABLAKIMOV JAMSHID
            </span>
          </div>

          {/* Micro Progress Bar */}
          <div className="w-32 h-[2px] bg-white/10 rounded-full overflow-hidden my-1">
            <div
              className="h-full bg-gradient-to-r from-[#e60000] to-white transition-all duration-75 ease-out rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Percentage Counter */}
          <span className="font-mono text-[11px] tracking-widest text-zinc-500 tabular-nums">
            {progress < 10 ? `0${progress}` : progress}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
