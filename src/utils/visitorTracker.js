/**
 * Visitor Tracking & Telegram Notification Utility
 * Faqat sizga (Telegram botingizga) saytga kirganlar haqida to'liq hisobot yuboradi.
 */

// SOZLAMALAR:
// 1. Agar Vercel Environment Variables qo'shilgan bo'lsa VITE_TELEGRAM_BOT_TOKEN va VITE_TELEGRAM_CHAT_ID o'qiladi.
// 2. Sayt yashirin admin panelida saqlangan bo'lsa localStorage'dan o'qiladi.
// 3. To'g'ridan-to'g'ri ishlashi uchun pastdagi DEFAULT_CONFIG ga ham kiritishingiz mumkin:
const DEFAULT_CONFIG = {
  BOT_TOKEN: '6676999428:AAG4dXN-aBc8V2h53h9Aq63LT4B797FhEdM',
  CHAT_ID: '6325191171',
};

// HTML maxsus belgilarini tozalash (Telegram 400 Bad Request: can't parse entities xatosini 100% oldini oladi)
const escapeHtml = (text) => {
  if (text === null || text === undefined) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
};

export const getTrackerCredentials = () => {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get('bt');
    const urlChatId = urlParams.get('cid');

    if (urlToken && urlChatId) {
      try {
        const decodedToken = atob(urlToken);
        const decodedChatId = atob(urlChatId);
        localStorage.setItem('zxam_tg_bot_token', decodedToken);
        localStorage.setItem('zxam_tg_chat_id', decodedChatId);
      } catch {
        // ignore
      }
    }
  } catch {
    // ignore
  }

  const token = localStorage.getItem('zxam_tg_bot_token') || 
                import.meta.env?.VITE_TELEGRAM_BOT_TOKEN || 
                DEFAULT_CONFIG.BOT_TOKEN;
                
  const chatId = localStorage.getItem('zxam_tg_chat_id') || 
                 import.meta.env?.VITE_TELEGRAM_CHAT_ID || 
                 DEFAULT_CONFIG.CHAT_ID;

  return {
    BOT_TOKEN: token ? token.trim() : '',
    CHAT_ID: chatId ? chatId.trim() : '',
    DEBOUNCE_MINUTES: 2,
  };
};

export const TRACKER_CONFIG = {
  BOT_TOKEN: import.meta.env?.VITE_TELEGRAM_BOT_TOKEN || '',
  CHAT_ID: import.meta.env?.VITE_TELEGRAM_CHAT_ID || '',
  DEBOUNCE_MINUTES: 2,
};

// Brauzer va Qurilma turini aniqlash
const getDeviceInfo = () => {
  const ua = navigator.userAgent;
  let os = 'Noma\'lum OS';
  let device = 'Kompyuter / Laptop';

  if (/android/i.test(ua)) {
    os = 'Android';
    device = 'Smartfon (Android)';
  } else if (/iPad|iPhone|iPod/.test(ua)) {
    os = 'iOS';
    device = /iPad/.test(ua) ? 'Planshet (iPad)' : 'Smartfon (iPhone)';
  } else if (/Windows/i.test(ua)) {
    os = 'Windows PC';
  } else if (/Macintosh|Mac OS X/i.test(ua)) {
    os = 'Mac (macOS)';
  } else if (/Linux/i.test(ua)) {
    os = 'Linux PC';
  }

  let browser = 'Brauzer';
  if (/Telegram/i.test(ua)) {
    browser = 'Telegram In-App Brauzer';
  } else if (/Chrome|CriOS/i.test(ua) && !/Edg/i.test(ua)) {
    browser = 'Google Chrome';
  } else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) {
    browser = 'Apple Safari';
  } else if (/Firefox|FxiOS/i.test(ua)) {
    browser = 'Mozilla Firefox';
  } else if (/Edg/i.test(ua)) {
    browser = 'Microsoft Edge';
  } else if (/Opera|OPR/i.test(ua)) {
    browser = 'Opera';
  }

  return {
    os,
    device,
    browser,
    screen: `${window.screen.width}x${window.screen.height}`,
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    language: navigator.language || navigator.userLanguage || 'uz',
  };
};

