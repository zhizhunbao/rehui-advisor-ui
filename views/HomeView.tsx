
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
    <div className="max-w-4xl mx-auto px-6 pt-12 pb-24 flex flex-col items-center">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
          {t.subtitle} <span className="text-blue-600 dark:text-blue-500">{t.subtitleSuffix}</span>
        </h1>
        <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
          {t.heroDesc}
        </p>
      </div>

      <div className="w-full mb-12">
        <ChatInput onSend={onQuickSearch} isLoading={false} placeholder={t.placeholder} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        {topics.map(topic => (
          <TopicCard key={topic.id} topic={topic} onClick={onTopicClick} />
        ))}
      </div>
    </div>
  );
};

export default HomeView;
