
import React from 'react';
import { Topic } from '../types';
import { getIcon } from '../constants';

interface TopicCardProps {
  topic: Topic;
  onClick: (topic: Topic) => void;
}

const TopicCard: React.FC<TopicCardProps> = ({ topic, onClick }) => {
  return (
    <div 
      onClick={() => onClick(topic)}
      className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 cursor-pointer hover:border-blue-400 dark:hover:border-slate-600 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 transform hover:-translate-y-1 active:scale-95 shadow-sm"
    >
      <div className={`w-12 h-12 ${topic.color} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/20`}>
        {getIcon(topic.icon, "text-white w-6 h-6")}
      </div>
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{topic.title}</h3>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">{topic.description}</p>
      
      <div className="mt-4 flex items-center text-xs font-bold text-blue-600 dark:text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest">
        Go 
        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  );
};

export default TopicCard;