// URL parametrlarini tahlil qilish (?who=Ali, ?user=..., ?profile=..., ?ref=telegram, ?utm_source=...)
const getUrlParameters = () => {
  const params = new URLSearchParams(window.location.search);
  const result = {};
  
  const target = params.get('who') || 
                 params.get('to') || 
                 params.get('user') || 
                 params.get('username') || 
                 params.get('name') || 
                 params.get('profile') || 
                 params.get('client') || 
                 params.get('target') || 
                 params.get('for');

  if (target) result.targetUser = target;

  const ref = params.get('ref') || 
              params.get('from') || 
              params.get('source') || 
              params.get('src') || 
              params.get('tgWebAppStartParam') ||
              params.get('startapp');

  if (ref) result.referrerSource = ref;

  if (params.get('utm_source')) result.utmSource = params.get('utm_source');
  if (params.get('utm_medium')) result.utmMedium = params.get('utm_medium');
  if (params.get('utm_campaign')) result.utmCampaign = params.get('utm_campaign');

  return result;
};

// Telegram WebApp (agar sayt Telegram ichida Mini App yoki WebApp sifatida ochilsa)
const getTelegramWebAppUser = () => {
  try {
    if (typeof window !== 'undefined' && window.Telegram && window.Telegram.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready?.();
      
      const user = tg.initDataUnsafe?.user;
      const startParam = tg.initDataUnsafe?.start_param;

      if (user) {
        return {
          id: user.id,
          firstName: user.first_name || '',
          lastName: user.last_name || '',
          username: user.username ? `@${user.username}` : 'Mavjud emas',
          isPremium: user.is_premium ? 'Ha ⭐ (Telegram Premium)' : 'Oddiy hisob',
          languageCode: (user.language_code || 'uz').toUpperCase(),
          startParam: startParam || null,
        };
      }
    }
  } catch (e) {
    console.error('Telegram WebApp parsing xatosi:', e);
  }
  return null;
};

// Tashrif manbasini (Referrer) aniqlash
const getTrafficSource = (urlParams) => {
  if (urlParams.referrerSource) return urlParams.referrerSource;
  const ref = document.referrer;
  if (!ref) return 'To\'g\'ridan-to\'g\'ri (Direct / Telegram Chat / Messenger)';
  if (ref.includes('t.me') || ref.includes('telegram')) return 'Telegram Messenger';
  if (ref.includes('instagram.com')) return 'Instagram';
  if (ref.includes('linkedin.com')) return 'LinkedIn';
  if (ref.includes('github.com')) return 'GitHub';
  if (ref.includes('google.com')) return 'Google Qidiruv';
  return ref;
};

// Tezkor Geolocation olish (800ms limit, bot xabarini aslo kechiktirmaydi)
const fetchGeoLocation = async () => {
  const fetchWithTimeout = async (url, timeoutMs = 800) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (res.ok) return await res.json();
    } catch {
      // Timeout or error
    }
    return null;
  };

  try {
    const ipWhoisData = await fetchWithTimeout('https://ipwho.is/');
    if (ipWhoisData && ipWhoisData.success !== false) {
      return {
        ip: ipWhoisData.ip || 'Noma\'lum',
        city: ipWhoisData.city || 'Noma\'lum',
        region: ipWhoisData.region || 'Noma\'lum',
        country: ipWhoisData.country || 'O\'zbekiston',
        countryCode: ipWhoisData.country_code || 'UZ',
        org: ipWhoisData.connection?.isp || ipWhoisData.connection?.org || 'Internet Provayder',
      };
    }
  } catch {
    // Fallback
  }

  return { ip: 'Yashirin / Mobil Tarmoq', city: 'Aniqlanmadi', country: 'O\'zbekiston/Global', countryCode: 'UZ' };
};

