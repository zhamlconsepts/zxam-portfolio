import React, { useState, useEffect, useRef } from 'react';
import { playHoverSound } from '../utils/audio';

const CHAR_SETS = {
  matrix: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_#@&%',
  tech: '01<>{}[]_/*~+=#',
  cyber: 'ΔΩΨΣΠΞΘΛΦ01XYZ',
  binary: '01010110',
  glitch: 'ABCDEFXYZ012345!@#$%^&*()_+'
};

/**
 * Creative Interactive Text Hover Component
 * - Scrambles, glitches, or dynamically resolves letters on hover.
 * - Supports multiple creative variants: matrix, cyber, tech, binary, glitch, bracket.
 * - Preserves spaces and punctuation cleanly.
 */
export const ScrambleText = ({
  text = '',
  as: Component = 'span',
  className = '',
  variant = 'matrix',
  speed = 28,
  glowOnHover = true,
  onClick,
  ...props
}) => {
  const [displayText, setDisplayText] = useState(text);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef(null);

  // Sync when prop text changes (e.g. language toggle)
  useEffect(() => {
    setDisplayText(text);
  }, [text]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const handleMouseEnter = () => {
    setIsHovered(true);
    playHoverSound();

    if (variant === 'bracket') {
      setDisplayText(`[ ${text} ]`);
      return;
    }

    const chars = CHAR_SETS[variant] || CHAR_SETS.matrix;
    let iteration = 0;
    const originalText = String(text);

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setDisplayText(
        originalText
          .split('')
          .map((letter, index) => {
            if (letter === ' ') return ' ';
            if (index < iteration) {
              return originalText[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('')
      );

      if (iteration >= originalText.length) {
        clearInterval(intervalRef.current);
        setDisplayText(originalText);
      }
      iteration += 1 / 2;
    }, speed);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (variant === 'bracket') {
      setDisplayText(text);
    }
  };

  return (
    <Component
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={`inline-block transition-all duration-300 select-none ${
        isHovered && glowOnHover ? 'text-[#e60000] drop-shadow-[0_0_15px_rgba(230,0,0,0.65)]' : ''
      } ${className}`}
      {...props}
    >
      {displayText}
    </Component>
  );
};

export default ScrambleText;
