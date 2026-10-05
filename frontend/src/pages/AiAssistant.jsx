import { useState, useRef } from 'react';
import { useSafety } from '../context/useSafety';
import { queryAiAssistant } from '../api/client';
import {
  BotMessageSquare,
  Sparkles,
  BookOpen,
  Copy,
  Check,
  RefreshCw,
  CornerDownLeft
} from 'lucide-react';

export default function AiAssistant() {
  const { addToast } = useSafety();
  const idRef = useRef(100);

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: `Hello Chief Safety Officer! I am **SafeSteel Copilot**, your real-time industrial safety intelligence assistant.\n\nI am actively synchronized with your plant's **24 Edge Vision feeds**, IoT machinery telemetry, and international compliance standards (**OSHA 1910, ISO 45001, NFPA 70E**).\n\nHow can I support your safety shift today?`,
      timestamp: 'Active Now'
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  const samplePrompts = [
    { label: "PPE Standards", query: "What is the mandatory PPE requirement for entering the Blast Furnace Tapping Deck?" },
    { label: "Crane Proximity", query: "What are the automated E-Stop trigger rules for Overhead Cranes?" },
    { label: "ISO 45001 Log", query: "How do I report a Near Miss incident according to ISO 45001?" },
    { label: "Shift B Hazards", query: "Summarize high-risk hazards in Rolling Mill for Shift B." }
  ];

  const handleSend = async (textToSend) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    idRef.current += 1;
    const userMsg = {
      id: idRef.current,
      sender: 'user',
      text: query,
      timestamp: 'Just now'
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsTyping(true);

    try {
      const res = await queryAiAssistant(query);
      idRef.current += 1;
      setMessages((prev) => [
        ...prev,
        {
          id: idRef.current,
          sender: 'ai',
          text: res.data.answer,
          timestamp: 'Just now'
        }
      ]);
    } catch (err) {
      idRef.current += 1;
      setMessages((prev) => [
        ...prev,
        {
          id: idRef.current,
          sender: 'ai',
          text: `⚠️ Unable to reach SafeSteel Copilot backend. Please check your connection.\n\nError: ${err.message}`,
          timestamp: 'Just now'
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleCopy = (id, text) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    addToast('Response copied to clipboard', 'info');
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl overflow-hidden shadow-2xl">
      {/* 1. COPILOT HEADER */}
      <div className="p-4 bg-slate-950/90 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-800 flex items-center justify-center text-white shadow-lg shadow-violet-500/15 border border-violet-400/30">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-bold text-white tracking-tight">SafeSteel Copilot</h3>
              <span className="text-[10px] font-mono font-semibold px-2 py-0.2 rounded bg-violet-500/15 text-violet-300 border border-violet-500/30">
                OSHA 1910 & ISO 45001 Certified
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Natural-language safety protocol guidance, incident drafting & live hazard analysis
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setMessages([
              {
                id: 1,
                sender: 'ai',
                text: 'Chat history reset. How can I assist your plant safety shift?',
                timestamp: 'Now'
              }
            ]);
            addToast('Conversation restarted', 'info');
          }}
          className="text-xs text-slate-400 hover:text-white flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/80 transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset Session</span>
        </button>
      </div>

      {/* 2. SUGGESTED QUESTIONS CHIPS */}
      <div className="p-3 bg-slate-950/50 border-b border-slate-800/80 overflow-x-auto flex items-center space-x-2">
        <span className="text-[11px] font-mono font-semibold text-slate-400 shrink-0 flex items-center space-x-1 pl-1">
          <BookOpen className="w-3.5 h-3.5 text-amber-400" />
          <span>Quick Prompts:</span>
        </span>
        {samplePrompts.map((item, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(item.query)}
            className="text-xs whitespace-nowrap px-3 py-1.5 rounded-xl bg-slate-850 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 hover:border-slate-600 transition-all shrink-0 cursor-pointer flex items-center space-x-1.5"
          >
            <span className="text-[10px] font-mono text-amber-400 font-semibold">{item.label}</span>
            <span className="text-slate-500">•</span>
            <span className="truncate max-w-xs">{item.query}</span>
          </button>
        ))}
      </div>

      {/* 3. CHAT MESSAGES BODY */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-5">
        {messages.map((msg) => {
          const isAi = msg.sender === 'ai';
          return (
            <div
              key={msg.id}
              className={`flex items-start space-x-3.5 ${
                isAi ? 'justify-start' : 'justify-end'
              }`}
            >
              {isAi && (
                <div className="w-8 h-8 rounded-xl bg-violet-600/25 border border-violet-500/40 flex items-center justify-center text-violet-300 shrink-0 mt-0.5">
                  <BotMessageSquare className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-2xl rounded-2xl p-4 sm:p-5 text-xs sm:text-sm leading-relaxed shadow-lg ${
                  isAi
                    ? 'bg-slate-950/80 border border-slate-800/90 text-slate-200'
                    : 'bg-slate-800 text-white font-medium border border-slate-700'
                }`}
              >
                <div className="whitespace-pre-wrap font-sans space-y-2">
                  {msg.text}
                </div>

                <div
                  className={`mt-3 pt-2.5 border-t flex items-center justify-between text-[10px] font-mono ${
                    isAi ? 'border-slate-800/80 text-slate-400' : 'border-slate-700 text-slate-400'
                  }`}
                >
                  <span>{msg.timestamp}</span>
                  {isAi && (
                    <button
                      onClick={() => handleCopy(msg.id, msg.text)}
                      className="hover:text-white flex items-center space-x-1 transition-colors cursor-pointer"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy Response</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center space-x-3 text-slate-400 text-xs pl-2 animate-in fade-in duration-150">
            <div className="w-7 h-7 rounded-lg bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-300">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
            </div>
            <span className="font-mono text-[11px] text-violet-300">
              SafeSteel Copilot is referencing plant safety protocols...
            </span>
          </div>
        )}
      </div>

      {/* 4. OBVIOUS MODERN INPUT DOCK */}
      <div className="p-3.5 sm:p-4 bg-slate-950/90 border-t border-slate-800/80">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="relative flex items-center"
        >
          <input
            type="text"
            placeholder="Ask anything about steel plant safety protocols, OSHA standards, or hazard remediation..."
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl pl-4 pr-24 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/80 transition-colors shadow-inner"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim()}
            className="absolute right-2 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-bold flex items-center space-x-1.5 transition-all shadow-md shadow-amber-500/10 cursor-pointer text-xs"
          >
            <span>Ask</span>
            <CornerDownLeft className="w-3 h-3" />
          </button>
        </form>
        <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 px-1 font-mono">
          <span>Trained on OSHA 1910, ISO 45001 & SafeSteel SOP v3.2</span>
          <span>Press Enter to Submit</span>
        </div>
      </div>
    </div>
  );
}
