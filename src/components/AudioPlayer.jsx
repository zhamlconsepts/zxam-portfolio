import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Shuffle,
  Repeat,
  Repeat1,
  Volume2,
  VolumeX,
  ListMusic,
  ChevronDown,
  ChevronUp,
  Search,
  Music,
  Sliders,
  Sparkles,
  Minimize2,
  Maximize2
} from 'lucide-react';
import defaultTracks from '../utils/musicTracks.json';
import { playClickSound } from '../utils/audio';

/**
 * High-End Floating Music Player Window ("Suzuvchi Audiopleer")
 * - Works seamlessly as a floating window/pill on both mobile phones and desktop computers.
 * - Minimized Pill Mode: ultra-compact floating glass capsule with live EQ bars and quick controls.
 * - Expanded Window Mode: full-featured floating studio card with scrubber, volume, repeat, shuffle & searchable playlist.
 * - Zero scroll interference (data-lenis-prevent="true", touch-pan-y).
 * - Auto-picks random song on visitor arrival.
 */
const AudioPlayer = () => {
  const [tracks, setTracks] = useState(defaultTracks);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(() => {
    const saved = localStorage.getItem('portfolio_music_vol');
    return saved !== null ? parseFloat(saved) : 0.45;
  });
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  // 'all' | 'one' | 'off'
  const [repeatMode, setRepeatMode] = useState('all');
  const [isPlaylistOpen, setIsPlaylistOpen] = useState(false);
  // Default to collapsed pill on mobile screens to save screen real estate, open on desktop
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768;
    }
    return false;
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [hasStartedFirstTime, setHasStartedFirstTime] = useState(false);

  const audioRef = useRef(null);
  const progressBarRef = useRef(null);

  // 1. Pick a RANDOM song for every visitor on initial arrival
  useEffect(() => {
    if (defaultTracks && defaultTracks.length > 0) {
      const randomIndex = Math.floor(Math.random() * defaultTracks.length);
      setCurrentIndex(randomIndex);
    }
  }, []);

  // Listen to Vite HMR when dev drops new songs into the music folder
  useEffect(() => {
    if (import.meta.hot) {
      import.meta.hot.on('music-updated', async () => {
        try {
          const updated = await import('../utils/musicTracks.json?t=' + Date.now());
          if (updated && updated.default) {
            setTracks(updated.default);
          }
        } catch (e) {
          // Fallback
        }
      });
    }
  }, []);

  // Sync volume with audio element and save preference
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
    localStorage.setItem('portfolio_music_vol', volume.toString());
  }, [volume, isMuted]);

  // Autoplay on first user gesture across the document
  useEffect(() => {
    const handleFirstGesture = () => {
      if (!hasStartedFirstTime && audioRef.current) {
        audioRef.current
          .play()
          .then(() => {
            setIsPlaying(true);
            setHasStartedFirstTime(true);
          })
          .catch(() => {});
      }
      window.removeEventListener('pointerdown', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
    };

    window.addEventListener('pointerdown', handleFirstGesture, { passive: true });
    window.addEventListener('keydown', handleFirstGesture, { passive: true });

    return () => {
      window.removeEventListener('pointerdown', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
    };
  }, [hasStartedFirstTime, currentIndex]);

  const currentTrack = tracks[currentIndex] || tracks[0];

  // Play / Pause Toggle
  const togglePlay = (e) => {
    e?.stopPropagation?.();
    playClickSound();
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          setHasStartedFirstTime(true);
        })
        .catch(() => {});
    }
  };

  // Next Track Logic
  const playNext = (e) => {
    e?.stopPropagation?.();
    playClickSound();
    if (tracks.length === 0) return;

    let nextIndex;
    if (isShuffle && tracks.length > 1) {
      do {
        nextIndex = Math.floor(Math.random() * tracks.length);
      } while (nextIndex === currentIndex);
    } else {
      nextIndex = (currentIndex + 1) % tracks.length;
    }

    setCurrentIndex(nextIndex);
    setIsPlaying(true);
  };

  // Previous Track Logic
  const playPrev = (e) => {
    e?.stopPropagation?.();
    playClickSound();
    if (tracks.length === 0) return;

    if (audioRef.current && audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
      return;
    }

    const prevIndex = (currentIndex - 1 + tracks.length) % tracks.length;
    setCurrentIndex(prevIndex);
    setIsPlaying(true);
  };

  // Track Ended Handler
  const handleTrackEnded = () => {
    if (repeatMode === 'one') {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
      }
    } else if (repeatMode === 'all') {
      playNext();
    } else {
      if (currentIndex < tracks.length - 1) {
        playNext();
      } else {
        setIsPlaying(false);
      }
    }
  };

  // Toggle Repeat Mode
  const cycleRepeatMode = (e) => {
    e?.stopPropagation?.();
    playClickSound();
    setRepeatMode((prev) => {
      if (prev === 'all') return 'one';
      if (prev === 'one') return 'off';
      return 'all';
    });
  };

  // Toggle Shuffle Mode
  const toggleShuffle = (e) => {
    e?.stopPropagation?.();
    playClickSound();
    setIsShuffle((prev) => !prev);
  };

  // Time & Progress Update
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  // Seek bar scrub
  const handleSeek = (e) => {
    if (!progressBarRef.current || !audioRef.current || !duration) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, clickX / rect.width));
    const newTime = percentage * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // Format seconds to mm:ss
  const formatTime = (timeInSec) => {
    if (isNaN(timeInSec) || timeInSec < 0) return '0:00';
    const minutes = Math.floor(timeInSec / 60);
    const seconds = Math.floor(timeInSec % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Filtered tracks for playlist drawer
  const filteredTracks = tracks.filter((t) => {
    const q = searchQuery.toLowerCase();
    return (
      (t.title && t.title.toLowerCase().includes(q)) ||
      (t.artist && t.artist.toLowerCase().includes(q))
    );
  });

  return (
    <>
      {/* Hidden Native Audio Element */}
      {currentTrack && (
        <audio
          ref={audioRef}
          src={currentTrack.url}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleTimeUpdate}
          onEnded={handleTrackEnded}
          onError={() => {
            setTimeout(playNext, 500);
          }}
          autoPlay={isPlaying}
          preload="metadata"
        />
      )}

      {/* FLOATING AUDIO CONTAINER */}
      <aside
        id="floating-audio-window"
        data-lenis-prevent="true"
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 font-mono select-none pointer-events-auto touch-pan-y"
        aria-label="Floating Music Player"
      >
        {isCollapsed ? (
          /* ============================================================ */
          /* 1. COMPACT FLOATING PILL / CAPSULE (MINIMIZED STATE)         */
          /* ============================================================ */
          <div
            onClick={() => {
              playClickSound();
              setIsCollapsed(false);
            }}
            className="flex items-center gap-2.5 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-full bg-[#08080c]/90 hover:bg-[#0c0c12] border border-white/20 hover:border-[#e60000]/60 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.85)] text-white cursor-pointer transition-all duration-300 hover:scale-[1.03] active:scale-95 group max-w-[280px] sm:max-w-xs"
            title="Musiqa pleyerini ochish (Suzuvchi oyna)"
          >
            {/* Pulsing Equalizer Icon */}
            <div
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center border transition-all shrink-0 ${
                isPlaying
                  ? 'border-[#e60000] bg-[#e60000]/15 text-[#e60000] shadow-[0_0_12px_rgba(230,0,0,0.4)]'
                  : 'border-white/20 bg-white/5 text-zinc-400'
              }`}
            >
              <div className="flex items-end gap-0.5 h-3.5">
                <span
                  className={`w-0.5 rounded-full ${
                    isPlaying ? 'bg-[#e60000] animate-bounce' : 'bg-zinc-500 h-1'
                  }`}
                  style={{ animationDuration: '450ms', height: isPlaying ? '100%' : '30%' }}
                />
                <span
                  className={`w-0.5 rounded-full ${
                    isPlaying ? 'bg-[#e60000] animate-bounce' : 'bg-zinc-500 h-2'
                  }`}
                  style={{ animationDuration: '600ms', animationDelay: '150ms', height: isPlaying ? '70%' : '50%' }}
                />
                <span
                  className={`w-0.5 rounded-full ${
                    isPlaying ? 'bg-[#e60000] animate-bounce' : 'bg-zinc-500 h-2.5'
                  }`}
                  style={{ animationDuration: '500ms', animationDelay: '300ms', height: isPlaying ? '90%' : '70%' }}
                />
              </div>
            </div>

            {/* Track Info */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1">
                <span className="text-[9px] text-[#e60000] font-bold tracking-wider">
                  BGM
                </span>
                <span className="text-[9px] text-zinc-500">
                  {currentIndex + 1}/{tracks.length}
                </span>
              </div>
              <p className="text-xs font-bold text-white truncate max-w-[110px] sm:max-w-[140px] leading-tight">
                {currentTrack?.title || 'Audio Stream'}
              </p>
            </div>

            {/* Quick Play/Pause Button */}
            <button
              onClick={togglePlay}
              className="w-7 h-7 rounded-full bg-white hover:bg-[#e60000] text-black hover:text-white flex items-center justify-center transition-colors shrink-0 cursor-pointer shadow"
              title={isPlaying ? 'Pauza' : 'Ijro'}
              aria-label="Play/Pause"
            >
              {isPlaying ? (
                <Pause className="w-3.5 h-3.5 fill-current" />
              ) : (
                <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
              )}
            </button>

            {/* Quick Next Button */}
            <button
              onClick={playNext}
              className="p-1 text-zinc-400 hover:text-white transition-colors shrink-0 cursor-pointer hidden sm:block"
              title="Keyingi"
              aria-label="Next Track"
            >
              <SkipForward className="w-3.5 h-3.5" />
            </button>

            {/* Expand Indicator */}
            <div className="text-zinc-500 group-hover:text-white transition-colors pl-0.5 shrink-0">
              <Maximize2 className="w-3.5 h-3.5" />
            </div>
          </div>
        ) : (
          /* ============================================================ */
          /* 2. EXPANDED FLOATING WINDOW (SUZUVCHI STUDIYA PANELI)        */
          /* ============================================================ */
          <div
            data-lenis-prevent="true"
            className="w-[calc(100vw-2rem)] max-w-sm sm:max-w-md bg-[#08080c]/95 border border-white/20 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.9)] backdrop-blur-2xl text-white overflow-hidden transition-all duration-300 animate-fadeIn"
          >
            {/* Top Red Laser Accent */}
            <div
              className={`h-[2px] w-full transition-all duration-300 ${
                isPlaying
                  ? 'bg-gradient-to-r from-transparent via-[#e60000] to-transparent animate-pulse'
                  : 'bg-white/10'
              }`}
            />

            {/* Window Header Bar */}
            <div className="px-4 py-2.5 bg-white/[0.03] border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#e60000] animate-ping" />
                <span className="text-[10px] font-bold tracking-widest text-zinc-300 uppercase">
                  SUZUVCHI AUDIOPLEER
                </span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/10 text-zinc-400">
                  {currentIndex + 1} / {tracks.length}
                </span>
              </div>

              {/* Window Controls: Playlist & Minimize */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    playClickSound();
                    setIsPlaylistOpen((prev) => !prev);
                  }}
                  className={`p-1.5 rounded-md transition-colors cursor-pointer text-xs flex items-center gap-1 ${
                    isPlaylistOpen
                      ? 'bg-[#e60000] text-white shadow-[0_0_10px_rgba(230,0,0,0.4)]'
                      : 'text-zinc-400 hover:text-white hover:bg-white/10'
                  }`}
                  title="Playlist ro'yxati"
                  aria-label="Toggle Playlist"
                >
                  <ListMusic className="w-3.5 h-3.5" />
                  <span className="text-[10px] hidden sm:inline">RO'YXAT</span>
                </button>

                <button
                  onClick={() => {
                    playClickSound();
                    setIsCollapsed(true);
                  }}
                  className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 rounded-md transition-colors cursor-pointer"
                  title="Kichraytirish (Suzuvchi kapsulaga aylantirish)"
                  aria-label="Minimize Player"
                >
                  <Minimize2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Main Player Body */}
            <div className="p-4">
              
              {/* Row 1: Track Details & Live Audio Waves */}
              <div className="flex items-center gap-3 mb-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all shrink-0 ${
                    isPlaying
                      ? 'border-[#e60000] bg-[#e60000]/15 text-[#e60000] shadow-[0_0_15px_rgba(230,0,0,0.3)]'
                      : 'border-white/15 bg-white/5 text-zinc-400'
                  }`}
                >
                  <Music className="w-5 h-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-[10px] text-[#e60000] font-bold uppercase tracking-wider">
                      TRACK #{currentIndex + 1}
                    </span>
                    {isShuffle && (
                      <span className="text-[8px] px-1 bg-[#e60000]/20 text-[#e60000] rounded">
                        SHUFFLE
                      </span>
                    )}
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-white truncate">
                    {currentTrack?.title || 'Audio Stream'}
                  </h4>
                  <p className="text-[10px] text-zinc-400 truncate">
                    {currentTrack?.artist || 'Jamshid (zxam) Portfolio'}
                  </p>
                </div>
              </div>

              {/* Row 2: Progress Seek Bar & Timers */}
              <div className="mb-3">
                <div
                  ref={progressBarRef}
                  onClick={handleSeek}
                  className="relative w-full h-1.5 bg-white/10 hover:h-2 rounded-full cursor-pointer transition-all group overflow-hidden"
                  title="Seek audio position"
                >
                  <div
                    className="h-full bg-gradient-to-r from-white via-white to-[#e60000] rounded-full relative shadow-[0_0_8px_rgba(230,0,0,0.6)]"
                    style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[10px] text-zinc-400 font-mono mt-1">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Row 3: Control Buttons Bar (Shuffle, Prev, Play/Pause, Next, Repeat, Volume) */}
              <div className="flex items-center justify-between gap-1 pt-2 border-t border-white/10">
                
                {/* Left Controls: Shuffle & Repeat */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={toggleShuffle}
                    className={`p-1.5 rounded transition-colors cursor-pointer ${
                      isShuffle ? 'text-[#e60000] bg-[#e60000]/15' : 'text-zinc-500 hover:text-white'
                    }`}
                    title={isShuffle ? 'Random (Aralash) faol' : 'Random (Aralash) yoqish'}
                    aria-label="Shuffle"
                  >
                    <Shuffle className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={cycleRepeatMode}
                    className={`p-1.5 rounded transition-colors cursor-pointer ${
                      repeatMode !== 'off'
                        ? 'text-[#e60000] bg-[#e60000]/15'
                        : 'text-zinc-500 hover:text-white'
                    }`}
                    title={`Replay: ${
                      repeatMode === 'one' ? 'Bir musiqani takrorlash' : repeatMode === 'all' ? 'Hammasini takrorlash' : 'O`chirilgan'
                    }`}
                    aria-label="Repeat"
                  >
                    {repeatMode === 'one' ? (
                      <Repeat1 className="w-3.5 h-3.5" />
                    ) : (
                      <Repeat className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                {/* Center Controls: Prev, Play/Pause, Next */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={playPrev}
                    className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 rounded transition-colors cursor-pointer"
                    title="Oldingi musiqa"
                    aria-label="Previous"
                  >
                    <SkipBack className="w-4 h-4" />
                  </button>

                  <button
                    onClick={togglePlay}
                    className="w-9 h-9 rounded-full bg-white hover:bg-[#e60000] text-black hover:text-white flex items-center justify-center transition-all duration-200 shadow-lg cursor-pointer hover:scale-105 active:scale-95"
                    title={isPlaying ? 'Pauza' : 'Ijro etish'}
                    aria-label="Play/Pause"
                  >
                    {isPlaying ? (
                      <Pause className="w-4 h-4 fill-current" />
                    ) : (
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    )}
                  </button>

                  <button
                    onClick={playNext}
                    className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 rounded transition-colors cursor-pointer"
                    title="Keyingi musiqa"
                    aria-label="Next"
                  >
                    <SkipForward className="w-4 h-4" />
                  </button>
                </div>

                {/* Right Control: Volume Slider & Mute Toggle */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      playClickSound();
                      setIsMuted((prev) => !prev);
                    }}
                    className="text-zinc-400 hover:text-white transition-colors cursor-pointer p-1"
                    title={isMuted ? 'Ovozni yoqish' : 'Ovozni o`chirish'}
                    aria-label="Mute/Unmute"
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX className="w-3.5 h-3.5 text-[#e60000]" />
                    ) : (
                      <Volume2 className="w-3.5 h-3.5" />
                    )}
                  </button>

                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.02"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => {
                      setIsMuted(false);
                      setVolume(parseFloat(e.target.value));
                    }}
                    className="w-12 sm:w-16 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#e60000]"
                    title={`Ovoz: ${Math.round((isMuted ? 0 : volume) * 100)}%`}
                  />
                </div>

              </div>
            </div>

            {/* PLAYLIST DRAWER (Searchable list of tracks) */}
            {isPlaylistOpen && (
              <div
                data-lenis-prevent="true"
                className="border-t border-white/15 bg-black/95 p-3 max-h-60 overflow-hidden flex flex-col touch-pan-y"
              >
                {/* Search Bar */}
                <div className="relative mb-2">
                  <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    placeholder="Musiqani qidirish..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white/5 border border-white/15 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#e60000] font-mono"
                  />
                </div>

                {/* Tracks List */}
                <div
                  data-lenis-prevent="true"
                  className="overflow-y-auto custom-scrollbar flex-1 space-y-1 pr-1 max-h-40 text-xs touch-pan-y overscroll-contain"
                >
                  {filteredTracks.length === 0 ? (
                    <div className="py-4 text-center text-zinc-500 text-[11px]">
                      Musiqa topilmadi
                    </div>
                  ) : (
                    filteredTracks.map((item) => {
                      const realIndex = tracks.indexOf(item);
                      const isCurrent = realIndex === currentIndex;

                      return (
                        <button
                          key={item.id || item.filename}
                          onClick={() => {
                            playClickSound();
                            setCurrentIndex(realIndex);
                            setIsPlaying(true);
                          }}
                          className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors cursor-pointer group ${
                            isCurrent
                              ? 'bg-[#e60000]/15 text-[#e60000] border border-[#e60000]/30'
                              : 'hover:bg-white/5 text-zinc-300'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-[10px] text-zinc-500 w-4 shrink-0">
                              {realIndex + 1}
                            </span>
                            <div className="min-w-0">
                              <p className={`font-semibold truncate text-[11px] ${isCurrent ? 'text-white' : 'text-zinc-200'}`}>
                                {item.title}
                              </p>
                              <p className="text-[9px] text-zinc-500 truncate">
                                {item.artist}
                              </p>
                            </div>
                          </div>

                          {isCurrent && isPlaying && (
                            <div className="flex items-end gap-0.5 h-2.5 shrink-0 ml-2">
                              <span className="w-0.5 bg-[#e60000] h-full animate-bounce" />
                              <span className="w-0.5 bg-[#e60000] h-2/3 animate-bounce" style={{ animationDelay: '150ms' }} />
                              <span className="w-0.5 bg-[#e60000] h-4/5 animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                          )}
                        </button>
                      );
                    })
                  )}
                </div>

                {/* Playlist Summary Footer */}
                <div className="pt-2 mt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-zinc-500 font-mono">
                  <span>Jami: {tracks.length} ta musiqa</span>
                  <span className="text-[#e60000]">Avtomatik kesh</span>
                </div>
              </div>
            )}

          </div>
        )}
      </aside>
    </>
  );
};

export default AudioPlayer;
