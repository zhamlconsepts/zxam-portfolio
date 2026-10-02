import React, { useState, useEffect } from 'react';
import { ArrowDown, ArrowUpRight, FileText } from 'lucide-react';
import { GithubIcon, TelegramIcon } from './Icons';
import { playClickSound, playHoverSound } from '../utils/audio';
import ScrambleText from './ScrambleText';

const TYPING_PHRASES = [
  "JUNIOR FRONTEND DEVELOPER",
  "REACT.JS & TAILWIND ARCHITECT",
  "FIGMA TO PIXEL-PERFECT CODE",
  "MODERN & INTERACTIVE WEB APPS",
  "GIT, GITHUB & VERCEL CI/CD"
];

const Hero = ({ onOpenCV, t }) => {
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Scramble text state on hover
  const [headlineText1, setHeadlineText1] = useState('ABLAKIMOV');
  const [headlineText2, setHeadlineText2] = useState('JAMSHID');

  const scramble = (originalText, setText) => {
    playHoverSound();
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_#@&%';
    let iteration = 0;
    const interval = setInterval(() => {
      setText(
        originalText
          .split('')
          .map((letter, index) => {
            if (index < iteration) {
              return originalText[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('')
      );

      if (iteration >= originalText.length) {
        clearInterval(interval);
      }
      iteration += 1 / 2;
    }, 25);
  };

  useEffect(() => {
    const currentPhrase = TYPING_PHRASES[phraseIdx];
    const typingSpeed = isDeleting ? 20 : 55;

    const timer = setTimeout(() => {
      if (!isDeleting) {
        if (displayText.length < currentPhrase.length) {
          setDisplayText(currentPhrase.slice(0, displayText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), 2200);
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(currentPhrase.slice(0, displayText.length - 1));
        } else {
          setIsDeleting(false);
          setPhraseIdx((prev) => (prev + 1) % TYPING_PHRASES.length);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, phraseIdx]);

  return (
    <section
      id="hero"
      className="relative min-h-screen pt-32 pb-20 lg:pt-36 lg:pb-24 flex items-center justify-center overflow-hidden"
    >
      {/* Subtle ambient lighting glows */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#e60000]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[600px] h-[600px] bg-white/[0.02] rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Typography, Real Typewriter Effect, Actions (6 cols max-w-xl) */}
          <div className="lg:col-span-6 xl:col-span-6 flex flex-col items-start text-left z-20 max-w-xl">
            
            {/* Live Status - Editorial Text */}
            <div className="hero-badge-entry flex items-center gap-3 font-mono text-xs mb-6 tracking-widest uppercase">
              <span className="w-2 h-2 rounded-full bg-[#e60000] animate-ping" />
              <span className="text-white font-bold">// {t.badgeStatus ? t.badgeStatus.toUpperCase() : 'ISH VA LOYIHALAR UCHUN OCHIQ'}</span>
              <span className="text-zinc-600">&bull;</span>
              <span className="text-[#e60000] font-semibold">{t.badgeLocation || 'GULISTON ( UZ )'}</span>
            </div>

            {/* Giant Razor-Sharp Headline with Interactive Hover Scrambler */}
            <div className="mb-2 select-none overflow-hidden">
              <h1 className="text-5xl sm:text-7xl md:text-8xl xl:text-9xl font-black font-editorial tracking-tighter uppercase leading-[0.88] text-white">
                <span
                  onMouseEnter={() => scramble('ABLAKIMOV', setHeadlineText1)}
                  className="hero-title-entry block hover:text-[#e60000] transition-colors duration-300 cursor-crosshair"
                >
                  {headlineText1}
                </span>
                <span
                  onMouseEnter={() => scramble('JAMSHID', setHeadlineText2)}
                  className="hero-title-entry block mt-1 sm:mt-2 text-zinc-200 hover:text-[#e60000] transition-colors duration-300 cursor-crosshair"
                >
                  {headlineText2}
                </span>
              </h1>
            </div>

            {/* Prominent Live Typewriter Terminal Line - FIXED HEIGHT to eliminate layout shifts */}
            <div className="hero-typewriter-entry my-6 w-full">
              <div className="h-12 sm:h-14 lg:h-16 flex items-center">
                <div className="font-mono text-lg sm:text-2xl lg:text-3xl text-white font-bold tracking-tight flex items-center gap-2 whitespace-nowrap overflow-hidden">
                  <span className="text-[#e60000] shrink-0">&gt;</span>
                  <span className="text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.2)] truncate">{displayText}</span>
                  <span className="inline-block w-2.5 h-6 sm:h-7 bg-[#e60000] animate-blink shrink-0" />
                </div>
              </div>
              <div className="font-mono text-xs text-zinc-500 uppercase tracking-widest mt-1 select-none">
                // SPECIALIZING IN REACT.JS, TAILWIND CSS & HIGH-PERFORMANCE WEB APPS
              </div>
            </div>

            {/* Bio Paragraph */}
            <p className="hero-bio-entry text-base sm:text-lg leading-relaxed text-zinc-300 max-w-xl mb-8 font-sans">
              {t.heroBio || "React.js, Tailwind CSS va zamonaviy JavaScript yordamida tezkor, toza arxitekturali va interaktiv veb-ilovalarni yarataman. Foydalanuvchi tajribasi (UX) va vizual mukammallik men uchun ustuvor."}
            </p>

            {/* Clean Typographic Tech Specs */}
            <div className="hero-tech-entry flex flex-wrap items-center gap-x-4 gap-y-2 mb-10 font-mono text-xs text-zinc-400">
              <ScrambleText text="REACT.JS" variant="tech" className="text-white font-semibold" />
              <span className="text-zinc-600">/</span>
              <ScrambleText text="TAILWIND CSS" variant="tech" className="text-white font-semibold" />
              <span className="text-zinc-600">/</span>
              <ScrambleText text="JAVASCRIPT ES6+" variant="tech" className="text-white font-semibold" />
              <span className="text-zinc-600">/</span>
              <ScrambleText text="VITE" variant="tech" className="text-white font-semibold" />
              <span className="text-zinc-600">/</span>
              <ScrambleText text="FIGMA" variant="tech" className="text-white font-semibold" />
              <span className="text-zinc-600">/</span>
              <ScrambleText text="VERCEL" variant="tech" className="text-white font-semibold" />
            </div>

            {/* Action Buttons */}
            <div className="hero-actions-entry flex flex-wrap items-center gap-4 mb-10">
              <a
                href="#projects"
                onClick={playClickSound}
                className="group inline-flex items-center gap-2.5 px-8 py-4 bg-white text-black hover:bg-[#e60000] hover:text-white font-mono text-xs uppercase tracking-widest font-bold transition-all duration-300 shadow-[0_10px_30px_rgba(255,255,255,0.1)] hover:-translate-y-0.5 cursor-pointer"
              >
                <span>{t.btnExploreProjects || "LOYIHALARNI KO'RISH"}</span>
                <ArrowDown className="w-4 h-4 transition-transform group-hover:translate-y-1" />
              </a>

              <a
                href="#contact"
                onClick={playClickSound}
                className="inline-flex items-center gap-2.5 px-7 py-4 border border-white/20 hover:border-white text-white hover:bg-white/10 font-mono text-xs uppercase tracking-widest transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
              >
                <span>{t.btnGetInTouch || "BOG'LANISH"}</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>

              {onOpenCV && (
                <button
                  onClick={() => {
                    playClickSound();
                    onOpenCV();
                  }}
                  className="inline-flex items-center gap-2 px-6 py-4 border border-[#e60000]/40 hover:border-[#e60000] text-white hover:bg-[#e60000]/10 font-mono text-xs uppercase tracking-widest transition-all duration-300 cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-[#e60000]" />
                  <span>{t.btnResume || "CV KO'RISH"}</span>
                </button>
              )}
            </div>

            {/* Quick Links: Telegram & GitHub only (abdusalomovv.uz removed) */}
            <div className="hero-links-entry flex flex-wrap items-center gap-6 pt-6 border-t border-white/10 font-mono text-xs text-zinc-400">
              <span className="text-zinc-500 uppercase">// ALOQA:</span>
              <a
                href="https://t.me/jamwidunvrsl"
                target="_blank"
                rel="noopener noreferrer"
                onClick={playClickSound}
                className="hover:text-white flex items-center gap-1.5 transition-colors"
              >
                <TelegramIcon className="w-3.5 h-3.5 text-[#e60000]" />
                <span>TELEGRAM (@jamwidunvrsl)</span>
              </a>
              <a
                href="https://github.com/zhamlconsepts"
                target="_blank"
                rel="noopener noreferrer"
                onClick={playClickSound}
                className="hover:text-white flex items-center gap-1.5 transition-colors"
              >
                <GithubIcon className="w-3.5 h-3.5" />
                <span>GITHUB (zhamlconsepts)</span>
              </a>
            </div>

          </div>

          {/* Right Column: Jamshid Portrait - ZOOMED IN, HEROIC, UNOBSTRUCTED BY TEXT */}
          <div className="hero-portrait-entry lg:col-span-6 xl:col-span-6 relative flex flex-col justify-center items-center lg:items-end z-10 velocity-skew will-change-transform">
            {/* Ambient backlight */}
            <div className="absolute top-12 w-80 h-80 sm:w-[420px] sm:h-[420px] rounded-full bg-[#e60000]/25 blur-[120px] pointer-events-none" />

            {/* Jamshid Portrait - Zoomed In (scale-120/125), High-Definition & Fully Clear */}
            <div className="relative w-full max-w-md sm:max-w-lg lg:max-w-xl flex justify-center lg:justify-end overflow-visible">
              
              {/* Giant Red "ZXAM" Typographic Backdrop Behind Portrait */}
              <div 
                className="absolute top-[36%] sm:top-[38%] left-1/2 lg:left-[52%] -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none select-none flex flex-col items-center justify-center w-full"
                aria-hidden="true"
              >
                <span className="font-editorial font-black text-[#e60000] text-[130px] sm:text-[180px] md:text-[230px] lg:text-[260px] xl:text-[310px] leading-none tracking-tighter uppercase select-none drop-shadow-[0_0_55px_rgba(230,0,0,0.9)] scale-y-105">
                  ZXAM
                </span>
                <span className="font-mono text-[11px] sm:text-xs text-[#e60000]/90 tracking-[0.35em] uppercase -mt-3 sm:-mt-5 font-bold drop-shadow-[0_0_12px_rgba(230,0,0,0.8)]">
                  // IDENTITY: ZXAM
                </span>
              </div>

              <img
                src="/assets/jamshid.png"
                alt="Ablakimov Jamshid (zxam) - Junior Frontend Developer"
                className="relative z-10 w-full h-auto max-h-[700px] sm:max-h-[780px] lg:max-h-[860px] scale-115 sm:scale-120 lg:scale-125 xl:scale-130 origin-bottom object-contain filter contrast-[1.05] drop-shadow-[0_25px_70px_rgba(0,0,0,0.98)] select-none pointer-events-none"
                loading="eager"
              />
            </div>

            {/* Editorial Caption */}
            <div className="mt-6 flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-zinc-400">
              <span className="w-2 h-2 rounded-full bg-[#e60000]" />
              <span className="text-white font-bold">ABLAKIMOV JAMSHID (ZXAM)</span>
              <span className="text-zinc-600">//</span>
              <span>GULISTON, UZ &bull; 2026</span>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;

