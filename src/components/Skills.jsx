import React, { useState } from 'react';
import { playClickSound } from '../utils/audio';
import ScrambleText from './ScrambleText';

const Skills = ({ lang }) => {
  const [activeTab, setActiveTab] = useState('all');

  const technicalSkills = [
    {
      num: '01',
      category: 'tech',
      name: 'REACT.JS',
      level: 'CORE // ADVANCED',
      desc: lang === 'uz'
        ? "Komponentlar arxitekturasi, custom Hooks (useState, useEffect, useMemo, useCallback), Context API va yuqori darajada modulli Single Page Application (SPA)."
        : lang === 'ru'
        ? "Архитектура компонентов, кастомные хуки (useState, useEffect, useMemo, useCallback), Context API и высокопроизводительные Single Page Applications (SPA)."
        : "Component architecture, custom Hooks, Context API, reactive state management, and high-performance modular Single Page Applications.",
      tags: ['Hooks', 'Context API', 'SPA', 'Component Architecture', 'Performance']
    },
    {
      num: '02',
      category: 'tech',
      name: 'TAILWIND CSS',
      level: 'CORE // ADVANCED',
      desc: lang === 'uz'
        ? "Utility-first uslubi, maxsus konfiguratsiyalar, dark-mode arxitekturasi, responsive dizayn sistemalari va silliq micro-animatsiyalar."
        : lang === 'ru'
        ? "Utility-first подход, кастомная конфигурация токенов, темные темы оформления, гибкие адаптивные сетки и плавные микро-анимации."
        : "Utility-first methodology, custom configuration tokens, dark-mode architectures, fluid responsive layouts, and modern CSS transitions.",
      tags: ['Responsive Grids', 'Dark Architecture', 'Design Tokens', 'Micro-Interactions']
    },
    {
      num: '03',
      category: 'tech',
      name: 'JAVASCRIPT (ES6+)',
      level: 'CORE // PROFICIENT',
      desc: lang === 'uz'
        ? "Zamonaviy sintaksis, Async/Await, Promises zanjirlari, Fetch API, DOM optimallashtirish va samarali ma'lumotlar bilan ishlash."
        : lang === 'ru'
        ? "Современный синтаксис, Async/Await, промисы, взаимодействие с REST API через Fetch, жизненный цикл DOM и функциональное программирование."
        : "Modern syntax, Async/Await concurrency, Promises, Fetch API REST integration, DOM lifecycle, and functional programming.",
      tags: ['ES6+', 'Async/Await', 'Fetch API', 'DOM Optimization']
    },
    {
      num: '04',
      category: 'tools',
      name: 'VITE & BUILD PIPELINES',
      level: 'TOOLING // EXPERT',
      desc: lang === 'uz'
        ? "Ultra-tezkor Hot Module Replacement (HMR), samarali production bundling, plaginlar integratsiyasi va optimallashtirish."
        : lang === 'ru'
        ? "Сверхбыстрый Hot Module Replacement (HMR), оптимизация production сборки, экосистема плагинов и минификация ресурсов."
        : "Ultra-fast Hot Module Replacement (HMR), production asset minification, plugin architectures, and build optimization.",
      tags: ['HMR', 'Production Bundling', 'Rollup', 'Developer Workflow']
    },
    {
      num: '05',
      category: 'tools',
      name: 'GIT & GITHUB',
      level: 'WORKFLOW // PROFICIENT',
      desc: lang === 'uz'
        ? "Jamoaviy versiyalar nazorati, branch boshqaruvi, Pull Requests, merge ziddiyatlarini bartaraf etish va toza commit madaniyati."
        : lang === 'ru'
        ? "Распределенный контроль версий, ветвление, Pull Requests, разрешение конфликтов слияния и культура понятных коммитов."
        : "Distributed version control, branch management strategies, code reviews, Pull Requests, and clean commit etiquette.",
      tags: ['Branching', 'Version Control', 'Pull Requests', 'Collaboration']
    },
    {
      num: '06',
      category: 'tools',
      name: 'FIGMA TO PIXEL-PERFECT CODE',
      level: 'DESIGN // ADVANCED',
      desc: lang === 'uz'
        ? "Figma maketlari, Auto-Layout, tipografiya va rang tizimlarini React va Tailwind kodiga 100% aniqlik bilan ko'chirish."
        : lang === 'ru'
        ? "Точный перенос сложных макетов Figma, дизайн-систем, сеток Auto-Layout и типографики в чистый код React и Tailwind."
        : "Translating complex Figma layouts, design systems, spacing grids, and component tokens into clean, responsive React code.",
      tags: ['Auto-Layout', 'Design Systems', 'Typography Specs', 'UI/UX Fidelity']
    },
    {
      num: '07',
      category: 'tools',
      name: 'VERCEL & DEPLOYMENT',
      level: 'DEPLOY // STREAMLINED',
      desc: lang === 'uz'
        ? "Vercel orqali avtomatlashtirilgan CI/CD deploy qilish, domen sozlamalari, preview muhitlar va ishlab chiqarish tahlillari."
        : lang === 'ru'
        ? "Автоматический деплой по событиям Git, привязка доменов, превью-окружения и мониторинг доступности."
        : "Automated Git-triggered CI/CD deployments, custom domain setups, edge environments, and zero-downtime release pipelines.",
      tags: ['CI/CD', 'Automated Deploy', 'Edge Hosting', 'Production Monitoring']
    }
  ];

  const softSkills = [
    {
      num: 'S1',
      title: lang === 'uz' ? 'JAMOAVIY HAMKORLIK & MULOQOT' : lang === 'ru' ? 'КОМАНДНАЯ РАБОТА И КОММУНИКАЦИЯ' : 'STRONG TEAMWORK & COMMUNICATION',
      desc: lang === 'uz'
        ? "Jamoada ochiq va do'stona muloqot o'rnatish, fikr almashish va jamoaviy maqsadlar yo'lida birgalikda ishlash."
        : lang === 'ru'
        ? "Эмпатичное и открытое общение в команде, обмен идеями и совместная работа ради достижения общих целей проекта."
        : "Empathetic communication, collaborative problem-solving, and constructive peer discussions."
    },
    {
      num: 'S2',
      title: lang === 'uz' ? "O'Z USTIDA QAYTA ISHLASH (CONTINUOUS IMPROVEMENT)" : lang === 'ru' ? "НЕПРЕРЫВНОЕ САМОРАЗВИТИЕ (CONTINUOUS IMPROVEMENT)" : "CONTINUOUS IMPROVEMENT",
      desc: lang === 'uz'
        ? "Kod sifatini tahlil qilish, xatolardan to'g'ri xulosa chiqarish va doimiy ravishda yangi yondashuvlarni o'rganish."
        : lang === 'ru'
        ? "Анализ качества кода, конструктивное восприятие критики и ежедневное расширение технических горизонтов."
        : "Relentless code auditing, learning from critique, and daily expansion of technical horizons."
    },
    {
      num: 'S3',
      title: lang === 'uz' ? "G'OYALAR O'RGANISH VA KAMCHILIKLAR QIDIRISH" : lang === 'ru' ? "ПОИСК ОПТИМАЛЬНЫХ ИДЕЙ И РЕШЕНИЙ" : "CRITICAL EXPLORATION & SOLUTIONS",
      desc: lang === 'uz'
        ? "Loyiha interfeysi va mantiqidagi kamchiliklarni erta aniqlash hamda ijodiy, qulay yechimlar taklif qilish."
        : lang === 'ru'
        ? "Своевременное выявление недочетов в логике и UI/UX интерфейса и предложение аккуратных инженерных решений."
        : "Proactively spotting UI/UX friction and formulating innovative, clean technical resolutions."
    },
    {
      num: 'S4',
      title: lang === 'uz' ? "HUSHCHAQCHAQ VA SABRLI (RESILIENCE & PATIENCE)" : lang === 'ru' ? "СТРЕССОУСТОЙЧИВОСТЬ И ТЕРПЕНИЕ (RESILIENCE & PATIENCE)" : "RESILIENCE & PATIENCE",
      desc: lang === 'uz'
        ? "Murakkab vazifalar va kutilmagan qiyinchiliklarga sovuqqon, sabrli va ijobiy kayfiyat bilan yondashish."
        : lang === 'ru'
        ? "Спокойный, терпеливый и позитивный настрой даже при решении самых сложных и нестандартных инженерных задач."
        : "Maintaining high morale, composure, and tenacious determination through complex engineering challenges."
    }
  ];

  const languages = [
    {
      lang: lang === 'ru' ? 'УЗБЕКСКИЙ' : 'UZBEK',
      level: lang === 'uz' ? 'ONA TILI (NATIVE)' : lang === 'ru' ? 'РОДНОЙ ЯЗЫК (NATIVE)' : 'NATIVE PROFICIENCY',
      note: '100% Fluent'
    },
    {
      lang: lang === 'ru' ? 'АНГЛИЙСКИЙ' : 'ENGLISH',
      level: lang === 'ru' ? 'СРЕДНИЙ (B1 - B2)' : 'INTERMEDIATE (B1 - B2)',
      note: lang === 'ru' ? 'Техническая документация и спецификации' : 'Technical documentation & Specs'
    },
    {
      lang: lang === 'ru' ? 'РУССКИЙ' : 'RUSSIAN',
      level: lang === 'ru' ? 'РАБОЧИЙ / СРЕДНИЙ' : 'INTERMEDIATE',
      note: lang === 'ru' ? 'Профессиональная коммуникация' : 'Working Professional Communication'
    }
  ];

  const filteredSkills = technicalSkills.filter((s) => {
    if (activeTab === 'all') return true;
    return s.category === activeTab;
  });

  return (
    <section id="skills" className="py-24 lg:py-36 relative border-t border-white/10 bg-[#08080a]">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14">
        
        {/* Section Header */}
        <div className="flex flex-wrap items-end justify-between gap-6 pb-8 border-b border-white/10 mb-16">
          <div className="stagger-text">
            <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-[#e60000] mb-3 font-bold">
              <span>( 02 )</span>
              <span className="w-8 h-[1px] bg-[#e60000]" />
              <ScrambleText text={lang === 'uz' ? 'TEXNOLOGIK STACK' : lang === 'ru' ? 'ТЕХНОЛОГИЧЕСКИЙ СТЕК' : 'TECHNOLOGY STACK'} variant="tech" />
            </div>
            <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black font-editorial text-white uppercase tracking-tighter leading-none">
              <ScrambleText text={lang === 'uz' ? "KO'NIKMALAR VA" : lang === 'ru' ? "НАВЫКИ И" : "SKILLS &"} variant="matrix" />
              <span className="text-[#e60000] inline-block ml-3">
                <ScrambleText text={lang === 'uz' ? "VOSITALAR" : lang === 'ru' ? "ТЕХНОЛОГИИ" : "TOOLS"} variant="cyber" />
              </span>
            </h2>
          </div>

          {/* Minimalist Editorial Filter Tabs */}
          <div className="stagger-text flex items-center gap-6 font-mono text-xs uppercase tracking-wider">
            <button
              onClick={() => { playClickSound(); setActiveTab('all'); }}
              className={`transition-colors cursor-pointer ${
                activeTab === 'all' ? 'text-[#e60000] font-bold border-b border-[#e60000] pb-1' : 'text-zinc-400 hover:text-white pb-1'
              }`}
            >
              {lang === 'uz' ? '// BARCHASI' : lang === 'ru' ? '// ВСЕ' : '// ALL'}
            </button>
            <button
              onClick={() => { playClickSound(); setActiveTab('tech'); }}
              className={`transition-colors cursor-pointer ${
                activeTab === 'tech' ? 'text-[#e60000] font-bold border-b border-[#e60000] pb-1' : 'text-zinc-400 hover:text-white pb-1'
              }`}
            >
              // FRONTEND
            </button>
            <button
              onClick={() => { playClickSound(); setActiveTab('tools'); }}
              className={`transition-colors cursor-pointer ${
                activeTab === 'tools' ? 'text-[#e60000] font-bold border-b border-[#e60000] pb-1' : 'text-zinc-400 hover:text-white pb-1'
              }`}
            >
              {lang === 'uz' ? '// ASBOBLAR & CI/CD' : lang === 'ru' ? '// ИНСТРУМЕНТЫ & CI/CD' : '// TOOLS & CI/CD'}
            </button>
          </div>
        </div>

        {/* Clean Typographic List with Smooth Hover Highlights */}
        <div className="divide-y divide-white/10 border-b border-white/10">
          {filteredSkills.map((item) => (
            <div
              key={item.num}
              className="stagger-text py-8 sm:py-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start group hover:bg-white/[0.015] transition-colors px-2 sm:px-4 relative"
            >
              {/* Left Accent Indicator on Hover */}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#e60000] opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="lg:col-span-2 font-mono text-xs text-zinc-400 group-hover:text-[#e60000] transition-colors flex lg:flex-col justify-between">
                <span className="font-bold text-sm">( {item.num} )</span>
                <span className="text-[11px] text-zinc-500 mt-1">{item.level}</span>
              </div>

              <div className="lg:col-span-4">
                <h3 className="font-editorial text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-white group-hover:text-[#e60000] transition-colors">
                  <ScrambleText text={item.name} variant={item.category === 'tech' ? 'cyber' : 'tech'} />
                </h3>
              </div>

              <div className="lg:col-span-6 space-y-4">
                <p className="text-zinc-400 leading-relaxed text-sm sm:text-base font-sans">
                  {item.desc}
                </p>

                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[11px] text-zinc-500">
                  {item.tags.map((tag, tIdx) => (
                    <React.Fragment key={tag}>
                      <span className="hover:text-white transition-colors">{tag}</span>
                      {tIdx < item.tags.length - 1 && <span className="text-zinc-700">&bull;</span>}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Soft Skills Section */}
        <div className="mt-20 pt-16 border-t border-white/10">
          <div className="stagger-text flex flex-wrap items-baseline justify-between gap-4 mb-10">
            <h3 className="font-editorial text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-white">
              <ScrambleText text={lang === 'uz' ? "// SHAXSIY MAHORAT (SOFT SKILLS)" : lang === 'ru' ? "// ЛИЧНЫЕ НАВЫКИ (SOFT SKILLS)" : "// SOFT SKILLS & CULTURE"} variant="bracket" />
            </h3>
            <span className="font-mono text-xs text-[#e60000] tracking-widest uppercase font-bold">
              {lang === 'uz' ? 'JAMOA BILAN HAMKORLIK' : lang === 'ru' ? 'КОМАНДНОЕ ВЗАИМОДЕЙСТВИЕ' : 'TEAM COLLABORATION'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14">
            {softSkills.map((s) => (
              <div key={s.num} className="stagger-text border-t border-white/10 pt-6 group">
                <div className="font-mono text-xs text-[#e60000] font-bold mb-2">
                  ( {s.num} )
                </div>
                <h4 className="font-editorial text-lg sm:text-xl font-bold uppercase text-white tracking-tight group-hover:text-[#e60000] transition-colors">
                  <ScrambleText text={s.title} variant="matrix" />
                </h4>
                <p className="mt-3 text-sm text-zinc-400 leading-relaxed font-sans">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Languages Table */}
        <div className="mt-20 pt-16 border-t border-white/10">
          <div className="stagger-text flex flex-wrap items-baseline justify-between gap-4 mb-8">
            <h3 className="font-editorial text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-white">
              {lang === 'uz' ? "// TILLARNI BILISH DARAJASI" : lang === 'ru' ? "// ВЛАДЕНИЕ ЯЗЫКАМИ" : "// LANGUAGE PROFICIENCY"}
            </h3>
            <span className="font-mono text-xs text-zinc-400 tracking-widest uppercase">
              {lang === 'uz' ? 'XALQARO HAMKORLIK' : lang === 'ru' ? 'МЕЖДУНАРОДНАЯ КОММУНИКАЦИЯ' : 'GLOBAL WORKFLOW'}
            </span>
          </div>

          <div className="stagger-text divide-y divide-white/10 border-y border-white/10 font-mono text-xs">
            {languages.map((l) => (
              <div
                key={l.lang}
                className="py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white/[0.015] transition-colors px-2"
              >
                <div className="flex items-center gap-4">
                  <span className="w-2 h-2 rounded-full bg-[#e60000]" />
                  <span className="font-bold text-white text-sm uppercase">{l.lang}</span>
                </div>
                <div className="text-zinc-400 sm:text-right">
                  <span className="text-white font-semibold">{l.level}</span>
                  <span className="block text-[11px] text-zinc-500 mt-0.5">{l.note}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default Skills;
