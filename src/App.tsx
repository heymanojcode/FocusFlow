import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Zap, Coffee, Tv, LayoutDashboard, History, Timer } from 'lucide-react';
import { Category, Session, CATEGORIES } from './types';
import { TimerDisplay } from './components/TimerDisplay';
import { StatsOverview } from './components/StatsOverview';
import { CommunityStats } from './components/CommunityStats';
import { SessionList } from './components/SessionList';
import { cn } from './utils';

export default function App() {
  const [userName, setUserName] = useState<string>(() => {
    return localStorage.getItem('focusflow_user_name') || '';
  });
  const [activeCategory, setActiveCategory] = useState<Category>('productivity');
  const [sessions, setSessions] = useState<Session[]>([]);
  const [view, setView] = useState<'timer' | 'dashboard'>('timer');
  const [tempName, setTempName] = useState('');
  const [allUsersData, setAllUsersData] = useState<any[]>([]);

  // Load user-specific sessions when userName changes
  useEffect(() => {
    if (userName) {
      const saved = localStorage.getItem(`focusflow_sessions_${userName}`);
      setSessions(saved ? JSON.parse(saved) : []);
      localStorage.setItem('focusflow_user_name', userName);
    }
  }, [userName]);

  // Load all users data for community view
  useEffect(() => {
    if (view === 'dashboard' && userName) {
      const usersMap = new Map<string, any>();
      
      // 1. Get all users from localStorage
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('focusflow_sessions_')) {
          const name = key.replace('focusflow_sessions_', '');
          const userSessions: Session[] = JSON.parse(localStorage.getItem(key) || '[]');
          
          usersMap.set(name, {
            name,
            totalTime: userSessions.reduce((acc, s) => acc + s.duration, 0),
            productivityTime: userSessions.filter(s => s.category === 'productivity').reduce((acc, s) => acc + s.duration, 0),
            entertainmentTime: userSessions.filter(s => s.category === 'entertainment').reduce((acc, s) => acc + s.duration, 0),
            relaxTime: userSessions.filter(s => s.category === 'relax').reduce((acc, s) => acc + s.duration, 0),
          });
        }
      }

      // 2. Ensure current user is included and up-to-date (using current state)
      usersMap.set(userName, {
        name: userName,
        totalTime: sessions.reduce((acc, s) => acc + s.duration, 0),
        productivityTime: sessions.filter(s => s.category === 'productivity').reduce((acc, s) => acc + s.duration, 0),
        entertainmentTime: sessions.filter(s => s.category === 'entertainment').reduce((acc, s) => acc + s.duration, 0),
        relaxTime: sessions.filter(s => s.category === 'relax').reduce((acc, s) => acc + s.duration, 0),
      });

      setAllUsersData(Array.from(usersMap.values()));
    }
  }, [view, sessions, userName]);

  // Save sessions to user-specific key
  useEffect(() => {
    if (userName) {
      localStorage.setItem(`focusflow_sessions_${userName}`, JSON.stringify(sessions));
    }
  }, [sessions, userName]);

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempName.trim()) {
      setUserName(tempName.trim());
    }
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to switch users? Your data for the current user will be saved.')) {
      setUserName('');
      setTempName('');
      localStorage.removeItem('focusflow_user_name');
    }
  };

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

  if (!userName) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-zinc-100"
        >
          <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center mb-6 mx-auto">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-center text-zinc-900 mb-2">Welcome to FocusFlow</h1>
          <p className="text-zinc-500 text-center mb-8">Let's start by getting to know you. What should we call you?</p>
          
          <form onSubmit={handleStart} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2 ml-1">
                Your Name
              </label>
              <input
                autoFocus
                type="text"
                id="name"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                placeholder="e.g. Alex"
                className="w-full px-5 py-4 rounded-2xl bg-zinc-50 border-2 border-transparent focus:border-zinc-900 focus:bg-white outline-none transition-all font-medium"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-4 bg-zinc-900 text-white rounded-2xl font-bold hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-200 active:scale-[0.98]"
            >
              Get Started
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-5xl mx-auto px-4 py-8 md:py-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900">FocusFlow</h1>
            <span className="px-2 py-0.5 rounded-full bg-zinc-100 text-[10px] font-bold text-zinc-500 uppercase tracking-tighter">v1.0</span>
          </div>
          <div className="flex items-center gap-3">
            <p className="text-zinc-500 font-medium">
              Welcome back, <span className="text-zinc-900 font-bold">{userName}</span>.
            </p>
            <button 
              onClick={handleLogout}
              className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest hover:text-red-500 transition-colors"
            >
              Switch User
            </button>
          </div>
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
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Your Performance</h2>
            </div>
            <StatsOverview sessions={sessions} />
            
            <CommunityStats allUsersData={allUsersData} />

            <div className="max-w-2xl pt-8">
              <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-6">Recent History</h2>
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
