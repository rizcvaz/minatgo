// hooks/useDarkMode.js
import { useState, useEffect } from 'react';

// Kunci untuk Local Storage
const STORAGE_KEY = 'darkModeEnabled';

export function useDarkMode() {
  // Ambil nilai dari Local Storage saat inisialisasi state
  const [darkMode, setDarkMode] = useState(() => {
    // Pastikan kita hanya mencoba mengakses localStorage di lingkungan browser
    if (typeof window !== 'undefined') {
      const storedValue = localStorage.getItem(STORAGE_KEY);
      // Mengubah string 'true'/'false' menjadi boolean, default ke false jika tidak ada
      return storedValue === 'true';
    }
    return false; // Default ke Light Mode saat di server (SSR)
  });

  // useEffect untuk menyimpan state ke Local Storage setiap kali 'darkMode' berubah
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, darkMode);
    }
  }, [darkMode]);

  // Fungsi untuk toggle mode
  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  return [darkMode, toggleDarkMode];
}