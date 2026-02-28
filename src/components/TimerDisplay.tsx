import React, { useState, useEffect, useRef } from 'react';
import { Play, Square, Zap, Coffee, Tv } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Category, CATEGORIES } from '../types';
import { formatTimer, cn } from '../utils';

interface TimerDisplayProps {
  activeCategory: Category;
  onSessionEnd: (duration: number) => void;
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({ activeCategory, onSessionEnd }) => {
  const [isActive, setIsActive] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const currentCategory = CATEGORIES.find(c => c.id === activeCategory)!;

  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setSeconds(s => s + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive]);

  const handleToggle = () => {
    if (isActive) {
      onSessionEnd(seconds);
      setSeconds(0);
      setIsActive(false);
    } else {
      setIsActive(true);
    }
  };

  const getIcon = () => {
    switch (activeCategory) {
      case 'productivity': return <Zap className="w-6 h-6" />;
      case 'entertainment': return <Tv className="w-6 h-6" />;
      case 'relax': return <Coffee className="w-6 h-6" />;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 glass-card">
      <div className="flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full bg-zinc-100 text-zinc-600">
        {getIcon()}
        <span className="text-sm font-medium uppercase tracking-wider">{currentCategory.label}</span>
      </div>
      
      <div className="text-8xl font-mono font-light tracking-tighter mb-8 tabular-nums">
        {formatTimer(seconds)}
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleToggle}
        className={cn(
          "w-20 h-20 rounded-full flex items-center justify-center transition-colors shadow-lg",
          isActive 
            ? "bg-red-500 hover:bg-red-600 text-white" 
            : "bg-zinc-900 hover:bg-zinc-800 text-white"
        )}
      >
        {isActive ? <Square className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
      </motion.button>
      
      <p className="mt-6 text-zinc-400 text-sm font-medium">
        {isActive ? "Currently tracking..." : "Ready to start"}
      </p>
    </div>
  );
};
