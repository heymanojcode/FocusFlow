import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { Session, CATEGORIES } from '../types';
import { formatDuration } from '../utils';

interface StatsOverviewProps {
  sessions: Session[];
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ sessions }) => {
  const today = new Date().setHours(0, 0, 0, 0);
  const todaySessions = sessions.filter(s => s.startTime >= today);

  const data = CATEGORIES.map(cat => {
    const total = todaySessions
      .filter(s => s.category === cat.id)
      .reduce((acc, s) => acc + s.duration, 0);
    return {
      name: cat.label,
      value: total,
      color: cat.color
    };
  });

  const totalSeconds = data.reduce((acc, d) => acc + d.value, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="glass-card p-6">
        <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-6">Time Distribution</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => formatDuration(value)}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center gap-6 mt-4">
          {data.map(d => (
            <div key={d.name} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
              <span className="text-xs font-medium text-zinc-500">{d.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card p-6 flex flex-col justify-center">
        <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-2">Total Tracked Today</h3>
        <div className="text-5xl font-light tracking-tight mb-8">
          {formatDuration(totalSeconds)}
        </div>
        
        <div className="space-y-4">
          {data.map(d => (
            <div key={d.name} className="space-y-1">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-zinc-500">{d.name}</span>
                <span className="text-zinc-900">{formatDuration(d.value)}</span>
              </div>
              <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                <div 
                  className="h-full transition-all duration-500" 
                  style={{ 
                    width: `${totalSeconds > 0 ? (d.value / totalSeconds) * 100 : 0}%`,
                    backgroundColor: d.color 
                  }} 
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
