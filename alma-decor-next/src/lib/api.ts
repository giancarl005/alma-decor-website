export const getApiBase = () => {
  if (typeof window !== 'undefined') {
    return ''; // Relative path in browser
  }
  return 'https://almadecor.ro';
};

export const API_BASE = getApiBase();
export const DOMAIN = 'https://almadecor.ro';
