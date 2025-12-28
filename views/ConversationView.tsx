import React, { useRef, useEffect } from 'react';
import { Conversation, User, Language } from '../types';
import MessageBubble from '../components/MessageBubble';
import ChatInput from '../components/ChatInput';
import { Sparkles } from 'lucide-react';
import { translations } from '../i18n';

interface ConversationViewProps {
  conversation: Conversation;
  user: User | null;
  lang: Language;
  onSendMessage: (content: string) => void;
  isLoading: boolean;
}

const ConversationView: React.FC<ConversationViewProps> = ({ conversation, user, lang, onSendMessage, isLoading }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const t = translations[lang];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [conversation.messages, isLoading]);

  return (
    <div className="flex flex-col h-full bg-gpt-bg-light dark:bg-gpt-bg-dark relative overflow-hidden transition-colors duration-300">
      {/* Scrollable Content Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto pt-6 md:pt-10 flex flex-col items-center"
      >
        <div className="w-full max-w-3xl flex flex-col">
          {conversation.messages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center mt-[15vh] animate-in fade-in duration-700">
              <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-[#2f2f2f] flex items-center justify-center mb-6">
                <Sparkles className="w-8 h-8 text-blue-500 dark:text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                {lang === 'zh' ? '我可以帮您什么？' : 'How can I help you?'}
              </h3>
              <p className="text-base text-slate-500 dark:text-slate-400 max-w-sm">
                {t.advisorSubtitle}
              </p>
            </div>
          ) : (
            <div className="pb-48">
              {conversation.messages.map(msg => (
                <MessageBubble key={msg.id} message={msg} lang={lang} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Floating Input Controls */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gpt-bg-light via-gpt-bg-light/95 to-transparent dark:from-gpt-bg-dark dark:via-gpt-bg-dark/95 dark:to-transparent pb-8 pt-12 px-4 flex justify-center z-10">
        <div className="w-full max-w-3xl">
          <ChatInput 
            onSend={onSendMessage} 
            isLoading={isLoading} 
            placeholder={t.placeholder}
            disabled={user ? user.quota <= 0 : false}
          />
          <p className="mt-3 text-[11px] text-center text-slate-500 dark:text-slate-500 opacity-80 font-medium">
            {t.aiDisclaimer}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConversationView;