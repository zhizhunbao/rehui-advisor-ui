
import React, { useState, useMemo } from 'react';
import { Conversation, User, Language, AppView } from '../types';
import { Plus, Trash2, PanelLeftClose, PanelLeftOpen, User as UserIcon, LogIn, LogOut, Compass } from 'lucide-react';
import { translations } from '../i18n';

interface SidebarProps {
  user: User | null;
  lang: Language;
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewChat: () => void;
  onDeleteConversation: (id: string) => void;
  onNavigate: (view: AppView) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  user,
  lang,
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewChat,
  onDeleteConversation,
  onNavigate,
  onLogout
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

  if (isCollapsed) {
    return (
      <div className="fixed left-4 top-3.5 z-[70]">
        <button 
          onClick={() => setIsCollapsed(false)}
          className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-[#171717] border border-slate-200 dark:border-white/10 rounded-lg shadow-sm"
        >
          <PanelLeftOpen className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <aside className="w-[260px] h-full bg-gpt-sidebar-light dark:bg-gpt-sidebar-dark border-r border-slate-200 dark:border-white/10 flex flex-col shrink-0 z-[70]">
      {/* Header with Brand & New Chat */}
      <div className="p-3 flex flex-col gap-2">
        <div className="flex items-center justify-between px-2 mb-1">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate(AppView.HOME)}>
            <div className="w-7 h-7 bg-blue-600 rounded-md flex items-center justify-center">
              <Compass className="text-white w-4 h-4" />
            </div>
            <span className="text-sm font-bold dark:text-white truncate">{t.title}</span>
          </div>
          <button onClick={() => setIsCollapsed(true)} className="p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white">
            <PanelLeftClose className="w-5 h-5" />
          </button>
        </div>
        
        <button 
          onClick={onNewChat}
          className="flex items-center gap-2 w-full rounded-lg px-3 py-2 hover:bg-slate-200 dark:hover:bg-[#2f2f2f] text-slate-900 dark:text-slate-200 transition-all text-sm font-medium border border-slate-200 dark:border-white/10"
        >
          <Plus className="w-4 h-4" />
          <span>{t.newChat}</span>
        </button>
      </div>

      {/* History */}
      <div className="flex-1 overflow-y-auto px-3 py-2 scrollbar-hide">
        {/* Cast list to any or Conversation[] to avoid 'unknown' type error in some TS environments */}
        {Object.entries(groupedConversations).map(([label, list]) => (list as Conversation[]).length > 0 && (
          <div key={label} className="mb-4">
            <div className="px-3 py-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider">{label}</div>
            {/* Cast list to Conversation[] to ensure access to map property */}
            {(list as Conversation[]).map((conv) => (
              <div 
                key={conv.id}
                onClick={() => onSelectConversation(conv.id)}
                className={`group relative flex items-center gap-2 rounded-lg px-3 py-2 cursor-pointer transition-colors text-sm ${
                  activeConversationId === conv.id ? 'bg-slate-200 dark:bg-[#2f2f2f] text-slate-900 dark:text-white' : 'hover:bg-slate-200/50 dark:hover:bg-[#212121] text-slate-700 dark:text-slate-300'
                }`}
              >
                <span className="flex-1 truncate">{conv.title}</span>
                <button 
                  className="opacity-0 group-hover:opacity-100 p-1 hover:text-rose-500"
                  onClick={(e) => { e.stopPropagation(); onDeleteConversation(conv.id); }}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Footer with User Controls */}
      <div className="p-3 border-t border-slate-200 dark:border-white/10">
        {user ? (
          <div className="flex flex-col gap-2">
            <div className="px-2 py-1">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                <span className="text-[10px] text-slate-400 uppercase tracking-widest">{t.quotaLeft} {user.quota}/20</span>
              </div>
              <div className="w-full h-1 bg-slate-200 dark:bg-[#2f2f2f] rounded-full overflow-hidden">
                <div className="h-full bg-blue-500" style={{ width: `${(user.quota / 20) * 100}%` }}></div>
              </div>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-[#2f2f2f] transition-colors group">
              <div className="flex items-center gap-2 overflow-hidden">
                <div className="w-8 h-8 rounded-full bg-slate-300 dark:bg-slate-700 flex items-center justify-center shrink-0">
                  <UserIcon className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                </div>
                <span className="text-sm font-medium dark:text-white truncate">{user.username}</span>
              </div>
              <button onClick={onLogout} className="p-1.5 text-slate-400 hover:text-rose-500">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <button 
            onClick={() => onNavigate(AppView.LOGIN)}
            className="flex items-center gap-2 w-full p-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-all text-sm font-bold shadow-lg shadow-blue-500/10"
          >
            <LogIn className="w-4 h-4" />
            <span>{t.login}</span>
          </button>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
