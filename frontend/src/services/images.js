import { API_BASE_URL } from './api';

const getApiOrigin = () => {
  try {
    return new URL(API_BASE_URL, window.location.origin).origin;
  } catch {
    return window.location.origin;
  }
};

export const getImageUrl = (imageUrl, fallback = '/image/hero.png') => {
  const value = String(imageUrl || '').trim();

  if (!value) {
    return fallback;
  }

  if (value.startsWith('data:') || value.startsWith('blob:')) {
    return value;
  }

  if (value.startsWith('/uploads/')) {
    return `${getApiOrigin()}${value}`;
  }

  if (value.startsWith('uploads/')) {
    return `${getApiOrigin()}/${value}`;
  }

  try {
    const url = new URL(value);
    if ((url.hostname === 'localhost' || url.hostname === '127.0.0.1') && url.pathname.startsWith('/uploads/')) {
      return `${getApiOrigin()}${url.pathname}`;
    }
    return value;
  } catch {
    return value.startsWith('/') ? value : `/${value}`;
  }
};
