import React, { useState, useEffect, useRef } from 'react';
import Lenis from 'lenis';
import LiquidInkBackground from './components/LiquidInkBackground';
import InversionCursor from './components/InversionCursor';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import MarqueeTicker from './components/MarqueeTicker';
import ScrollManifesto from './components/ScrollManifesto';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Experience from './components/Experience';
import Contact from './components/Contact';
import Footer from './components/Footer';
import { ProjectModal, CVModal } from './components/Modals';
import AdminTrackerModal from './components/AdminTrackerModal';
import Toast from './components/Toast';
import AudioPlayer from './components/AudioPlayer';
import LoadingScreen from './components/LoadingScreen';
import { translations } from './utils/translations';
import { initScrollAnimations } from './utils/animations';
import { initAudioContext } from './utils/audio';
import { trackVisitor } from './utils/visitorTracker';

function App() {
  const [lang, setLang] = useState('uz');
  const [selectedProject, setSelectedProject] = useState(null);
  const [cvModalOpen, setCvModalOpen] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '' });
  const [scrollProgress, setScrollProgress] = useState(0);

  const lenisRef = useRef(null);

  const t = translations[lang] || translations.uz;

  // Auto visitor tracking to Telegram Bot
  useEffect(() => {
    trackVisitor();

    // Check if opened with ?admin=zxam or ?admin=true
    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') === 'zxam' || params.get('admin') === 'true') {
      setAdminModalOpen(true);
    }
  }, []);

  // Modal open / close handling: pause background Lenis scroll and allow inner modal card scrolling
  const isAnyModalOpen = Boolean(selectedProject || cvModalOpen || adminModalOpen);
  useEffect(() => {
    if (isAnyModalOpen) {
      lenisRef.current?.stop();
    } else {
      lenisRef.current?.start();
    }
  }, [isAnyModalOpen]);

  // Butter-Smooth Inertia Scroll (Lenis) + Granular Ambient Scroll Audio + GSAP Animations
  useEffect(() => {
    // Preload & resume audio context on the first user interaction
    const handleFirstGesture = () => {
      initAudioContext();
      window.removeEventListener('pointerdown', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
      window.removeEventListener('wheel', handleFirstGesture);
    };
    window.addEventListener('pointerdown', handleFirstGesture, { passive: true });
    window.addEventListener('keydown', handleFirstGesture, { passive: true });
    window.addEventListener('wheel', handleFirstGesture, { passive: true });

    const isMobile = typeof window !== 'undefined' &&
      (window.matchMedia('(hover: none) and (pointer: coarse)').matches || window.innerWidth < 768);

    let lenis = null;

    if (!isMobile) {
      lenis = new Lenis({
        duration: 1.15,
        easing: (val) => Math.min(1, 1.001 - Math.pow(2, -10 * val)),
        smoothWheel: true,
        wheelMultiplier: 1.0,
      });
      lenisRef.current = lenis;
    }

    let cleanupAnimations = () => {};
    // Ensure all DOM elements are mounted before initializing GSAP triggers
    const animTimer = setTimeout(() => {
      cleanupAnimations = initScrollAnimations(lenis);
    }, 150);

    const onScroll = () => {
      const scrollY = window.scrollY;
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;

      if (totalHeight > 0) {
        setScrollProgress((scrollY / totalHeight) * 100);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    let keyBuffer = '';
    let keyBufferTimer = null;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedProject(null);
        setCvModalOpen(false);
        setAdminModalOpen(false);
        return;
      }

      // Ignore keystrokes when typing inside inputs/textareas
      const tag = (e.target?.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'textarea') return;

      // Secret cheat-code: typing "zxam" anywhere on keyboard
      if (e.key && e.key.length === 1) {
        keyBuffer += e.key.toLowerCase();
        if (keyBuffer.length > 8) {
          keyBuffer = keyBuffer.slice(-8);
        }

        if (keyBuffer.endsWith('zxam')) {
          keyBuffer = '';
          setAdminModalOpen(true);
        }

        clearTimeout(keyBufferTimer);
        keyBufferTimer = setTimeout(() => {
          keyBuffer = '';
        }, 2200);
      }

      // Also support shortcut: Ctrl + Shift + A
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setAdminModalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(animTimer);
      clearTimeout(keyBufferTimer);
      lenis?.destroy();
      lenisRef.current = null;
      cleanupAnimations();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const showToast = (message) => {
    setToast({ visible: true, message });
    setTimeout(() => {
      setToast({ visible: false, message: '' });
    }, 3200);
  };

  return (
    <div
      id="app-root"
      className="relative min-h-screen bg-[#08080a] text-[#ffffff] overflow-x-hidden selection:bg-[#e60000] selection:text-[#ffffff] transition-colors duration-700"
    >
      {/* 3x3 Minimalist Cyber Preloader */}
      <LoadingScreen />

      {/* Scroll Progress Bar at very top */}
      <div
        className="fixed top-0 left-0 right-0 h-[2.5px] z-50 transition-all duration-75 pointer-events-none bg-[#e60000] shadow-[0_0_12px_rgba(230,0,0,0.8)]"
        style={{ width: `${scrollProgress}%` }}
        aria-hidden="true"
      />

      {/* Trailing Inversion Custom Cursor */}
      <InversionCursor />

      {/* Interactive High-Speed Navier-Stokes Liquid Inversion Canvas */}
      <LiquidInkBackground />


      {/* Header / Navbar */}
      <Navbar
        lang={lang}
        setLang={setLang}
        t={t}
        onOpenCV={() => setCvModalOpen(true)}
      />

      {/* Main Editorial Content Flow */}
      <main className="relative z-10">
        <Hero
          onOpenCV={() => setCvModalOpen(true)}
          t={t}
        />
        <MarqueeTicker />
        <ScrollManifesto lang={lang} />
        <About t={t} />
        <Skills lang={lang} />
        <Projects onSelectProject={(p) => setSelectedProject(p)} lang={lang} t={t} />
        <Experience lang={lang} t={t} />
        <Contact onShowToast={showToast} t={t} />
      </main>

      {/* Footer */}
      <Footer t={t} onOpenAdmin={() => setAdminModalOpen(true)} />

      {/* Interactive Modals */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        lang={lang}
        t={t}
      />

      <CVModal
        isOpen={cvModalOpen}
        onClose={() => setCvModalOpen(false)}
        t={t}
      />

      {/* Secret Admin Visitor Tracker Modal */}
      <AdminTrackerModal
        isOpen={adminModalOpen}
        onClose={() => setAdminModalOpen(false)}
        onShowToast={showToast}
      />

      {/* Floating Feedback Toast */}
      <Toast message={toast.message} visible={toast.visible} />

      {/* Futuristic Background Audio Player */}
      <AudioPlayer />
    </div>
  );
}

export default App;
