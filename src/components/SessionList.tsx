import React from 'react';
import { format } from 'date-fns';
import { Session, CATEGORIES } from '../types';
import { formatDuration } from '../utils';
import { Zap, Coffee, Tv, Trash2 } from 'lucide-react';

interface SessionListProps {
  sessions: Session[];
  onDelete: (id: string) => void;
}

export const SessionList: React.FC<SessionListProps> = ({ sessions, onDelete }) => {
  const sortedSessions = [...sessions].sort((a, b) => b.startTime - a.startTime);

  const getIcon = (category: string) => {
    switch (category) {
      case 'productivity': return <Zap className="w-4 h-4 text-emerald-500" />;
      case 'entertainment': return <Tv className="w-4 h-4 text-amber-500" />;
      case 'relax': return <Coffee className="w-4 h-4 text-blue-500" />;
      default: return null;
    }
  };

  return (
    <div className="glass-card p-6">
      <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-6">Recent Activity</h3>
      
      {sessions.length === 0 ? (
        <div className="text-center py-12 text-zinc-400">
          <p className="text-sm">No sessions recorded yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedSessions.slice(0, 10).map((session) => (
            <div 
              key={session.id} 
              className="flex items-center justify-between p-4 rounded-2xl bg-zinc-50 hover:bg-zinc-100 transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                  {getIcon(session.category)}
                </div>
                <div>
                  <div className="text-sm font-semibold text-zinc-900">
                    {CATEGORIES.find(c => c.id === session.category)?.label}
                  </div>
                  <div className="text-xs text-zinc-400">
                    {format(session.startTime, 'MMM d, h:mm a')}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="text-sm font-mono font-medium text-zinc-600">
                  {formatDuration(session.duration)}
                </div>
                <button 
                  onClick={() => onDelete(session.id)}
                  className="p-2 text-zinc-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
