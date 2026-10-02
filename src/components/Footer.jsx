import React from 'react';
import { ArrowUp } from 'lucide-react';
import { playClickSound } from '../utils/audio';
import ScrambleText from './ScrambleText';
import { TelegramIcon, GithubIcon } from './Icons';

const Footer = ({ t, onOpenAdmin }) => {
  const scrollToTop = () => {
    playClickSound();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdminTrigger = () => {
    playClickSound();
    onOpenAdmin?.();
  };

  return (
    <footer className="py-16 border-t border-white/15 bg-black text-[#ffffff] relative z-10 font-mono text-xs uppercase tracking-wider">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center justify-between">
          
          {/* Left: Verified Social Channels (Telegram @jamwidunvrsl & GitHub zhamlconsepts) */}
          <div className="md:col-span-5 flex flex-wrap items-center gap-6 text-[#888888]">
            <a
              href="https://t.me/jamwidunvrsl"
              target="_blank"
              rel="noopener noreferrer"
              onClick={playClickSound}
              className="hover:text-[#e60000] flex items-center gap-1.5 transition-colors group"
            >
              <TelegramIcon className="w-3.5 h-3.5 text-[#e60000]" />
              <ScrambleText text="TELEGRAM (@jamwidunvrsl)" variant="tech" className="group-hover:text-[#e60000]" />
            </a>
            <a
              href="https://github.com/zhamlconsepts"
              target="_blank"
              rel="noopener noreferrer"
              onClick={playClickSound}
              className="hover:text-[#e60000] flex items-center gap-1.5 transition-colors group"
            >
              <GithubIcon className="w-3.5 h-3.5 text-zinc-400 group-hover:text-white" />
              <ScrambleText text="GITHUB (zhamlconsepts)" variant="matrix" className="group-hover:text-[#e60000]" />
            </a>
          </div>

          {/* Center: Editorial Attribution & Secret Admin Trigger */}
          <div className="md:col-span-4 text-left md:text-center text-[#888888] text-[11px]">
            <div className="flex items-center justify-start md:justify-center gap-2">
              <span>&copy; 2026</span>
              <button
                onClick={handleAdminTrigger}
                title="Tashriflar boshqaruvi (Ctrl + Shift + A)"
                className="text-white font-bold hover:text-[#e60000] transition-colors cursor-pointer text-left md:text-center focus:outline-none"
              >
                <ScrambleText text="ABLAKIMOV JAMSHID (ZXAM)" variant="cyber" />
              </button>
              <span>&bull; ALL RIGHTS RESERVED</span>
            </div>
            <div className="text-white/40 mt-1">
              <ScrambleText text="REACT // TAILWIND CSS // VITE // DESIGN SYSTEM" variant="tech" />
            </div>
          </div>

          {/* Right: Back to Top */}
          <div className="md:col-span-3 flex justify-start md:justify-end">
            <button
              onClick={scrollToTop}
              className="group flex items-center gap-2 px-5 py-3 border border-white/20 hover:border-[#e60000] hover:bg-[#e60000] hover:text-white text-white transition-all cursor-pointer font-bold tracking-widest"
              aria-label="Back to Top"
            >
              <ScrambleText text={t.backToTop || 'BACK TO TOP'} variant="bracket" />
              <ArrowUp className="w-3.5 h-3.5 transition-transform group-hover:-translate-y-0.5" />
            </button>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
