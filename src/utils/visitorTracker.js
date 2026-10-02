/**
 * Visitor Tracking & Telegram Notification Utility
 * Faqat sizga (Telegram botingizga) saytga kirganlar haqida to'liq hisobot yuboradi.
 */

// SOZLAMALAR:
// 1. Agar Vercel Environment Variables qo'shilgan bo'lsa VITE_TELEGRAM_BOT_TOKEN va VITE_TELEGRAM_CHAT_ID o'qiladi.
// 2. Sayt yashirin admin panelida saqlangan bo'lsa localStorage'dan o'qiladi.
// 3. To'g'ridan-to'g'ri ishlashi uchun pastdagi DEFAULT_CONFIG ga ham kiritishingiz mumkin:
const DEFAULT_CONFIG = {
  BOT_TOKEN: '', // O'zingizning Bot Tokeningizni shu yerga ham yozib qo'yishingiz mumkin
  CHAT_ID: '',   // O'zingizning Chat ID raqamingizni shu yerga ham yozib qo'yishingiz mumkin
};

export const getTrackerCredentials = () => {
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

// URL parametrlarini tahlil qilish (?who=Ali, ?ref=telegram, ?utm_source=...)
const getUrlParameters = () => {
  const params = new URLSearchParams(window.location.search);
  const result = {};
  
  if (params.get('who')) result.targetUser = params.get('who');
  if (params.get('to')) result.targetUser = params.get('to');
  if (params.get('name')) result.targetUser = params.get('name');
  if (params.get('ref')) result.referrerSource = params.get('ref');
  if (params.get('utm_source')) result.utmSource = params.get('utm_source');
  if (params.get('from')) result.referrerSource = params.get('from');

  return result;
};

// Telegram WebApp (agar sayt Telegram ichida Mini App sifatida ochilsa)
const getTelegramWebAppUser = () => {
  try {
    if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initDataUnsafe) {
      const user = window.Telegram.WebApp.initDataUnsafe.user;
      if (user) {
        return {
          id: user.id,
          firstName: user.first_name || '',
          lastName: user.last_name || '',
          username: user.username ? `@${user.username}` : 'Mavjud emas',
          isPremium: user.is_premium ? 'Ha (Telegram Premium ⭐)' : 'Yo\'q',
          languageCode: user.language_code || 'uz',
        };
      }
    }
  } catch (e) {
    console.error('Telegram WebApp parsing xatosi:', e);
  }
  return null;
};

// Tezkor Geolocation olish (Timeout bilan, hech qachon bot xabarini to'xtatib qo'ymaydi)
const fetchGeoLocation = async () => {
  const fetchWithTimeout = async (url, timeoutMs = 1500) => {
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
    // 1-urinish: ipwho.is (Juda tez va limitsiz)
    const ipWhoisData = await fetchWithTimeout('https://ipwho.is/');
    if (ipWhoisData && ipWhoisData.success !== false) {
      return {
        ip: ipWhoisData.ip || 'Noma\'lum',
        city: ipWhoisData.city || 'Noma\'lum',
        region: ipWhoisData.region || 'Noma\'lum',
        country: ipWhoisData.country || 'O\'zbekiston',
        countryCode: ipWhoisData.country_code || 'UZ',
        org: ipWhoisData.connection?.isp || ipWhoisData.connection?.org || 'Internet Provayder',
        timezone: ipWhoisData.timezone?.id || 'Asia/Tashkent',
      };
    }

    // 2-urinish: ipapi.co
    const ipApiData = await fetchWithTimeout('https://ipapi.co/json/');
    if (ipApiData && ipApiData.ip) {
      return {
        ip: ipApiData.ip || 'Noma\'lum',
        city: ipApiData.city || 'Noma\'lum',
        region: ipApiData.region || 'Noma\'lum',
        country: ipApiData.country_name || 'O\'zbekiston',
        countryCode: ipApiData.country_code || 'UZ',
        org: ipApiData.org || 'Internet Provayder',
        timezone: ipApiData.timezone || 'Asia/Tashkent',
      };
    }
  } catch {
    // Fallback
  }

  return { ip: 'Yashirin / Mobil Tarmoq', city: 'Aniqlanmadi', country: 'O\'zbekiston/Global', countryCode: 'UZ' };
};

