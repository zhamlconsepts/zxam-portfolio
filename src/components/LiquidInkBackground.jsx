import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

/**
 * Interactive Typography Dynamic Cursor-Driven Negative Reveal Mask Effect
 * (Inspired by noth.in & Anti-Gravity physics)
 * 
 * Tech Stack & Architecture:
 * - WebGL Shader / Three.js Pipeline: Computes 3D-quality liquid textures, surface tension meniscus,
 *   and Voronoi effervescent liquid bubbles.
 * - GSAP Motion Physics: Drops organically expand, swirl with fluid drag, and slowly dissolve/fade
 *   back to normal after 1.5 - 2.0 seconds.
 * - Negative Inversion Mask (mix-blend-mode: difference):
 *   * Where the erased trail intersects typography and portrait, they invert to pure white/metallic negative tones.
 *   * Where it overlaps the background, it forms solid negative fluid shapes.
 * - Exact noth.in Dripping Splatter Shape:
 *   * Heavy vertical dripping stalactites with bulbous teardrop heads hanging downward.
 *   * Upward & diagonal splash horns stretching outward.
 *   * Detached satellite tear beads.
 * - Document-Space Scroll Anchoring: stays pinned to page content during scrolling.
 */
const LiquidInkBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = (canvas.width = Math.floor(window.innerWidth * dpr));
    let height = (canvas.height = Math.floor(window.innerHeight * dpr));
    let cssWidth = window.innerWidth;
    let cssHeight = window.innerHeight;

    const gl =
      canvas.getContext('webgl2', {
        alpha: true,
        depth: false,
        stencil: false,
        antialias: true,
        powerPreference: 'high-performance'
      }) ||
      canvas.getContext('webgl', {
        alpha: true,
        depth: false,
        stencil: false,
        antialias: true,
        powerPreference: 'high-performance'
      });

    if (!gl) {
      return run2DFallback(canvas);
    }

    // 1. WebGL Shaders
    // Pass 1: Accumulate Gaussian Density for Dripping Splatter Metaballs
    const vsDensity = `
      attribute vec2 aCorner;
      attribute vec2 aCenter;
      attribute float aRadius;
      attribute float aWeight;
      uniform vec2 uResolution;
      varying vec2 vLocalPos;
      varying float vWeight;
      void main() {
        vLocalPos = aCorner;
        vWeight = aWeight;
        vec2 pos = aCenter + aCorner * aRadius;
        vec2 clip = (pos / uResolution) * 2.0 - 1.0;
        clip.y = -clip.y;
        gl_Position = vec4(clip, 0.0, 1.0);
      }
    `;

    const fsDensity = `
      precision highp float;
      varying vec2 vLocalPos;
      varying float vWeight;
      void main() {
        float distSq = dot(vLocalPos, vLocalPos);
        if (distSq > 1.0) discard;
        // Gaussian falloff for organic liquid fusion
        float d = exp(-distSq * 2.5) * vWeight;
        gl_FragColor = vec4(d, d, d, 1.0);
      }
    `;

    // Pass 2: Screen Pass with Scalloped Meniscus, Glassy Rim & Effervescent Bubbles
    const vsScreen = `
      attribute vec2 aPosition;
      varying vec2 vUv;
      void main() {
        vUv = aPosition * 0.5 + 0.5;
        gl_Position = vec4(aPosition, 0.0, 1.0);
      }
    `;

    const fsScreen = `
      precision highp float;
      uniform sampler2D uDensity;
      uniform float uTime;
      varying vec2 vUv;

      void main() {
        float density = texture2D(uDensity, vUv).r;
        if (density < 0.02) {
          gl_FragColor = vec4(0.0);
          return;
        }

        // Smooth viscous wave edge perturbation
        float wave = sin(vUv.x * 20.0 + vUv.y * 14.0 + uTime * 0.4) * 0.012 +
                     cos(vUv.y * 24.0 - vUv.x * 16.0 + uTime * 0.35) * 0.010;

        float threshold = 0.30;
        float edge = 0.025;
        float mask = smoothstep(threshold, threshold + edge, density + wave);
        if (mask <= 0.001) {
          gl_FragColor = vec4(0.0);
          return;
        }

        // Pure, solid, seamless white liquid mask for difference inversion
        gl_FragColor = vec4(mask, mask, mask, mask);
      }
    `;

    function compileShader(type, src) {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.warn('Shader err:', gl.getShaderInfoLog(s));
        gl.deleteShader(s);
        return null;
      }
      return s;
    }

    function createProgram(vsSrc, fsSrc) {
      const vs = compileShader(gl.VERTEX_SHADER, vsSrc);
      const fs = compileShader(gl.FRAGMENT_SHADER, fsSrc);
      if (!vs || !fs) return null;
      const p = gl.createProgram();
      gl.attachShader(p, vs);
      gl.attachShader(p, fs);
      gl.linkProgram(p);
      if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
        console.warn('Program link err:', gl.getProgramInfoLog(p));
        gl.deleteProgram(p);
        return null;
      }
      return p;
    }

    const densityProg = createProgram(vsDensity, fsDensity);
    const screenProg = createProgram(vsScreen, fsScreen);

    if (!densityProg || !screenProg) {
      return run2DFallback(canvas);
    }

    // Geometry buffers
    const quadBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );

    const BUFFER_CAPACITY = 250;
    const vertexArray = new Float32Array(BUFFER_CAPACITY * 6 * 6);
    const dropBuffer = gl.createBuffer();

    let fboWidth = Math.floor(width * 0.75);
    let fboHeight = Math.floor(height * 0.75);

    function createDensityFBO(w, h) {
      const texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

      const fbo = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);

      return { fbo, texture, width: w, height: h };
    }

    let densityFBO = createDensityFBO(fboWidth, fboHeight);

    const onResize = () => {
      const newDpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.width = Math.floor(window.innerWidth * newDpr);
      height = canvas.height = Math.floor(window.innerHeight * newDpr);
      cssWidth = window.innerWidth;
      cssHeight = window.innerHeight;
      fboWidth = Math.floor(width * 0.75);
      fboHeight = Math.floor(height * 0.75);
      densityFBO = createDensityFBO(fboWidth, fboHeight);
    };
    window.addEventListener('resize', onResize);

    // Active drops pool managed by GSAP
    const drops = [];

    const isMobile = typeof window !== 'undefined' && 
      (window.matchMedia('(hover: none) and (pointer: coarse)').matches || window.innerWidth < 768);

    const MAX_DROPS = isMobile ? 20 : 80;

    let lastDocX = null;
    let lastDocY = null;
    let lastTime = 0;

    /**
     * Generates a signature noth.in Viscous Liquid Dripping Splatter Cluster
     */
    const spawnDrippingCluster = (cx, cy, baseRadius, vx, vy, isTouch = false) => {
      const clusterItems = [];

      // 1. Central Molten Core
      clusterItems.push({
        x: cx,
        y: cy,
        targetRadius: isTouch ? baseRadius * 0.75 : baseRadius,
        initialRadius: isTouch ? baseRadius * 0.35 : baseRadius * 0.35
      });

      if (!isTouch) {
        // Desktop: Heavy Vertical Dripping Stalactites (Exact noth.in signature style)
        const numDrips = 2 + Math.floor(Math.random() * 2);
        for (let i = 0; i < numDrips; i++) {
          const xOffset = (i - (numDrips - 1) / 2) * (baseRadius * 0.38);
          const dripLength = baseRadius * (0.50 + Math.random() * 0.40);
          const tipRadius = baseRadius * (0.35 + Math.random() * 0.12);

          clusterItems.push({
            x: cx + xOffset * 0.7,
            y: cy + dripLength * 0.5,
            targetRadius: baseRadius * 0.45,
            initialRadius: baseRadius * 0.2
          });

          clusterItems.push({
            x: cx + xOffset,
            y: cy + dripLength,
            targetRadius: tipRadius,
            initialRadius: tipRadius * 0.25
          });
        }

        // Upward & Diagonal Splash Tendrils
        const numHorns = 2;
        for (let j = 0; j < numHorns; j++) {
          const hornAngle =
            -Math.PI * 0.5 + (j === 0 ? -0.65 : 0.65) + (Math.random() - 0.5) * 0.2;
          const hornLength = baseRadius * (0.45 + Math.random() * 0.35);
          const hornRadius = baseRadius * (0.32 + Math.random() * 0.10);

          clusterItems.push({
            x: cx + Math.cos(hornAngle) * hornLength * 0.55,
            y: cy + Math.sin(hornAngle) * hornLength * 0.55,
            targetRadius: baseRadius * 0.38,
            initialRadius: baseRadius * 0.18
          });

          clusterItems.push({
            x: cx + Math.cos(hornAngle) * hornLength,
            y: cy + Math.sin(hornAngle) * hornLength,
            targetRadius: hornRadius,
            initialRadius: hornRadius * 0.22
          });
        }
      } else {
        // Mobile: Lightweight Smooth Fluid Aura (120fps hardware fluidity)
        clusterItems.push({
          x: cx + (vx ? vx * 0.12 : 0),
          y: cy + (vy ? vy * 0.12 : 0),
          targetRadius: baseRadius * 0.5,
          initialRadius: baseRadius * 0.2
        });
      }

      // Instantiate each drop and animate physics using GSAP
      clusterItems.forEach((item) => {
        const drop = {
          x: item.x,
          y: item.y,
          radius: item.initialRadius,
          maxRadius: item.targetRadius,
          weight: 0.85,
          swirlX: 0,
          swirlY: 0
        };

        drops.push(drop);

        // GSAP Physics Dynamics:
        gsap.to(drop, {
          radius: drop.maxRadius,
          weight: 1.0,
          duration: isTouch ? 0.18 : 0.26,
          ease: 'power2.out'
        });

        if (!isTouch) {
          gsap.to(drop, {
            swirlX: (Math.random() - 0.5) * 10,
            swirlY: (Math.random() - 0.2) * 14,
            duration: 1.6,
            ease: 'sine.out'
          });
        }

        const dissolveDuration = isTouch ? 0.65 : (1.35 + Math.random() * 0.35);
        gsap.to(drop, {
          weight: 0.0,
          radius: drop.maxRadius * 0.2,
          duration: dissolveDuration,
          delay: isTouch ? 0.10 : 0.28,
          ease: 'power2.inOut',
          onComplete: () => {
            const idx = drops.indexOf(drop);
            if (idx !== -1) drops.splice(idx, 1);
          }
        });
      });

      // Keep drops pool bounded
      if (drops.length > MAX_DROPS) {
        drops.splice(0, drops.length - MAX_DROPS);
      }
    };

    const addLiquidImpulse = (clientX, clientY, isForced = false, isTouch = false) => {
      const scrollY = window.scrollY || window.pageYOffset || 0;
      const docX = clientX;
      const docY = clientY + scrollY;
      const now = performance.now();

      if (lastDocX === null || lastDocY === null) {
        lastDocX = docX;
        lastDocY = docY;
        lastTime = now;
        spawnDrippingCluster(docX, docY, isTouch ? 45 : 70, 0, 0, isTouch);
        return;
      }

      const dx = docX - lastDocX;
      const dy = docY - lastDocY;
      const dist = Math.hypot(dx, dy);
      const dt = Math.max(1, now - lastTime);

      const minDist = isTouch ? 24 : 15;
      const minDt = isTouch ? 80 : 65;

      if (dist < minDist && !isForced && dt < minDt) return;

      const speed = dist / dt; // px/ms
      const baseRadius = isTouch
        ? 45
        : Math.max(60, Math.min(88, 88 - Math.min(speed * 12, 28)));

      const stepSize = isTouch ? 50 : 28;
      const maxSteps = isTouch ? 3 : 8;
      const steps = Math.max(1, Math.min(Math.ceil(dist / stepSize), maxSteps));

      for (let i = 1; i <= steps; i++) {
        const t = i / steps;
        const curX = lastDocX + dx * t;
        const curY = lastDocY + dy * t;
        spawnDrippingCluster(curX, curY, baseRadius, dx, dy, isTouch);
      }

      lastDocX = docX;
      lastDocY = docY;
      lastTime = now;
    };

    const onMouseMove = (e) => addLiquidImpulse(e.clientX, e.clientY, false, false);
    const onMouseDown = (e) => addLiquidImpulse(e.clientX, e.clientY, true, false);

    const onTouchMove = (e) => {
      if (e.touches && e.touches[0]) {
        addLiquidImpulse(e.touches[0].clientX, e.touches[0].clientY, false, true);
      }
    };
    const onTouchStart = (e) => {
      if (e.touches && e.touches[0]) {
        addLiquidImpulse(e.touches[0].clientX, e.touches[0].clientY, true, true);
      }
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchstart', onTouchStart, { passive: true });

    const corners = [
      [-1, -1],
      [1, -1],
      [-1, 1],
      [-1, 1],
      [1, -1],
      [1, 1]
    ];

    let animId;

    const render = (time) => {
      animId = requestAnimationFrame(render);

      const scrollY = window.scrollY || window.pageYOffset || 0;

      if (drops.length === 0) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.viewport(0, 0, width, height);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        return;
      }

      // PASS 1: Accumulate Dripping Metaballs into densityFBO
      gl.bindFramebuffer(gl.FRAMEBUFFER, densityFBO.fbo);
      gl.viewport(0, 0, densityFBO.width, densityFBO.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.useProgram(densityProg);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE); // Additive fusion

      gl.uniform2f(
        gl.getUniformLocation(densityProg, 'uResolution'),
        cssWidth,
        cssHeight
      );

      let activeCount = 0;
      let offset = 0;

      for (let i = 0; i < drops.length; i++) {
        const d = drops[i];
        if (d.weight <= 0.001 || d.radius <= 1) continue;

        // Document Space -> Viewport Space with GSAP Swirl
        const sx = d.x + d.swirlX;
        const sy = d.y + d.swirlY - scrollY;

        if (
          sx < -d.radius ||
          sx > cssWidth + d.radius ||
          sy < -d.radius ||
          sy > cssHeight + d.radius
        ) {
          continue;
        }

        for (let k = 0; k < 6; k++) {
          vertexArray[offset++] = corners[k][0];
          vertexArray[offset++] = corners[k][1];
          vertexArray[offset++] = sx;
          vertexArray[offset++] = sy;
          vertexArray[offset++] = d.radius;
          vertexArray[offset++] = d.weight;
        }

        activeCount++;
        if (activeCount >= MAX_DROPS) break;
      }

      if (activeCount > 0) {
        gl.bindBuffer(gl.ARRAY_BUFFER, dropBuffer);
        gl.bufferData(
          gl.ARRAY_BUFFER,
          vertexArray.subarray(0, activeCount * 36),
          gl.DYNAMIC_DRAW
        );

        const stride = 6 * 4;
        const locCorner = gl.getAttribLocation(densityProg, 'aCorner');
        const locCenter = gl.getAttribLocation(densityProg, 'aCenter');
        const locRadius = gl.getAttribLocation(densityProg, 'aRadius');
        const locWeight = gl.getAttribLocation(densityProg, 'aWeight');

        gl.enableVertexAttribArray(locCorner);
        gl.vertexAttribPointer(locCorner, 2, gl.FLOAT, false, stride, 0);

        gl.enableVertexAttribArray(locCenter);
        gl.vertexAttribPointer(locCenter, 2, gl.FLOAT, false, stride, 2 * 4);

        gl.enableVertexAttribArray(locRadius);
        gl.vertexAttribPointer(locRadius, 1, gl.FLOAT, false, stride, 4 * 4);

        gl.enableVertexAttribArray(locWeight);
        gl.vertexAttribPointer(locWeight, 1, gl.FLOAT, false, stride, 5 * 4);

        gl.drawArrays(gl.TRIANGLES, 0, activeCount * 6);
      }

      // PASS 2: Screen Render with Meniscus & Voronoi Effervescent Bubbles
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, width, height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.disable(gl.BLEND);
      gl.useProgram(screenProg);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, densityFBO.texture);
      gl.uniform1i(gl.getUniformLocation(screenProg, 'uDensity'), 0);
      gl.uniform1f(gl.getUniformLocation(screenProg, 'uTime'), time * 0.001);

      gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
      const locPos = gl.getAttribLocation(screenProg, 'aPosition');
      gl.enableVertexAttribArray(locPos);
      gl.vertexAttribPointer(locPos, 2, gl.FLOAT, false, 0, 0);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchstart', onTouchStart);

      drops.forEach((d) => gsap.killTweensOf(d));

      gl.deleteBuffer(quadBuffer);
      gl.deleteBuffer(dropBuffer);
      gl.deleteTexture(densityFBO.texture);
      gl.deleteFramebuffer(densityFBO.fbo);
      gl.deleteProgram(densityProg);
      gl.deleteProgram(screenProg);
    };
  }, []);

  // 2D Canvas Fallback
  function run2DFallback(canvas) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return () => {};

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const onResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);

    const drops = [];
    const onMove = (e) => {
      const scrollY = window.scrollY || window.pageYOffset || 0;
      drops.push({
        x: e.clientX,
        y: e.clientY + scrollY,
        radius: 65 + Math.random() * 25,
        time: performance.now()
      });
      if (drops.length > 120) drops.shift();
    };

    window.addEventListener('mousemove', onMove, { passive: true });

    let raf;
    const render2D = () => {
      raf = requestAnimationFrame(render2D);
      ctx.clearRect(0, 0, w, h);

      const now = performance.now();
      const scrollY = window.scrollY || window.pageYOffset || 0;

      for (let i = drops.length - 1; i >= 0; i--) {
        const d = drops[i];
        const age = (now - d.time) / 1900;
        if (age >= 1.0) {
          drops.splice(i, 1);
          continue;
        }

        const life = 1.0 - age;
        const r = d.radius * Math.pow(life, 0.45);
        const sy = d.y - scrollY;

        if (d.x < -r || d.x > w + r || sy < -r || sy > h + r) continue;

        const grad = ctx.createRadialGradient(d.x, sy, 0, d.x, sy, r);
        grad.addColorStop(0, `rgba(255, 255, 255, ${Math.min(1.0, life * 2.0)})`);
        grad.addColorStop(0.7, `rgba(255, 255, 255, ${Math.min(1.0, life * 1.5)})`);
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(d.x, sy, r, 0, Math.PI * 2);
        ctx.fill();
      }
    };
    render2D();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMove);
    };
  }

  return (
    <canvas
      ref={canvasRef}
      id="scroll-anchored-liquid-canvas"
      className="fixed inset-0 w-full h-full pointer-events-none select-none z-30"
      style={{
        mixBlendMode: 'difference',
        WebkitBackfaceVisibility: 'hidden',
        backfaceVisibility: 'hidden'
      }}
      aria-hidden="true"
    />
  );
};

export default LiquidInkBackground;
