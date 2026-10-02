import React from 'react';
import { MapPin, Mail, Phone, ArrowUpRight } from 'lucide-react';
import { playClickSound } from '../utils/audio';
import ScrambleText from './ScrambleText';
import { TelegramIcon, GithubIcon } from './Icons';

const About = ({ t }) => {
  const pillars = [
    {
      num: '01',
      title: t.pillar1Title || 'MODULLI REACT.JS ARXITEKTURASI',
      desc: t.pillar1Desc || 'Komponentlar iyerarxiyasi, custom Hooks, qulay holat boshqaruvi (state management) va qayta ishlatiluvchi SPA arxitekturasi.',
      variant: 'tech'
    },
    {
      num: '02',
      title: t.pillar2Title || 'PIXEL-PERFECT FIGMA INTEGRATSIYASI',
      desc: t.pillar2Desc || 'Figma maketlari, Auto-Layout, rang tizimlari va dizayn tokenlarini React va Tailwind kodiga 100% aniqlik bilan ko\'chirish.',
      variant: 'cyber'
    },
    {
      num: '03',
      title: t.pillar3Title || 'TEZKOR VITE & VERCEL CI/CD',
      desc: t.pillar3Desc || 'Ultra-tezkor Vite muhiti, production bundling optimallashuvi va Vercel orqali avtomatlashtirilgan doimiy integratsiya.',
      variant: 'matrix'
    },
    {
      num: '04',
      title: t.pillar4Title || 'JAMOAVIY HAMKORLIK VA SABR',
      desc: t.pillar4Desc || 'Git & GitHub orqali qulay versiya boshqaruvi, do\'stona muloqot, o\'z ustida tinimsiz ishlash va muammolarni tizimli hal qilish.',
      variant: 'tech'
    }
  ];

  return (
    <section id="about" className="py-16 sm:py-24 lg:py-36 relative border-t border-white/10 bg-[#08080a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-10 lg:px-14">
        
        {/* Section Header */}
        <div className="flex flex-wrap items-end justify-between gap-4 sm:gap-6 pb-6 sm:pb-8 border-b border-white/10 mb-12 sm:mb-16">
          <div className="stagger-text">
            <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-[#e60000] mb-3 font-bold">
              <span>( 01 )</span>
              <span className="w-8 h-[1px] bg-[#e60000]" />
              <ScrambleText text={t.aboutTag || 'MEN HAQIMDA'} variant="tech" />
            </div>
            <h2 className="text-3xl sm:text-6xl lg:text-7xl font-black font-editorial text-white uppercase tracking-tighter leading-none">
              <span>{t.aboutTitle1 || "Frontend Dasturlash va"} </span>
              <span className="text-[#e60000] inline-block">
                <ScrambleText text={t.aboutTitle2 || "Texnologik Yondashuv"} variant="cyber" />
              </span>
            </h2>
          </div>

          <div className="stagger-text font-mono text-xs text-zinc-400 uppercase tracking-wider text-right">
            <div>// PROFILE &bull; PHILOSOPHY</div>
            <div className="text-white font-bold">
              <ScrambleText text="ABLAKIMOV JAMSHID (ZXAM) &bull; 2026" variant="matrix" />
            </div>
          </div>
        </div>

        {/* Spacious Editorial Grid (STRICTLY NO CARD BOXES) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column (5 cols): Developer Specifications List */}
          <div className="lg:col-span-5 space-y-6">
            <h3 className="stagger-text font-editorial text-2xl sm:text-3xl font-bold uppercase text-white leading-tight">
              <ScrambleText text={t.aboutHeadline || "GULISTONLIK JUNIOR FRONTEND DASTURCHI"} variant="tech" />
            </h3>

            <p className="stagger-text text-base text-zinc-300 leading-relaxed font-sans">
              {t.aboutBioShort || "Men zamonaviy veb-texnologiyalarga ixtisoslashgan dasturchiman. Har bir loyihada toza kod yozish, qulay foydalanuvchi tajribasi (UX) yaratish va dizaynni eng mayda detallarigacha kodda aniq aks ettirishga intilaman."}
            </p>

            {/* Direct Contact Specifications - Clean Editorial Lines (NO BOX CARD) */}
            <div className="stagger-text pt-4 border-t border-white/10 space-y-4 font-mono text-xs">
              <div className="py-2.5 border-b border-white/10 flex items-center justify-between">
                <span className="text-zinc-400 uppercase flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#e60000]" />
                  <span>{t.detailLoc || 'JOYLASHUV:'}</span>
                </span>
                <span className="text-white font-semibold">{t.detailLocVal || 'Guliston shahri, Sirdaryo'}</span>
              </div>

              <div className="py-2.5 border-b border-white/10 flex items-center justify-between">
                <span className="text-zinc-400 uppercase flex items-center gap-2">
                  <TelegramIcon className="w-3.5 h-3.5 text-[#e60000]" />
                  <span>TELEGRAM:</span>
                </span>
                <a
                  href="https://t.me/jamwidunvrsl"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={playClickSound}
                  className="text-white hover:text-[#e60000] font-semibold transition-colors flex items-center gap-1"
                >
                  <span>@jamwidunvrsl</span>
                  <ArrowUpRight className="w-3 h-3 text-[#e60000]" />
                </a>
              </div>

              <div className="py-2.5 border-b border-white/10 flex items-center justify-between">
                <span className="text-zinc-400 uppercase flex items-center gap-2">
                  <GithubIcon className="w-3.5 h-3.5 text-[#e60000]" />
                  <span>GITHUB:</span>
                </span>
                <a
                  href="https://github.com/zhamlconsepts"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={playClickSound}
                  className="text-white hover:text-[#e60000] font-semibold transition-colors flex items-center gap-1"
                >
                  <span>zhamlconsepts</span>
                  <ArrowUpRight className="w-3 h-3 text-[#e60000]" />
                </a>
              </div>

              <div className="py-2.5 border-b border-white/10 flex items-center justify-between">
                <span className="text-zinc-400 uppercase flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-[#e60000]" />
                  <span>EMAIL:</span>
                </span>
                <a
                  href="mailto:zhahsoh@gmail.com"
                  onClick={playClickSound}
                  className="text-white hover:text-[#e60000] font-semibold transition-colors"
                >
                  zhahsoh@gmail.com
                </a>
              </div>

              <div className="py-2.5 border-b border-white/10 flex items-center justify-between">
                <span className="text-zinc-400 uppercase flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#e60000]" />
                  <span>{t.detailPhone || 'TELEFON:'}</span>
                </span>
                <a
                  href="tel:+998940104039"
                  onClick={playClickSound}
                  className="text-white hover:text-[#e60000] font-semibold transition-colors"
                >
                  +998 (94) 010 40 39
                </a>
              </div>
            </div>
          </div>

          {/* Right Column (7 cols): Narrative & 4 Architectural Pillars */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-12">
            <div className="stagger-text space-y-6 text-base sm:text-lg text-zinc-300 leading-relaxed font-sans">
              <p className="text-xl sm:text-2xl font-editorial font-bold text-white uppercase leading-snug">
                {t.bioLead || "Salom! Men Ablakimov Jamshid (zxam) — zamonaviy veb-texnologiyalarga ixtisoslashgan Junior Frontend Dasturchiman."}
              </p>
              <p>{t.bioBody1}</p>
              <p>{t.bioBody2}</p>
            </div>

            {/* 4 Architectural Pillars - Clean Typography (NO CARDS) */}
            <div className="border-t border-white/10 pt-8">
              <div className="stagger-text font-mono text-xs uppercase tracking-widest text-[#e60000] mb-8 font-bold">
                <ScrambleText text={t.pillarsHeader || "// ASOSIY TEXNOLOGIK USTUNLAR"} variant="bracket" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-10">
                {pillars.map((item) => (
                  <div key={item.num} className="stagger-text group border-b border-white/10 pb-6">
                    <div className="font-mono text-xs text-[#e60000] font-bold mb-2">
                      ( {item.num} )
                    </div>
                    <h4 className="font-editorial text-base sm:text-lg font-bold uppercase text-white tracking-tight group-hover:text-[#e60000] transition-colors">
                      <ScrambleText text={item.title} variant={item.variant} />
                    </h4>
                    <p className="mt-2 text-xs sm:text-sm text-zinc-400 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default About;
