import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const initScrollAnimations = (lenisInstance) => {
  let tickerCallback = null;
  let scrollVelocityCallback = null;

  // 1. Synchronize Lenis with GSAP ScrollTrigger
  if (lenisInstance) {
    lenisInstance.on('scroll', ScrollTrigger.update);

    tickerCallback = (time) => {
      lenisInstance.raf(time * 1000);
    };
    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    // 2. Velocity-Sensitive Physics Connection (daqconsulting.com inspired)
    scrollVelocityCallback = ({ velocity }) => {
      const clampedSkew = Math.max(-2.5, Math.min(2.5, velocity * 0.035));
      gsap.to('.velocity-skew', {
        skewY: clampedSkew,
        duration: 0.28,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    };
    lenisInstance.on('scroll', scrollVelocityCallback);
  }

  // 3. Immediate Hero Entrance Animation (Runs on mount, no scroll needed!)
  const heroTL = gsap.timeline({ defaults: { ease: 'power3.out' } });
  
  const heroBadge = document.querySelector('.hero-badge-entry');
  const heroTitleLines = document.querySelectorAll('.hero-title-entry');
  const heroTypewriter = document.querySelector('.hero-typewriter-entry');
  const heroBio = document.querySelector('.hero-bio-entry');
  const heroTech = document.querySelector('.hero-tech-entry');
  const heroActions = document.querySelector('.hero-actions-entry');
  const heroLinks = document.querySelector('.hero-links-entry');
  const heroPortrait = document.querySelector('.hero-portrait-entry');

  if (heroBadge) {
    heroTL.fromTo(heroBadge, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 });
  }
  if (heroTitleLines.length > 0) {
    heroTL.fromTo(heroTitleLines, { opacity: 0, y: 45 }, { opacity: 1, y: 0, duration: 0.85, stagger: 0.12 }, '-=0.35');
  }
  if (heroTypewriter) {
    heroTL.fromTo(heroTypewriter, { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.4');
  }
  if (heroBio) {
    heroTL.fromTo(heroBio, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.4');
  }
  if (heroTech) {
    heroTL.fromTo(heroTech, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.5 }, '-=0.35');
  }
  if (heroActions) {
    heroTL.fromTo(heroActions, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.35');
  }
  if (heroLinks) {
    heroTL.fromTo(heroLinks, { opacity: 0 }, { opacity: 1, duration: 0.5 }, '-=0.3');
  }
  if (heroPortrait) {
    heroTL.fromTo(heroPortrait, { opacity: 0, scale: 0.94 }, { opacity: 1, scale: 1, duration: 1.1, ease: 'power2.out' }, '-=1.0');
  }

  // 4. Scroll-Triggered Slide-Up Reveals for Sections (About, Skills, Projects, Experience, Contact)
  const revealElements = document.querySelectorAll('.stagger-reveal, .stagger-text');
  revealElements.forEach((el, idx) => {
    gsap.fromTo(
      el,
      {
        y: 40,
        opacity: 0
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        delay: (idx % 3) * 0.08,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  });

  // 5. Parallax elements with data-speed
  const parallaxItems = document.querySelectorAll('[data-speed]');
  parallaxItems.forEach((item) => {
    const speed = parseFloat(item.getAttribute('data-speed')) || 0.15;
    gsap.to(item, {
      y: () => -80 * speed,
      ease: 'none',
      scrollTrigger: {
        trigger: item,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });
  });

  // 6. Force ScrollTrigger refresh once DOM, images, and fonts are ready
  const refreshTimer1 = setTimeout(() => ScrollTrigger.refresh(), 300);
  const refreshTimer2 = setTimeout(() => ScrollTrigger.refresh(), 800);

  return () => {
    clearTimeout(refreshTimer1);
    clearTimeout(refreshTimer2);
    if (tickerCallback) {
      gsap.ticker.remove(tickerCallback);
    }
    if (lenisInstance && scrollVelocityCallback) {
      lenisInstance.off('scroll', scrollVelocityCallback);
    }
    ScrollTrigger.getAll().forEach((t) => t.kill());
  };
};
