import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  Trash2, 
  BookOpen, 
  BrainCircuit, 
  Bot, 
  User, 
  Zap, 
  Check, 
  Copy,
  Lightbulb
} from 'lucide-react';
import { useStudy } from '../../context/StudyContext';

export const AIAssistantView: React.FC = () => {
  const { 
    chatMessages, 
    sendChatMessage, 
    isChatLoading, 
    clearChatHistory, 
    profile, 
    subjects, 
    exams 
  } = useStudy();

  const [input, setInput] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isChatLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isChatLoading) return;
    const msg = input;
    setInput('');
    await sendChatMessage(msg);
  };

  const handlePromptChipClick = (promptText: string) => {
    sendChatMessage(promptText);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const promptChips = [
    { label: '🎯 What should I study today?', prompt: 'What should I study today based on my enrolled subjects, upcoming exams, and weak topics?' },
    { label: '💡 Explain Normalization simply', prompt: 'Explain Database Normalization (1NF to BCNF) simply with a realistic real-world table example.' },
    { label: '🇮🇳 Explain in Hinglish', prompt: 'Explain ACID properties in simple Hinglish with an online banking transaction example.' },
    { label: '🌳 AVL Tree Rotations formula', prompt: 'Summarize the 4 AVL Tree rotations (LL, RR, LR, RL) with exact step-by-step algorithms and diagrams.' },
    { label: '📝 Generate 5 PYQ Exam Questions', prompt: 'Generate 5 high-yield university exam questions for Operating Systems CPU Scheduling with model answers.' }
  ];

  return (
    <div className="h-[calc(100vh-8.5rem)] flex flex-col rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden animate-in fade-in duration-300">
      {/* 1. Tutor Header */}
      <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-purple-500/20">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">AI Academic Tutor & Copilot</h2>
              <span className="text-[10px] px-2 py-0.2 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-200 dark:border-emerald-800">
                Online
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Personalized for {profile.fullName} • {profile.course}
            </p>
          </div>
        </div>

        <button
          onClick={clearChatHistory}
          className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          title="Clear Chat Conversation"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {/* 2. Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 custom-scrollbar">
        {chatMessages.map((msg) => {
          const isAssistant = msg.role === 'assistant';

          return (
            <div
              key={msg.id}
              className={`flex gap-3 ${isAssistant ? 'justify-start' : 'justify-end'}`}
            >
              {isAssistant && (
                <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-1">
                  <Sparkles className="h-4 w-4" />
                </div>
              )}

              <div
                className={`max-w-2xl rounded-3xl p-4 sm:p-5 text-xs sm:text-sm space-y-2 leading-relaxed ${
                  isAssistant
                    ? 'bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700/60'
                    : 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                }`}
              >
                <div className="whitespace-pre-wrap font-sans">
                  {msg.content}
                </div>

                {isAssistant && (
                  <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700/50 text-[10px] text-slate-400">
                    <span>AI Academic Engine</span>
                    <button
                      onClick={() => handleCopy(msg.content, msg.id)}
                      className="hover:text-blue-500 flex items-center gap-1"
                    >
                      {copiedId === msg.id ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                      <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                )}

                {/* Suggested Action Chips from Tutor */}
                {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                  <div className="pt-2 flex flex-wrap gap-1.5">
                    {msg.suggestedActions.map((act, aIdx) => (
                      <button
                        key={aIdx}
                        onClick={() => handlePromptChipClick(act.action)}
                        className="px-2.5 py-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[11px] font-semibold text-purple-600 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-slate-800 transition"
                      >
                        ⚡ {act.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {!isAssistant && (
                <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center shrink-0 mt-1 font-bold text-xs">
                  {profile.fullName ? profile.fullName[0] : 'U'}
                </div>
              )}
            </div>
          );
        })}

        {isChatLoading && (
          <div className="flex gap-3 justify-start animate-in fade-in">
            <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0">
              <Sparkles className="h-4 w-4 animate-spin" />
            </div>
            <div className="p-4 rounded-3xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-500 flex items-center gap-2">
              <div className="flex space-x-1">
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" />
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
              <span>Formulating academic response...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 3. Quick Suggestion Prompts */}
      <div className="px-4 py-2 bg-slate-50 dark:bg-slate-950/80 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 overflow-x-auto scrollbar-none">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
          <Lightbulb className="h-3 w-3 text-amber-500" /> Prompts:
        </span>
        {promptChips.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handlePromptChipClick(chip.prompt)}
            className="px-3 py-1 rounded-xl text-[11px] font-medium bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-purple-500 whitespace-nowrap transition"
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* 4. Input Form */}
      <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question, formula explanation, or exam strategy..."
            className="flex-1 px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            type="submit"
            disabled={!input.trim() || isChatLoading}
            className="p-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-md shadow-purple-500/25 transition active:scale-95 disabled:opacity-50"
            title="Send Message"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
