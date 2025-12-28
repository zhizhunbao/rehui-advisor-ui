
import React, { useRef, useEffect } from 'react';
import { Conversation, User, Language } from '../types';
import MessageBubble from '../components/MessageBubble';
import ChatInput from '../components/ChatInput';
import { UserSearch, Search, ShieldCheck, Zap, Sparkles, MessageSquareCode } from 'lucide-react';
import { translations } from '../i18n';

interface ConversationViewProps {
  conversation?: Conversation;
  user: User | null;
  lang: Language;
  onSendMessage: (content: string) => void;
  isLoading: boolean;
}

const ConversationView: React.FC<ConversationViewProps> = ({ conversation, user, lang, onSendMessage, isLoading }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const t = translations[lang];

  const commonQuestions = lang === 'zh' ? [
    { text: "如何在北美选择适合自己的医疗保险？", icon: <ShieldCheck className="w-4 h-4 text-blue-500" /> },
    { text: "留学生毕业后在北美求职有哪些核心策略？", icon: <Zap className="w-4 h-4 text-amber-500" /> },
    { text: "在北美买二手车和买新车相比，有哪些隐藏成本？", icon: <Sparkles className="w-4 h-4 text-emerald-500" /> },
    { text: "初次在北美买房，哪些区域的安全性和性价比最高？", icon: <MessageSquareCode className="w-4 h-4 text-rose-500" /> }
  ] : [
    { text: "How to choose medical insurance in NA?", icon: <ShieldCheck className="w-4 h-4 text-blue-500" /> },
    { text: "Job hunting strategies for students in NA?", icon: <Zap className="w-4 h-4 text-amber-500" /> },
    { text: "Hidden costs of used vs new cars in NA?", icon: <Sparkles className="w-4 h-4 text-emerald-500" /> },
    { text: "Safest and most affordable areas for first-time buyers?", icon: <MessageSquareCode className="w-4 h-4 text-rose-500" /> }
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [conversation?.messages, isLoading]);

  const handleSuggestionClick = (question: string) => {
    if (!isLoading) {
      onSendMessage(question);
    }
  };

  const handleRegenerate = () => {
    if (conversation && conversation.messages.length > 1 && !isLoading) {
      const lastUserMsg = [...conversation.messages].reverse().find(m => m.role === 'user');
      if (lastUserMsg) {
        onSendMessage(lastUserMsg.content);
      }
    }
  };

  // Only show welcome if there are NO messages at all (not even hidden ones)
  const hasMessages = conversation && conversation.messages.length > 0;

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#212121] relative transition-colors duration-500 overflow-hidden">
      {/* Centered Scrollable Container */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto scrollbar-hide pt-16 pb-32"
      >
        <div className="w-full flex flex-col items-center">
          {!hasMessages ? (
            <div className="w-full max-w-3xl flex flex-col items-center justify-center p-8 text-center my-auto animate-in fade-in duration-1000">
              <div className="w-16 h-16 rounded-2xl bg-slate-900 dark:bg-white flex items-center justify-center mb-8 shadow-2xl">
                <UserSearch className="w-8 h-8 text-white dark:text-black" />
              </div>
              
              <div className="mb-10">
                <h3 className="text-3xl font-[900] text-slate-900 dark:text-white mb-4 tracking-tighter">
                  {lang === 'zh' ? '您好，我是您的北美生活决策顾问' : 'Hello, I am your NA Decision Advisor'}
                </h3>
                <p className="text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto font-medium leading-relaxed px-4">
                  {lang === 'zh' 
                    ? '请直接描述您的现状。我将通过多轮引导确认您的决策边界，并为您执行北美全网的实时调研。' 
                    : 'Please describe your situation. I will guide you through dimensions and execute real-time research across North America.'}
                </p>
              </div>

              {/* Suggestions Grid */}
              <div className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-3 mt-4 px-4">
                {commonQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSuggestionClick(q.text)}
                    className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-left hover:border-blue-500 hover:bg-white dark:hover:bg-white/10 transition-all group active:scale-[0.98] shadow-sm pointer-events-auto"
                  >
                    <div className="p-2 rounded-lg bg-white dark:bg-white/10 shadow-sm group-hover:scale-110 transition-transform">
                      {q.icon}
                    </div>
                    <span className="text-[13px] font-bold text-slate-700 dark:text-slate-200 leading-snug">
                      {q.text}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="w-full max-w-4xl py-6">
              {conversation.messages.map(msg => (
                <MessageBubble 
                  key={msg.id} 
                  message={msg} 
                  lang={lang} 
                  onSuggestionClick={handleSuggestionClick}
                  onRegenerate={handleRegenerate}
                />
              ))}
              
              {isLoading && (
                <div className="w-full flex justify-center py-6">
                  <div className="w-full max-w-3xl px-10">
                    <div className="flex items-center gap-4 text-emerald-500/80 font-black text-[10px] uppercase tracking-[0.3em] animate-pulse">
                      <Search className="w-3.5 h-3.5" />
                      {lang === 'zh' ? '正在为您执行北美全网深度调研...' : 'Executing deep North American research...'}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Floating Centered Input Container */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white/95 to-transparent dark:from-[#212121] dark:via-[#212121]/95 dark:to-transparent pb-6 pt-12 px-4 flex flex-col items-center z-20 pointer-events-none">
        <div className="w-full max-w-3xl pointer-events-auto">
          <ChatInput 
            onSend={onSendMessage} 
            isLoading={isLoading} 
            placeholder={t.placeholder}
            disabled={user ? user.quota <= 0 : false}
          />
          <div className="mt-3 flex justify-center">
            <p className="text-[10px] text-center text-slate-400 dark:text-slate-500 font-bold uppercase tracking-[0.1em] opacity-40">
              {t.aiDisclaimer}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationView;
