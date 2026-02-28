import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Zap, Coffee, Tv, LayoutDashboard, History, Timer } from 'lucide-react';
import { Category, Session, CATEGORIES } from './types';
import { TimerDisplay } from './components/TimerDisplay';
import { StatsOverview } from './components/StatsOverview';
import { SessionList } from './components/SessionList';
import { cn } from './utils';

export default function App() {
  const [activeCategory, setActiveCategory] = useState<Category>('productivity');
  const [sessions, setSessions] = useState<Session[]>(() => {
    const saved = localStorage.getItem('focusflow_sessions');
    return saved ? JSON.parse(saved) : [];
  });
  const [view, setView] = useState<'timer' | 'dashboard'>('timer');

  useEffect(() => {
    localStorage.setItem('focusflow_sessions', JSON.stringify(sessions));
  }, [sessions]);

  const handleSessionEnd = (duration: number) => {
    if (duration < 1) return;

    const newSession: Session = {
      id: crypto.randomUUID(),
      category: activeCategory,
      startTime: Date.now() - (duration * 1000),
      endTime: Date.now(),
      duration
    };

    setSessions(prev => [newSession, ...prev]);
  };

  const deleteSession = (id: string) => {
    setSessions(prev => prev.filter(s => s.id !== id));
  };

  return (
    <div className="min-h-screen max-w-5xl mx-auto px-4 py-8 md:py-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">FocusFlow</h1>
          <p className="text-zinc-500 font-medium">Master your time, balance your life.</p>
        </div>

        <nav className="flex bg-zinc-200/50 p-1 rounded-2xl">
          <button
            onClick={() => setView('timer')}
            className={cn(
              "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all",
              view === 'timer' ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-700"
            )}
          >
            <Timer className="w-4 h-4" />
            Timer
          </button>
          <button
            onClick={() => setView('dashboard')}
            className={cn(
              "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all",
              view === 'dashboard' ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-700"
            )}
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </button>
        </nav>
      </header>

      <main>
        {view === 'timer' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 space-y-4">
              <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4">Select Category</h2>
              <div className="grid grid-cols-1 gap-3">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left group",
                      activeCategory === cat.id
                        ? "bg-white border-zinc-900 shadow-md"
                        : "bg-zinc-50 border-transparent hover:bg-zinc-100"
                    )}
                  >
                    <div 
                      className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
                        activeCategory === cat.id ? "bg-zinc-900 text-white" : "bg-white text-zinc-400 group-hover:text-zinc-600 shadow-sm"
                      )}
                    >
                      {cat.id === 'productivity' && <Zap className="w-6 h-6" />}
                      {cat.id === 'entertainment' && <Tv className="w-6 h-6" />}
                      {cat.id === 'relax' && <Coffee className="w-6 h-6" />}
                    </div>
                    <div>
                      <div className={cn(
                        "font-bold",
                        activeCategory === cat.id ? "text-zinc-900" : "text-zinc-500"
                      )}>
                        {cat.label}
                      </div>
                      <div className="text-xs text-zinc-400 font-medium">
                        {cat.id === 'productivity' && "Deep work & focus"}
                        {cat.id === 'entertainment' && "Games & media"}
                        {cat.id === 'relax' && "Rest & recharge"}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="lg:col-span-8 space-y-8">
              <TimerDisplay 
                activeCategory={activeCategory} 
                onSessionEnd={handleSessionEnd} 
              />
              <SessionList sessions={sessions} onDelete={deleteSession} />
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <StatsOverview sessions={sessions} />
            <div className="max-w-2xl">
              <SessionList sessions={sessions} onDelete={deleteSession} />
            </div>
          </div>
        )}
      </main>

      <footer className="mt-20 pt-8 border-t border-zinc-200 text-center">
        <p className="text-zinc-400 text-xs font-medium uppercase tracking-widest">
          FocusFlow &copy; {new Date().getFullYear()} &bull; Built for Clarity
        </p>
      </footer>
    </div>
  );
}
