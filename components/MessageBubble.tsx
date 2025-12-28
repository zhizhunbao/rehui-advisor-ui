
import React, { useState, useMemo } from 'react';
import { Message, Language } from '../types';
import { Copy, Check } from 'lucide-react';
import { translations } from '../i18n';

interface MessageBubbleProps {
  message: Message;
  lang: Language;
}

const formatMarkdown = (content: string) => {
  if (!content) return "";
  let html = content;
  html = html.replace(/```([\s\S]*?)```/g, (_, code) => `<pre class="my-2 p-3 rounded-lg bg-black text-slate-300 font-mono text-[13px] border border-white/10 overflow-x-auto"><code>${code.trim()}</code></pre>`);
  html = html.replace(/^### (.*$)/gm, '<h3 class="text-sm font-bold mt-2 mb-1 text-slate-900 dark:text-white">$1</h3>');
  html = html.replace(/^## (.*$)/gm, '<h2 class="text-base font-bold mt-3 mb-2 text-slate-900 dark:text-white">$1</h2>');
  html = html.replace(/^# (.*$)/gm, '<h1 class="text-lg font-bold mt-4 mb-3 text-slate-900 dark:text-white">$1</h1>');
  html = html.replace(/^\s*[-*+]\s+(.*)$/gm, '<li class="ml-4 list-disc my-0.5">$1</li>');
  html = html.replace(/^\s*\d+\.\s+(.*)$/gm, '<li class="ml-4 list-decimal my-0.5">$1</li>');
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-900 dark:text-white">$1</strong>');
  html = html.replace(/`([^`]+)`/g, '<code class="bg-slate-100 dark:bg-white/10 px-1 py-0.5 rounded font-mono text-[12px] text-blue-600 dark:text-blue-400">$1</code>');
  return html.split('\n\n').map(p => {
    if (p.trim().startsWith('<')) return p;
    return `<p class="mb-1 leading-relaxed last:mb-0">${p.replace(/\n/g, '<br/>')}</p>`;
  }).join('');
};

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, lang }) => {
  const isAssistant = message.role === 'assistant';
  const [copied, setCopied] = useState(false);
  const formattedContent = useMemo(() => formatMarkdown(message.content), [message.content]);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`w-full group px-4 flex flex-col ${isAssistant ? 'items-start' : 'items-end'} mb-6`}>
      <div className={`max-w-3xl w-full flex ${isAssistant ? 'justify-start' : 'justify-end'}`}>
        <div className={`
          prose prose-slate dark:prose-invert max-w-full text-[15px]
          ${!isAssistant 
            ? 'bg-[#f4f4f4] dark:bg-[#343541] px-4 py-2.5 rounded-[22px] text-slate-900 dark:text-slate-100 inline-block' 
            : 'text-slate-800 dark:text-slate-200'
          }
        `}>
          <div dangerouslySetInnerHTML={{ __html: formattedContent }} />
          {isAssistant && message.isStreaming && (
            <span className="inline-block w-2 h-4 ml-1 bg-slate-400 animate-pulse align-middle" />
          )}
        </div>
      </div>

      {isAssistant && !message.isStreaming && (
        <div className="max-w-3xl w-full mt-2 flex items-center gap-4">
          <button 
            onClick={handleCopy} 
            className="opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          {message.sources && message.sources.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {message.sources.map((s, i) => (
                <a key={i} href={s.uri} target="_blank" rel="noopener noreferrer" className="text-[10px] bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-1.5 py-0.5 rounded text-slate-400 hover:text-blue-500 transition-colors">
                  {i + 1}
                </a>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MessageBubble;
