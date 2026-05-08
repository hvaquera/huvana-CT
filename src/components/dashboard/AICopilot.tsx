'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Bot, Send, X, ChevronDown, ChevronUp, RefreshCw, Sparkles, AlertTriangle, CheckCircle, Info, Zap } from 'lucide-react';

interface Insight {
  type: 'warning' | 'success' | 'info' | 'critical';
  title: string;
  message: string;
  metric: string | null;
  action?: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AICopilotProps {
  tasks: any[];
  timeActuals: any;
  githubData: any;
}

const insightStyles = {
  critical: { bg: 'bg-red-50', border: 'border-red-200', icon: AlertTriangle, iconColor: 'text-red-500', badge: 'bg-red-100 text-red-700' },
  warning:  { bg: 'bg-amber-50', border: 'border-amber-200', icon: AlertTriangle, iconColor: 'text-amber-500', badge: 'bg-amber-100 text-amber-700' },
  success:  { bg: 'bg-emerald-50', border: 'border-emerald-200', icon: CheckCircle, iconColor: 'text-emerald-500', badge: 'bg-emerald-100 text-emerald-700' },
  info:     { bg: 'bg-blue-50', border: 'border-blue-200', icon: Info, iconColor: 'text-blue-500', badge: 'bg-blue-100 text-blue-700' },
};

const SUGGESTED_QUESTIONS = [
  'Which project is at highest risk right now?',
  'Who has the most overdue tasks?',
  'How is the team performing this month?',
  'Which client is burning budget fastest?',
  'What should I focus on today?',
];

export default function AICopilot({ tasks, timeActuals, githubData }: AICopilotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [insightsExpanded, setInsightsExpanded] = useState(true);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [insightsLoaded, setInsightsLoaded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadInsights = useCallback(async () => {
    if (!tasks?.length) return;
    setLoadingInsights(true);
    try {
      const res = await fetch('/api/ai/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tasks, timeActuals, githubData, context: { company: 'Simpat Tech' } }),
      });
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      setInsights(data.insights ?? []);
      setInsightsLoaded(true);
    } catch {
      setInsights([]);
    } finally {
      setLoadingInsights(false);
    }
  }, [tasks, timeActuals, githubData]);

  useEffect(() => {
    if (isOpen && !insightsLoaded && tasks?.length > 0) {
      loadInsights();
    }
  }, [isOpen, insightsLoaded, tasks, loadInsights]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 100);
  }, [isOpen]);

  const sendMessage = async (text?: string) => {
    const msg = (text ?? input).trim();
    if (!msg || sending) return;
    setInput('');
    setSending(true);
    const newMessages: Message[] = [...messages, { role: 'user', content: msg }];
    setMessages(newMessages);
    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg, history: messages, tasks, timeActuals, githubData, context: { company: 'Simpat Tech' } }),
      });
      const data = await res.json();
      setMessages([...newMessages, { role: 'assistant', content: data.reply }]);
    } catch {
      setMessages([...newMessages, { role: 'assistant', content: 'Something went wrong. Please try again.' }]);
    } finally {
      setSending(false);
    }
  };

  const criticalCount = insights.filter(i => i.type === 'critical' || i.type === 'warning').length;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-full shadow-lg transition-all bg-slate-900 text-white hover:bg-slate-700 ${
          isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <Sparkles className="h-4 w-4 text-violet-400" />
        <span className="text-sm font-medium">AI Co-Pilot</span>
        {criticalCount > 0 && (
          <span className="flex items-center justify-center w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full">
            {criticalCount}
          </span>
        )}
      </button>

      <div className={`fixed bottom-0 right-0 z-50 w-full sm:w-[420px] h-[85vh] sm:h-[680px] sm:bottom-6 sm:right-6 sm:rounded-2xl bg-white shadow-2xl border border-slate-200 flex flex-col transition-all duration-300 ${
        isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'
      }`}>

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-900 sm:rounded-t-2xl">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-violet-400" />
            <span className="font-semibold text-white text-sm">AI Co-Pilot</span>
            <span className="text-xs text-slate-400">powered by Claude</span>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Insights — div not button to avoid nesting */}
        <div className="border-b border-slate-100">
          <div
            role="button"
            tabIndex={0}
            onClick={() => setInsightsExpanded(!insightsExpanded)}
            onKeyDown={(e) => e.key === 'Enter' && setInsightsExpanded(!insightsExpanded)}
            className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-slate-50 transition-colors cursor-pointer select-none"
          >
            <div className="flex items-center gap-2">
              <Zap className="h-3.5 w-3.5 text-violet-500" />
              <span className="text-xs font-semibold text-slate-700">Live Insights</span>
              {insights.length > 0 && (
                <span className="text-xs text-slate-400">({insights.length})</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {!insightsLoaded && (
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(e) => { e.stopPropagation(); loadInsights(); }}
                  onKeyDown={(e) => e.key === 'Enter' && loadInsights()}
                  className="text-xs text-violet-600 hover:text-violet-800 cursor-pointer font-medium"
                >
                  Analyze
                </span>
              )}
              {insightsLoaded && (
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(e) => { e.stopPropagation(); loadInsights(); }}
                  onKeyDown={(e) => e.key === 'Enter' && loadInsights()}
                  className="text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <RefreshCw className={`h-3 w-3 ${loadingInsights ? 'animate-spin' : ''}`} />
                </span>
              )}
              {insightsExpanded
                ? <ChevronUp className="h-3.5 w-3.5 text-slate-400" />
                : <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
              }
            </div>
          </div>

          {insightsExpanded && (
            <div className="px-3 pb-3 space-y-2 max-h-52 overflow-y-auto">
              {loadingInsights && (
                <div className="flex items-center gap-2 py-3 text-sm text-slate-400">
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  Analyzing your data...
                </div>
              )}
              {!loadingInsights && !insightsLoaded && (
                <div className="py-3 text-center">
                  <p className="text-xs text-slate-400 mb-2">Get AI-powered insights about your ops</p>
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={loadInsights}
                    onKeyDown={(e) => e.key === 'Enter' && loadInsights()}
                    className="text-xs bg-violet-50 text-violet-700 px-3 py-1.5 rounded-lg hover:bg-violet-100 transition-colors font-medium cursor-pointer inline-block"
                  >
                    ✨ Analyze Now
                  </span>
                </div>
              )}
              {insights.map((insight, i) => {
                const style = insightStyles[insight.type] ?? insightStyles.info;
                const Icon = style.icon;
                return (
                  <div key={i} className={`rounded-lg border p-3 ${style.bg} ${style.border}`}>
                    <div className="flex items-start gap-2">
                      <Icon className={`h-3.5 w-3.5 mt-0.5 flex-shrink-0 ${style.iconColor}`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-xs font-semibold text-slate-800">{insight.title}</span>
                          {insight.metric && (
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${style.badge}`}>
                              {insight.metric}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">{insight.message}</p>
                        {insight.action && (
                          <p className="text-xs text-slate-500 mt-1 italic">→ {insight.action}</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Chat */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          {messages.length === 0 && (
            <div className="space-y-3">
              <p className="text-xs text-slate-400 text-center pt-2">Ask anything about your projects, team, or time</p>
              <div className="space-y-1.5">
                {SUGGESTED_QUESTIONS.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(q)}
                    className="w-full text-left text-xs px-3 py-2 rounded-lg bg-slate-50 hover:bg-violet-50 hover:text-violet-700 text-slate-600 transition-colors border border-slate-100 hover:border-violet-200"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <div className="w-6 h-6 rounded-full bg-slate-900 flex items-center justify-center flex-shrink-0 mt-0.5 mr-2">
                  <Bot className="h-3 w-3 text-violet-400" />
                </div>
              )}
              <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-xs leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-slate-900 text-white rounded-tr-sm'
                  : 'bg-slate-100 text-slate-800 rounded-tl-sm'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}

          {sending && (
            <div className="flex justify-start">
              <div className="w-6 h-6 rounded-full bg-slate-900 flex items-center justify-center flex-shrink-0 mt-0.5 mr-2">
                <Bot className="h-3 w-3 text-violet-400" />
              </div>
              <div className="bg-slate-100 rounded-2xl rounded-tl-sm px-3 py-2">
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="px-3 py-3 border-t border-slate-100">
          <div className="flex items-center gap-2 bg-slate-50 rounded-xl border border-slate-200 px-3 py-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
              placeholder="Ask about your team, projects, or risks..."
              className="flex-1 bg-transparent text-xs text-slate-800 placeholder-slate-400 outline-none"
              disabled={sending}
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || sending}
              className="p-1.5 rounded-lg bg-slate-900 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-700 transition-colors"
            >
              <Send className="h-3 w-3" />
            </button>
          </div>
          <p className="text-center text-[10px] text-slate-300 mt-1.5">
            Reads live data from Jira · Harvest · GitHub
          </p>
        </div>
      </div>
    </>
  );
}