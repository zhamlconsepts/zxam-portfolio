import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Menu, X, FileText, ArrowUpRight, Star } from 'lucide-react';
import { playClickSound, setSoundEnabled, playHoverSound } from '../utils/audio';
import ScrambleText from './ScrambleText';
import { TelegramIcon, GithubIcon } from './Icons';

const Navbar = ({ lang, setLang, t, onOpenCV, onOpenRating }) => {
  const [soundOn, setSoundOn] = useState(true);
  const [activeSection, setActiveSection] = useState('hero');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

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

  const handleNavClick = (sectionId) => {
    playClickSound();
    setMobileMenuOpen(false);
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navItems = [
    { id: 'hero', label: lang === 'uz' ? 'BOSH SAHIFA' : lang === 'ru' ? 'ГЛАВНАЯ' : 'HOME', variant: 'tech' },
    { id: 'about', label: lang === 'uz' ? 'HAQIDA • ROLLAR' : lang === 'ru' ? 'ОБО МНЕ • РОЛИ' : 'MEMBERS • ROLES', variant: 'cyber' },
    { id: 'skills', label: lang === 'uz' ? 'TEXNOLOGIYALAR' : lang === 'ru' ? 'СТЕК НАВЫКОВ' : 'CORE STACK', variant: 'tech' },
    { id: 'projects', label: lang === 'uz' ? 'LOYIHALAR' : lang === 'ru' ? 'ПРОЕКТЫ' : 'RECORDS', variant: 'matrix' },
    { id: 'experience', label: lang === 'uz' ? 'TAJRIBA' : lang === 'ru' ? 'ОПЫТ' : 'EXPERIENCE', variant: 'tech' },
    { id: 'contact', label: lang === 'uz' ? 'BOG\'LANISH' : lang === 'ru' ? 'КОНТАКТЫ' : 'CONTACT', variant: 'matrix' },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 px-4 sm:px-10 lg:px-14 py-4 sm:py-8 font-mono text-xs uppercase tracking-wider text-[#ffffff] pointer-events-none transition-all duration-300">
        <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
          
          {/* Left: Clean Brand Logo */}
          <div className="pointer-events-auto">
            <a
              href="#hero"
              onClick={() => handleNavClick('hero')}
              className="group block"
              aria-label="Ablakimov Jamshid (zxam) Home"
            >
              <ScrambleText
                text="ABLAKIMOV"
                variant="matrix"
                className="font-editorial font-bold text-base sm:text-lg tracking-tight uppercase group-hover:text-[#e60000]"
              />
              <span className="block text-[9px] sm:text-[10px] text-[#888888] tracking-widest mt-0.5 group-hover:text-[#ffffff] transition-colors">
                <ScrambleText text="FRONTEND ARCHITECT" variant="tech" />
              </span>
            </a>
          </div>

          {/* Desktop Navigation Menu (md:flex) */}
          <div className="pointer-events-auto hidden md:flex flex-col items-end text-right space-y-1.5 sm:space-y-2">
            {navItems.slice(0, 4).map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={playClickSound}
                className={`transition-colors tracking-widest ${
                  activeSection === item.id ? 'text-[#e60000] font-bold' : 'text-[#ffffff] hover:text-[#e60000]'
                }`}
              >
                <ScrambleText text={item.label} variant={item.variant} />
              </a>
            ))}

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

            {onOpenRating && (
              <button
                onClick={() => {
                  playClickSound();
                  onOpenRating();
                }}
                className="text-amber-400 hover:text-white transition-colors tracking-widest cursor-pointer text-right uppercase flex items-center gap-1.5 self-end group"
                title="Saytga o'z bahoingizni qoldiring"
              >
                <span className="text-[#e60000]">⭐️</span>
                <ScrambleText text={lang === 'uz' ? '[ BAHOLASH ]' : lang === 'ru' ? '[ ОЦЕНИТЬ ]' : '[ RATE SITE ]'} variant="bracket" />
              </button>
            )}

            {/* Controls: Audio & Lang Switcher */}
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
                    title={`Tilni tanlash: ${item.label}`}
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

          {/* Mobile Actions: Language + Sound + Hamburger Button (md:hidden) */}
          <div className="pointer-events-auto flex md:hidden items-center gap-2 bg-[#08080a]/90 backdrop-blur-md border border-white/10 px-2.5 py-1.5 rounded-full shadow-lg">
            {/* Quick Lang Switcher on Mobile */}
            <div className="flex items-center gap-0.5 text-[10px]">
              {['uz', 'ru', 'en'].map((code) => (
                <button
                  key={code}
                  onClick={() => setLanguage(code)}
                  className={`px-1.5 py-0.5 rounded font-bold uppercase transition-colors ${
                    lang === code ? 'bg-[#e60000] text-white' : 'text-zinc-400'
                  }`}
                >
                  {code}
                </button>
              ))}
            </div>

            <div className="w-[1px] h-3.5 bg-white/20" />

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => {
                playClickSound();
                setMobileMenuOpen((prev) => !prev);
              }}
              className="p-1.5 text-white hover:text-[#e60000] transition-colors flex items-center justify-center focus:outline-none"
              aria-label="Toggle Mobile Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-[#e60000]" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </header>

      {/* Fullscreen Mobile Drawer Navigation */}
      <div
        className={`fixed inset-0 z-50 bg-[#08080a]/98 backdrop-blur-2xl md:hidden transition-all duration-300 flex flex-col justify-between p-6 overflow-y-auto ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Top Header inside Drawer */}
        <div className="flex items-center justify-between pb-6 border-b border-white/10">
          <div>
            <span className="font-editorial text-xl font-bold uppercase tracking-tight text-white block">
              ABLAKIMOV JAMSHID
            </span>
            <span className="font-mono text-[10px] text-[#e60000] tracking-widest uppercase">
              // FRONTEND ARCHITECT &bull; ZXAM
            </span>
          </div>

          <button
            onClick={() => {
              playClickSound();
              setMobileMenuOpen(false);
            }}
            className="p-2.5 rounded-full bg-white/10 text-white hover:text-[#e60000] transition-colors"
            aria-label="Close Mobile Menu"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Items (Large Touch Targets for Mobile Fingers) */}
        <nav className="py-8 space-y-3 font-editorial">
          {navItems.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className="w-full text-left py-3 px-4 rounded-xl flex items-center justify-between group hover:bg-white/[0.04] transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-[#e60000] font-bold">
                  ( 0{idx + 1} )
                </span>
                <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white group-hover:text-[#e60000] transition-colors">
                  {item.label}
                </span>
              </div>
              <ArrowUpRight className="w-5 h-5 text-zinc-500 group-hover:text-[#e60000] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </button>
          ))}

          {/* Mobile CV Button */}
          {onOpenCV && (
            <button
              onClick={() => {
                playClickSound();
                setMobileMenuOpen(false);
                onOpenCV();
              }}
              className="w-full mt-4 py-3.5 px-5 rounded-xl border border-[#e60000]/40 bg-[#e60000]/10 text-white flex items-center justify-between font-mono text-xs uppercase tracking-widest font-bold"
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#e60000]" />
                <span>{lang === 'uz' ? 'REZYUME / CV KO\'RISH' : lang === 'ru' ? 'СМОТРЕТЬ РЕЗЮМЕ / CV' : 'VIEW CV / RESUME'}</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-[#e60000]" />
            </button>
          )}

          {/* Mobile Rating Button */}
          {onOpenRating && (
            <button
              onClick={() => {
                playClickSound();
                setMobileMenuOpen(false);
                onOpenRating();
              }}
              className="w-full mt-2.5 py-3.5 px-5 rounded-xl border border-amber-500/30 bg-amber-500/10 text-white flex items-center justify-between font-mono text-xs uppercase tracking-widest font-bold hover:bg-amber-500/20 transition-all cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.15)]"
            >
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span>{lang === 'uz' ? '⭐️ PORTFOLIONI BAHOLASH' : lang === 'ru' ? '⭐️ ОЦЕНИТЬ ПОРТФОЛИО' : '⭐️ RATE PORTFOLIO'}</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-amber-400" />
            </button>
          )}
        </nav>

        {/* Footer & Social Contacts in Drawer */}
        <div className="pt-6 border-t border-white/10 font-mono text-xs space-y-4">
          <div className="flex items-center justify-between">
            {/* Sound Toggle */}
            <button
              onClick={toggleSound}
              className="flex items-center gap-2 py-2 px-3 rounded-lg bg-white/5 text-zinc-300"
            >
              {soundOn ? <Volume2 className="w-4 h-4 text-[#e60000]" /> : <VolumeX className="w-4 h-4" />}
              <span>{soundOn ? 'AUDIO: ON' : 'AUDIO: OFF'}</span>
            </button>

            {/* Language Selector */}
            <div className="flex items-center gap-1">
              {[
                { id: 'uz', label: 'UZ' },
                { id: 'ru', label: 'RU' },
                { id: 'en', label: 'EN' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setLanguage(item.id)}
                  className={`px-2.5 py-1.5 rounded text-xs font-bold ${
                    lang === item.id ? 'bg-[#e60000] text-white' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Social Links */}
          <div className="flex items-center justify-between text-zinc-400 pt-2 text-[11px]">
            <a
              href="https://t.me/jamwidunvrsl"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-white"
            >
              <TelegramIcon className="w-3.5 h-3.5 text-[#e60000]" />
              <span>@jamwidunvrsl</span>
            </a>
            <a
              href="https://github.com/zhamlconsepts"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-white"
            >
              <GithubIcon className="w-3.5 h-3.5" />
              <span>zhamlconsepts</span>
            </a>
          </div>
        </div>

      </div>
    </>
  );
};

export default Navbar;
