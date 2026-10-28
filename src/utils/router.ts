import { DepartmentType } from '../types';

export interface RouteRule {
  keywords: string[];
  dept: DepartmentType;
  to: string; // Agent name
  say: string;
  defaultTaskTitle: (query: string) => string;
}

export const ROUTER_RULES: RouteRule[] = [
  {
    keywords: ['website', 'web', 'landing', 'site', 'page', 'html', 'frontend', 'backend', 'fullstack', 'react', 'nextjs', 'css', 'design web'],
    dept: 'Engineering',
    to: 'WebBuilder',
    say: 'Website build karne ke liye WebBuilder ko assign kar diya gaya hai. Deliverables: Architecture → UX/UI → Code → Launch.',
    defaultTaskTitle: (q) => `Web Development: ${q.slice(0, 48).trim()}`,
  },
  {
    keywords: ['app', 'mobile', 'feature', 'flutter', 'react native', 'ios', 'android', 'apk'],
    dept: 'Engineering',
    to: 'AppSmith',
    say: 'Mobile aur app feature development AppSmith ko bhej diya hai. Responsive components aur state architecture tayar ki ja rahi hai.',
    defaultTaskTitle: (q) => `App Feature: ${q.slice(0, 48).trim()}`,
  },
  {
    keywords: ['report', 'data', 'chart', 'analy', 'trend', 'metric', 'dashboard', 'analytics', 'kpi', 'cohort'],
    dept: 'Data & Analytics',
    to: 'DataLens',
    say: 'Data analysis DataLens ko assign kiya gaya hai — metrics compile karke visual report tayar ki ja rahi hai.',
    defaultTaskTitle: (q) => `Data Analysis: ${q.slice(0, 48).trim()}`,
  },
  {
    keywords: ['research', 'market', 'insight', 'competitor', 'decision', 'strategy', 'study'],
    dept: 'Data & Analytics',
    to: 'InsightX',
    say: 'Strategic market research aur business insights InsightX ke paas bhej di hain.',
    defaultTaskTitle: (q) => `Market Research: ${q.slice(0, 48).trim()}`,
  },
  {
    keywords: ['security', 'audit', 'vulnerab', 'hack', 'risk', 'penetr', 'firewall', 'safety', 'breach', 'auth'],
    dept: 'Security',
    to: 'Sentinel',
    say: 'Security audit aur vulnerability review Sentinel ko assign kar di hai — findings aate hi flag ki jayengi.',
    defaultTaskTitle: (q) => `Security Audit: ${q.slice(0, 48).trim()}`,
  },
  {
    keywords: ['payment', 'invoice', 'receiv', 'refund', 'bank', 'paisa', 'bill', 'ledger', 'balance', 'pkr', 'usd'],
    dept: 'Finance',
    to: 'PayTrack',
    say: 'Finance aur payment processing PayTrack ko handover kiya gaya hai. Mezan Bank ledger update ho raha hai; receipt aate hi Vault verification karega.',
    defaultTaskTitle: (q) => `Finance & Billing: ${q.slice(0, 48).trim()}`,
  },
  {
    keywords: ['scam', 'fraud', 'verify', 'fake', 'suspicious', 'slip', 'proof', 'check payment'],
    dept: 'Finance',
    to: 'Vault',
    say: 'Payment verification aur anti-fraud check Vault ke paas bhej diya hai. Reference number aur slip authenticate ki ja rahi hai.',
    defaultTaskTitle: (q) => `Payment Verification: ${q.slice(0, 48).trim()}`,
  },
  {
    keywords: ['ad', 'ads', 'campaign', 'social', 'growth', 'instagram', 'facebook', 'meta', 'tiktok', 'roas'],
    dept: 'Marketing',
    to: 'AdWise',
    say: 'Marketing campaign aur paid growth strategy AdWise ko assign kar di gayi hai.',
    defaultTaskTitle: (q) => `Ad Campaign: ${q.slice(0, 48).trim()}`,
  },
  {
    keywords: ['content', 'blog', 'copy', 'write', 'caption', 'email', 'newsletter', 'script', 'article'],
    dept: 'Marketing',
    to: 'Scribe',
    say: 'Content creation aur copywriting Scribe ko handover kiya hai. SEO-optimized draft ready ho raha hai.',
    defaultTaskTitle: (q) => `Content Copywriting: ${q.slice(0, 48).trim()}`,
  },
  {
    keywords: ['client', 'lead', 'outreach', 'prospect', 'whatsapp', 'google maps', 'hunting', 'cold email', 'scrape'],
    dept: 'Marketing',
    to: 'LeadHunter',
    say: 'Client acquisition aur lead hunting LeadHunter ko assign kar di hai — targeted prospects filter kiye ja rahe hain.',
    defaultTaskTitle: (q) => `Lead Outreach: ${q.slice(0, 48).trim()}`,
  },
  {
    keywords: ['schedule', 'meeting', 'reminder', 'follow', 'calendar', 'admin', 'call', 'daily', 'sync'],
    dept: 'Operations',
    to: 'Atlas',
    say: 'Scheduling, operational coordination aur reminders Atlas ko assign kar diye gaye hain.',
    defaultTaskTitle: (q) => `Operations Task: ${q.slice(0, 48).trim()}`,
  },
];

export interface RouteResult {
  agentId: string | null;
  dept: DepartmentType | null;
  say: string;
  matchedRule: RouteRule | null;
}

export function routeMessage(text: string): RouteResult {
  const query = text.toLowerCase().trim();

  // Check specific banking inquiry
  if (query.includes('iban') || query.includes('mezan') || (query.includes('bank') && query.includes('detail'))) {
    return {
      agentId: 'PayTrack',
      dept: 'Finance',
      say: 'Mezan Bank, Pakistan account details active hain: Title: ABBAD ALI | IBAN: PK43 MEZN 0000 3001 1599 7949 | A/C: 00300115997949. Vault har payment verify karega.',
      matchedRule: ROUTER_RULES.find((r) => r.to === 'PayTrack') || null,
    };
  }

  for (const rule of ROUTER_RULES) {
    if (rule.keywords.some((k) => query.includes(k))) {
      return {
        agentId: rule.to,
        dept: rule.dept,
        say: rule.say,
        matchedRule: rule,
      };
    }
  }

  return {
    agentId: null,
    dept: null,
    say: 'Samajh gaya. Is request ke liye direct department trigger match nahi hua — batao ye kis type ka kaam hai (e.g. Website, App, Ads, Security Audit, Payments, Leads, Scheduling), main foran right agent ko assign kar doonga.',
    matchedRule: null,
  };
}

export function calculateAgentLoad(tasksCount: number, customLoadWeight?: number): {
  percentage: number;
  label: 'Idle' | 'Active' | 'Overloaded';
  pillClass: string;
} {
  let load = 0;
  if (customLoadWeight !== undefined && customLoadWeight > 0) {
    load = Math.min(100, customLoadWeight);
  } else {
    if (tasksCount === 0) load = 0;
    else if (tasksCount === 1) load = 30;
    else if (tasksCount === 2) load = 60;
    else if (tasksCount === 3) load = 85;
    else load = Math.min(100, 85 + (tasksCount - 3) * 5);
  }

  if (load === 0) {
    return { percentage: 0, label: 'Idle', pillClass: 'text-emerald-400 bg-emerald-500/10' };
  }
  if (load < 70) {
    return { percentage: load, label: 'Active', pillClass: 'text-amber-400 bg-amber-500/10' };
  }
  return { percentage: load, label: 'Overloaded', pillClass: 'text-rose-400 bg-rose-500/10' };
}
