import React, { useRef, useState } from 'react';
import { playHoverSound } from '../utils/audio';

const TiltCard = ({
  children,
  className = '',
  maxTilt = 10,
  scale = 1.02,
  perspective = 1000,
  glare = true,
  onClick,
  ...props
}) => {
  const cardRef = useRef(null);
  const [style, setStyle] = useState({});
  const [glareStyle, setGlareStyle] = useState({ opacity: 0 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = -((y - centerY) / centerY) * maxTilt;
    const rotateY = ((x - centerX) / centerX) * maxTilt;

    setStyle({
      transform: `perspective(${perspective}px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(${scale}, ${scale}, ${scale})`,
      transition: 'transform 0.1s ease-out'
    });

    if (glare) {
      const glareX = (x / rect.width) * 100;
      const glareY = (y / rect.height) * 100;
      setGlareStyle({
        opacity: 0.25,
        background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.4) 0%, rgba(0,240,255,0.15) 35%, rgba(0,0,0,0) 70%)`,
        transition: 'opacity 0.2s ease-out'
      });
    }
  };

  const handleMouseEnter = () => {
    playHoverSound();
  };

  const handleMouseLeave = () => {
    setStyle({
      transform: `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`,
      transition: 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)'
    });
    if (glare) {
      setGlareStyle({
        opacity: 0,
        transition: 'opacity 0.5s ease-out'
      });
    }
  };

  return (
    <div
      ref={cardRef}
      className={`tilt-card-container relative transform-gpu will-change-transform ${className}`}
      style={style}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      {...props}
    >
      {glare && (
        <div
          className="card-glare absolute inset-0 rounded-inherit pointer-events-none z-20 overflow-hidden"
          style={glareStyle}
          aria-hidden="true"
        />
      )}
      {children}
    </div>
  );
};

export default TiltCard;
