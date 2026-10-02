import React, { useState, useEffect } from 'react';
import { X, Send, ShieldCheck, UserCheck, Smartphone, MapPin, Clock, Key, Copy, Check, ExternalLink, RefreshCw } from 'lucide-react';
import { sendTelegramNotification, getLocalVisitorHistory, trackVisitor } from '../utils/visitorTracker';
import { playClickSound, playSuccessSound } from '../utils/audio';

const AdminTrackerModal = ({ isOpen, onClose, onShowToast }) => {
  const [botToken, setBotToken] = useState(() => localStorage.getItem('zxam_tg_bot_token') || '');
  const [chatId, setChatId] = useState(() => localStorage.getItem('zxam_tg_chat_id') || '');
  const [targetName, setTargetName] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (isOpen) {
      setHistory(getLocalVisitorHistory());
      updateGeneratedLink(targetName);
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

  const handleSaveCredentials = () => {
    playClickSound();
    localStorage.setItem('zxam_tg_bot_token', botToken.trim());
    localStorage.setItem('zxam_tg_chat_id', chatId.trim());
    onShowToast?.('Telegram sozlamalari saqlandi!');
  };

  const handleTestBot = async () => {
    playClickSound();
    setIsTesting(true);
    const testMsg = `✅ <b>Sinov Xabari!</b>\n\nPortfolio saytingizdan Telegram botingiz muvaffaqiyatli ulandi!\nEndi saytga kim kirsa, barcha ma'lumotlar shu yerga keladi.`;
    
    const res = await sendTelegramNotification(testMsg, {
      BOT_TOKEN: botToken.trim(),
      CHAT_ID: chatId.trim()
    });

    setIsTesting(false);
    if (res.success) {
      playSuccessSound();
      onShowToast?.('✅ Sinov xabari Telegramingizga yuborildi!');
    } else {
      onShowToast?.('❌ Xatolik: Token yoki Chat ID noto\'g\'ri!');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#0d0d11] border border-white/15 rounded-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl text-white">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#e60000]/10 border border-[#e60000]/40 flex items-center justify-center text-[#e60000]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-editorial text-xl font-bold tracking-tight text-white flex items-center gap-2">
                VISITOR TRACKER <span className="text-xs font-mono py-0.5 px-2 bg-[#e60000] text-white rounded">ADMIN</span>
              </h3>
              <p className="text-xs text-zinc-400 font-sans">
                Faqat sizga ko'rinadigan Telegram bildirishnoma va tashriflar boshqaruvi
              </p>
            </div>
          </div>
          <button
            onClick={() => { playClickSound(); onClose(); }}
            className="p-2 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Telegram Sozlamalari */}
        <div className="mb-6 p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-zinc-200">
            <Key className="w-4 h-4 text-[#e60000]" />
            <span>Telegram Bot Ulanishi</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">TELEGRAM BOT TOKEN (@BotFather):</label>
              <input
                type="text"
                value={botToken}
                onChange={(e) => setBotToken(e.target.value)}
                placeholder="123456789:AAFx..."
                className="w-full bg-[#14141a] border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#e60000]"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">SIZNING CHAT ID (@userinfobot):</label>
              <input
                type="text"
                value={chatId}
                onChange={(e) => setChatId(e.target.value)}
                placeholder="123456789"
                className="w-full bg-[#14141a] border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#e60000]"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            <button
              onClick={handleSaveCredentials}
              className="px-4 py-2 bg-[#e60000] hover:bg-[#ff1a1a] text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" /> Saqlash
            </button>
            <button
              onClick={handleTestBot}
              disabled={isTesting || !botToken || !chatId}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" /> {isTesting ? 'Yuborilmoqda...' : 'Telegramga Sinov Xabari'}
            </button>
          </div>
        </div>

        {/* Maxsus Shaxsiy Link Yaratgich (Masalan: Sardor yoki HR ga yuborish uchun) */}
        <div className="mb-6 p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-zinc-200">
            <UserCheck className="w-4 h-4 text-[#e60000]" />
            <span>Shaxsiy Maxsus Havola Yaratish (Aniq kimligini bilish uchun)</span>
          </div>
          <p className="text-xs text-zinc-400">
            Biror kishiga havola yuborayotganda uning ismini kiritsangiz, u saytga kirishi bilan botingizga <b>"{targetName || 'Falonchi'} saytga kirdi"</b> deb xabar keladi:
          </p>

          <div className="flex gap-2">
            <input
              type="text"
              value={targetName}
              onChange={(e) => {
                setTargetName(e.target.value);
                updateGeneratedLink(e.target.value);
              }}
              placeholder="Masalan: Sardor, HR_Manager, Akmal..."
              className="flex-1 bg-[#14141a] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#e60000]"
            />
            <button
              onClick={handleCopyLink}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5"
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
              <Clock className="w-3.5 h-3.5 text-zinc-500" />
              Oxirgi Tashriflar Tarixi ({history.length})
            </div>
            <button
              onClick={() => { playClickSound(); setHistory(getLocalVisitorHistory()); }}
              className="text-xs text-zinc-400 hover:text-white flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" /> Yangilash
            </button>
          </div>

          {history.length === 0 ? (
            <div className="text-center py-6 text-xs text-zinc-500 font-mono bg-black/30 rounded-lg border border-white/5">
              Hozircha hech qanday tashrif qayd etilmagan.
            </div>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {history.map((item, idx) => (
                <div key={idx} className="p-3 bg-white/[0.02] border border-white/5 rounded-lg text-xs font-mono flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="text-white font-bold flex items-center gap-2">
                      <MapPin className="w-3 h-3 text-[#e60000]" />
                      <span>{item.geo?.city || 'Noma\'lum'}, {item.geo?.country || 'O\'zbekiston'}</span>
                      {item.urlParams?.targetUser && (
                        <span className="bg-[#e60000]/20 text-[#e60000] px-1.5 py-0.5 rounded text-[10px]">
                          {item.urlParams.targetUser}
                        </span>
                      )}
                    </div>
                    <div className="text-zinc-500 text-[11px] mt-0.5">
                      {item.device?.device} &bull; {item.device?.browser} &bull; IP: {item.geo?.ip}
                    </div>
                  </div>
                  <div className="text-zinc-500 text-[10px] text-right">
                    {item.time}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-zinc-500">
          <span>Ochish uchun klaviaturada: <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-zinc-300 font-mono">Ctrl + Shift + A</kbd></span>
          <button
            onClick={() => { playClickSound(); onClose(); }}
            className="text-zinc-400 hover:text-white transition-colors"
          >
            Yopish
          </button>
        </div>

      </div>
    </div>
  );
};

export default AdminTrackerModal;
