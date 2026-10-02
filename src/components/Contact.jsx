import React, { useState } from 'react';
import { Copy, Check, ArrowUpRight, Send, MapPin, Mail, Phone } from 'lucide-react';
import { TelegramIcon, GithubIcon } from './Icons';
import { playClickSound, playSuccessSound } from '../utils/audio';
import ScrambleText from './ScrambleText';

const Contact = ({ onShowToast, t }) => {
  const [formData, setFormData] = useState({ name: '', contact: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [copiedKey, setCopiedKey] = useState(null);

  const handleCopy = (text, key) => {
    playClickSound();
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    onShowToast(`${text} - ${t.copiedToast || 'Nusxalandi!'}`);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.contact || !formData.message) return;

    playSuccessSound();
    setSubmitted(true);
    onShowToast(t.formSuccess || 'Xabar qabul qilindi! Telegram ochilmoqda...');

    const telegramText = encodeURIComponent(
      `Assalomu alaykum Jamshid! Mening ismim: ${formData.name}. Aloqa: ${formData.contact}. Xabar: ${formData.message}`
    );
    setTimeout(() => {
      window.open(`https://t.me/jamwidunvrsl?text=${telegramText}`, '_blank');
    }, 1000);
  };

  return (
    <section id="contact" className="py-24 lg:py-36 relative border-t border-white/10 bg-[#08080a]">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14">
        
        {/* Editorial Section Header */}
        <div className="flex flex-wrap items-end justify-between gap-6 pb-8 border-b border-white/10 mb-20">
          <div className="stagger-text">
            <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-[#e60000] mb-3 font-bold">
              <span>( 05 )</span>
              <span className="w-8 h-[1px] bg-[#e60000]" />
              <span>DIRECT CHANNELS &bull; INQUIRIES</span>
            </div>
            <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black font-editorial uppercase tracking-tighter leading-none text-white">
              CONTACT{' '}
              <span className="text-[#e60000]">
                US
              </span>
            </h2>
          </div>

          <div className="stagger-text font-mono text-xs text-zinc-400 uppercase tracking-wider text-right">
            <div>// OPEN FOR WORK &bull; CONTRACTS</div>
            <div className="text-white font-bold">GULISTON // WORLDWIDE</div>
          </div>
        </div>

        {/* Editorial Layout: Balanced 2-Column Grid (Zero Overlap & Guaranteed Breathing Room) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Direct Contact Info (5 cols, max-w-md for generous buffer) */}
          <div className="lg:col-span-5 space-y-8 max-w-md">
            <div className="stagger-text">
              <h3 className="font-editorial font-black uppercase tracking-tight text-white select-none">
                <span className="block text-3xl sm:text-4xl xl:text-[44px] leading-[0.92]">
                  LET'S
                </span>
                <span className="block text-3xl sm:text-4xl xl:text-[44px] leading-[0.92]">
                  BUILD
                </span>
                <span className="block text-3xl sm:text-4xl xl:text-[44px] leading-[0.92]">
                  SOMETHING
                </span>
                <span className="block text-[#e60000] text-xl sm:text-2xl md:text-3xl xl:text-[32px] tracking-tight mt-2 leading-none">
                  EXTRAORDINARY.
                </span>
              </h3>
              <p className="text-sm sm:text-base text-zinc-400 leading-relaxed font-sans max-w-sm mt-5">
                {t.contactSubtitle || "Yangi takliflar, loyihalar yoki jamoaga qo'shilish bo'yicha xabar qoldiring"}
              </p>
            </div>

            {/* Direct Channel Rows */}
            <div className="stagger-text divide-y divide-white/10 border-y border-white/10 font-mono text-xs">
              {/* Telegram */}
              <div className="py-4 flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <TelegramIcon className="w-4 h-4 text-[#e60000]" />
                  <div>
                    <span className="text-zinc-500 block text-[10px] uppercase">TELEGRAM</span>
                    <a
                      href="https://t.me/jamwidunvrsl"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={playClickSound}
                      className="text-white group-hover:text-[#e60000] font-bold text-sm transition-colors"
                    >
                      @jamwidunvrsl
                    </a>
                  </div>
                </div>
                <a
                  href="https://t.me/jamwidunvrsl"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={playClickSound}
                  className="px-2.5 py-1 border border-white/20 text-zinc-400 hover:text-white hover:border-white transition-colors"
                >
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* GitHub */}
              <div className="py-4 flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <GithubIcon className="w-4 h-4 text-[#e60000]" />
                  <div>
                    <span className="text-zinc-500 block text-[10px] uppercase">GITHUB REPOSITORY</span>
                    <a
                      href="https://github.com/zhamlconsepts"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={playClickSound}
                      className="text-white group-hover:text-[#e60000] font-bold text-sm transition-colors"
                    >
                      github.com/zhamlconsepts
                    </a>
                  </div>
                </div>
                <a
                  href="https://github.com/zhamlconsepts"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={playClickSound}
                  className="px-2.5 py-1 border border-white/20 text-zinc-400 hover:text-white hover:border-white transition-colors"
                >
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Phone */}
              <div className="py-4 flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-[#e60000]" />
                  <div>
                    <span className="text-zinc-500 block text-[10px] uppercase">PHONE</span>
                    <a
                      href="tel:+998940104039"
                      onClick={playClickSound}
                      className="text-white group-hover:text-[#e60000] font-bold text-sm transition-colors"
                    >
                      +998 (94) 010 40 39
                    </a>
                  </div>
                </div>
                <button
                  onClick={() => handleCopy('+998940104039', 'phone')}
                  className="px-2.5 py-1 border border-white/20 text-zinc-400 hover:text-white hover:border-white transition-colors cursor-pointer"
                  title="Copy Phone"
                >
                  {copiedKey === 'phone' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Email */}
              <div className="py-4 flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-[#e60000]" />
                  <div>
                    <span className="text-zinc-500 block text-[10px] uppercase">EMAIL</span>
                    <a
                      href="mailto:zhahsoh@gmail.com"
                      onClick={playClickSound}
                      className="text-white group-hover:text-[#e60000] font-bold text-sm transition-colors"
                    >
                      zhahsoh@gmail.com
                    </a>
                  </div>
                </div>
                <button
                  onClick={() => handleCopy('zhahsoh@gmail.com', 'email')}
                  className="px-2.5 py-1 border border-white/20 text-zinc-400 hover:text-white hover:border-white transition-colors cursor-pointer"
                  title="Copy Email"
                >
                  {copiedKey === 'email' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Location */}
              <div className="py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-[#e60000]" />
                  <div>
                    <span className="text-zinc-500 block text-[10px] uppercase">LOCATION</span>
                    <span className="text-white font-semibold text-sm">Guliston, Sirdaryo, UZ</span>
                  </div>
                </div>
                <span className="font-mono text-xs text-[#e60000] font-bold">( UZ )</span>
              </div>
            </div>
          </div>

          {/* Right Column: Transmission Form (7 cols) */}
          <div className="lg:col-span-7 xl:col-span-7 stagger-text pt-2">
            <div className="flex items-center justify-between pb-4 mb-8 border-b border-white/10 font-mono text-xs">
              <span className="uppercase tracking-widest text-[#e60000] font-bold">
                // TRANSMISSION INTERFACE
              </span>
              <span className="text-zinc-500">[ ENCRYPTED DIRECT TELEGRAM ]</span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label className="block font-mono text-xs uppercase tracking-widest text-zinc-400 mb-2">
                  {t.formNameLabel || '01 // ISM YOKI KOMPANIYA NOMI'}
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={t.formName || "Masalan: Aziz Rahimov / IT Tech"}
                  className="w-full bg-transparent border-b border-white/20 focus:border-[#e60000] py-3 text-white placeholder-zinc-600 font-sans text-base focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block font-mono text-xs uppercase tracking-widest text-zinc-400 mb-2">
                  {t.formContactLabel || '02 // EMAIL YOKI TELEGRAM PROFIL'}
                </label>
                <input
                  type="text"
                  required
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  placeholder={t.formContact || "Masalan: @username yoki email@domain.com"}
                  className="w-full bg-transparent border-b border-white/20 focus:border-[#e60000] py-3 text-white placeholder-zinc-600 font-sans text-base focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block font-mono text-xs uppercase tracking-widest text-zinc-400 mb-2">
                  {t.formMsgLabel || '03 // LOYIHA TAVSIFI / TAKLIF'}
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder={t.formMsg || "Loyihangiz, muddati va texnik talablar haqida qisqacha yozing..."}
                  className="w-full bg-transparent border-b border-white/20 focus:border-[#e60000] py-3 text-white placeholder-zinc-600 font-sans text-base focus:outline-none transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitted}
                onClick={playClickSound}
                className="w-full py-4 bg-white text-black hover:bg-[#e60000] hover:text-white font-mono text-xs uppercase tracking-widest font-bold transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer disabled:opacity-60"
              >
                <span>{submitted ? (t.copiedToast ? 'YUBORILDI' : 'ОТПРАВЛЕНО') : (t.btnSendMsg || 'XABARNI YUBORISH')}</span>
                {submitted ? <Check className="w-4 h-4 text-black" /> : <Send className="w-4 h-4" />}
              </button>
            </form>
          </div>

        </div>

      </div>
    </section>
  );
};

export default Contact;
