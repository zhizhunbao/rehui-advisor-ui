
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="py-4 px-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 mt-auto">
      <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-slate-500 dark:text-slate-400 text-xs font-medium tracking-wide">
          © 2025 北美生活顾问 · North American Life Advisor
        </div>
        <div className="flex flex-wrap justify-center md:justify-end gap-x-8 gap-y-2">
          <a href="#" className="text-slate-400 hover:text-blue-600 dark:hover:text-white text-xs transition-colors font-medium">关于我们 About</a>
          <a href="#" className="text-slate-400 hover:text-blue-600 dark:hover:text-white text-xs transition-colors font-medium">使用条款 Terms</a>
          <a href="#" className="text-slate-400 hover:text-blue-600 dark:hover:text-white text-xs transition-colors font-medium">隐私政策 Privacy</a>
          <a href="#" className="text-slate-400 hover:text-blue-600 dark:hover:text-white text-xs transition-colors font-medium">帮助中心 Help</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
