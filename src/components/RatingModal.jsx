import React, { useState, useEffect } from 'react';
import { X, Star, Heart, ThumbsUp, Sparkles, Send, Check, MessageSquare } from 'lucide-react';
import { sendTelegramNotification } from '../utils/visitorTracker';
import { playClickSound, playSuccessSound } from '../utils/audio';

const RATING_LABELS = {
  1: "Yaxshilash kerak",
  2: "Qoniqarli",
  3: "Yaxshi",
  4: "A'lo darajada! ⭐️",
  5: "Mukammal / Masterpiece! 🔥"
};

const QUICK_TAGS = [
  '🔥 Ajoyib Dizayn',
  '⚡️ Ultra Tezkor',
  '💻 Toza Arxitektura',
  '🎵 Qulay Musiqa Pleyeri',
  '🚀 Hamkorlikka Tayyorman'
];

const RatingModal = ({ isOpen, onClose, onShowToast, lang = 'uz' }) => {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState(['🔥 Ajoyib Dizayn', '⚡️ Ultra Tezkor']);
  const [visitorName, setVisitorName] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    const savedRating = localStorage.getItem('zxam_portfolio_rating_submitted');
    if (savedRating) {
      setHasSubmitted(true);
    }
  }, []);

  if (!isOpen) return null;

  const toggleTag = (tag) => {
    playClickSound();
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (rating === 0) return;

    playSuccessSound();
    setIsSubmitting(true);

    const activeRating = rating || 5;
    const starsString = '⭐️'.repeat(activeRating);
    const timeString = new Date().toLocaleString('uz-UZ', { timeZone: 'Asia/Tashkent' });

    let message = `🌟 <b>YANGI PORTFOLIO BAHOSI!</b> 🌟\n\n`;
    message += `👤 <b>Baholovchi:</b> ⭐️ <b>${visitorName.trim() || 'Mehmon'}</b>\n`;
    message += `⭐️ <b>Baho:</b> ${starsString} (${activeRating} / 5 - ${RATING_LABELS[activeRating]})\n`;
    
    if (selectedTags.length > 0) {
      message += `🏷 <b>Taassurotlar:</b> ${selectedTags.join(', ')}\n`;
    }

    if (comment.trim()) {
      message += `💬 <b>Fikr / Izoh:</b>\n<i>"${comment.trim()}"</i>\n`;
    }

    message += `\n🕒 <b>Vaqt:</b> ${timeString} (Toshkent vaqti)\n`;
    message += `🌐 <b>Sayt:</b> https://zxam-portfolio.vercel.app/`;

    await sendTelegramNotification(message);

    setIsSubmitting(false);
    setHasSubmitted(true);
    localStorage.setItem('zxam_portfolio_rating_submitted', activeRating.toString());
    onShowToast?.('⭐️ Katta rahmat! Bahoyingiz Jamshidga muvaffaqiyatli yetkazildi.');
  };

  return (
    <div
      data-lenis-prevent="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="fixed inset-0 cursor-pointer"
        onClick={() => {
          playClickSound();
          onClose();
        }}
      />

      <div
        data-lenis-prevent="true"
        className="relative w-full max-w-lg bg-[#0d0d11] border border-white/15 rounded-2xl p-6 sm:p-8 max-h-[92vh] overflow-y-auto shadow-2xl text-white custom-scrollbar overscroll-contain touch-pan-y z-20"
      >
        {/* Close Button */}
        <button
          onClick={() => {
            playClickSound();
            onClose();
          }}
          className="absolute top-5 right-5 p-2 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          aria-label="Yopish"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-white/10 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#e60000]/10 border border-[#e60000]/30 flex items-center justify-center text-[#e60000]">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-editorial text-xl font-bold uppercase tracking-tight text-white flex items-center gap-2">
              PORTFOLIONI BAHOLASH <span className="text-[10px] font-mono py-0.5 px-2 bg-[#e60000] text-white rounded">FEEDBACK</span>
            </h3>
            <p className="text-xs text-zinc-400 font-sans">
              Sayt dizayni va tajribasiga o'z bahoingizni qoldiring
            </p>
          </div>
        </div>

        {/* Content */}
        {hasSubmitted ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.2)]">
              <Check className="w-8 h-8" />
            </div>
            <div>
              <h4 className="font-editorial text-2xl font-bold text-white uppercase">
                TASHAKKUR!
              </h4>
              <p className="text-xs text-zinc-400 font-sans mt-1 max-w-sm mx-auto">
                Sizning fikringiz va bahoyingiz men uchun juda qadrli. Jamshidga to'g'ridan-to'g'ri yetkazildi!
              </p>
            </div>
            <button
              onClick={() => {
                playClickSound();
                onClose();
              }}
              className="px-6 py-3 bg-[#e60000] hover:bg-[#ff1a1a] text-white font-mono text-xs uppercase font-bold rounded-lg transition-colors cursor-pointer"
            >
              YOPISH
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Interactive Star Rating */}
            <div className="flex flex-col items-center justify-center p-5 rounded-xl bg-white/[0.02] border border-white/10 space-y-3">
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => {
                      playClickSound();
                      setRating(star);
                    }}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 transition-transform hover:scale-125 focus:outline-none cursor-pointer"
                  >
                    <Star
                      className={`w-8 h-8 sm:w-9 sm:h-9 transition-colors ${
                        (hoverRating || rating) >= star
                          ? 'fill-[#e60000] text-[#e60000] drop-shadow-[0_0_10px_rgba(230,0,0,0.6)]'
                          : 'text-zinc-700 hover:text-zinc-500'
                      }`}
                    />
                  </button>
                ))}
              </div>

              {/* Dynamic Rating Label */}
              <div className="font-mono text-xs font-semibold text-white tracking-wider uppercase">
                {RATING_LABELS[hoverRating || rating] || 'Baholang'}
              </div>
            </div>

            {/* Quick Impression Tags */}
            <div className="space-y-2">
              <label className="block font-mono text-xs text-zinc-400 uppercase tracking-wider">
                // SIZGA NIMA YOQDI? (Bir nechta tanlash mumkin):
              </label>
              <div className="flex flex-wrap gap-2">
                {QUICK_TAGS.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer border ${
                        isSelected
                          ? 'bg-[#e60000]/15 border-[#e60000] text-white font-bold shadow-[0_0_12px_rgba(230,0,0,0.3)]'
                          : 'bg-white/[0.02] border-white/10 text-zinc-400 hover:text-white hover:border-white/20'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Name or Contact Input */}
            <div className="space-y-1.5">
              <label className="block font-mono text-xs text-zinc-400 uppercase tracking-wider">
                // ISM YOKI TELEGRAM PROFILINGIZ (Ixtiyoriy):
              </label>
              <input
                type="text"
                value={visitorName}
                onChange={(e) => setVisitorName(e.target.value)}
                placeholder="Masalan: Sardor yoki @username"
                className="w-full bg-[#14141a] border border-white/15 focus:border-[#e60000] rounded-lg px-3.5 py-2.5 text-xs font-sans text-white focus:outline-none transition-colors"
              />
            </div>

            {/* Comment or Message */}
            <div className="space-y-1.5">
              <label className="block font-mono text-xs text-zinc-400 uppercase tracking-wider">
                // FIKR-MULOHAZA YOKI TAKLIFINGIZ (Ixtiyoriy):
              </label>
              <textarea
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Sayt haqidagi taassurotingizni yozing..."
                className="w-full bg-[#14141a] border border-white/15 focus:border-[#e60000] rounded-lg p-3 text-xs font-sans text-white focus:outline-none transition-colors resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-[#e60000] hover:bg-[#ff1a1a] text-white font-mono text-xs uppercase font-bold rounded-xl transition-all shadow-lg hover:shadow-[0_0_20px_rgba(230,0,0,0.4)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Yuborilmoqda...' : 'BAHONI YUBORISH'}</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
};

export default RatingModal;
