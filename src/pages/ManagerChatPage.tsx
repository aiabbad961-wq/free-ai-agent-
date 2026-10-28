import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { routeMessage } from '../utils/router';
import { Send, Trash2, Bot, Sparkles, Check, ArrowRight } from 'lucide-react';

export const ManagerChatPage: React.FC = () => {
  const { chatHistory, addChatMessage, clearChat, dispatchTask, agents, showToast } = useApp();
  const [input, setInput] = useState('');
  const [dispatchedTaskIds, setDispatchedTaskIds] = useState<Record<string, boolean>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const quickPrompts = [
    'Ek modern landing page banani hai Next.js mein',
    'Mobile app ke liye push notifications feature build karo',
    'Security audit karo aur dependencies check karo',
    'Google Maps aur WhatsApp se 50 clients dhoondo',
    'Mezan Bank payment details aur account verify karo',
    'Meta aur Google ads budget optimize karo',
    'Monthly revenue cohort aur analytics report chahiye',
  ];

  const handleSend = (userText: string) => {
    const textToSend = userText.trim();
    if (!textToSend) return;

    // 1. Add user message
    addChatMessage({
      sender: 'user',
      text: textToSend,
    });
    setInput('');

    // 2. Compute rule-based routing
    setTimeout(() => {
      const match = routeMessage(textToSend);
      if (match.agentId && match.dept && match.matchedRule) {
        const taskTitle = match.matchedRule.defaultTaskTitle(textToSend);
        addChatMessage({
          sender: 'bot',
          text: match.say,
          suggestedAction: {
            type: 'dispatch_task',
            agentId: match.agentId,
            dept: match.dept,
            taskTitle,
            say: match.say,
          },
        });
      } else {
        addChatMessage({
          sender: 'bot',
          text: match.say,
        });
      }
    }, 280);
  };

  const handleExecuteAction = (msgId: string, action: NonNullable<(typeof chatHistory)[0]['suggestedAction']>) => {
    const targetAgent = agents.find(
      (a) => a.id.toLowerCase() === action.agentId.toLowerCase() || a.name.toLowerCase() === action.agentId.toLowerCase()
    );

    if (targetAgent) {
      dispatchTask({
        title: action.taskTitle,
        assignedTo: targetAgent.id,
        dept: action.dept,
        priority: 'high',
        loadWeight: 30,
        description: `Dispatched via Sugarplum Manager Chat consultation.`,
      });
      setDispatchedTaskIds((prev) => ({ ...prev, [msgId]: true }));
      showToast(`Task assigned to ${targetAgent.name}!`);
    }
  };

  return (
    <div className="h-[calc(100vh-6.5rem)] flex flex-col rounded-2xl bg-[var(--panel)] border border-[var(--line)] overflow-hidden shadow-xs">
      {/* Chat Header */}
      <div className="px-5 py-3.5 border-b border-[var(--line)] flex items-center justify-between shrink-0 bg-[var(--panel2)]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-lg">
            🧑💼
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-xs text-[var(--txt)]">Sugarplum Manager Chat</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono text-blue-400 bg-blue-500/10 border border-blue-500/20">
                Rule-Based Router (Offline)
              </span>
            </div>
            <span className="text-[11px] text-[var(--muted)]">
              Orchestrating 11 agents across Engineering, Data, Security, Finance & Marketing
            </span>
          </div>
        </div>

        <button
          onClick={clearChat}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[var(--line)] hover:border-rose-500/30 text-[var(--muted)] hover:text-rose-400 text-xs transition-colors"
          title="Clear chat history"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Clear History</span>
        </button>
      </div>

      {/* Message History */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {chatHistory.map((msg) => {
          const isUser = msg.sender === 'user';
          const isDispatched = dispatchedTaskIds[msg.id];

          return (
            <div key={msg.id} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
              <div
                className={`max-w-[85%] sm:max-w-xl rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                  isUser
                    ? 'bg-blue-600 text-white rounded-br-xs shadow-xs'
                    : 'bg-[var(--panel2)] border border-[var(--line)] text-[var(--txt)] rounded-bl-xs'
                }`}
              >
                {!isUser && (
                  <div className="flex items-center gap-1.5 mb-1 text-[11px] text-blue-400 font-semibold">
                    <span>🧑💼 Sugarplum</span>
                  </div>
                )}
                <div className="whitespace-pre-wrap">{msg.text}</div>

                {/* Suggested Action Pill */}
                {!isUser && msg.suggestedAction && (
                  <div className="mt-3 pt-2.5 border-t border-[var(--line)] flex flex-wrap items-center justify-between gap-2">
                    <div className="text-[11px] text-[var(--muted)] flex items-center gap-1.5">
                      <span className="font-semibold text-[var(--txt)]">Auto-Assignment:</span>
                      <span className="text-blue-400 font-mono">{msg.suggestedAction.agentId}</span>
                      <span>({msg.suggestedAction.dept})</span>
                    </div>

                    {isDispatched ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-[10px]">
                        <Check className="w-3 h-3" />
                        <span>Task Dispatched</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => handleExecuteAction(msg.id, msg.suggestedAction!)}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-600 hover:bg-blue-500 text-white font-medium text-[11px] transition-colors shadow-xs active:scale-95"
                      >
                        <span>Dispatch to {msg.suggestedAction.agentId}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                )}

                <div
                  className={`mt-1.5 text-[9px] font-mono text-right ${
                    isUser ? 'text-blue-200' : 'text-[var(--muted)]'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Chips */}
      <div className="px-5 py-2.5 border-t border-[var(--line)] bg-[var(--panel2)]/50 flex items-center gap-2 overflow-x-auto select-none no-scrollbar">
        <span className="text-[10px] text-[var(--muted)] uppercase font-semibold shrink-0">Quick Dispatches:</span>
        {quickPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            className="shrink-0 px-2.5 py-1 rounded-full bg-[var(--panel)] border border-[var(--line)] text-[11px] text-[var(--muted)] hover:text-[var(--txt)] hover:border-blue-500/40 transition-colors"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Composer Input */}
      <div className="p-4 border-t border-[var(--line)] bg-[var(--panel)]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(input);
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Sugarplum ko task batao (e.g. Website launch, client lead hunting, audit, payment verification)..."
            className="flex-1 bg-[var(--bg)] border border-[var(--line)] rounded-xl px-4 py-2.5 text-xs text-[var(--txt)] placeholder:text-[var(--muted)] focus:outline-hidden focus:border-blue-500"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:hover:bg-blue-600 text-white rounded-xl text-xs font-semibold shadow-xs transition-all flex items-center gap-1.5 shrink-0"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
