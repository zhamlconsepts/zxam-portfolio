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
    const typingSpeed = isDeleting ? 20 : 50;

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
      className="relative min-h-screen pt-24 sm:pt-28 lg:pt-32 pb-16 lg:pb-24 flex items-center justify-center overflow-hidden"
    >
      {/* Subtle ambient lighting glows */}
      <div className="absolute top-1/4 left-1/4 w-[280px] sm:w-[500px] h-[280px] sm:h-[500px] bg-[#e60000]/10 rounded-full blur-[100px] sm:blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-white/[0.02] rounded-full blur-[120px] sm:blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 xl:gap-12 items-center">
          
          {/* Left Column: 100% Unclipped Typography, Live Typewriter, Buttons (7 cols) */}
          <div className="lg:col-span-7 xl:col-span-7 flex flex-col items-start text-left z-20 w-full">
            
            {/* Live Status - Editorial Text */}
            <div className="hero-badge-entry flex flex-wrap items-center gap-2 sm:gap-3 font-mono text-[11px] sm:text-xs mb-4 sm:mb-6 tracking-widest uppercase">
              <span className="w-2 h-2 rounded-full bg-[#e60000] animate-ping" />
              <span className="text-white font-bold">// {t.badgeStatus ? t.badgeStatus.toUpperCase() : 'ISH VA LOYIHALAR UCHUN OCHIQ'}</span>
              <span className="text-zinc-600 hidden sm:inline">&bull;</span>
              <span className="text-[#e60000] font-semibold">{t.badgeLocation || 'GULISTON ( UZ )'}</span>
            </div>

            {/* Giant Razor-Sharp Headline (100% Fully Visible, No Cutting!) */}
            <div className="mb-3 select-none w-full">
              <h1 className="text-[34px] xs:text-[42px] sm:text-6xl md:text-7xl lg:text-[62px] xl:text-[76px] 2xl:text-[88px] font-black font-editorial tracking-tight uppercase leading-[0.92] text-white">
                <span
                  onMouseEnter={() => scramble('ABLAKIMOV', setHeadlineText1)}
                  className="hero-title-entry block hover:text-[#e60000] transition-colors duration-300 cursor-crosshair tracking-tight"
                >
                  {headlineText1}
                </span>
                <span
                  onMouseEnter={() => scramble('JAMSHID', setHeadlineText2)}
                  className="hero-title-entry block mt-1 text-zinc-200 hover:text-[#e60000] transition-colors duration-300 cursor-crosshair tracking-tight"
                >
                  {headlineText2}
                </span>
              </h1>
            </div>

            {/* Prominent Live Typewriter Terminal Line */}
            <div className="hero-typewriter-entry my-4 sm:my-5 w-full">
              <div className="min-h-[36px] sm:h-12 flex items-center">
                <div className="font-mono text-sm sm:text-lg lg:text-xl xl:text-2xl text-white font-bold tracking-tight flex items-center gap-2 whitespace-nowrap overflow-hidden">
                  <span className="text-[#e60000] shrink-0">&gt;</span>
                  <span className="text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">{displayText}</span>
                  <span className="inline-block w-2 sm:w-2.5 h-4 sm:h-6 bg-[#e60000] animate-blink shrink-0" />
                </div>
              </div>
              <div className="font-mono text-[10px] sm:text-xs text-zinc-500 uppercase tracking-widest mt-1 select-none">
                // SPECIALIZING IN REACT.JS, TAILWIND CSS & HIGH-PERFORMANCE WEB APPS
              </div>
            </div>

            {/* Bio Paragraph */}
            <p className="hero-bio-entry text-sm sm:text-base lg:text-base xl:text-lg leading-relaxed text-zinc-300 max-w-xl mb-6 sm:mb-8 font-sans">
              {t.heroBio || "React.js, Tailwind CSS va zamonaviy JavaScript yordamida tezkor, toza arxitekturali va interaktiv veb-ilovalarni yarataman. Foydalanuvchi tajribasi (UX) va vizual mukammallik men uchun ustuvor."}
            </p>

            {/* Clean Typographic Tech Specs */}
            <div className="hero-tech-entry flex flex-wrap items-center gap-x-3 gap-y-1.5 sm:gap-x-4 sm:gap-y-2 mb-8 sm:mb-10 font-mono text-[11px] sm:text-xs text-zinc-400">
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

            {/* Action Buttons (Full-Width on Mobile, Inline on Desktop) */}
            <div className="hero-actions-entry flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-8 sm:mb-10 w-full sm:w-auto">
              <a
                href="#projects"
                onClick={playClickSound}
                className="group inline-flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 bg-white text-black hover:bg-[#e60000] hover:text-white font-mono text-xs uppercase tracking-widest font-bold transition-all duration-300 shadow-[0_10px_30px_rgba(255,255,255,0.1)] hover:-translate-y-0.5 cursor-pointer text-center"
              >
                <span>{t.btnExploreProjects || "LOYIHALARNI KO'RISH"}</span>
                <ArrowDown className="w-4 h-4 transition-transform group-hover:translate-y-1" />
              </a>

              <a
                href="#contact"
                onClick={playClickSound}
                className="inline-flex items-center justify-center gap-2.5 px-6 sm:px-7 py-3.5 sm:py-4 border border-white/20 hover:border-white text-white hover:bg-white/10 font-mono text-xs uppercase tracking-widest transition-all duration-300 hover:-translate-y-0.5 cursor-pointer text-center"
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
                  className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3.5 sm:py-4 border border-[#e60000]/40 hover:border-[#e60000] text-white hover:bg-[#e60000]/10 font-mono text-xs uppercase tracking-widest transition-all duration-300 cursor-pointer text-center"
                >
                  <FileText className="w-4 h-4 text-[#e60000]" />
                  <span>{t.btnResume || "CV KO'RISH"}</span>
                </button>
              )}
            </div>

            {/* Quick Links */}
            <div className="hero-links-entry flex flex-wrap items-center gap-4 sm:gap-6 pt-4 sm:pt-6 border-t border-white/10 font-mono text-[11px] sm:text-xs text-zinc-400">
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

          {/* Right Column: Jamshid Portrait + Red "ZXAM" Typography (5 cols, Strictly Contained!) */}
          <div className="hero-portrait-entry lg:col-span-5 xl:col-span-5 relative flex flex-col justify-center items-center z-10 w-full">
            {/* Ambient backlight */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 sm:w-80 sm:h-80 lg:w-[380px] lg:h-[380px] rounded-full bg-[#e60000]/20 blur-[100px] pointer-events-none" />

            {/* Jamshid Portrait Container */}
            <div className="relative w-full max-w-[300px] sm:max-w-[360px] lg:max-w-[400px] xl:max-w-[440px] flex justify-center items-center">
              
              {/* Giant Red "ZXAM" Typographic Backdrop (Centered Behind Photo ONLY) */}
              <div 
                className="absolute top-[34%] sm:top-[36%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-full z-0 pointer-events-none select-none flex flex-col items-center justify-center text-center px-1"
                aria-hidden="true"
              >
                <span className="font-editorial font-black text-[#e60000] text-[65px] sm:text-[90px] lg:text-[100px] xl:text-[120px] leading-none tracking-tight uppercase select-none drop-shadow-[0_0_35px_rgba(230,0,0,0.85)] scale-y-105 whitespace-nowrap">
                  ZXAM
                </span>
                <span className="font-mono text-[8px] sm:text-[10px] text-[#e60000] tracking-[0.3em] uppercase mt-1 font-bold drop-shadow-[0_0_8px_rgba(230,0,0,0.8)]">
                  // IDENTITY: ZXAM
                </span>
              </div>

              {/* Large Heroic Portrait (High Definition, Correctly Scaled) */}
              <img
                src="/assets/jamshid.png"
                alt="Ablakimov Jamshid (zxam) - Frontend Developer"
                className="relative z-10 w-full h-auto max-h-[480px] sm:max-h-[540px] lg:max-h-[580px] xl:max-h-[620px] object-contain filter contrast-[1.05] drop-shadow-[0_20px_50px_rgba(0,0,0,0.95)] select-none pointer-events-none"
                loading="eager"
              />
            </div>

            {/* Editorial Caption */}
            <div className="mt-4 sm:mt-6 flex items-center gap-2.5 font-mono text-[11px] sm:text-xs uppercase tracking-widest text-zinc-400 z-20">
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
