
import React from 'react';
import { Topic, User, Language } from '../types';
import { getLocalizedTopics } from '../constants';
import TopicCard from '../components/TopicCard';
import ChatInput from '../components/ChatInput';
import { translations } from '../i18n';

interface HomeViewProps {
  user: User | null;
  lang: Language;
  onTopicClick: (topic: Topic) => void;
  onQuickSearch: (query: string) => void;
}

const HomeView: React.FC<HomeViewProps> = ({ user, lang, onTopicClick, onQuickSearch }) => {
  const t = translations[lang];
  const topics = getLocalizedTopics(lang);

  return (
    <div className="w-full min-h-full flex flex-col items-center justify-center bg-white dark:bg-[#212121] px-6 py-12 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-40 dark:opacity-20">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-400/10 blur-[120px] rounded-full" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-indigo-400/10 blur-[120px] rounded-full" />
      </div>

      <div className="w-full max-w-4xl flex flex-col items-center relative z-10 animate-in">
        {/* Hero Section */}
        <div className="text-center mb-10 max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-[900] text-slate-900 dark:text-white mb-6 tracking-tighter leading-[1.1]">
            {t.subtitle} <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-500">{t.subtitleSuffix}</span>
          </h1>
        </div>

        {/* Search/Input Section */}
        <div className="w-full max-w-2xl mb-16">
          <ChatInput onSend={onQuickSearch} isLoading={false} placeholder={t.placeholder} />
        </div>

        {/* Topics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          {topics.map(topic => (
            <TopicCard key={topic.id} topic={topic} onClick={onTopicClick} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeView;
