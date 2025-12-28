
import React, { useState, useRef, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
  placeholder?: string;
  disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend, isLoading, placeholder, disabled }) => {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (text.trim() && !isLoading && !disabled) {
      onSend(text.trim());
      setText('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [text]);

  return (
    <div className="relative w-full">
      <div className={`
        flex items-end gap-3 bg-white dark:bg-[#2f2f2f] 
        rounded-[32px] p-2 pr-2.5 pl-6 transition-all duration-500
        border border-slate-200/60 dark:border-white/5
        shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.3)]
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}>
        <textarea
          ref={textareaRef}
          rows={1}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 bg-transparent border-none focus:ring-0 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 resize-none py-3.5 text-[15px] leading-relaxed max-h-[200px] scrollbar-hide outline-none"
          disabled={disabled || isLoading}
        />

        <button 
          onClick={handleSend}
          disabled={!text.trim() || isLoading || disabled}
          className={`
            mb-1.5 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300
            ${text.trim() && !isLoading 
              ? 'bg-slate-900 dark:bg-white text-white dark:text-black hover:scale-105 shadow-lg' 
              : 'bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-600'
            }
          `}
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : (
            <ArrowUp className="w-5 h-5" strokeWidth={3} />
          )}
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
