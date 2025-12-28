
import React, { useState, useEffect, useCallback } from 'react';
import { AppView, User, Conversation, Message, Topic, Language, Theme, GroundingSource } from './types';
import Layout from './components/Layout';
import HomeView from './views/HomeView';
import ConversationView from './views/ConversationView';
import AuthView from './views/AuthView';
import { getAdvisorStream } from './services/geminiService';
import { translations } from './i18n';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.HOME);
  const [user, setUser] = useState<User | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  
  const [lang, setLang] = useState<Language>(() => (localStorage.getItem('lang') as Language) || 'zh');
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('theme') as Theme) || 'dark');

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));
    const savedConvs = localStorage.getItem('conversations');
    if (savedConvs) setConversations(JSON.parse(savedConvs));
  }, []);

  useEffect(() => {
    theme === 'dark' ? document.documentElement.classList.add('dark') : document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => { localStorage.setItem('lang', lang); }, [lang]);
  useEffect(() => { user ? localStorage.setItem('user', JSON.stringify(user)) : localStorage.removeItem('user'); }, [user]);
  useEffect(() => { localStorage.setItem('conversations', JSON.stringify(conversations)); }, [conversations]);

  const handleNavigate = (newView: AppView) => setView(newView);
  const handleAuthSuccess = (userData: User) => { setUser(userData); setView(AppView.HOME); };
  const handleLogout = () => { setUser(null); setConversations([]); setActiveConversationId(null); setView(AppView.HOME); };
  const toggleLang = () => setLang(prev => prev === 'zh' ? 'en' : 'zh');
  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const processAiReplyStream = async (convId: string, history: Message[]) => {
    setIsAiLoading(true);
    
    const aiMsgId = Date.now().toString() + '-ai';
    const initialAiMsg: Message = {
      id: aiMsgId,
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
      isStreaming: true
    };

    setConversations(prev => prev.map(c => c.id === convId ? { ...c, messages: [...c.messages, initialAiMsg] } : c));

    try {
      const responseStream = await getAdvisorStream(history, lang);
      let fullText = "";
      let sources: GroundingSource[] = [];

      for await (const chunk of responseStream) {
        fullText += chunk.text || "";
        
        const groundingMetadata = chunk.candidates?.[0]?.groundingMetadata;
        if (groundingMetadata?.groundingChunks) {
          const newSources = groundingMetadata.groundingChunks
            .filter(gc => gc.web)
            .map(gc => ({ title: gc.web?.title || 'Source', uri: gc.web?.uri || '#' }));
          
          if (newSources.length > 0) {
            sources = [...sources, ...newSources.filter(ns => !sources.some(s => s.uri === ns.uri))];
          }
        }

        setConversations(prev => prev.map(c => {
          if (c.id === convId) {
            return {
              ...c,
              messages: c.messages.map(m => m.id === aiMsgId ? { ...m, content: fullText, sources } : m)
            };
          }
          return c;
        }));
      }

      setConversations(prev => prev.map(c => {
        if (c.id === convId) {
          return {
            ...c,
            messages: c.messages.map(m => m.id === aiMsgId ? { ...m, isStreaming: false } : m),
            updatedAt: Date.now()
          };
        }
        return c;
      }));

      if (user) setUser(prev => prev ? { ...prev, quota: Math.max(0, prev.quota - 1) } : null);
    } catch (error) {
      console.error("Streaming Error:", error);
      setConversations(prev => prev.map(c => c.id === convId ? { 
        ...c, 
        messages: c.messages.map(m => m.id === aiMsgId ? { ...m, content: lang === 'zh' ? "抱歉，检索实时信息时出现错误。" : "Sorry, an error occurred while searching for real-time information.", isStreaming: false } : m) 
      } : c));
    } finally {
      setIsAiLoading(false);
    }
  };

  const createNewConversation = useCallback((initialMessage?: string, topic?: Topic, hidden: boolean = false) => {
    const newId = Date.now().toString();
    const initialMsgs: Message[] = [];
    
    if (initialMessage) {
      initialMsgs.push({
        id: Date.now().toString() + '-user',
        role: 'user',
        content: initialMessage,
        timestamp: Date.now(),
        metadata: { hidden }
      });
    }

    const newConv: Conversation = {
      id: newId,
      title: topic ? topic.title : (initialMessage ? initialMessage.slice(0, 20) : (lang === 'zh' ? '新咨询' : 'New Consulting')),
      messages: initialMsgs,
      topicId: topic?.id,
      updatedAt: Date.now()
    };

    setConversations(prev => [newConv, ...prev]);
    setActiveConversationId(newId);
    setView(AppView.CONVERSATION);

    if (initialMessage) {
      processAiReplyStream(newId, initialMsgs);
    }
  }, [lang]);

  const handleTopicClick = (topic: Topic) => {
    // Direct dialog mode: Auto-send prompt but keep it hidden from UI
    createNewConversation(topic.prompt, topic, true);
  };

  const handleQuickSearch = (query: string) => createNewConversation(query);
  const handleDeleteConversation = (id: string) => {
    setConversations(prev => prev.filter(c => c.id !== id));
    if (activeConversationId === id) { setActiveConversationId(null); setView(AppView.HOME); }
  };

  const handleSendMessage = async (content: string) => {
    if (!activeConversationId) {
      createNewConversation(content);
      return;
    }
    const userMsg: Message = { id: Date.now().toString() + '-user', role: 'user', content, timestamp: Date.now() };
    let updatedHistory: Message[] = [];
    setConversations(prev => prev.map(c => {
      if (c.id === activeConversationId) {
        updatedHistory = [...c.messages, userMsg];
        return { ...c, messages: updatedHistory, updatedAt: Date.now(), title: c.messages.length <= 1 ? content.slice(0, 20) : c.title };
      }
      return c;
    }));
    await processAiReplyStream(activeConversationId, updatedHistory);
  };

  const activeConv = conversations.find(c => c.id === activeConversationId);
  const renderContent = () => {
    switch (view) {
      case AppView.HOME: return <HomeView user={user} lang={lang} onTopicClick={handleTopicClick} onQuickSearch={handleQuickSearch} />;
      case AppView.CONVERSATION: return <ConversationView conversation={activeConv} user={user} lang={lang} onSendMessage={handleSendMessage} isLoading={isAiLoading} />;
      case AppView.LOGIN: return <AuthView type="login" lang={lang} onNavigate={handleNavigate} onAuthSuccess={handleAuthSuccess} />;
      case AppView.REGISTER: return <AuthView type="register" lang={lang} onNavigate={handleNavigate} onAuthSuccess={handleAuthSuccess} />;
      default: return <HomeView user={user} lang={lang} onTopicClick={handleTopicClick} onQuickSearch={handleQuickSearch} />;
    }
  };

  return (
    <Layout
      view={view} user={user} lang={lang} theme={theme}
      onNavigate={handleNavigate} onLogout={handleLogout} onToggleLang={toggleLang} onToggleTheme={toggleTheme}
      conversations={conversations} activeConversationId={activeConversationId}
      onSelectConversation={(id) => { 
        setActiveConversationId(id); 
        if (id) setView(AppView.CONVERSATION); 
        else setView(AppView.HOME);
      }}
      onNewChat={() => { setActiveConversationId(null); setView(AppView.CONVERSATION); }}
      onDeleteConversation={handleDeleteConversation}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;
