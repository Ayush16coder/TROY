"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Cpu, ChevronDown, Sparkles, User, Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

type Model = "gpt-4o" | "claude-3-5-sonnet" | "gemini-1.5-pro";

const MODELS: { id: Model; label: string; provider: string; color: string }[] = [
  { id: "gpt-4o", label: "GPT-4o", provider: "OpenAI", color: "text-emerald-400" },
  { id: "claude-3-5-sonnet", label: "Claude 3.5", provider: "Anthropic", color: "text-amber-400" },
  { id: "gemini-1.5-pro", label: "Gemini 1.5 Pro", provider: "Google", color: "text-blue-400" },
];

const STARTERS = [
  "Why did my last Vercel deployment fail?",
  "Analyze these build logs and suggest fixes",
  "How do I reduce my Railway build time?",
  "Explain the difference between preview and production environments",
];

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  model?: Model;
}

function MessageBubble({ msg }: { msg: Message }) {
  const [copied, setCopied] = useState(false);
  const isUser = msg.role === "user";

  function copy() {
    navigator.clipboard.writeText(msg.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={cn("flex gap-3", isUser ? "flex-row-reverse" : "flex-row")}
    >
      <div className={cn(
        "w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5",
        isUser ? "bg-blue-600" : "bg-gradient-to-br from-violet-600 to-blue-600"
      )}>
        {isUser ? <User className="w-3.5 h-3.5 text-white" /> : <Cpu className="w-3.5 h-3.5 text-white" />}
      </div>
      <div className={cn("group max-w-[75%] space-y-1", isUser ? "items-end" : "items-start")}>
        {!isUser && msg.model && (
          <span className="text-[10px] text-zinc-600 font-mono ml-1">
            {MODELS.find((m) => m.id === msg.model)?.label}
          </span>
        )}
        <div className={cn(
          "relative px-4 py-3 rounded-2xl text-sm leading-relaxed",
          isUser
            ? "bg-blue-600 text-white rounded-tr-sm"
            : "bg-[#111827] border border-[#1e2d40] text-zinc-200 rounded-tl-sm"
        )}>
          {msg.content}
          {!isUser && (
            <button
              onClick={copy}
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-white/10"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-zinc-500" />}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function AIWorkspaceClient() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [model, setModel] = useState<Model>("gpt-4o");
  const [modelOpen, setModelOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send(text?: string) {
    const content = text ?? input.trim();
    if (!content || loading) return;
    setInput("");
    const userMsg: Message = { id: Date.now().toString(), role: "user", content };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: content, model, sessionId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "AI request failed");
        setLoading(false);
        return;
      }
      if (data.sessionId) setSessionId(data.sessionId);
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.content,
        model,
      };
      setMessages((prev) => [...prev, aiMsg]);
      setError(null);
    } catch {
      setError("Failed to reach AI service");
    } finally {
      setLoading(false);
    }
  }

  const selectedModel = MODELS.find((m) => m.id === model)!;

  return (
    <div className="flex-1 flex flex-col glass rounded-2xl overflow-hidden min-h-0" style={{ height: "calc(100vh - 220px)" }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-3 border-b border-[#1e2d40] flex-shrink-0">
        <Sparkles className="w-4 h-4 text-violet-400" />
        <span className="text-sm font-medium text-white">AI Assistant</span>
        <div className="ml-auto relative">
          <button
            onClick={() => setModelOpen(!modelOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0d1117] border border-[#1e2d40] hover:border-blue-500/30 transition-all text-xs"
          >
            <span className={selectedModel.color}>{selectedModel.label}</span>
            <span className="text-zinc-600">· {selectedModel.provider}</span>
            <ChevronDown className="w-3 h-3 text-zinc-600" />
          </button>
          <AnimatePresence>
            {modelOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="absolute right-0 top-full mt-2 w-52 glass-raised rounded-xl border border-[#1e2d40] shadow-xl z-20 overflow-hidden"
              >
                {MODELS.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => { setModel(m.id); setModelOpen(false); }}
                    className={cn(
                      "w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-[#1a2236] transition-colors text-left",
                      model === m.id ? "text-white" : "text-zinc-400"
                    )}
                  >
                    <span className={m.color}>{m.label}</span>
                    <span className="text-[11px] text-zinc-600">{m.provider}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 min-h-0">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center gap-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center">
              <Cpu className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-white font-semibold mb-1">Ask me anything</p>
              <p className="text-zinc-500 text-sm max-w-xs">Deployment debugging, log analysis, infrastructure advice — powered by {selectedModel.label}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg">
              {STARTERS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="text-left px-4 py-3 rounded-xl border border-[#1e2d40] bg-[#0d1117] hover:border-blue-500/30 hover:bg-blue-500/5 text-xs text-zinc-400 hover:text-zinc-200 transition-all"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
        <AnimatePresence>
          {messages.map((msg) => (
            <MessageBubble key={msg.id} msg={msg} />
          ))}
        </AnimatePresence>
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center flex-shrink-0">
              <Cpu className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-[#111827] border border-[#1e2d40]">
              <div className="flex gap-1 items-center h-4">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-zinc-500"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.2 }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-4 border-t border-[#1e2d40] flex-shrink-0">
        <div className="flex items-end gap-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
            }}
            placeholder="Ask about deployments, logs, infrastructure..."
            rows={1}
            className="flex-1 resize-none bg-[#0d1117] border border-[#1e2d40] rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/40 focus:ring-1 focus:ring-blue-500/15 transition-all max-h-32"
          />
          <button
            onClick={() => send()}
            disabled={!input.trim() || loading}
            className="flex-shrink-0 w-10 h-10 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-all glow-blue"
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </div>
        {error && (
          <p className="text-[11px] text-rose-500 mt-2 text-center">{error}</p>
        )}
        <p className="text-[11px] text-zinc-700 mt-2 text-center">
          Shift+Enter for newline · Enter to send · Requires API keys in .env.local
        </p>
      </div>
    </div>
  );
}
