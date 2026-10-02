import React, { useState, useEffect } from 'react';
import { X, Send, ShieldCheck, UserCheck, MapPin, Clock, Copy, Check, RefreshCw, Lock, Trash2, Smartphone, Globe } from 'lucide-react';
import { sendTelegramNotification, getLocalVisitorHistory } from '../utils/visitorTracker';
import { playClickSound, playSuccessSound } from '../utils/audio';

const SECRET_PIN = '1108';

const AdminTrackerModal = ({ isOpen, onClose, onShowToast }) => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  const [targetName, setTargetName] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (isOpen) {
      setHistory(getLocalVisitorHistory());
      updateGeneratedLink(targetName);
    } else {
      setIsUnlocked(false);
      setPinInput('');
      setPinError(false);
    }
  }, [isOpen, targetName]);

  const updateGeneratedLink = (name) => {
    const baseUrl = window.location.origin.includes('localhost')
      ? 'https://zxam-portfolio.vercel.app'
      : window.location.origin + window.location.pathname;
    if (name.trim()) {
      setGeneratedLink(`${baseUrl}?who=${encodeURIComponent(name.trim())}&ref=telegram`);
    } else {
      setGeneratedLink(`${baseUrl}?ref=telegram`);
    }
  };

  const handlePinSubmit = (e) => {
    e?.preventDefault();
    if (pinInput.trim() === SECRET_PIN || pinInput.trim() === 'zxam') {
      playSuccessSound();
      setIsUnlocked(true);
      setPinError(false);
    } else {
      playClickSound();
      setPinError(true);
      setPinInput('');
    }
  };

  const handleRefresh = () => {
    playClickSound();
    setIsRefreshing(true);
    setHistory(getLocalVisitorHistory());
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const handleClearHistory = () => {
    playClickSound();
    localStorage.removeItem('zxam_visitor_logs');
    setHistory([]);
    onShowToast?.('Tashriflar tarixi tozalandi!');
  };

  const handleTestBot = async () => {
    playClickSound();
    setIsTesting(true);
    const testMsg = `✅ <b>Sinov Xabari!</b>\n\n` +
      `👤 <b>Portfolio Egasi:</b> Ablakimov Jamshid (@zxam)\n` +
      `🎯 <b>zxam-portfolio.vercel.app</b> saytidan Telegram botingiz muvaffaqiyatli ulandi!\n\n` +
      `Endi kim kirsa, uning Telegram profili yoki maxsus yo'naltirilgan ismi, manzili va barcha ma'lumotlari to'liq shu yerga keladi.`;
    
    const res = await sendTelegramNotification(testMsg);

    setIsTesting(false);
    if (res?.success) {
      playSuccessSound();
      onShowToast?.('✅ Sinov xabari Telegramingizga yuborildi!');
    } else {
      onShowToast?.('❌ Xatolik: Bot xabari yuborilmadi!');
    }
  };

  const handleCopyLink = () => {
    playClickSound();
    navigator.clipboard.writeText(generatedLink);
    setCopiedLink(true);
    onShowToast?.('Maxsus havola nusxalandi! Telegramda yuborishingiz mumkin.');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  if (!isOpen) return null;

  return (
    <div
      data-lenis-prevent="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn"
    >
      <div
        data-lenis-prevent="true"
        className="relative w-full max-w-2xl bg-[#0d0d11] border border-white/15 rounded-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl text-white custom-scrollbar overscroll-contain touch-pan-y"
      >
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#e60000]/10 border border-[#e60000]/40 flex items-center justify-center text-[#e60000]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-editorial text-xl font-bold tracking-tight text-white flex items-center gap-2">
                VISITOR TRACKER <span className="text-xs font-mono py-0.5 px-2 bg-[#e60000] text-white rounded">TELEMETRIYA</span>
              </h3>
              <p className="text-xs text-zinc-400 font-sans">
                Sayt tashrifchilari va Telegram hisobotlar jurnali
              </p>
            </div>
          </div>
          <button
            onClick={() => { playClickSound(); onClose(); }}
            className="p-2 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* PIN CODE PROTECTION SCREEN */}
        {!isUnlocked ? (
          <div className="py-8 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-[#e60000]/10 border border-[#e60000]/30 flex items-center justify-center text-[#e60000]">
              <Lock className="w-7 h-7" />
            </div>
            <div>
              <h4 className="font-editorial text-lg font-bold uppercase text-white">
                XAVFSIZLIK PAROLI
              </h4>
              <p className="text-xs text-zinc-400 mt-1 font-sans">
                Boshqaruv paneliga kirish uchun maxfiy kodni kiriting
              </p>
            </div>

            <form onSubmit={handlePinSubmit} className="flex flex-col sm:flex-row items-center gap-2 w-full max-w-xs mt-2">
              <input
                type="password"
                maxLength={8}
                value={pinInput}
                onChange={(e) => { setPinInput(e.target.value); setPinError(false); }}
                placeholder="••••"
                autoFocus
                className="w-full bg-[#14141a] border border-white/20 focus:border-[#e60000] rounded-lg px-4 py-2.5 text-center font-mono text-base tracking-widest text-white focus:outline-none"
              />
              <button
                type="submit"
                className="w-full sm:w-auto px-5 py-2.5 bg-[#e60000] hover:bg-[#ff1a1a] text-white font-mono text-xs uppercase font-bold rounded-lg transition-colors cursor-pointer shrink-0"
              >
                KIRISH
              </button>
            </form>

            {pinError && (
              <p className="text-xs text-red-500 font-mono">
                Noto'g'ri kod kiritildi! Qayta urinib ko'ring.
              </p>
            )}
          </div>
        ) : (
          /* UNLOCKED DASHBOARD */
          <div className="space-y-6 animate-fadeIn">
            
            {/* Status & Test Bar */}
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <div>
                  <div className="text-xs font-mono text-white font-semibold flex items-center gap-2">
                    <span>TELEGRAM BOT FAOL</span>
                    <span className="text-[10px] text-zinc-500 font-normal">ID: 6325191171</span>
                  </div>
                  <p className="text-[11px] text-zinc-400">Har bir tashrif to'g'ridan-to'g'ri botingizga yuborilmoqda</p>
                </div>
              </div>

              <button
                onClick={handleTestBot}
                disabled={isTesting}
                className="px-3.5 py-2 bg-[#e60000] hover:bg-[#ff1a1a] disabled:opacity-50 text-white rounded-lg text-xs font-bold font-mono transition-colors flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isTesting ? 'Yuborilmoqda...' : 'Sinov Xabari'}</span>
              </button>
            </div>

            {/* Maxsus Shaxsiy Link Yaratgich */}
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-zinc-200">
                <UserCheck className="w-4 h-4 text-[#e60000]" />
                <span>Shaxsiy Maxsus Havola (Ism yoki Username orqali bilish)</span>
              </div>
              <p className="text-xs text-zinc-400">
                Do'stingiz yoki mijozning ismini yozib havolani oling:
              </p>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={targetName}
                  onChange={(e) => {
                    setTargetName(e.target.value);
                    updateGeneratedLink(e.target.value);
                  }}
                  placeholder="Masalan: Sardor, HR_Kompaniya, @user..."
                  className="flex-1 bg-[#14141a] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#e60000]"
                />
                <button
                  onClick={handleCopyLink}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedLink ? 'Nusxalandi' : 'Linkni olish'}
                </button>
              </div>

              <div className="bg-black/50 p-2.5 rounded-lg border border-white/5 font-mono text-[11px] text-[#e60000] break-all select-all">
                {generatedLink}
              </div>
            </div>

            {/* Mahalliy Tashriflar Tarixi */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#e60000]" />
                  <span>Oxirgi Tashriflar Jurnali ({history.length})</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleRefresh}
                    className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#e60000]' : ''}`} />
                    <span>Yangilash</span>
                  </button>

                  {history.length > 0 && (
                    <button
                      onClick={handleClearHistory}
                      className="text-xs text-zinc-500 hover:text-red-400 flex items-center gap-1 cursor-pointer transition-colors"
                      title="Tarixni tozalash"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Tozalash</span>
                    </button>
                  )}
                </div>
              </div>

              {history.length === 0 ? (
                <div className="text-center py-8 text-xs text-zinc-500 font-mono bg-black/30 rounded-lg border border-white/5">
                  Hozircha saqlangan mahalliy tashriflar mavjud emas.
                </div>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
                  {history.map((item, idx) => (
                    <div key={idx} className="p-3.5 bg-white/[0.02] border border-white/5 hover:border-white/15 rounded-lg text-xs font-mono flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 transition-colors">
                      <div className="space-y-1">
                        <div className="text-white font-bold flex items-center gap-2 flex-wrap">
                          <MapPin className="w-3.5 h-3.5 text-[#e60000] shrink-0" />
                          <span>{item.geo?.city || 'Noma\'lum'}, {item.geo?.country || 'O\'zbekiston'}</span>
                          
                          {item.urlParams?.targetUser && (
                            <span className="bg-[#e60000]/20 text-[#e60000] border border-[#e60000]/30 px-2 py-0.5 rounded text-[10px] font-semibold">
                              ⭐️ {item.urlParams.targetUser}
                            </span>
                          )}

                          {item.tgUser?.username && item.tgUser.username !== 'Mavjud emas' && (
                            <span className="bg-sky-500/10 text-sky-400 border border-sky-500/20 px-2 py-0.5 rounded text-[10px]">
                              {item.tgUser.username}
                            </span>
                          )}
                        </div>

                        <div className="text-zinc-400 text-[11px] flex items-center gap-2 flex-wrap">
                          <span className="flex items-center gap-1 text-zinc-300">
                            <Smartphone className="w-3 h-3 text-zinc-500" />
                            {item.device?.device}
                          </span>
                          <span className="text-zinc-600">&bull;</span>
                          <span>{item.device?.browser}</span>
                          <span className="text-zinc-600">&bull;</span>
                          <span className="text-zinc-500">IP: {item.geo?.ip}</span>
                        </div>
                      </div>

                      <div className="text-zinc-500 text-[10px] sm:text-right shrink-0">
                        {item.time}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* Footer info */}
        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-zinc-500 font-mono">
          <span>Maxfiy ochish: klaviaturada <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-white font-bold">zxam</kbd> yozing</span>
          <button
            onClick={() => { playClickSound(); onClose(); }}
            className="text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            Yopish
          </button>
        </div>

      </div>
    </div>
  );
};

export default AdminTrackerModal;
