
import React, { useState, useRef, useEffect } from 'react';
import { Send, ArrowUp } from 'lucide-react';

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
    <div className="relative group">
      <div className={`
        flex items-end gap-2 bg-[#f4f4f4] dark:bg-[#212121] 
        rounded-[26px] p-2 pr-3 pl-4 transition-all duration-200
        focus-within:ring-1 focus-within:ring-slate-300 dark:focus-within:ring-slate-700
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}>
        <textarea
          ref={textareaRef}
          rows={1}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 bg-transparent border-none focus:ring-0 text-slate-900 dark:text-slate-100 placeholder-slate-500 resize-none py-3 text-base leading-relaxed"
          disabled={disabled || isLoading}
        />

        <button 
          onClick={handleSend}
          disabled={!text.trim() || isLoading || disabled}
          className={`
            mb-1.5 w-8 h-8 rounded-full flex items-center justify-center transition-all
            ${text.trim() && !isLoading 
              ? 'bg-slate-900 dark:bg-white text-white dark:text-black hover:opacity-80' 
              : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
            }
          `}
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : (
            <ArrowUp className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
