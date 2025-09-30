import React, { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [dark, setDark] = useState(() => localStorage.getItem('smartHabitTheme') === 'dark');

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('smartHabitTheme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('smartHabitTheme', 'light');
    }
  }, [dark]);

  return (
    <button
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      onClick={() => setDark(!dark)}
      className={`transition-colors duration-200 flex items-center gap-2 px-3 py-2 rounded-full shadow-md focus:outline-none border border-primary/30 bg-white/60 dark:bg-dark/80 hover:bg-primary/10 dark:hover:bg-primary/20`}
    >
      <span className="text-primary dark:text-secondary font-semibold">
        {dark ? 'Light' : 'Dark'} Mode
      </span>
      {dark ? (
        <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m8.66-8.66l-.71.71M4.05 19.95l-.71.71M21 12h-1M4 12H3m16.95 4.05l-.71-.71M4.05 4.05l-.71-.71M12 5a7 7 0 100 14 7 7 0 000-14z" /></svg>
      ) : (
        <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" /></svg>
      )}
    </button>
  );
}
