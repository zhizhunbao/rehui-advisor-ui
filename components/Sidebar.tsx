
import React, { useState, useMemo } from 'react';
import { Conversation, User, Language, AppView } from '../types';
import { Trash2, PanelLeftClose, PanelLeftOpen, User as UserIcon, LogOut, SquarePen, UserSearch } from 'lucide-react';
import { translations } from '../i18n';

interface SidebarProps {
  user: User | null;
  lang: Language;
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string | null) => void;
  onNewChat: () => void;
  onDeleteConversation: (id: string) => void;
  onNavigate: (view: AppView) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  user, lang, conversations, activeConversationId, onSelectConversation, 
  onNewChat, onDeleteConversation, onNavigate, onLogout
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const t = translations[lang];

  const groupedConversations = useMemo(() => {
    const groups: Record<string, Conversation[]> = { [t.today]: [], [t.yesterday]: [], [t.earlier]: [] };
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const yesterdayStart = todayStart - 86400000;

    conversations.forEach(conv => {
      if (conv.updatedAt >= todayStart) groups[t.today].push(conv);
      else if (conv.updatedAt >= yesterdayStart) groups[t.yesterday].push(conv);
      else groups[t.earlier].push(conv);
    });
    return groups;
  }, [conversations, lang, t.today, t.yesterday, t.earlier]);

  const handleGoHome = () => {
    onNavigate(AppView.HOME);
    onSelectConversation(null);
  };

  return (
    <>
      <div className={`fixed left-4 top-4 z-[80] transition-opacity duration-300 ${isCollapsed ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <button onClick={() => setIsCollapsed(false)} className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
          <PanelLeftOpen className="w-6 h-6" />
        </button>
      </div>

      <aside className={`relative h-full bg-gpt-sidebar-light dark:bg-gpt-sidebar-dark border-r border-slate-200 dark:border-white/10 flex flex-col shrink-0 z-[70] transition-[width] duration-300 ease-in-out overflow-hidden ${isCollapsed ? 'w-0 border-r-0' : 'w-[240px]'}`}>
        <div className="w-[240px] h-full flex flex-col">
          {/* GPT Top Actions with Brand Logo */}
          <div className="h-[60px] flex items-center px-3 shrink-0 gap-1">
            <button 
              onClick={handleGoHome}
              className="flex items-center gap-2 hover:bg-slate-200/50 dark:hover:bg-[#2f2f2f] p-1.5 rounded-xl transition-all active:scale-95 group flex-1 min-w-0"
              title="Go Home"
            >
              <div className="w-7 h-7 bg-slate-900 dark:bg-white rounded-lg flex items-center justify-center shrink-0 shadow-lg group-hover:scale-105 transition-transform">
                <UserSearch className="w-4 h-4 text-white dark:text-black" />
              </div>
              <span className="text-xs font-[800] text-slate-900 dark:text-white truncate tracking-tight">
                {lang === 'zh' ? '决策罗盘' : 'Decision Compass'}
              </span>
            </button>
            
            <div className="flex items-center">
              <button 
                onClick={() => setIsCollapsed(true)} 
                className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
                title="Hide sidebar"
              >
                <PanelLeftClose className="w-5 h-5" />
              </button>
              <button 
                onClick={onNewChat} 
                className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
                title="New chat"
              >
                <SquarePen className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* History */}
          <div className="flex-1 overflow-y-auto px-3 py-2 space-y-4 scrollbar-hide">
            {Object.entries(groupedConversations).map(([label, list]) => (list as Conversation[]).length > 0 && (
              <div key={label}>
                <div className="px-3 py-1 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">{label}</div>
                {(list as Conversation[]).map((conv) => (
                  <div 
                    key={conv.id} 
                    onClick={() => onSelectConversation(conv.id)} 
                    className={`group relative flex items-center gap-2 rounded-lg px-3 py-2 cursor-pointer transition-all text-sm ${activeConversationId === conv.id ? 'bg-slate-200 dark:bg-[#2f2f2f] text-slate-900 dark:text-white font-medium' : 'hover:bg-slate-200/50 dark:hover:bg-[#212121] text-slate-600 dark:text-slate-400'}`}
                  >
                    <span className="flex-1 truncate pr-6 font-medium">{conv.title}</span>
                    <button className="absolute right-2 opacity-0 group-hover:opacity-100 p-1 hover:text-rose-500 transition-opacity" onClick={(e) => { e.stopPropagation(); onDeleteConversation(conv.id); }}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* User Bottom Section */}
          <div className="p-3 border-t border-slate-200 dark:border-white/10 shrink-0">
            {user ? (
              <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-200 dark:hover:bg-[#2f2f2f] transition-colors group">
                <div className="w-8 h-8 rounded-full bg-slate-900 dark:bg-white flex items-center justify-center shrink-0 shadow-sm">
                  <UserIcon className="w-4 h-4 text-white dark:text-black" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold dark:text-slate-200 truncate">{user.username}</div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{t.quotaLeft}: {user.quota}/20</div>
                </div>
                <button onClick={onLogout} className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button onClick={() => onNavigate(AppView.LOGIN)} className="flex items-center gap-3 w-full p-2 rounded-xl hover:bg-slate-200 dark:hover:bg-[#2f2f2f] transition-colors">
                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                  <UserIcon className="w-4 h-4 text-slate-400" />
                </div>
                <span className="text-sm font-semibold dark:text-slate-200">{t.login}</span>
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
