export const getApiBase = () => {
  if (typeof window !== 'undefined') {
    return ''; // Browser
  }
  return 'https://almadecor.ro';
};

export const API_BASE = getApiBase();
export const DOMAIN = 'https://almadecor.ro';
