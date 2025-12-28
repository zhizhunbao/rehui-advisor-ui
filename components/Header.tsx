
import React from 'react';
import { Language, Theme } from '../types';
import { Sun, Moon, Languages } from 'lucide-react';

interface HeaderProps {
  lang: Language;
  theme: Theme;
  onToggleLang: () => void;
  onToggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ lang, theme, onToggleLang, onToggleTheme }) => {
  return (
    <header className="h-12 flex items-center justify-end px-4 gap-2 sticky top-0 z-[60] bg-transparent pointer-events-none">
      <div className="flex items-center bg-white/80 dark:bg-[#212121]/80 backdrop-blur-sm rounded-full p-1 border border-slate-200 dark:border-white/10 pointer-events-auto shadow-sm">
        <button 
          onClick={onToggleTheme}
          className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 transition-all"
        >
          {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
        </button>
        <div className="w-px h-4 bg-slate-200 dark:bg-white/10 mx-1"></div>
        <button 
          onClick={onToggleLang}
          className="flex items-center gap-1 px-2 py-1 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 transition-all text-[11px] font-bold"
        >
          <Languages className="w-3.5 h-3.5" />
          <span className="uppercase">{lang}</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