// Telegram Botga xabar yuborish
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
    const hasSpecialLink = Boolean(urlParams.targetUser || urlParams.referrerSource || urlParams.utmSource);

    // Spamdan himoya: faqat oddiy qayta yuklashlar uchun 2 daqiqa. Maxsus link bo'lsa darhol yuboradi!
    const lastTrackTime = sessionStorage.getItem('zxam_last_track_time');
    const now = Date.now();
    const debounceMs = 2 * 60 * 1000; // 2 daqiqa

    if (!hasSpecialLink && lastTrackTime && now - parseInt(lastTrackTime, 10) < debounceMs) {
      return;
    }

    const device = getDeviceInfo();
    const tgUser = getTelegramWebAppUser();
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

    // Go'zal va tushunarli Telegram xabari formatlash
    let message = `🎯 <b>YANGI TASHRIF: zxam-portfolio.vercel.app</b> 🎯\n\n`;

    // Agar Telegram WebApp orqali kirgan bo'lsa (Telegramdagi ism, username)
    if (tgUser) {
      message += `👤 <b>Telegram Foydalanuvchi:</b>\n`;
      message += `├ <b>Ism:</b> ${tgUser.firstName} ${tgUser.lastName}\n`;
      message += `├ <b>Username:</b> ${tgUser.username}\n`;
      message += `├ <b>Telegram ID:</b> <code>${tgUser.id}</code>\n`;
      message += `└ <b>Premium:</b> ${tgUser.isPremium}\n\n`;
    }

    // Agar maxsus link orqali kirgan bo'lsa (?who=Ali yoki ?ref=telegram)
    if (urlParams.targetUser || urlParams.referrerSource || urlParams.utmSource) {
      message += `🔗 <b>Maxsus Link Ma'lumotlari:</b>\n`;
      if (urlParams.targetUser) {
        message += `├ <b>Kim uchun yuborilgan:</b> ⭐️ <b>${urlParams.targetUser}</b>\n`;
      }
      if (urlParams.referrerSource) {
        message += `├ <b>Havola manbasi:</b> <code>${urlParams.referrerSource}</code>\n`;
      }
      if (urlParams.utmSource) {
        message += `└ <b>UTM Source:</b> <code>${urlParams.utmSource}</code>\n`;
      }
      message += `\n`;
    }

    // Geolocation & Internet
    message += `📍 <b>Joylashuv & Tarmoq:</b>\n`;
    message += `├ <b>Shahar / Davlat:</b> ${geo.city || 'Noma\'lum'}, ${geo.country || 'O\'zbekiston'} ${geo.countryCode ? `(${geo.countryCode})` : ''}\n`;
    message += `├ <b>IP Manzil:</b> <code>${geo.ip}</code>\n`;
    message += `└ <b>Provayder (ISP):</b> ${geo.org || 'Aniqlanmadi'}\n\n`;

    // Qurilma va Brauzer
    message += `📱 <b>Qurilma & Brauzer:</b>\n`;
    message += `├ <b>Qurilma:</b> ${device.device}\n`;
    message += `├ <b>Tizim (OS):</b> ${device.os}\n`;
    message += `├ <b>Brauzer:</b> ${device.browser}\n`;
    message += `├ <b>Ekran:</b> ${device.screen} (Viewport: ${device.viewport})\n`;
    message += `└ <b>Tili:</b> ${device.language}\n\n`;

    // Havola va Vaqt
    message += `🕒 <b>Vaqt:</b> ${timeString} (Toshkent)\n`;
    message += `🌐 <b>Ochilgan sahifa:</b> <code>${window.location.href}</code>`;

    // Telegramga yuborish
    const sendResult = await sendTelegramNotification(message, config);

    // Mahalliy xotirada oxirgi yuborilgan vaqtni saqlab qo'yish
    if (sendResult.success) {
      sessionStorage.setItem('zxam_last_track_time', now.toString());
      // Admin dashboard uchun oxirgi tashriflar tarixiga saqlash
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

    const message = `⚡ <b>Foydalanuvchi Harakati:</b> ${actionName}${who}\n` +
      `├ <b>Batafsil:</b> ${JSON.stringify(details)}\n` +
      `└ <b>Vaqt:</b> ${timeString}`;

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
