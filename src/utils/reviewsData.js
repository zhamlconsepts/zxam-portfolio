/**
 * Reviews & Community Ratings Data Storage
 * Bitta foydalanuvchi faqat bitta baho qoldira oladi (localStorage asosida tekshiriladi).
 * Yangi baholar saqlanadi va saytning pastki qismidagi sharhlar ro'yxatida darhol aks etadi.
 */

export const INITIAL_REVIEWS = [
  {
    id: 'rev-1',
    name: 'Sardorbek Rahimov',
    role: 'Senior Frontend Dev',
    rating: 5,
    tags: ['🔥 Ajoyib Dizayn', '⚡️ Ultra Tezkor', '💻 Toza Arxitektura'],
    comment: 'Cyber-editorial uslub juda chiroyli va qat’iy ishlangan. Shovqin effekti, tipografika va mikro-animatsiyalar premium darajada!',
    date: '2026-10-02',
    isOwn: false,
  },
  {
    id: 'rev-2',
    name: 'Dilshod Mamadaliyev',
    role: 'Product Designer',
    rating: 5,
    tags: ['🔥 Ajoyib Dizayn', '🎵 Qulay Musiqa Pleyeri'],
    comment: 'Musiqa pleyerining suzuvchi holati va suyuqlik (liquid ink) foni aqlbovar qilmas vizual tajriba beradi. Ijodkorlikka 10/10.',
    date: '2026-10-01',
    isOwn: false,
  },
  {
    id: 'rev-3',
    name: 'Ulug\'bek Tursunov',
    role: 'Full-Stack Engineer',
    rating: 5,
    tags: ['⚡️ Ultra Tezkor', '💻 Toza Arxitektura'],
    comment: 'Mobil telefonda ham 120Hz silliq scroll bo\'lyapti. Barcha animatsiyalar kadr tushib qolmasdan ravon ishlayapti. Super!',
    date: '2026-09-30',
    isOwn: false,
  },
  {
    id: 'rev-4',
    name: 'Javohir Qodirov',
    role: 'Startup Founder',
    rating: 5,
    tags: ['🚀 Hamkorlikka Tayyorman', '🔥 Ajoyib Dizayn'],
    comment: 'Ajoyib portfolioni ko\'rib loyihamiz frontendi uchun darhol bog\'lanishga qaror qildim. Kuchli arxitektor.',
    date: '2026-09-28',
    isOwn: false,
  },
  {
    id: 'rev-5',
    name: 'Azizbek Ergashev',
    role: 'React / WebGL Developer',
    rating: 5,
    tags: ['💻 Toza Arxitektura', '⚡️ Ultra Tezkor'],
    comment: 'Navier-Stokes suyuqlik simulyatsiyasi va inversiya kursori bir-biriga mukammal uyg\'unlashgan.',
    date: '2026-09-27',
    isOwn: false,
  },
];

const USER_REVIEW_STORAGE_KEY = 'zxam_portfolio_user_review';
const COMMUNITY_REVIEWS_STORAGE_KEY = 'zxam_portfolio_all_community_reviews';

/**
 * Foydalanuvchi allaqachon baho qoldirganmi?
 */
export const hasUserVoted = () => {
  if (typeof window === 'undefined') return false;
  return Boolean(
    localStorage.getItem(USER_REVIEW_STORAGE_KEY) ||
    localStorage.getItem('zxam_portfolio_rating_submitted')
  );
};

/**
 * Foydalanuvchi qoldirgan bahoni olish
 */
export const getUserReview = () => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(USER_REVIEW_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
    const legacyRating = localStorage.getItem('zxam_portfolio_rating_submitted');
    if (legacyRating) {
      return {
        id: 'user-own-legacy',
        name: 'Siz',
        role: 'Portfolio Mehmoni',
        rating: parseInt(legacyRating, 10) || 5,
        tags: ['🔥 Ajoyib Dizayn'],
        comment: 'Siz avvalroq portfolioni baholagansiz.',
        date: new Date().toLocaleDateString('uz-UZ'),
        isOwn: true,
      };
    }
  } catch (e) {
    console.error('getUserReview xatosi:', e);
  }
  return null;
};

/**
 * Barcha baholar ro'yxatini olish (foydalanuvchi o'z bahosini ham o'z ichiga oladi)
 */
export const getAllReviews = () => {
  let extraReviews = [];
  try {
    const rawCommunity = localStorage.getItem(COMMUNITY_REVIEWS_STORAGE_KEY);
    if (rawCommunity) {
      extraReviews = JSON.parse(rawCommunity);
    }
  } catch (e) {
    extraReviews = [];
  }

  const userReview = getUserReview();
  
  // Agar foydalanuvchining o'z bahosi bo'lsa va u hali ro'yxatda bo'lmasa, uni eng yuqoriga qo'yish
  const combined = [...extraReviews, ...INITIAL_REVIEWS];
  
  if (userReview) {
    const exists = combined.some((r) => r.id === userReview.id || r.isOwn);
    if (!exists) {
      combined.unshift(userReview);
    }
  }

  return combined;
};

/**
 * Foydalanuvchining yangi bahosini saqlash (faqat 1 marta)
 */
export const saveUserReview = (reviewData) => {
  if (typeof window === 'undefined') return null;

  const newReview = {
    id: 'user-' + Date.now(),
    name: reviewData.name?.trim() || 'Mehmon',
    role: 'Tashrifchi',
    rating: reviewData.rating || 5,
    tags: reviewData.tags || ['🔥 Ajoyib Dizayn'],
    comment: reviewData.comment?.trim() || '',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' }),
    isOwn: true,
  };

  try {
    localStorage.setItem(USER_REVIEW_STORAGE_KEY, JSON.stringify(newReview));
    localStorage.setItem('zxam_portfolio_rating_submitted', newReview.rating.toString());

    // Shuningdek, community ro'yxatining boshiga qo'shish
    const rawCommunity = localStorage.getItem(COMMUNITY_REVIEWS_STORAGE_KEY);
    const list = rawCommunity ? JSON.parse(rawCommunity) : [];
    list.unshift(newReview);
    localStorage.setItem(COMMUNITY_REVIEWS_STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.error('saveUserReview xatosi:', e);
  }

  return newReview;
};
