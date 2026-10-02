import React from 'react';
import { X, ExternalLink, Printer } from 'lucide-react';
import { GithubIcon } from './Icons';
import { playClickSound } from '../utils/audio';

export const ProjectModal = ({ project, onClose, lang, t }) => {
  if (!project) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="fixed inset-0 bg-[#0b0b0b]/90 backdrop-blur-md transition-opacity duration-300 cursor-pointer"
        onClick={() => {
          playClickSound();
          onClose();
        }}
      />

      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#0b0b0b] border border-[#ffffff]/20 shadow-[0_25px_60px_rgba(0,0,0,0.95)] z-20 p-6 sm:p-10 animate-modal-zoom custom-scrollbar font-mono text-xs">
        {/* Close Button */}
        <button
          onClick={() => {
            playClickSound();
            onClose();
          }}
          className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center bg-[#000000] hover:bg-[#e60000] text-[#ffffff] border border-[#ffffff]/20 transition-colors cursor-pointer z-30"
          aria-label="Yopish"
        >
          <X className="w-5 h-5 pointer-events-none" />
        </button>

        {/* Modal Image */}
        <div className="relative border border-[#ffffff]/15 mb-8 overflow-hidden">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-auto max-h-[420px] object-cover object-top filter contrast-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0b] via-transparent to-transparent opacity-60 pointer-events-none" />
          <div className="absolute bottom-4 left-4 font-mono text-xs uppercase tracking-widest bg-[#0b0b0b] text-[#ffffff] px-3.5 py-1.5 border border-[#ffffff]/20">
            // {project.tag}
          </div>
        </div>

        {/* Tag & Title */}
        <div className="flex items-center gap-3 mb-2 text-[#e60000] uppercase tracking-wider font-bold">
          <span>( PROJECT {project.num} )</span>
          <span className="text-[#888888]">//</span>
          <span className="text-[#ffffff]">PRODUCTION_READY</span>
        </div>

        <h3 className="text-3xl sm:text-4xl font-extrabold font-editorial uppercase tracking-tight text-[#ffffff] mb-4">
          {project.title}
        </h3>

        <p className="text-[#ffffff]/80 leading-relaxed text-sm sm:text-base font-sans mb-8">
          {project.fullDesc[lang] || project.fullDesc.en}
        </p>

        {/* Features */}
        <div className="mb-8">
          <h4 className="font-mono text-xs uppercase tracking-wider text-[#e60000] mb-4 font-bold">
            // {t.modalFeaturesTitle || 'ARCHITECTURAL HIGHLIGHTS:'}
          </h4>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(project.features[lang] || project.features.en).map((feat, idx) => (
              <li
                key={idx}
                className="flex items-start gap-3 text-xs sm:text-sm text-[#ffffff]/85 p-3.5 bg-[#000000] border border-[#ffffff]/10 font-sans"
              >
                <span className="font-mono text-xs text-[#e60000] mt-0.5">0{idx + 1}</span>
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Tech Stack */}
        <div className="mb-8 pt-4 border-t border-[#ffffff]/15">
          <h4 className="font-mono text-xs uppercase tracking-wider text-[#888888] mb-3">
            // TECH_STACK:
          </h4>
          <div className="flex flex-wrap gap-2">
            {project.tech.map((techItem, idx) => (
              <span
                key={idx}
                className="px-3 py-1 text-xs border border-[#ffffff]/20 text-[#ffffff]"
              >
                {techItem}
              </span>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-4 pt-6 border-t border-[#ffffff]/15 uppercase tracking-wider">
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={playClickSound}
            className="flex items-center gap-2 px-6 py-3.5 bg-[#ffffff] hover:bg-[#e60000] text-[#0b0b0b] hover:text-[#ffffff] font-bold text-xs transition-colors"
          >
            <span>LIVE DEMO</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={playClickSound}
            className="flex items-center gap-2 px-6 py-3.5 border border-[#ffffff]/30 hover:border-[#ffffff] text-[#ffffff] text-xs font-semibold transition-colors"
          >
            <GithubIcon className="w-4 h-4" />
            <span>GITHUB CODE</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export const CVModal = ({ isOpen, onClose, t }) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    playClickSound();
    window.print();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="fixed inset-0 bg-[#0b0b0b]/90 backdrop-blur-md transition-opacity duration-300 cursor-pointer"
        onClick={() => {
          playClickSound();
          onClose();
        }}
      />

      <div className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto bg-[#0b0b0b] border border-[#ffffff]/20 shadow-[0_25px_60px_rgba(0,0,0,0.95)] z-20 p-6 sm:p-10 animate-modal-zoom custom-scrollbar print-modal-area font-mono text-xs">
        {/* Close Button */}
        <button
          onClick={() => {
            playClickSound();
            onClose();
          }}
          className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center bg-[#000000] hover:bg-[#e60000] text-[#ffffff] border border-[#ffffff]/20 transition-colors print:hidden cursor-pointer z-30"
          aria-label="Yopish"
        >
          <X className="w-5 h-5 pointer-events-none" />
        </button>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#ffffff]/15">
          <div>
            <h3 className="text-3xl font-extrabold font-editorial uppercase tracking-tight text-[#ffffff]">
              Ablakimov Jamshid (zxam)
            </h3>
            <p className="text-[#e60000] text-xs mt-1 uppercase font-semibold">
              Junior Frontend Developer (React.js &amp; Tailwind CSS) &bull; Guliston ( UZ )
            </p>
          </div>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 border border-[#ffffff]/30 hover:border-[#e60000] hover:bg-[#e60000] text-[#ffffff] text-xs transition-all self-start sm:self-auto print:hidden font-bold"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{t.btnPrint || 'PRINT CV'}</span>
          </button>
        </div>

        {/* Content sections */}
        <div className="py-6 space-y-6 text-[#ffffff]/80 text-xs">
          {/* Contacts */}
          <div>
            <h4 className="text-[#e60000] uppercase tracking-wider mb-2 font-bold">// CONTACT &amp; LOCATION</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[#ffffff]">
              <p><strong className="text-[#888888]">Joylashuv:</strong> Guliston, Sirdaryo</p>
              <p><strong className="text-[#888888]">Telefon:</strong> +998 (94) 010 40 39</p>
              <p><strong className="text-[#888888]">Telegram:</strong> @jamwidunvrsl</p>
              <p><strong className="text-[#888888]">GitHub:</strong> github.com/zhamlconsepts</p>
            </div>
          </div>

          {/* Technical Skills */}
          <div>
            <h4 className="text-[#e60000] uppercase tracking-wider mb-2 font-bold">// TECHNICAL SKILLS</h4>
            <p><strong className="text-[#ffffff]">Frontend:</strong> React.js, Tailwind CSS, JavaScript (ES6+), HTML5, CSS3, Modern Responsive Layouts</p>
            <p className="mt-1"><strong className="text-[#ffffff]">Tools &amp; Workflow:</strong> GitHub, Git, Vite, Figma, Vercel, REST API Integration, CI/CD basics</p>
          </div>

          {/* Soft Skills */}
          <div>
            <h4 className="text-[#e60000] uppercase tracking-wider mb-2 font-bold">// SOFT SKILLS</h4>
            <p>Strong teamwork and friendly communication, O'z ustida qayta ishlash (continuous self-improvement), G'oyalar o'rganish va kamchiliklar qidirish (critical exploration &amp; solution finding), Xushchaqchaq va sabrli (positive mindset &amp; patience).</p>
          </div>

          {/* Work Experience */}
          <div>
            <h4 className="text-[#e60000] uppercase tracking-wider mb-2 font-bold">// WORK EXPERIENCE</h4>
            <div className="p-4 bg-[#000000] border border-[#ffffff]/10">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-[#ffffff] text-sm uppercase">Junior Frontend Developer</span>
                <span className="text-[#e60000]">2025 - Present</span>
              </div>
              <ul className="list-disc list-inside space-y-1.5 mt-2 text-[#ffffff]/80">
                <li>Developed responsive UIs using React.js, Tailwind CSS, and Figma for clean and modern user experiences.</li>
                <li>Collaborated through Git &amp; GitHub for version control and workflow management.</li>
                <li>Implemented deployment and testing pipelines using Vercel and basic CI/CD practices.</li>
                <li>Strengthened problem-solving and teamwork skills through real-world, end-to-end project development.</li>
              </ul>
            </div>
          </div>

          {/* Education */}
          <div>
            <h4 className="text-[#e60000] uppercase tracking-wider mb-2 font-bold">// EDUCATION</h4>
            <div className="space-y-2">
              <div className="p-3 bg-[#000000] border border-[#ffffff]/10">
                <span className="font-semibold text-[#ffffff] uppercase">IT LIVE Academy (2026)</span>
                <p className="text-[#888888] text-[11px]">Frontend Developer Specialization</p>
              </div>
              <div className="p-3 bg-[#000000] border border-[#ffffff]/10">
                <span className="font-semibold text-[#ffffff] uppercase">Web Practikum</span>
                <p className="text-[#888888] text-[11px]">Frontend Developer Course</p>
              </div>
            </div>
          </div>

          {/* Languages */}
          <div>
            <h4 className="text-[#e60000] uppercase tracking-wider mb-2 font-bold">// LANGUAGES</h4>
            <p><strong className="text-[#ffffff]">Uzbek:</strong> Native (Ona tili) | <strong className="text-[#ffffff]">English:</strong> Intermediate (B1/B2) | <strong className="text-[#ffffff]">Russian:</strong> Intermediate (B1/B2)</p>
          </div>
        </div>
      </div>
    </div>
  );
};
