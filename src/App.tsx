import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Bot, User, Trash2, Terminal, Code2, BrainCircuit, Sparkles } from 'lucide-react';
import Markdown from 'react-markdown';
import { askChintu } from './services/gemini';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await askChintu(userMessage.content);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response || 'Chintu is speechless. Try again.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Chintu is having a stroke. Ask something else or check your connection.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div className="flex flex-col h-screen bg-zinc-950 text-zinc-100 selection:bg-emerald-500/30">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <BrainCircuit className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h1 className="font-display font-bold text-xl tracking-tight">CHINTU <span className="text-emerald-400">AI</span></h1>
            <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">DSA Mentor • No BS Zone</p>
          </div>
        </div>
        
        <button 
          onClick={clearChat}
          className="p-2 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400 hover:text-red-400"
          title="Clear Chat"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 scrollbar-hide">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center max-w-2xl mx-auto text-center space-y-8">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-24 h-24 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center relative"
            >
              <Bot className="w-12 h-12 text-emerald-400" />
              <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center"
              >
                <Sparkles className="w-3 h-3 text-white" />
              </motion.div>
            </motion.div>
            
            <div className="space-y-4">
              <h2 className="text-4xl font-display font-bold tracking-tight">
                I'm Chintu. <br />
                <span className="text-emerald-400">Ask me about DSA.</span>
              </h2>
              <p className="text-zinc-400 max-w-md mx-auto leading-relaxed">
                I'm here to teach you Data Structures and Algorithms. Don't ask me about your personal life or I'll be rude. I don't have time for nonsense.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
              {[
                "Explain Quick Sort like I'm five",
                "How does a Hash Map work?",
                "Write a BFS implementation in Java",
                "What's the time complexity of Merge Sort?"
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setInput(suggestion)}
                  className="p-4 text-left rounded-xl bg-zinc-900 border border-zinc-800 hover:border-emerald-500/50 hover:bg-zinc-800/50 transition-all group"
                >
                  <p className="text-sm text-zinc-300 group-hover:text-emerald-400 transition-colors">{suggestion}</p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-8">
            <AnimatePresence initial={false}>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "flex gap-4",
                    message.role === 'user' ? "flex-row-reverse" : "flex-row"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border",
                    message.role === 'user' 
                      ? "bg-zinc-800 border-zinc-700" 
                      : "bg-emerald-500/10 border-emerald-500/20"
                  )}>
                    {message.role === 'user' ? <User className="w-5 h-5 text-zinc-400" /> : <Bot className="w-5 h-5 text-emerald-400" />}
                  </div>
                  
                  <div className={cn(
                    "flex flex-col max-w-[85%]",
                    message.role === 'user' ? "items-end" : "items-start"
                  )}>
                    <div className={cn(
                      "px-5 py-3 rounded-2xl text-sm",
                      message.role === 'user' 
                        ? "bg-emerald-600 text-white rounded-tr-none" 
                        : "bg-zinc-900 border border-zinc-800 rounded-tl-none"
                    )}>
                      <div className="markdown-body">
                        <Markdown>{message.content}</Markdown>
                      </div>
                    </div>
                    <span className="text-[10px] text-zinc-600 mt-2 font-mono uppercase tracking-widest">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' ,second:'2-digit'})}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-4"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                  <Bot className="w-5 h-5 text-emerald-400 animate-pulse" />
                </div>
                <div className="bg-zinc-900 border border-zinc-800 px-5 py-3 rounded-2xl rounded-tl-none flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" />
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </main>

      {/* Input Area */}
      <footer className="p-4 md:p-8 border-t border-zinc-800 bg-zinc-900/50 backdrop-blur-md">
        <form 
          onSubmit={handleSubmit}
          className="max-w-4xl mx-auto relative group"
        >
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Terminal className="w-5 h-5 text-zinc-500 group-focus-within:text-emerald-400 transition-colors" />
          </div>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Chintu about DSA..."
            className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-4 pl-12 pr-16 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all text-sm"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 top-2 bottom-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:hover:bg-emerald-600 transition-all flex items-center justify-center group"
          >
            <Send className="w-5 h-5 text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </form>
        <p className="text-center text-[10px] text-zinc-600 mt-4 uppercase tracking-widest font-bold">
          Chintu only answers DSA questions. Don't waste his time.
        </p>
      </footer>
    </div>
  );
}
