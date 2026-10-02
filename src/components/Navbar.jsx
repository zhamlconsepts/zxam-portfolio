import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { playClickSound, setSoundEnabled, playHoverSound } from '../utils/audio';
import ScrambleText from './ScrambleText';

const Navbar = ({ lang, setLang, t, onOpenCV }) => {
  const [soundOn, setSoundOn] = useState(true);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'about', 'skills', 'projects', 'experience', 'contact'];
      const scrollPos = window.scrollY + 250;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleSound = () => {
    const nextState = !soundOn;
    setSoundOn(nextState);
    setSoundEnabled(nextState);
    if (nextState) {
      setTimeout(playClickSound, 50);
    }
  };

  const setLanguage = (newLang) => {
    playClickSound();
    setLang(newLang);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 pointer-events-none px-6 sm:px-10 lg:px-14 py-6 sm:py-8 font-mono text-xs uppercase tracking-wider text-[#ffffff]">
      <div className="flex items-start justify-between w-full">
        
        {/* Left: Clean Brand Logo */}
        <div className="pointer-events-auto">
          <a
            href="#hero"
            onClick={playClickSound}
            className="group block"
            aria-label="Ablakimov Jamshid (zxam) Home"
          >
            <ScrambleText
              text="ABLAKIMOV"
              variant="matrix"
              className="font-editorial font-bold text-base sm:text-lg tracking-tight uppercase group-hover:text-[#e60000]"
            />
            <span className="block text-[10px] text-[#888888] tracking-widest mt-0.5 group-hover:text-[#ffffff] transition-colors">
              <ScrambleText text="FRONTEND ARCHITECT" variant="tech" />
            </span>
          </a>
        </div>

        {/* Center: "CONTACT US" (Direct Link) */}
        <div className="pointer-events-auto hidden md:block">
          <a
            href="#contact"
            onClick={playClickSound}
            className="group relative inline-block text-xs uppercase tracking-widest text-[#ffffff] hover:text-[#e60000] transition-colors py-1"
          >
            <ScrambleText text={t.btnContactUs || 'CONTACT US'} variant="matrix" />
            <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#e60000] group-hover:w-full transition-all duration-300" />
          </a>
        </div>

        {/* Right: Vertical Navigation Menu (HOME, BAND MEMBERS / ROLES, RECORDS, CV) Aligned Right */}
        <div className="pointer-events-auto flex flex-col items-end text-right space-y-1.5 sm:space-y-2">
          {/* Vertical Menu Items */}
          <a
            href="#hero"
            onClick={playClickSound}
            className={`transition-colors tracking-widest ${
              activeSection === 'hero' ? 'text-[#e60000] font-bold' : 'text-[#ffffff] hover:text-[#e60000]'
            }`}
          >
            <ScrambleText text={lang === 'uz' ? 'BOSH SAHIFA' : lang === 'ru' ? 'ГЛАВНАЯ' : 'HOME'} variant="tech" />
          </a>

          <a
            href="#about"
            onClick={playClickSound}
            className={`transition-colors tracking-widest ${
              activeSection === 'about' ? 'text-[#e60000] font-bold' : 'text-[#ffffff] hover:text-[#e60000]'
            }`}
          >
            <ScrambleText text={lang === 'uz' ? 'HAQIDA • ROLLAR' : lang === 'ru' ? 'ОБО МНЕ • РОЛИ' : 'MEMBERS • ROLES'} variant="cyber" />
          </a>

          <a
            href="#skills"
            onClick={playClickSound}
            className={`transition-colors tracking-widest ${
              activeSection === 'skills' ? 'text-[#e60000] font-bold' : 'text-[#ffffff] hover:text-[#e60000]'
            }`}
          >
            <ScrambleText text={lang === 'uz' ? 'TEXNOLOGIYALAR' : lang === 'ru' ? 'СТЕК НАВЫКОВ' : 'CORE STACK'} variant="tech" />
          </a>

          <a
            href="#projects"
            onClick={playClickSound}
            className={`transition-colors tracking-widest ${
              activeSection === 'projects' ? 'text-[#e60000] font-bold' : 'text-[#ffffff] hover:text-[#e60000]'
            }`}
          >
            <ScrambleText text={lang === 'uz' ? 'LOYIHALAR' : lang === 'ru' ? 'ПРОЕКТЫ' : 'RECORDS'} variant="matrix" />
          </a>

          {onOpenCV && (
            <button
              onClick={() => {
                playClickSound();
                onOpenCV();
              }}
              className="text-[#888888] hover:text-[#e60000] transition-colors tracking-widest cursor-pointer text-right uppercase"
            >
              <ScrambleText text={lang === 'uz' ? '[ REZYUME / CV ]' : lang === 'ru' ? '[ РЕЗЮМЕ / CV ]' : '[ CV / RESUME ]'} variant="bracket" />
            </button>
          )}

          {/* Controls: Audio & Lang Switcher (UZ / RU / EN) */}
          <div className="flex items-center gap-2 pt-2 mt-1 border-t border-white/10 text-[10px]">
            <div className="flex items-center gap-1 font-mono">
              {[
                { id: 'uz', label: 'UZ' },
                { id: 'ru', label: 'RU' },
                { id: 'en', label: 'EN' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setLanguage(item.id)}
                  className={`px-1.5 py-0.5 transition-all duration-150 cursor-pointer font-bold ${
                    lang === item.id
                      ? 'text-white bg-white/20 border border-white/40'
                      : 'text-[#888888] hover:text-white'
                  }`}
                  title={`Tilni tanlash / Выбрать язык: ${item.label}`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <span className="text-white/20">/</span>
            <button
              onClick={toggleSound}
              className="text-[#888888] hover:text-[#e60000] transition-colors cursor-pointer flex items-center gap-1"
              title={soundOn ? 'Sound On' : 'Sound Off'}
            >
              {soundOn ? <Volume2 className="w-3 h-3 text-[#e60000]" /> : <VolumeX className="w-3 h-3" />}
            </button>
          </div>
        </div>

      </div>
    </header>
  );
};

export default Navbar;