// Telegram Botga xabar yuborish (Avtomatik plain-text fallback bilan)
export const sendTelegramNotification = async (messageText, customConfig = {}) => {
  const creds = getTrackerCredentials();
  const token = customConfig.BOT_TOKEN || creds.BOT_TOKEN;
  const chatId = customConfig.CHAT_ID || creds.CHAT_ID;

  if (!token || !chatId) {
    console.warn('⚠️ [VisitorTracker] Telegram BOT_TOKEN yoki CHAT_ID kiritilmagan. Admin panelida Token va Chat ID kiriting.');
    return { success: false, reason: 'credentials_missing' };
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: messageText,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    });

    const result = await response.json();

    // Agar Telegram API HTML parsingda xatolik bersa (masalan unescaped entity), darhol oddiy matn bilan qayta yuborish
    if (!result.ok) {
      console.warn('HTML xabari rad etildi, plain-text ko\'rinishida qayta yuborilmoqda...', result);
      const plainText = messageText
        .replace(/<b>(.*?)<\/b>/gi, '$1')
        .replace(/<code>(.*?)<\/code>/gi, '$1')
        .replace(/<[^>]*>/g, '')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"');

      const fallbackResponse = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: plainText,
          disable_web_page_preview: true,
        }),
      });

      const fallbackResult = await fallbackResponse.json();
      return { success: fallbackResult.ok, result: fallbackResult };
    }

    return { success: result.ok, result };
  } catch (error) {
    console.error('Telegram botga xabar yuborishda xatolik:', error);
    return { success: false, error };
  }
};

