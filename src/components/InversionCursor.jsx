import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { playHoverSound, playClickSound } from '../utils/audio';

/**
 * High-Definition Colorless Hand ("Qo'lcha") & Delta Arrow Cursor
 * - Default State: Aerodynamic delta arrow rotating with movement vector.
 * - Interactive Hover State: High-Definition Colorless Pointing Hand ("Qo'lcha"):
 *   * Ultra-crisp vector linework with index finger pointing up-left.
 *   * Hotspot precisely at index fingertip.
 *   * Monochromatic pure white with `mix-blend-mode: difference` (inverts cleanly on all surfaces).
 *   * Tactile pressing gesture on click with physical Button Down (heavier) & Button Up (lighter) feedback.
 *   * Futuristic UI liquid glass droplet hover sound on interactive elements.
 * - Card Hover State ('view'): High-definition hand paired with subtle brutalist `[ VIEW ↗ ]` badge.
 * - 100% suppression of native OS cursors, text carets, and selection boxes.
 * - Mounted via Portal to document.body (zIndex 2147483647).
 */
const InversionCursor = () => {
  const cursorRef = useRef(null);
  const arrowRef = useRef(null);

  const [cursorState, setCursorState] = useState('default'); // 'default', 'hover', 'view'
  const [isClicked, setIsClicked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouch, setIsTouch] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(hover: none) and (pointer: coarse)').matches || window.innerWidth < 768;
    }
    return false;
  });

  useEffect(() => {
    // Only enable on desktop pointer devices
    const checkTouch = () => {
      return window.matchMedia('(hover: none) and (pointer: coarse)').matches || window.innerWidth < 768;
    };

    if (checkTouch()) {
      setIsTouch(true);
      document.documentElement.style.cursor = '';
      document.body.style.cursor = '';
      return;
    }

    setIsTouch(false);
    // Enforce cursor suppression on document root
    document.documentElement.style.cursor = 'none';
    document.body.style.cursor = 'none';

    let mouseX = -100;
    let mouseY = -100;
    let prevMouseX = -100;
    let prevMouseY = -100;

    let currentX = -100;
    let currentY = -100;

    let currentAngle = -120;
    let targetAngle = -120; // Default up-left resting angle

    let animId;
    let restTimer = null;

    const onMouseMove = (e) => {
      prevMouseX = mouseX;
      prevMouseY = mouseY;
      mouseX = e.clientX;
      mouseY = e.clientY;

      setIsVisible(true);

      const dx = mouseX - prevMouseX;
      const dy = mouseY - prevMouseY;
      const speed = Math.sqrt(dx * dx + dy * dy);

      // Rotate arrow toward movement vector when active
      if (speed > 1.2) {
        targetAngle = (Math.atan2(dy, dx) * 180) / Math.PI;

        clearTimeout(restTimer);
        restTimer = setTimeout(() => {
          targetAngle = -120; // Relax back to default slant
        }, 350);
      }
    };

    const render = () => {
      // Smooth position spring interpolation (fast, snappy 0.40 lerp)
      currentX += (mouseX - currentX) * 0.4;
      currentY += (mouseY - currentY) * 0.4;

      // Shortest-path angle interpolation
      let angleDiff = targetAngle - currentAngle;
      while (angleDiff < -180) angleDiff += 360;
      while (angleDiff > 180) angleDiff -= 360;
      currentAngle += angleDiff * 0.25;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      }

      if (arrowRef.current) {
        arrowRef.current.style.transform = `rotate(${currentAngle.toFixed(2)}deg)`;
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    const onMouseOver = (e) => {
      const target = e.target;
      if (!target) return;

      const projectCard = target.closest('#projects img, .group\\/img, [data-project-media]');
      const interactiveBtn = target.closest(
        'button, a, input, textarea, select, [role="button"], .cursor-pointer, .interactive-target, nav a, .tag-pill'
      );
      const textHeading = target.closest('h1 span, h2, h3, .hover-target');

      if (projectCard && !interactiveBtn) {
        setCursorState((prev) => {
          if (prev !== 'view') playHoverSound();
          return 'view';
        });
      } else if (interactiveBtn) {
        setCursorState((prev) => {
          if (prev !== 'hover') playHoverSound();
          return 'hover';
        });
      } else {
        setCursorState('default');
      }
    };

    const onMouseDown = (e) => {
      setIsClicked(true);
      // Only play subtle click when pressing actual interactive targets
      if (e.target && e.target.closest('button, a, [role="button"], .cursor-pointer')) {
        playClickSound();
      }
    };
    const onMouseUp = () => setIsClicked(false);
    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    // Prevent native drag ghosting & text selection carets
    const onDragStart = (e) => e.preventDefault();
    const onSelectStart = (e) => {
      if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
      e.preventDefault();
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseover', onMouseOver);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);
    window.addEventListener('dragstart', onDragStart);
    document.addEventListener('selectstart', onSelectStart);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      window.removeEventListener('dragstart', onDragStart);
      document.removeEventListener('selectstart', onSelectStart);
      clearTimeout(restTimer);
    };
  }, []);

  const isHovering = cursorState === 'hover' || cursorState === 'view';

  if (isTouch) {
    return null;
  }

  return createPortal(
    <div
      ref={cursorRef}
      id="hand-inversion-cursor"
      className={`fixed top-0 left-0 pointer-events-none select-none will-change-transform transition-opacity duration-150 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{
        zIndex: 2147483647,
        mixBlendMode: 'difference'
      }}
      aria-hidden="true"
    >
      {/* Click compression physics */}
      <div
        className={`relative flex items-center justify-center transition-transform duration-150 ease-out ${
          isClicked ? 'scale-90 translate-y-0.5' : 'scale-100'
        }`}
      >
        {/* STATE A: Aerodynamic Delta Arrow (Default Navigation) */}
        <div
          ref={arrowRef}
          className={`absolute -top-3 -left-3 transition-all duration-200 ease-out ${
            isHovering ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'
          }`}
          style={{
            transformOrigin: '24px 12px'
          }}
        >
          <svg
            width="28"
            height="24"
            viewBox="0 0 600 500"
            fill="none"
            className="drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
          >
            <path
              d="M530 225C555 237 555 263 530 275L112 475C76 492 40 462 50 423L181 269C190 258 190 242 181 231L50 77C40 38 76 8 112 25L530 225Z"
              fill="white"
              stroke="white"
              strokeWidth="10"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* STATE B: High-Definition Colorless Pointing Hand ("Qo'lcha") */}
        {/* Hotspot positioned precisely at index fingertip: -left-[6px] -top-[2px] */}
        <div
          className={`absolute -left-[6px] -top-[2px] transition-all duration-200 ease-out ${
            isHovering
              ? 'scale-100 opacity-100'
              : 'scale-0 opacity-0 pointer-events-none'
          }`}
          style={{
            transformOrigin: '6px 2px'
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]"
          >
            {/* High-Definition Luxury Pointing Hand (Apple/Figma Vector Ergonomics) */}
            <path
              d="M10 2a1.5 1.5 0 0 0-1.5 1.5v7.2l-1.32-1.05a1.5 1.5 0 0 0-2.1.28c-.37.43-.33 1.08.1 1.45l3.78 3.38c1 .9 2.3 1.39 3.64 1.39h3.26A4.14 4.14 0 0 0 20 12.11V8.5a1.5 1.5 0 0 0-3 0v1h-1v-3a1.5 1.5 0 0 0-3 0v3h-1V5.5a1.5 1.5 0 0 0-3 0V9.5h-1V3.5A1.5 1.5 0 0 0 10 2z"
              fill="white"
              stroke="rgba(0,0,0,0.3)"
              strokeWidth="0.8"
              strokeLinejoin="round"
            />
            {/* Subtle index finger knuckle detail */}
            <line x1="8.5" y1="6" x2="10" y2="6" stroke="rgba(0,0,0,0.15)" strokeWidth="0.5" />
          </svg>

          {/* Optional minimal [ VIEW ↗ ] badge when hovering project media */}
          {cursorState === 'view' && (
            <div className="absolute left-6 top-2 px-2.5 py-0.5 rounded-full border border-white/80 bg-white/20 backdrop-blur-[3px] shadow-[0_0_12px_rgba(255,255,255,0.3)]">
              <span className="font-mono text-[8px] font-bold tracking-[0.2em] text-white uppercase whitespace-nowrap">
                VIEW ↗
              </span>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default InversionCursor;
