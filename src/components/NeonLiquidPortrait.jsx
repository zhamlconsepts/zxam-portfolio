import React, { useRef, useEffect, useState, useCallback } from 'react';

/**
 * NeonLiquidPortrait Component
 * 
 * - Default State: Pure glowing all-white neon silhouette ("toliq oppoq neon boladi, korinmay turadi")
 * - Interactive State: Fluid cursor motion paints organic liquid reveal droplets, unveiling the real HD portrait beneath ("suyuq hover borganda korinadi")
 * - Liquid Dynamics: Organic metaball fusion, subtle downward dripping tears, and smooth evaporation dissolution.
 * - Backdrop: Sits directly in front of the giant laser-red "ZXAM" typography.
 */
const NeonLiquidPortrait = () => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const dropsRef = useRef([]);
  const animFrameRef = useRef(null);
  const lastPosRef = useRef({ x: 0, y: 0, time: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Preload HD image for canvas drawing
  useEffect(() => {
    const img = new Image();
    img.src = '/assets/jamshid.png';
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imageRef.current = img;
      setImageLoaded(true);
    };
  }, []);

  // Spawn a liquid droplet
  const spawnDrop = useCallback((x, y, radius, isMain = false) => {
    dropsRef.current.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 0.8,
      vy: Math.random() * 0.9 + 0.3, // organic downward gravitational drip
      radius: radius * 0.45,
      targetRadius: radius,
      alpha: 1.0,
      fadeRate: isMain ? 0.012 : 0.016, // stays visible for ~1.5 - 2s
      growth: 0.14
    });
  }, []);

  // Handle pointer movement over the portrait
  const handlePointerMove = useCallback((e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (x < 0 || x > rect.width || y < 0 || y > rect.height) return;

    const now = performance.now();
    const dt = Math.max(1, now - lastPosRef.current.time);
    const dist = Math.hypot(x - lastPosRef.current.x, y - lastPosRef.current.y);
    const speed = dist / dt;

    lastPosRef.current = { x, y, time: now };

    // Primary liquid pool under cursor
    const baseRadius = Math.min(85, Math.max(50, 45 + speed * 15));
    spawnDrop(x, y, baseRadius, true);

    // Secondary tear droplets / splashing satellite beads
    const satellites = Math.floor(Math.random() * 2) + 1;
    for (let i = 0; i < satellites; i++) {
      const offsetX = (Math.random() - 0.5) * (baseRadius * 0.85);
      const offsetY = (Math.random() - 0.5) * (baseRadius * 0.85);
      spawnDrop(x + offsetX, y + offsetY, baseRadius * (0.35 + Math.random() * 0.35), false);
    }
  }, [spawnDrop]);

  // Main Canvas Rendering Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const updateSize = () => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        canvas.width = Math.floor(rect.width * dpr);
        canvas.height = Math.floor(rect.height * dpr);
        ctx.scale(dpr, dpr);
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);

    let lastFrame = performance.now();

    const render = (time) => {
      const delta = Math.min(2, (time - lastFrame) / 16.66);
      lastFrame = time;

      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      // 1. Clear frame
      ctx.clearRect(0, 0, w, h);

      // If user is hovering still, gently pulse a drop at current mouse pos
      if (isHovered && lastPosRef.current.time > 0) {
        if (Math.random() < 0.25) {
          spawnDrop(
            lastPosRef.current.x + (Math.random() - 0.5) * 12,
            lastPosRef.current.y + (Math.random() - 0.5) * 12,
            55,
            true
          );
        }
      }

      // 2. Update and draw active liquid mask drops
      const activeDrops = [];
      const drops = dropsRef.current;

      ctx.save();
      ctx.globalCompositeOperation = 'source-over';

      for (let i = 0; i < drops.length; i++) {
        const d = drops[i];

        // Animate radius expansion
        if (d.radius < d.targetRadius) {
          d.radius += (d.targetRadius - d.radius) * d.growth * delta;
        }

        // Gravity drip
        d.x += d.vx * delta;
        d.y += d.vy * delta;
        d.vy += 0.02 * delta;

        // Fade out
        d.alpha -= d.fadeRate * delta;

        if (d.alpha > 0.01 && d.radius > 2) {
          activeDrops.push(d);

          // Draw organic liquid droplet with soft radial gradient
          const grad = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, d.radius);
          grad.addColorStop(0, `rgba(0, 0, 0, ${d.alpha})`);
          grad.addColorStop(0.75, `rgba(0, 0, 0, ${d.alpha * 0.9})`);
          grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(d.x, d.y, d.radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      dropsRef.current = activeDrops;

      // 3. Composite REAL COLOR PHOTO through the liquid mask with pixel-perfect object-contain alignment
      if (activeDrops.length > 0 && imageRef.current && imageLoaded) {
        ctx.globalCompositeOperation = 'source-in';

        const imgW = imageRef.current.naturalWidth || 450;
        const imgH = imageRef.current.naturalHeight || 600;
        const imgRatio = imgW / imgH;
        const canvasRatio = w / h;

        let dw = w;
        let dh = h;
        let dx = 0;
        let dy = 0;

        if (canvasRatio > imgRatio) {
          dw = h * imgRatio;
          dh = h;
          dx = (w - dw) / 2;
          dy = 0;
        } else {
          dw = w;
          dh = w / imgRatio;
          dx = 0;
          dy = h - dh; // anchor bottom
        }

        ctx.drawImage(imageRef.current, dx, dy, dw, dh);

        // 4. Subtle glowing liquid rim around the reveal edges
        ctx.globalCompositeOperation = 'destination-over';
        for (let i = 0; i < activeDrops.length; i++) {
          const d = activeDrops[i];
          const rimGrad = ctx.createRadialGradient(d.x, d.y, d.radius * 0.85, d.x, d.y, d.radius * 1.05);
          rimGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
          rimGrad.addColorStop(0.5, `rgba(230, 0, 0, ${d.alpha * 0.35})`);
          rimGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

          ctx.fillStyle = rimGrad;
          ctx.beginPath();
          ctx.arc(d.x, d.y, d.radius * 1.05, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.restore();

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', updateSize);
    };
  }, [imageLoaded, isHovered, spawnDrop]);

  return (
    <div
      ref={containerRef}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => {
        setIsHovered(false);
        lastPosRef.current.time = 0;
      }}
      onPointerMove={handlePointerMove}
      onPointerDown={handlePointerMove}
      onTouchStart={handlePointerMove}
      onTouchMove={handlePointerMove}
      className="relative w-full max-w-[340px] sm:max-w-[400px] lg:max-w-[450px] aspect-[3/4] flex justify-center items-center overflow-visible group cursor-crosshair select-none pointer-events-auto"
      title="Surat ustiga sichqonchani olib boring (Suyuq ochilish effekti)"
    >
      {/* 0. Red "ZXAM" Typography Backdrop */}
      <div 
        className="absolute top-[28%] sm:top-[30%] lg:top-[32%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-full z-0 pointer-events-none select-none flex flex-col items-center justify-center text-center px-2"
        aria-hidden="true"
      >
        <span className="font-editorial font-black text-[#e60000] text-[80px] sm:text-[105px] md:text-[125px] lg:text-[145px] xl:text-[160px] leading-none tracking-tight uppercase select-none drop-shadow-[0_0_40px_rgba(230,0,0,0.9)] drop-shadow-[0_0_15px_rgba(230,0,0,0.85)] scale-y-105 whitespace-nowrap">
          ZXAM
        </span>
        <span className="font-mono text-[9px] sm:text-[11px] text-[#e60000] tracking-[0.35em] uppercase mt-1 font-bold drop-shadow-[0_0_10px_rgba(230,0,0,0.9)]">
          // IDENTITY: ZXAM
        </span>
      </div>

      {/* 1. Base Layer: Pure White Radiant Neon Silhouette */}
      <img
        src="/assets/jamshid.png"
        alt="Ablakimov Jamshid (zxam) - White Neon Silhouette"
        className="absolute inset-0 w-full h-full object-contain object-bottom select-none pointer-events-none z-10 transition-all duration-500 filter brightness-0 invert contrast-200 drop-shadow-[0_0_25px_rgba(255,255,255,0.95)] drop-shadow-[0_0_55px_rgba(255,255,255,0.6)] drop-shadow-[0_0_80px_rgba(230,0,0,0.4)]"
        loading="eager"
      />

      {/* 2. Top Layer: Real Full-Color HD Portrait revealed by Liquid Hover Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-contain object-bottom select-none pointer-events-none z-20"
        aria-hidden="true"
      />

      {/* Interactive Micro-badge indicator */}
      <div className="absolute top-2 right-2 z-30 font-mono text-[9px] tracking-widest uppercase bg-black/80 backdrop-blur-md text-white/70 px-2 py-0.5 border border-white/15 rounded pointer-events-none group-hover:border-[#e60000] group-hover:text-[#e60000] transition-colors">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#e60000] mr-1.5 animate-pulse" />
        <span>LIQUID REVEAL</span>
      </div>
    </div>
  );
};

export default NeonLiquidPortrait;
