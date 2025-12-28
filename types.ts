
export enum AppView {
  HOME = 'home',
  CONVERSATION = 'conversation',
  LOGIN = 'login',
  REGISTER = 'register'
}

export type Language = 'zh' | 'en';
export type Theme = 'light' | 'dark';

export interface User {
  id: string;
  email: string;
  username: string;
  avatar?: string;
  quota: number;
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface ChartData {
  type: 'bar' | 'line' | 'pie';
  title: string;
  labels: string[];
  values: number[];
  unit?: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  sources?: GroundingSource[];
  isStreaming?: boolean;
  chartData?: ChartData;
  suggestedQuestions?: string[];
  metadata?: {
    hidden?: boolean;
  };
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  topicId?: string;
  updatedAt: number;
}

export interface Topic {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  prompt: string;
}
