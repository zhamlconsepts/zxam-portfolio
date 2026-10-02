/**
 * Reviews & Community Ratings Data Storage
 * Bitta foydalanuvchi faqat bitta baho qoldira oladi (1 user = 1 review).
 * Hech qanday soxta / demo baholar YO'Q. Faqat real tashrifchilar qo'shgan baholar saqlanadi va ko'rsatiladi.
 */

// Soxta yoki demo ma'lumotlar butunlay olib tashlandi
export const INITIAL_REVIEWS = [];

const USER_REVIEW_STORAGE_KEY = 'zxam_portfolio_user_review';
const COMMUNITY_REVIEWS_STORAGE_KEY = 'zxam_portfolio_all_community_reviews';

/**
 * Eski demo/soxta sharhlarni tozalash (agar avval keshda qolgan bo'lsa)
 */
const sanitizeReviewsList = (list) => {
  if (!Array.isArray(list)) return [];
  // rev-1, rev-2 kabi demo id larni tozalash
  return list.filter((r) => r && r.id && !String(r.id).startsWith('rev-'));
};

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
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && !String(parsed.id).startsWith('rev-')) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('getUserReview xatosi:', e);
  }
  return null;
};

/**
 * Barcha real baholar ro'yxatini olish (faqat haqiqiy qo'shilganlar)
 */
export const getAllReviews = () => {
  if (typeof window === 'undefined') return [];

  let realCommunityReviews = [];
  try {
    const rawCommunity = localStorage.getItem(COMMUNITY_REVIEWS_STORAGE_KEY);
    if (rawCommunity) {
      const parsed = JSON.parse(rawCommunity);
      realCommunityReviews = sanitizeReviewsList(parsed);
      // Tozalangan ro'yxatni qayta saqlab qo'yish
      if (realCommunityReviews.length !== parsed.length) {
        localStorage.setItem(COMMUNITY_REVIEWS_STORAGE_KEY, JSON.stringify(realCommunityReviews));
      }
    }
  } catch (e) {
    realCommunityReviews = [];
  }

  const userReview = getUserReview();
  
  // Agar foydalanuvchining o'z bahosi bo'lsa va u hali ro'yxatda bo'lmasa, uni eng yuqoriga qo'yish
  const combined = [...realCommunityReviews];
  
  if (userReview) {
    const exists = combined.some((r) => r.id === userReview.id);
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

    // Shuningdek, haqiqiy community ro'yxatining boshiga qo'shish
    const rawCommunity = localStorage.getItem(COMMUNITY_REVIEWS_STORAGE_KEY);
    let list = rawCommunity ? JSON.parse(rawCommunity) : [];
    list = sanitizeReviewsList(list);
    list.unshift(newReview);
    localStorage.setItem(COMMUNITY_REVIEWS_STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.error('saveUserReview xatosi:', e);
  }

  return newReview;
};
