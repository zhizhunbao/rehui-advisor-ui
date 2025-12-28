
import React from 'react';
import { 
  Plane, 
  Hotel, 
  Briefcase, 
  Car, 
  Home, 
  ShieldCheck, 
  GraduationCap, 
  TrendingUp 
} from 'lucide-react';
import { Topic, Language } from './types';

export const getLocalizedTopics = (lang: Language): Topic[] => {
  const isZh = lang === 'zh';
  return [
    {
      id: 'flights',
      title: isZh ? '机票咨询' : 'Flight Consult',
      description: isZh ? '寻找最优惠的航线与订票时机' : 'Find best routes and booking times',
      icon: 'Plane',
      color: 'bg-blue-500',
      prompt: isZh ? '我想咨询北美内部或往返北美的特价机票，请帮我分析最近的趋势。' : 'I want to inquire about cheap flights within or to North America. Please analyze trends.'
    },
    {
      id: 'hotels',
      title: isZh ? '酒店住宿' : 'Hotel Stay',
      description: isZh ? '北美各大城市住宿攻略与建议' : 'Guides for accommodation in NA cities',
      icon: 'Hotel',
      color: 'bg-indigo-500',
      prompt: isZh ? '我正在计划北美旅行，请推荐一些性价比高的酒店。' : 'I am planning a trip to NA, please recommend value-for-money hotels.'
    },
    {
      id: 'jobs',
      title: isZh ? '兼职实习' : 'Jobs & Interns',
      description: isZh ? '求职经验分享与职业规划建议' : 'Job experience and career planning',
      icon: 'Briefcase',
      color: 'bg-emerald-500',
      prompt: isZh ? '我想了解目前北美针对新移民或留学生的兼职与实习机会。' : 'I want to know about job/internship opportunities for newcomers/students in NA.'
    },
    {
      id: 'cars',
      title: isZh ? '汽车决策' : 'Car Decisions',
      description: isZh ? '购车流程、保险与维护全指南' : 'Buying, insurance, and maintenance guide',
      icon: 'Car',
      color: 'bg-orange-500',
      prompt: isZh ? '我在考虑在北美购买第一台车，请问二手车和新车如何权衡？' : 'I am considering buying my first car in NA. How do I weigh new vs used?'
    },
    {
      id: 'realestate',
      title: isZh ? '房产租赁' : 'Real Estate',
      description: isZh ? '租房买房流程与区域安全性评估' : 'Renting/Buying and safety assessment',
      icon: 'Home',
      color: 'bg-rose-500',
      prompt: isZh ? '我准备在北美长期定居，请帮我分析目前的房产租赁和买卖市场。' : 'I plan to settle in NA. Please analyze the current housing market.'
    },
    {
      id: 'insurance',
      title: isZh ? '保险理财' : 'Insurance',
      description: isZh ? '医疗、人寿与财产保险专业解读' : 'Medical, life, and property insurance',
      icon: 'ShieldCheck',
      color: 'bg-cyan-500',
      prompt: isZh ? '北美的保险系统非常复杂，请为我介绍基础的医疗保险选择。' : 'NA insurance is complex. Please introduce basic medical options.'
    },
    {
      id: 'education',
      title: isZh ? '留学生活' : 'Study Abroad',
      description: isZh ? '名校申请、校园生活与文化适应' : 'Applications, campus life, and culture',
      icon: 'GraduationCap',
      color: 'bg-purple-500',
      prompt: isZh ? '我正在申请北美大学，请问如何提升我的背景竞争力？' : 'I am applying to NA universities. How can I improve my profile?'
    },
    {
      id: 'investment',
      title: isZh ? '投资税务' : 'Investment & Tax',
      description: isZh ? '股市、基金与报税季节专业指导' : 'Stocks, funds, and tax season guidance',
      icon: 'TrendingUp',
      color: 'bg-amber-500',
      prompt: isZh ? '我想了解北美基础的报税知识以及合法的避税途径。' : 'I want to know basic NA tax knowledge and legal tax avoidance.'
    }
  ];
};

export const getIcon = (name: string, className?: string) => {
  switch (name) {
    case 'Plane': return <Plane className={className} />;
    case 'Hotel': return <Hotel className={className} />;
    case 'Briefcase': return <Briefcase className={className} />;
    case 'Car': return <Car className={className} />;
    case 'Home': return <Home className={className} />;
    case 'ShieldCheck': return <ShieldCheck className={className} />;
    case 'GraduationCap': return <GraduationCap className={className} />;
    case 'TrendingUp': return <TrendingUp className={className} />;
    default: return <Plane className={className} />;
  }
};
