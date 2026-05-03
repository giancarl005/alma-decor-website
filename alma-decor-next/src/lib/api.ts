export const getApiBase = () => {
  if (typeof window !== 'undefined') {
    // Client side (browser)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://127.0.0.1/Alma%20Decor%20Website';
    }
    // Pe server folosim calea relativă pentru client-side fetch
    return ''; 
  }

  // Server side (Build time sau Server Actions)
  if (process.env.NODE_ENV === 'production') {
    return 'https://almadecor.ro';
  }

  return 'http://127.0.0.1/Alma%20Decor%20Website';
};

export const API_BASE = getApiBase();
export const DOMAIN = 'https://almadecor.ro';
