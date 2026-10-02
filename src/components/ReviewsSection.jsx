import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, Sparkles, CheckCircle2, ShieldCheck, Heart, User, ArrowUpRight } from 'lucide-react';
import { playClickSound } from '../utils/audio';
import ScrambleText from './ScrambleText';
import { getAllReviews, hasUserVoted, getUserReview } from '../utils/reviewsData';

const ReviewsSection = ({ onOpenRating, reviewsVersion }) => {
  const [reviews, setReviews] = useState([]);
  const [userVoted, setUserVoted] = useState(false);
  const [myReview, setMyReview] = useState(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    setReviews(getAllReviews());
    setUserVoted(hasUserVoted());
    setMyReview(getUserReview());
  }, [reviewsVersion]);

  // Hisoblangan o'rtacha ball (faqat real qo'shilgan baholardan)
  const totalReviews = reviews.length;
  const avgRating = totalReviews > 0
    ? (reviews.reduce((acc, r) => acc + (r.rating || 5), 0) / totalReviews).toFixed(1)
    : null;

  const visibleReviews = showAll ? reviews : reviews.slice(0, 6);

  return (
    <section id="reviews" className="py-16 sm:py-24 lg:py-32 relative border-t border-white/10 bg-[#08080a] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-10 lg:px-14">
        
        {/* Section Header */}
        <div className="flex flex-wrap items-end justify-between gap-6 pb-6 sm:pb-8 border-b border-white/10 mb-12 sm:mb-16">
          <div className="stagger-text">
            <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-[#e60000] mb-3 font-bold">
              <span>( 06 )</span>
              <span className="w-8 h-[1px] bg-[#e60000]" />
              <span>COMMUNITY FEEDBACK &bull; REAL RATINGS</span>
            </div>
            <h2 className="text-3xl sm:text-6xl lg:text-7xl font-black font-editorial uppercase tracking-tighter leading-none text-white">
              SAYT <span className="text-[#e60000]">BAHOLARI</span>
            </h2>
          </div>

          <div className="stagger-text font-mono text-xs text-zinc-400 uppercase tracking-wider text-left sm:text-right">
            <div>// 100% REAL TAASSUROTlar</div>
            <div className="text-white font-bold">1 FOYDALANUVCHI = 1 BAHOLASH</div>
          </div>
        </div>

        {/* Rating Metrics & Call to Action Banner */}
        <div className="mb-12 p-6 sm:p-8 rounded-2xl bg-[#0c0c12] border border-white/15 relative overflow-hidden shadow-2xl">
          {/* Subtle Red/Amber Ambient Glow */}
          <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-gradient-to-br from-[#e60000]/10 via-amber-500/10 to-transparent blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            
            {/* Left: Overall Rating Display */}
            <div className="flex items-center gap-5 sm:gap-6">
              <div className="text-center sm:text-left">
                <span className="font-editorial text-5xl sm:text-6xl font-black text-white leading-none tracking-tight block">
                  {avgRating !== null ? avgRating : '5.0'}
                </span>
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block mt-1">
                  / 5.0 BALL
                </span>
              </div>

              <div className="h-12 w-[1px] bg-white/15 hidden sm:block" />

              <div className="space-y-1">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className="w-5 h-5 fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]"
                    />
                  ))}
                </div>
                <p className="text-xs font-mono text-zinc-300">
                  {totalReviews > 0 ? (
                    <>Jami <strong className="text-white">{totalReviews} ta</strong> tasdiqlangan baho</>
                  ) : (
                    <>Hozircha yangi qo'shilayotgan baholar mavjud</>
                  )}
                </p>
                <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-400">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Real tashrifchilar baholari (Soxta baholarsiz)</span>
                </div>
              </div>
            </div>

            {/* Right: Action Button or Voted Status */}
            <div className="w-full md:w-auto">
              {userVoted ? (
                <div className="flex items-center gap-3 p-3.5 px-5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div className="text-left font-mono text-xs">
                    <p className="font-bold text-white uppercase tracking-wider">
                      Siz o'z bahoingizni qoldirdingiz!
                    </p>
                    <p className="text-[11px] text-zinc-400">
                      Bahoingiz: {myReview?.rating || 5}/5 ⭐️ &bull; 1 user = 1 baho
                    </p>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => {
                    playClickSound();
                    onOpenRating();
                  }}
                  className="w-full md:w-auto px-6 py-4 rounded-xl bg-gradient-to-r from-[#e60000] to-[#ff2b2b] hover:from-[#ff1a1a] hover:to-[#ff4040] text-white font-mono text-xs uppercase font-bold tracking-widest transition-all duration-300 shadow-[0_0_25px_rgba(230,0,0,0.4)] flex items-center justify-center gap-2.5 cursor-pointer hover:scale-105 active:scale-95"
                >
                  <Star className="w-4 h-4 fill-white" />
                  <span>O'Z BAHONGIZNI QOLDIRING</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              )}
            </div>

          </div>
        </div>

        {/* Real Reviews Cards Grid or Empty State */}
        {totalReviews === 0 ? (
          /* Empty State when no real reviews have been added yet */
          <div className="p-8 sm:p-12 rounded-2xl bg-[#0c0c12]/80 border border-white/10 text-center space-y-4 max-w-lg mx-auto shadow-2xl">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#e60000]/10 border border-[#e60000]/30 flex items-center justify-center text-[#e60000] shadow-[0_0_20px_rgba(230,0,0,0.2)]">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-editorial text-xl font-bold uppercase tracking-tight text-white">
                HOZIRCHA BAHOLAR YO'Q
              </h4>
              <p className="text-xs text-zinc-400 font-sans mt-1.5 max-w-sm mx-auto leading-relaxed">
                Hech qanday soxta baho yo'q. Saytga birinchi bo'lib o'z bahoyingiz va xolis fikringizni qoldiring!
              </p>
            </div>
            <button
              onClick={() => {
                playClickSound();
                onOpenRating();
              }}
              className="px-6 py-3.5 bg-[#e60000] hover:bg-[#ff1a1a] text-white font-mono text-xs uppercase font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(230,0,0,0.4)] flex items-center justify-center gap-2 mx-auto cursor-pointer hover:scale-105 active:scale-95"
            >
              <Star className="w-4 h-4 fill-white" />
              <span>BIRINCHI BO'LIB BAHOLASH</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* Populated Reviews Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleReviews.map((item) => {
              const isUserOwn = item.isOwn || item.id === myReview?.id;

              return (
                <div
                  key={item.id}
                  className={`relative rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between ${
                    isUserOwn
                      ? 'bg-gradient-to-b from-[#181216] to-[#0f0e13] border-2 border-amber-500/50 shadow-[0_0_30px_rgba(245,158,11,0.15)] ring-1 ring-amber-500/30'
                      : 'bg-[#0c0c12]/90 hover:bg-[#12121a] border border-white/15 hover:border-white/30 shadow-lg'
                  }`}
                >
                  {/* User's Own Badge */}
                  {isUserOwn && (
                    <div className="absolute -top-3 left-6 px-3 py-1 bg-gradient-to-r from-amber-500 to-[#e60000] text-white font-mono text-[9px] font-black uppercase tracking-widest rounded-full shadow-md flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>SIZNING BAHONGIZ</span>
                    </div>
                  )}

                  <div>
                    {/* Review Card Header: Avatar / Name / Stars */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border shrink-0 ${
                            isUserOwn
                              ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                              : 'bg-white/5 border-white/15 text-zinc-300'
                          }`}
                        >
                          {item.name ? item.name.charAt(0).toUpperCase() : 'M'}
                        </div>
                        <div>
                          <h4 className="font-editorial text-base font-bold text-white leading-tight">
                            {item.name}
                          </h4>
                          <span className="font-mono text-[10px] text-zinc-400 block mt-0.5">
                            {item.role || 'Tashrifchi'}
                          </span>
                        </div>
                      </div>

                      {/* Stars */}
                      <div className="flex items-center gap-0.5 shrink-0">
                        {[1, 2, 3, 4, 5].map((starIndex) => (
                          <Star
                            key={starIndex}
                            className={`w-3.5 h-3.5 ${
                              starIndex <= (item.rating || 5)
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-zinc-700'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Impression Tags */}
                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-3.5">
                        {item.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/[0.04] border border-white/10 text-zinc-300"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Comment Text */}
                    {item.comment && (
                      <p className="text-xs text-zinc-300 leading-relaxed font-sans italic border-l-2 border-[#e60000]/60 pl-3 my-2">
                        "{item.comment}"
                      </p>
                    )}
                  </div>

                  {/* Card Footer: Date & Verified Icon */}
                  <div className="pt-4 mt-3 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-zinc-500">
                    <span>{item.date || 'Yaqinda'}</span>
                    <span className="flex items-center gap-1 text-zinc-400">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      <span>Tasdiqlangan</span>
                    </span>
                  </div>

                </div>
              );
            })}
          </div>
        )}

        {/* View All Toggle Button (if more than 6) */}
        {reviews.length > 6 && (
          <div className="mt-8 text-center">
            <button
              onClick={() => {
                playClickSound();
                setShowAll((prev) => !prev);
              }}
              className="px-6 py-2.5 rounded-lg border border-white/20 hover:border-white text-zinc-300 hover:text-white font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              {showAll ? 'QISQARTIRISH' : `BARCHA BAHOLARNI KO'RISH (${reviews.length})`}
            </button>
          </div>
        )}

      </div>
    </section>
  );
};

export default ReviewsSection;
