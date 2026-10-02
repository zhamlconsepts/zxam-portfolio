import React from 'react';
import { Eye, ArrowUpRight } from 'lucide-react';
import { GithubIcon } from './Icons';
import { playClickSound } from '../utils/audio';
import ScrambleText from './ScrambleText';

const Projects = ({ onSelectProject, lang, t }) => {
  const projectsData = [
    {
      idx: 0,
      num: '01',
      title: 'CALL OUR HERO (COH)',
      subtitle: 'SMART ECO-LOGISTICS & CIVIC PLATFORM',
      tag: 'CIVIC TECH & SMART LOGISTICS',
      variant: 'tech',
      image: '/assets/project-coh.jpg',
      shortDesc: {
        uz: "50 kishilik jamoaviy birlik orqali mahallalarda chiqindilarni saralash, monitoring qilish va tezkor ekologik logistika boshqaruv platformasi. Aholi portali va dispetcherlar operatsion markazi.",
        ru: "Платформа гражданских эко-инициатив и интеллектуальной логистики. Система коллективного сбора отходов (порог 50 участников), портал жителей и операционный центр диспетчера.",
        en: "Smart eco-logistics and civic community platform. Features 50-resident collective action thresholds for waste sorting, municipal dispatcher control center, and real-time fleet telemetry."
      },
      fullDesc: {
        uz: "Call Our Hero (COH) — shahar ekologiyasini yaxshilash va mahalla aholisini birlashtirishga qaratilgan innovatsion platforma. Loyiha 50 kishilik talab marrasiga asoslangan holda maxsus transport vositalarini yo'naltirish, dispetcherlar uchun operatsion boshqaruv paneli va xaritalar integratsiyasini o'z ichiga oladi.",
        ru: "Call Our Hero (COH) — передовая веб-платформа для координации раздельного сбора отходов и эко-логистики. Автоматически активирует вызов спецтехники по достижению квоты в 50 жителей, предоставляет диспетчерам интерактивный центр управления и карту телеметрии.",
        en: "Call Our Hero (COH) is a civic-tech ecosystem designed for urban waste sorting and rapid eco-logistics dispatch. Operates on a 50-resident collective quorum mechanism, empowering neighborhoods with community tools while providing municipal dispatchers with high-performance routing telemetry."
      },
      features: {
        uz: [
          "Aholi va xonadonlar uchun interaktiv portal",
          "50 kishilik jamoaviy maqsadli talab kvotasi",
          "Dispetcherlar uchun real vaqtli operatsion markaz",
          "AI marshrut optimallashtirish va avtopark monitoringi"
        ],
        ru: [
          "Интерактивный портал для жителей и домохозяйств",
          "Квота коллективных заявок (порог 50 участников)",
          "Операционный центр диспетчера в реальном времени",
          "Оптимизация маршрутов автопарка и телеметрия"
        ],
        en: [
          "Interactive citizen & household neighborhood portal",
          "50-resident collective action quorum mechanism",
          "Real-time operational dispatch control center",
          "Automated fleet routing and logistics telemetry"
        ]
      },
      tech: ['HTML5 / CSS3', 'JavaScript ES6+', 'Smart Logistics', 'Vercel', 'Geo-Dispatch'],
      liveUrl: 'https://call-our-hero-coh.vercel.app/',
      githubUrl: 'https://github.com/zhamlconsepts'
    },
    {
      idx: 1,
      num: '02',
      title: 'PANTHERA PARDUS',
      subtitle: 'INTERACTIVE 3D SCROLLYTELLING MONOGRAPH',
      tag: 'EDITORIAL SCROLLYTELLING & 3D',
      variant: 'cyber',
      image: '/assets/project-panthera.jpg',
      shortDesc: {
        uz: "Panthera Pardus (Qoplon) haqidagi fotorealistik ilmiy monografiya va interaktiv scrollytelling tajribasi. Skrollga sinxronlangan kinestetik video boshqaruvi va stardust zarrachalar kanvasi.",
        ru: "Интерактивная научная монография и кинематографичный scrollytelling об анатомии и жизни Panthera Pardus. Скролл-скраббинг видео в реальном времени, система частиц Canvas и фото-реестр.",
        en: "Cinematic scrollytelling monograph exploring the apex predator Panthera Pardus. Features frame-scrubbed interactive background video, Canvas stardust particles, and photo archive."
      },
      fullDesc: {
        uz: "Panthera Pardus — tabiatning eng mukammal yirtqichiga bag'ishlangan zamonaviy interaktiv monografiya. Loyihada foydalanuvchining skroll harakatiga to'liq sinxronlangan 120-kadrli fotorealistik video tahlili, Canvas zarrachalari, zamonaviy editorial tipografiya va taqqoslash matritsalari yaratilgan.",
        ru: "Panthera Pardus — премиальная веб-монография, посвященная анатомии и повадкам леопарда. Проект сочетает покадровый скраббинг кинематографичного видео, синхронизированный со скроллом, генеративные частицы на HTML5 Canvas, швейцарскую типографику и исследовательскую матрицу.",
        en: "Panthera Pardus is an editorial web monograph chronicling the apex predator. Engineered with scroll-scrubbed 120-frame cinematic video playback, kinetic stardust Canvas particle physics, precision typography, and anatomical telemetry."
      },
      features: {
        uz: [
          "Skrollga bog'langan 120-kadrli interaktiv video tizimi",
          "Kinestetik savanna stardust zarrachalar kanvasi",
          "Anatomik taqqoslash matritsasi va telemetriya",
          "Arxiv foto-reyestri va dinamik audio dvigatel"
        ],
        ru: [
          "Интерактивный скролл-скраббинг видео (120 кадров)",
          "Кинетическая система частиц Stardust на Canvas",
          "Анатомическая матрица сравнения и телеметрия",
          "Архивный фото-реестр и встроенный аудио-движок"
        ],
        en: [
          "Bidirectional scroll-scrubbed cinematic video player",
          "Kinetic savanna stardust Canvas particle system",
          "Anatomical comparison telemetry matrix",
          "Archive photo registry and dynamic ambient audio"
        ]
      },
      tech: ['Vite', 'JavaScript ES6+', 'HTML5 Canvas', 'Scrollytelling', 'Vercel'],
      liveUrl: 'https://zoo-pi-ten.vercel.app/',
      githubUrl: 'https://github.com/zhamlconsepts'
    },
    {
      idx: 2,
      num: '03',
      title: 'NEXUS AI ANALYTICS',
      subtitle: 'DATA TELEMETRY & PREDICTIVE METRICS',
      tag: 'SAAS & DATA PLATFORM',
      variant: 'matrix',
      image: '/assets/project-saas.jpg',
      shortDesc: {
        uz: "Sun'iy intellekt ma'lumotlarini real vaqt rejimida vizualizatsiya qiluvchi zamonaviy boshqaruv paneli. Foydalanuvchi faolligi grafiklari, anomaliyalarni aniqlash matritsasi va to'liq moslashuvchan dizayn.",
        ru: "Панель мониторинга и телеметрии данных искусственного интеллекта в реальном времени. Высокопроизводительные интерактивные графики, матрица выявления аномалий и адаптивная темная архитектура.",
        en: "Real-time AI telemetry and metric visualization dashboard. High-performance charts, anomaly detection grid, session analytics, and responsive dark glassmorphism architecture."
      },
      fullDesc: {
        uz: "Nexus AI - zamonaviy veb xizmatlarining tahliliy ko'rsatkichlarini bir joyda jamlovchi murakkab boshqaruv paneli. Ushbu loyihada React.js komponentlar arxitekturasi, Chart.js yordamida real vaqt grafiklari, murakkab filtrlash mexanizmlari va Tailwind CSS orqali yuqori darajadagi foydalanuvchi tajribasi yaratilgan.",
        ru: "Nexus AI — высокопроизводительная веб-панель для централизованного многомерного анализа данных. Разработана с использованием модульной иерархии компонентов React.js, телеметрии на Chart.js в реальном времени, динамической фильтрации и стильного темного интерфейса на Tailwind CSS.",
        en: "Nexus AI is a high-performance web dashboard centralizing multi-dimensional analytics. Developed using modular React.js component hierarchy, real-time Chart.js telemetry, dynamic data filtration, and sleek dark UI with Tailwind CSS."
      },
      features: {
        uz: [
          "Real vaqt rejimida yangilanuvchi interaktiv grafiklar",
          "Anomaliyalarni aniqlovchi issiqlik xaritasi (Heatmap matrix)",
          "100% responsiv va ultra-silliq dark dizayn",
          "Vite yordamida optimallashtirilgan tezkor yuklanish"
        ],
        ru: [
          "Интерфактивные графики с обновлением метрик в реальном времени",
          "Тепловая карта и телеметрия обнаружения аномалий",
          "100% адаптивная темная дизайн-система",
          "Оптимизированная и мгновенная сборка на Vite"
        ],
        en: [
          "Interactive real-time metric charting engine",
          "Anomaly detection telemetry and activity heatmaps",
          "100% responsive dark design system",
          "Vite-bundled fast asset delivery with zero lag"
        ]
      },
      tech: ['React.js', 'Tailwind CSS', 'Chart.js', 'Vite', 'Vercel'],
      liveUrl: 'https://github.com/zhamlconsepts',
      githubUrl: 'https://github.com/zhamlconsepts'
    }
  ];

  return (
    <section id="projects" className="py-24 lg:py-36 relative border-t border-white/10 bg-[#08080a]">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14">
        
        {/* Section Header */}
        <div className="flex flex-wrap items-end justify-between gap-6 pb-8 border-b border-white/10 mb-24">
          <div className="stagger-text">
            <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-[#e60000] mb-3 font-bold">
              <span>( 03 )</span>
              <span className="w-8 h-[1px] bg-[#e60000]" />
              <ScrambleText text="RECORDS // SELECTED WORKS" variant="tech" />
            </div>
            <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black font-editorial uppercase tracking-tighter leading-none text-white">
              <ScrambleText text="PROJECTS" variant="matrix" />
              <span className="text-[#e60000] inline-block ml-3">
                <ScrambleText text="&bull; RELEASES" variant="cyber" />
              </span>
            </h2>
          </div>

          <div className="stagger-text font-mono text-xs text-zinc-400 uppercase tracking-wider text-right">
            <div>// CODE REPOSITORIES &bull; LIVE SITES</div>
            <div className="text-white font-bold">
              <ScrambleText text="REACT &bull; TAILWIND &bull; VERCEL" variant="tech" />
            </div>
          </div>
        </div>

        {/* Asymmetrical Editorial Project Spreads (NO CARDS, PURE FLUID LAYOUT) */}
        <div className="space-y-28 lg:space-y-36">
          {projectsData.map((project, i) => {
            const isReversed = i % 2 === 1;

            return (
              <div
                key={project.idx}
                className="stagger-text grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center group select-none"
              >
                {/* Visual Image Spread (7 cols) */}
                <div className={`lg:col-span-7 relative velocity-skew will-change-transform ${isReversed ? 'lg:order-2' : 'lg:order-1'}`}>
                  <div
                    onClick={() => {
                      playClickSound();
                      onSelectProject(project);
                    }}
                    className="relative block cursor-pointer overflow-hidden group/img aspect-[16/10]"
                  >
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover filter grayscale contrast-110 brightness-95 group-hover/img:grayscale-0 group-hover/img:scale-105 transition-all duration-700 ease-out"
                      loading="lazy"
                    />

                    {/* Minimalist corner release tag (no chunky card box) */}
                    <div className="absolute top-4 left-4 font-mono text-[11px] uppercase tracking-widest text-zinc-400 bg-black/80 px-2.5 py-1">
                      ( {project.num} ) // {project.tag}
                    </div>

                    {/* Hover Red Accent Overlay */}
                    <div className="absolute inset-0 bg-[#e60000]/10 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="font-mono text-xs uppercase tracking-widest bg-white text-black px-6 py-3 font-bold flex items-center gap-2 shadow-2xl">
                        <Eye className="w-4 h-4 text-[#e60000]" />
                        <span>EXPLORE RECORD</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Typography & Editorial Metadata (5 cols) */}
                <div className={`lg:col-span-5 flex flex-col justify-between ${isReversed ? 'lg:order-1' : 'lg:order-2'}`}>
                  <div>
                    <div className="flex items-center gap-3 font-mono text-xs text-[#e60000] tracking-widest uppercase mb-3 font-bold">
                      <span>RELEASE ( {project.num} )</span>
                      <span className="w-6 h-[1px] bg-[#e60000]" />
                      <span className="text-zinc-500">{project.tag}</span>
                    </div>

                    <h3 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white leading-tight transition-colors">
                      <ScrambleText text={project.title} variant={project.variant} />
                    </h3>

                    <div className="font-mono text-xs text-zinc-400 uppercase tracking-widest mt-1 mb-6">
                      <ScrambleText text={project.subtitle} variant="bracket" />
                    </div>

                    <p className="text-base text-zinc-300 leading-relaxed font-sans mb-8">
                      {project.shortDesc[lang] || project.shortDesc.en}
                    </p>

                    {/* Typographic Tech List (NO BOX PILLS) */}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-zinc-500 mb-8">
                      {project.tech.map((tItem, idx) => (
                        <React.Fragment key={tItem}>
                          <ScrambleText text={tItem} variant="tech" className="hover:text-white transition-colors" />
                          {idx < project.tech.length - 1 && <span className="text-zinc-700">&bull;</span>}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>

                  {/* Actions - Clean Editorial Buttons */}
                  <div className="flex flex-wrap items-center gap-4 pt-6 border-t border-white/10 font-mono text-xs uppercase tracking-wider">
                    <button
                      onClick={() => {
                        playClickSound();
                        onSelectProject(project);
                      }}
                      className="px-6 py-3.5 bg-white text-black hover:bg-[#e60000] hover:text-white font-bold transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{t.btnViewDetails || 'VIEW DETAILS'}</span>
                    </button>

                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={playClickSound}
                      className="px-5 py-3.5 border border-white/20 hover:border-white text-white hover:bg-white/10 transition-colors flex items-center gap-1.5"
                    >
                      <span>LIVE DEMO</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>

                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={playClickSound}
                      className="p-3.5 border border-white/20 hover:border-white text-white hover:bg-white/10 transition-colors"
                      title="GitHub Repository"
                    >
                      <GithubIcon className="w-4 h-4" />
                    </a>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default Projects;