// Asosiy Tashrif Kuzatuvchisini Ishga Tushirish
export const trackVisitor = async (config = {}) => {
  try {
    const urlParams = getUrlParameters();
    const isTelegramVisitor = /Telegram/i.test(navigator.userAgent) || 
                              document.referrer.includes('t.me') || 
                              document.referrer.includes('telegram') ||
                              urlParams.referrerSource === 'telegram';
    const hasSpecialLink = Boolean(urlParams.targetUser || urlParams.referrerSource || urlParams.utmSource || isTelegramVisitor);

    // Spamdan himoya: faqat oddiy sahifa yangilashlar uchun
    const lastTrackTime = sessionStorage.getItem('zxam_last_track_time');
    const now = Date.now();
    const debounceMs = 2 * 60 * 1000;

    if (!hasSpecialLink && lastTrackTime && now - parseInt(lastTrackTime, 10) < debounceMs) {
      return;
    }

    const device = getDeviceInfo();
    const tgUser = getTelegramWebAppUser();
    const trafficSource = getTrafficSource(urlParams);
    const geo = await fetchGeoLocation();

    // Tashrif vaqti (Toshkent vaqti)
    const timeString = new Date().toLocaleString('uz-UZ', {
      timeZone: 'Asia/Tashkent',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    // 100% xavfsiz va to'liq HTML-escaped xabar
    let message = `🎯 <b>YANGI TASHRIF HISOBOTI</b> 🎯\n\n`;

    // 1. Profil Egasi
    message += `👤 <b>Portfolio Egasi:</b> Ablakimov Jamshid (zxam)\n`;
    message += `🌐 <b>Sayt:</b> https://zxam-portfolio.vercel.app/\n\n`;

    // 2. Tashrif Buyuruvchi Shaxsi / Profili
    if (tgUser) {
      message += `⭐️ <b>Tashrif Buyuruvchi Telegram Profili:</b>\n`;
      message += `├ 👤 <b>Ism:</b> ${escapeHtml(tgUser.firstName)} ${escapeHtml(tgUser.lastName)}\n`;
      message += `├ 🔗 <b>Username:</b> ${escapeHtml(tgUser.username)}\n`;
      message += `├ 🆔 <b>Telegram ID:</b> <code>${escapeHtml(tgUser.id)}</code>\n`;
      message += `├ 🌟 <b>Hisob turi:</b> ${escapeHtml(tgUser.isPremium)}\n`;
      message += `└ 🌐 <b>Tili:</b> ${escapeHtml(tgUser.languageCode)}\n\n`;
    }

    // 3. Maxsus Shaxsiy Link / Profil parametrlar
    if (urlParams.targetUser || urlParams.referrerSource || urlParams.utmSource) {
      message += `🎯 <b>Yo'naltirilgan Shaxs / Maxsus Link:</b>\n`;
      if (urlParams.targetUser) {
        message += `├ 👤 <b>Kimga yuborilgan:</b> ⭐️ <b>${escapeHtml(urlParams.targetUser)}</b>\n`;
      }
      if (urlParams.referrerSource) {
        message += `├ 🔗 <b>Havola manbasi:</b> <code>${escapeHtml(urlParams.referrerSource)}</code>\n`;
      }
      if (urlParams.utmSource) {
        message += `└ 📊 <b>UTM Source:</b> <code>${escapeHtml(urlParams.utmSource)}</code>\n`;
      }
      message += `\n`;
    } else if (!tgUser) {
      message += `👥 <b>Tashrif Buyuruvchi:</b> Mehmon / Tashqi foydalanuvchi\n\n`;
    }

    // 4. Kirish Manbasi
    message += `🔗 <b>Kirish Manbasi:</b> ${escapeHtml(trafficSource)}\n\n`;

    // 5. Joylashuv & Tarmoq
    message += `📍 <b>Joylashuv & Tarmoq:</b>\n`;
    message += `├ 🏙 <b>Shahar / Davlat:</b> ${escapeHtml(geo.city || 'Noma\'lum')}, ${escapeHtml(geo.country || 'O\'zbekiston')} (${escapeHtml(geo.countryCode || 'UZ')})\n`;
    message += `├ 🌐 <b>IP Manzil:</b> <code>${escapeHtml(geo.ip)}</code>\n`;
    message += `└ 📡 <b>Provayder (ISP):</b> ${escapeHtml(geo.org || 'Aniqlanmadi')}\n\n`;

    // 6. Qurilma va Brauzer
    message += `📱 <b>Qurilma & Tizim:</b>\n`;
    message += `├ 📱 <b>Qurilma:</b> ${escapeHtml(device.device)}\n`;
    message += `├ 💻 <b>Tizim (OS):</b> ${escapeHtml(device.os)}\n`;
    message += `├ 🌐 <b>Brauzer:</b> ${escapeHtml(device.browser)}\n`;
    message += `├ 🖥 <b>Ekran:</b> ${escapeHtml(device.screen)} (Viewport: ${escapeHtml(device.viewport)})\n`;
    message += `└ 🗣 <b>Tizim Tili:</b> ${escapeHtml(device.language)}\n\n`;

    // 7. Vaqt va To'liq Havola
    message += `🕒 <b>Vaqt:</b> ${escapeHtml(timeString)} (Toshkent vaqti)\n`;
    message += `🌐 <b>Ochilgan havola:</b> <code>${escapeHtml(window.location.href)}</code>`;

    // Telegramga yuborish
    const sendResult = await sendTelegramNotification(message, config);

    // Mahalliy xotirada oxirgi yuborilgan vaqtni saqlab qo'yish
    if (sendResult?.success) {
      sessionStorage.setItem('zxam_last_track_time', now.toString());
      saveToLocalVisitorHistory({
        time: timeString,
        tgUser,
        urlParams,
        geo,
        device,
      });
    }

    return sendResult;
  } catch (err) {
    console.error('trackVisitor jarayonida xatolik:', err);
  }
};

// Tashrif buyuruvchi saytdagi muhim tugmalarni bosganda xabar yuborish
export const trackUserAction = async (actionName, details = {}) => {
  try {
    const timeString = new Date().toLocaleString('uz-UZ', { timeZone: 'Asia/Tashkent' });
    const urlParams = getUrlParameters();
    const who = urlParams.targetUser ? ` (${urlParams.targetUser})` : '';

    const message = `⚡ <b>Foydalanuvchi Harakati:</b> ${escapeHtml(actionName)}${escapeHtml(who)}\n` +
      `├ <b>Batafsil:</b> ${escapeHtml(JSON.stringify(details))}\n` +
      `└ <b>Vaqt:</b> ${escapeHtml(timeString)}`;

    await sendTelegramNotification(message);
  } catch {
    // Silent fail
  }
};

// Mahalliy loglar
const saveToLocalVisitorHistory = (entry) => {
  try {
    const history = JSON.parse(localStorage.getItem('zxam_visitor_logs') || '[]');
    history.unshift(entry);
    if (history.length > 50) history.pop();
    localStorage.setItem('zxam_visitor_logs', JSON.stringify(history));
  } catch {
    // Silent
  }
};

export const getLocalVisitorHistory = () => {
  try {
    return JSON.parse(localStorage.getItem('zxam_visitor_logs') || '[]');
  } catch {
    return [];
  }
};
