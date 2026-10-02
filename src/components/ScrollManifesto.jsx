import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ScrollManifesto = ({ lang }) => {
  const sectionRef = useRef(null);
  const textRef = useRef(null);
  const stepsRef = useRef(null);

  const manifestoText = lang === 'uz'
    ? "MUKAMMAL RAQAMLI TAJRIBA TOZA ARXITEKTURADAN BOSHLANADI. BIZ HAR BIR PIXELNI ANIQ HISOBLAB, MURAKKAB DIZAYNNI ULTRA-TEZKOR, ISHONCHLI VA INTERAKTIV REACT ILFASIGA AYLANTIRAMIZ. DIQQAT MARKAZIDA — TEZLIK, SIFAT VA FOYDALANUVCHI QULAYLIGI."
    : lang === 'ru'
    ? "БЕЗУПРЕЧНЫЙ ЦИФРОВОЙ ОПЫТ НАЧИНАЕТСЯ С ЧИСТОЙ АРХИТЕКТУРЫ. МЫ ВЫВЕРЯЕМ КАЖДЫЙ ПИКСЕЛЬ, ПРЕВРАЩАЯ СЛОЖНЫЙ ДИЗАЙН В СВЕРХБЫСТРЫЕ, НАДЕЖНЫЕ И ИНТЕРАКТИВНЫЕ СИСТЕМЫ REACT. В ФОКУСЕ — СКОРОСТЬ, СОВЕРШЕНСТВО И МАКСИМАЛЬНЫЙ КОМФОРТ ПОЛЬЗОВАТЕЛЯ."
    : "EXCEPTIONAL DIGITAL EXPERIENCES DEMAND UNCOMPROMISING ARCHITECTURE. WE TRANSFORM COMPLEX DESIGN TOKENS INTO RESILIENT, ULTRA-FAST, AND PIXEL-PERFECT REACT SYSTEMS. OUR OBSESSION — SPEED, PURITY, AND FLAWLESS USER ERGONOMICS.";

  const accentWords = [
    'MUKAMMAL', 'ARXITEKTURADAN', 'PIXELNI', 'ULTRA-TEZKOR', 'REACT', 'SIFAT',
    'БЕЗУПРЕЧНЫЙ', 'АРХИТЕКТУРЫ', 'ПИКСЕЛЬ', 'СВЕРХБЫСТРЫЕ', 'REACT', 'СКОРОСТЬ', 'СОВЕРШЕНСТВО',
    'EXCEPTIONAL', 'ARCHITECTURE', 'PIXEL-PERFECT', 'REACT', 'SPEED', 'PURITY'
  ];

  const steps = [
    {
      num: '01',
      title: lang === 'uz' ? 'ARXITEKTURA & STRUKTURA' : lang === 'ru' ? 'АРХИТЕКТУРА И СТРУКТУРА' : 'CORE ARCHITECTURE',
      desc: lang === 'uz' 
        ? "Modulli komponentlar iyerarxiyasi, toza kod va qayta ishlatiluvchi custom hooklar."
        : lang === 'ru'
        ? "Модульная иерархия компонентов, чистый код и переиспользуемые кастомные хуки."
        : "Modular component hierarchies, clean state lifecycle, and reusable reactive hooks."
    },
    {
      num: '02',
      title: lang === 'uz' ? 'PIXEL-PERFECT FIDELITY' : lang === 'ru' ? 'ТОЧНОСТЬ PIXEL-PERFECT' : 'PIXEL-PERFECT FIDELITY',
      desc: lang === 'uz'
        ? "Figma maketlari, Auto-Layout va dizayn tokenlarini kodda 100% aniq aks ettirish."
        : lang === 'ru'
        ? "Перенос макетов Figma, сеток Auto-Layout и дизайн-токенов в код с абсолютной точностью."
        : "Direct translation of Figma design systems, tokens, and auto-layouts into reactive DOM."
    },
    {
      num: '03',
      title: lang === 'uz' ? 'OPTIMALLASHTIRISH & TEZLIK' : lang === 'ru' ? 'СКОРОСТЬ И ОПТИМИЗАЦИЯ' : 'VELOCITY & PERFORMANCE',
      desc: lang === 'uz'
        ? "Ultra-tezkor Vite muhiti, resurslarni siqish va soniyadan kam yuklanish tezligi."
        : lang === 'ru'
        ? "Сверхбыстрая сборка Vite, сжатие ассетов и молниеносная отзывчивость 60fps."
        : "Sub-second Vite asset bundling, code-splitting, and silky-smooth 60fps responsiveness."
    },
    {
      num: '04',
      title: lang === 'uz' ? 'UZLUKSIZ CI/CD DEPLOY' : lang === 'ru' ? 'НЕПРЕРЫВНЫЙ ДЕПЛОЙ CI/CD' : 'PRODUCTION CI/CD',
      desc: lang === 'uz'
        ? "Git & GitHub orqali versiyalash hamda Vercel edge tarmog'ida tezkor nashr etish."
        : lang === 'ru'
        ? "Контроль версий Git & GitHub и автоматическая публикация в глобальной сети Vercel."
        : "Automated Git versioning, pull request rigor, and continuous Vercel edge deployment."
    }
  ];

  useEffect(() => {
    const sectionEl = sectionRef.current;
    if (!sectionEl) return;

    const ctx = gsap.context(() => {
      // 1. Background pitch-black theatrical blackout trigger (DAQ Consulting style)
      ScrollTrigger.create({
        trigger: sectionEl,
        start: 'top 70%',
        end: 'bottom 30%',
        onEnter: () => {
          document.body.classList.add('in-dark-focus');
        },
        onLeave: () => {
          document.body.classList.remove('in-dark-focus');
        },
        onEnterBack: () => {
          document.body.classList.add('in-dark-focus');
        },
        onLeaveBack: () => {
          document.body.classList.remove('in-dark-focus');
        }
      });

      // 2. Sequential Word-by-word Scroll Scrubbing (DAQ Consulting inspired)
      const words = sectionEl.querySelectorAll('.manifesto-word');
      if (words.length > 0) {
        gsap.fromTo(
          words,
          {
            opacity: 0.18,
            y: 12
          },
          {
            opacity: 1,
            y: 0,
            stagger: 0.04,
            ease: 'none',
            scrollTrigger: {
              trigger: textRef.current,
              start: 'top 75%',
              end: 'bottom 35%',
              scrub: 0.6
            }
          }
        );
      }

      // 3. Sequential Engineering Steps Lighting (01 -> 02 -> 03 -> 04)
      const stepItems = sectionEl.querySelectorAll('.core-step-item');
      stepItems.forEach((step) => {
        gsap.fromTo(
          step,
          {
            opacity: 0.25,
            y: 25
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            scrollTrigger: {
              trigger: step,
              start: 'top 85%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [lang]);

  const wordsArray = manifestoText.split(' ');

  return (
    <section
      ref={sectionRef}
      id="manifesto"
      className="dark-focus-section relative py-20 sm:py-32 lg:py-48 bg-[#000000] text-white transition-colors duration-700 overflow-hidden border-y border-white/10 select-none"
    >
      {/* Focused ambient central spotlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[750px] bg-[#e60000]/6 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-10 lg:px-14 relative z-10">
        
        {/* Top Tag */}
        <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-[#e60000] mb-8 sm:mb-12 font-bold">
          <span className="w-2 h-2 rounded-full bg-[#e60000] animate-ping" />
          <span>// FRONTEND PHILOSOPHY &bull; CORE SEQUENCE</span>
          <span className="w-12 h-[1px] bg-white/20 hidden sm:inline-block" />
        </div>

        {/* Word-by-word Scrub Illuminated Manifesto Text */}
        <div ref={textRef} className="mb-16 sm:mb-24 lg:mb-32">
          <p className="font-editorial text-2xl sm:text-5xl lg:text-6xl font-extrabold uppercase tracking-tight leading-[1.2] sm:leading-[1.15]">
            {wordsArray.map((word, idx) => {
              const cleanWord = word.replace(/[^A-Z0-9-]/gi, '');
              const isAccent = accentWords.includes(cleanWord);

              return (
                <span
                  key={idx}
                  className={`manifesto-word inline-block mr-3 sm:mr-4 transition-all duration-200 ${
                    isAccent ? 'text-[#e60000] font-black drop-shadow-[0_0_15px_rgba(230,0,0,0.6)]' : 'text-white'
                  }`}
                >
                  {word}
                </span>
              );
            })}
          </p>
        </div>

        {/* The 4-Phase Engineering Sequence */}
        <div ref={stepsRef} className="border-t border-white/15 pt-16">
          <div className="flex flex-wrap items-baseline justify-between gap-4 mb-12 font-mono text-xs text-zinc-400 uppercase tracking-widest">
            <span className="text-white font-bold">
              {lang === 'uz' ? '// MUHANDISLIK YADROSI' : lang === 'ru' ? '// ИНЖЕНЕРНОЕ ЯДРО' : '// THE ENGINEERING CORE'}
            </span>
            <span>
              {lang === 'uz' ? '4 BOSQICHLI ISHLAB CHIQISH SIKLI' : lang === 'ru' ? '4 ЭТАПА ЖИЗНЕННОГО ЦИКЛА' : '4-PHASE DEVELOPMENT LIFECYCLE'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
            {steps.map((step) => (
              <div
                key={step.num}
                className="core-step-item group border-t border-white/20 pt-6 transition-all duration-300"
              >
                <div className="flex items-center justify-between font-mono text-xs mb-3">
                  <span className="text-[#e60000] font-bold text-sm">( {step.num} )</span>
                  <span className="w-2 h-2 rounded-full bg-white/20 group-hover:bg-[#e60000] transition-colors" />
                </div>
                <h4 className="font-editorial text-lg sm:text-xl font-bold uppercase tracking-tight text-white group-hover:text-[#e60000] transition-colors mb-3">
                  {step.title}
                </h4>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-sans">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default ScrollManifesto;
