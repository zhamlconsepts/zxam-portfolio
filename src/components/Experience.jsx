import React from 'react';

const Experience = ({ lang, t }) => {
  return (
    <section id="experience" className="py-16 sm:py-24 lg:py-36 relative border-t border-white/10 bg-[#08080a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-10 lg:px-14">
        
        {/* Editorial Section Header */}
        <div className="flex flex-wrap items-end justify-between gap-4 sm:gap-6 pb-6 sm:pb-8 border-b border-white/10 mb-12 sm:mb-20">
          <div className="stagger-text">
            <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-[#e60000] mb-3 font-bold">
              <span>( 04 )</span>
              <span className="w-8 h-[1px] bg-[#e60000]" />
              <span>TIMELINE &bull; HISTORICAL RECORD</span>
            </div>
            <h2 className="text-3xl sm:text-6xl lg:text-7xl font-black font-editorial uppercase tracking-tighter leading-none text-white">
              EXPERIENCE
              <span className="text-[#e60000]"> &bull; CAREER</span>
            </h2>
          </div>

          <div className="stagger-text font-mono text-xs text-zinc-400 uppercase tracking-wider text-left sm:text-right">
            <div>// CHRONOLOGICAL LOG</div>
            <div className="text-white font-bold">2025 &bull; 2026</div>
          </div>
        </div>

        {/* Dual Column Editorial Layout (NO CARDS) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Left Column: Work Experience (7 cols) */}
          <div className="lg:col-span-7 space-y-12">
            <div className="stagger-text flex items-center justify-between pb-4 border-b border-white/10">
              <h3 className="font-editorial text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-white">
                {lang === 'uz' ? '// ISH TAJRIBASI' : lang === 'ru' ? '// ОПЫТ РАБОТЫ' : '// WORK EXPERIENCE'}
              </h3>
              <span className="font-mono text-xs text-[#e60000] tracking-widest uppercase font-bold">
                PRODUCTION
              </span>
            </div>

            {/* Experience Item: Junior Frontend Developer */}
            <div className="stagger-text space-y-6">
              <div className="flex flex-wrap items-baseline justify-between gap-2 font-mono text-xs">
                <span className="text-[#e60000] font-bold text-sm">
                  2025 — {lang === 'uz' ? 'HOZIRGACHA' : lang === 'ru' ? 'ПО НАСТОЯЩЕЕ ВРЕМЯ' : 'PRESENT'}
                </span>
                <span className="text-zinc-500 uppercase">// GULISTON &amp; REMOTE</span>
              </div>

              <div>
                <h4 className="font-editorial text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">
                  {t.expJuniorTitle || 'JUNIOR FRONTEND DEVELOPER'}
                </h4>
                <div className="font-mono text-xs text-zinc-500 tracking-wider mt-1 uppercase">
                  REACT.JS // TAILWIND CSS // FIGMA // VERCEL
                </div>
              </div>

              {/* Editorial Bullets */}
              <ul className="space-y-4 pt-4 border-t border-white/10 text-sm sm:text-base text-zinc-300 font-sans leading-relaxed">
                <li className="flex items-start gap-3">
                  <span className="font-mono text-xs text-[#e60000] mt-1 shrink-0">01</span>
                  <span>{t.expBullet1}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-mono text-xs text-[#e60000] mt-1 shrink-0">02</span>
                  <span>{t.expBullet2}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-mono text-xs text-[#e60000] mt-1 shrink-0">03</span>
                  <span>{t.expBullet3}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-mono text-xs text-[#e60000] mt-1 shrink-0">04</span>
                  <span>{t.expBullet4}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column: Education & Academies (5 cols) */}
          <div className="lg:col-span-5 space-y-12">
            <div className="stagger-text flex items-center justify-between pb-4 border-b border-white/10">
              <h3 className="font-editorial text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-white">
                {lang === 'uz' ? '// AKADEMIK BOSQICHLAR' : lang === 'ru' ? '// АКАДЕМИЧЕСКИЙ ПУТЬ' : '// ACADEMIC PATH'}
              </h3>
              <span className="font-mono text-xs text-zinc-400 tracking-widest uppercase">
                ACADEMY
              </span>
            </div>

            {/* Edu Item 1: IT LIVE Academy */}
            <div className="stagger-text border-b border-white/10 pb-8 space-y-3">
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="text-[#e60000] font-bold">2026</span>
                <span className="text-zinc-500 uppercase">{lang === 'uz' ? 'BITIRUVCHI' : lang === 'ru' ? 'ВЫПУСК' : 'GRADUATION'}</span>
              </div>
              <h4 className="font-editorial text-2xl font-bold uppercase text-white">
                IT LIVE ACADEMY
              </h4>
              <p className="text-sm text-zinc-400 leading-relaxed font-sans">
                {t.edu1Desc || 'Modern frontend engineering, component hierarchies, state management, and real-world team practices.'}
              </p>
            </div>

            {/* Edu Item 2: Web Practikum */}
            <div className="stagger-text border-b border-white/10 pb-8 space-y-3">
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="text-[#e60000] font-bold">2025</span>
                <span className="text-zinc-500 uppercase">{lang === 'uz' ? 'SERTIFIKAT' : lang === 'ru' ? 'СЕРТИФИКАТ' : 'CERTIFIED'}</span>
              </div>
              <h4 className="font-editorial text-2xl font-bold uppercase text-white">
                WEB PRACTIKUM
              </h4>
              <p className="text-sm text-zinc-400 leading-relaxed font-sans">
                {t.edu2Desc || 'Frontend Developer course: HTML5, CSS3, modern JavaScript ES6+, Figma to code workflows, and standalone web applications.'}
              </p>
            </div>

            {/* Pure Typographic Continuous Iteration Note (NO BOX CARD) */}
            <div className="stagger-text pt-4 space-y-3">
              <div className="font-mono text-xs text-[#e60000] uppercase tracking-widest font-bold">
                {lang === 'uz' ? '// UZLUKSIZ RIVOJLANISH' : lang === 'ru' ? '// НЕПРЕРЫВНОЕ РАЗВИТИЕ' : '// CONTINUOUS ITERATION'}
              </div>
              <p className="text-sm text-zinc-400 leading-relaxed font-sans">
                {lang === 'uz'
                  ? "Dasturlash sohasidagi har bir yangi o'zgarish va yangilikni diqqat bilan kuzataman. Tajriba, xatolarni tahlil qilish va tinimsiz amaliyot yuqori malakali muhandis bo'lishimning garovidir."
                  : lang === 'ru'
                  ? "Внимательно слежу за развитием стандартов веб-разработки и архитектурных подходов. Анализ кода, работа над ошибками и постоянная практика — основа моего профессионального роста."
                  : "Dedicated to tracking modern web standards and architectural shifts. Continuous refinement through rigorous deliberate practice."}
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default Experience;
