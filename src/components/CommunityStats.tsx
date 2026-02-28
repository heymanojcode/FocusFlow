import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { formatDuration } from '../utils';
import { Users } from 'lucide-react';
import { CATEGORIES } from '../types';

interface UserStats {
  name: string;
  totalTime: number;
  productivityTime: number;
  entertainmentTime: number;
  relaxTime: number;
}

interface CommunityStatsProps {
  allUsersData: UserStats[];
}

export const CommunityStats: React.FC<CommunityStatsProps> = ({ allUsersData }) => {
  // Sort by total time descending
  const sortedData = [...allUsersData].sort((a, b) => b.totalTime - a.totalTime);

  return (
    <div className="glass-card p-6 mt-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">Community Leaderboard</h3>
            <p className="text-xs text-zinc-400 font-medium">Breakdown of time tracked by all users</p>
          </div>
        </div>
        <div className="flex gap-4">
          {CATEGORIES.map(cat => (
            <div key={cat.id} className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-tight">{cat.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sortedData} layout="vertical" margin={{ left: 20, right: 40 }}>
              <XAxis type="number" hide />
              <YAxis 
                dataKey="name" 
                type="category" 
                axisLine={false} 
                tickLine={false}
                tick={{ fontSize: 12, fontWeight: 600, fill: '#71717a' }}
                width={80}
              />
              <Tooltip 
                cursor={{ fill: 'transparent' }}
                formatter={(value: number, name: string) => [formatDuration(value), name.replace('Time', '')]}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Bar dataKey="productivityTime" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} barSize={32} name="Productivity" />
              <Bar dataKey="entertainmentTime" stackId="a" fill="#f59e0b" radius={[0, 0, 0, 0]} barSize={32} name="Entertainment" />
              <Bar dataKey="relaxTime" stackId="a" fill="#3b82f6" radius={[0, 8, 8, 0]} barSize={32} name="Relax" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-4">
          <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-4">Top Contributors</h4>
          {sortedData.slice(0, 5).map((user, index) => (
            <div key={user.name} className="flex flex-col gap-2 p-3 rounded-2xl bg-zinc-50 border border-transparent hover:border-zinc-200 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-xs font-bold text-zinc-400 border border-zinc-100 shadow-sm">
                    {index + 1}
                  </div>
                  <span className="text-sm font-bold text-zinc-900">{user.name}</span>
                </div>
                <span className="text-xs font-medium text-zinc-500">{formatDuration(user.totalTime)}</span>
              </div>
              <div className="flex h-1 w-full rounded-full overflow-hidden bg-zinc-200">
                <div style={{ width: `${(user.productivityTime / user.totalTime) * 100}%`, backgroundColor: '#10b981' }} />
                <div style={{ width: `${(user.entertainmentTime / user.totalTime) * 100}%`, backgroundColor: '#f59e0b' }} />
                <div style={{ width: `${(user.relaxTime / user.totalTime) * 100}%`, backgroundColor: '#3b82f6' }} />
              </div>
            </div>
          ))}
          {sortedData.length === 0 && (
            <p className="text-sm text-zinc-400 italic">No community data yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};
